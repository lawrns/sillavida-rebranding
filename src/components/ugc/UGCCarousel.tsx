/**
 * UGCCarousel Component
 * Horizontal scrolling carousel for UGC content with edge-to-edge layout
 * Inspired by ReviewsCarousel and ProductCarousel patterns
 */

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import UGCCard from './UGCCard';
import type { UGCContent } from '../../data/ugc-content';
import { LAYOUT } from '../../constants/layout';

interface UGCCarouselProps {
  content: UGCContent[];
  onContentClick: (content: UGCContent) => void;
  autoScroll?: boolean;
  autoScrollInterval?: number;
}

const UGCCarousel: React.FC<UGCCarouselProps> = ({ 
  content,
  onContentClick, 
  autoScroll = false, 
  autoScrollInterval = 8000 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(autoScroll);
  const autoScrollRef = useRef<NodeJS.Timeout>();
  
  // Touch/swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Check scroll position to update navigation buttons
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = LAYOUT.CARD_WIDTH.TABLET + 24; // Use constant + space-x-6 gap (24px)
      scrollContainerRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = LAYOUT.CARD_WIDTH.TABLET + 24; // Use constant + space-x-6 gap (24px)
      scrollContainerRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
      });
    }
  };

  // Touch event handlers for swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    // Pause auto-scroll during interaction
    if (isAutoScrolling) {
      clearInterval(autoScrollRef.current);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || !isDragging) return;
    
    const currentX = e.targetTouches[0].clientX;
    const diffX = Math.abs(currentX - touchStart);
    
    // If horizontal movement is significant, prevent vertical scrolling
    if (diffX > 10) {
      e.preventDefault();
    }
    
    setTouchEnd(currentX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !isDragging) {
      setIsDragging(false);
      // Resume auto-scroll if it was enabled
      if (isAutoScrolling) {
        startAutoScroll();
      }
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > LAYOUT.CAROUSEL.SCROLL_THRESHOLD;
    const isRightSwipe = distance < -LAYOUT.CAROUSEL.SCROLL_THRESHOLD;

    if (isLeftSwipe && canScrollRight) {
      scrollRight();
    } else if (isRightSwipe && canScrollLeft) {
      scrollLeft();
    }

    setTouchStart(null);
    setTouchEnd(null);
    setIsDragging(false);
    
    // Resume auto-scroll if it was enabled
    if (isAutoScrolling) {
      startAutoScroll();
    }
  };

  // Auto-scroll functionality
  const startAutoScroll = () => {
    if (!isAutoScrolling) return;
    
    autoScrollRef.current = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        
        // If at the end, scroll back to the beginning
        if (scrollLeft >= scrollWidth - clientWidth - 10) {
          scrollContainerRef.current.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        } else {
          scrollRight();
        }
      }
    }, autoScrollInterval);
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };

  const toggleAutoScroll = () => {
    setIsAutoScrolling(!isAutoScrolling);
  };

  // Effect for auto-scroll
  useEffect(() => {
    if (isAutoScrolling) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }

    return () => stopAutoScroll();
  }, [isAutoScrolling, autoScrollInterval]);

  // Effect for scroll position monitoring
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition(); // Initial check
      
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => {
    if (isAutoScrolling) {
      stopAutoScroll();
    }
  };

  const handleMouseLeave = () => {
    if (isAutoScrolling) {
      startAutoScroll();
    }
  };


  if (!content || content.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Navigation buttons - Positioned away from fade gradients */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 z-20">
        <button
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className={`p-2 rounded-full border transition-all duration-200 ${
            canScrollLeft
              ? 'border-gray-300 hover:border-black hover:bg-black hover:text-white text-gray-600 bg-white/90 backdrop-blur-sm shadow-lg'
              : 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50/90'
          }`}
          aria-label="Scroll hacia la izquierda"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
      
      <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20">
        <button
          onClick={scrollRight}
          disabled={!canScrollRight}
          className={`p-2 rounded-full border transition-all duration-200 ${
            canScrollRight
              ? 'border-gray-300 hover:border-black hover:bg-black hover:text-white text-gray-600 bg-white/90 backdrop-blur-sm shadow-lg'
              : 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50/90'
          }`}
          aria-label="Scroll hacia la derecha"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Carousel Container - Matching ProductCarousel exactly */}
      <div
        ref={scrollContainerRef}
        className={`flex space-x-6 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {content.map((item, index) => (
          <UGCCard
            key={item.id}
            content={item}
            onImageClick={onContentClick}
            index={index}
          />
        ))}
      </div>

      {/* Edge Fade gradients */}
      <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />

      {/* Auto-scroll toggle (optional - can be removed) */}
      {autoScroll && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={toggleAutoScroll}
            className="bg-black/50 hover:bg-black/70 text-white px-3 py-1 rounded-full text-xs transition-colors"
          >
            {isAutoScrolling ? 'Pausar' : 'Auto'}
          </button>
        </div>
      )}
    </div>
  );
};

export default UGCCarousel;