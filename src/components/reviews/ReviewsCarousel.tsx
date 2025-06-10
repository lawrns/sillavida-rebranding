/**
 * ReviewsCarousel Component
 * Horizontal scrolling carousel for enhanced review cards
 */

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedReviewCard from './EnhancedReviewCard';
import type { EnhancedReview } from '../../data/enhanced-reviews';
import './ReviewsCarousel.css';

interface ReviewsCarouselProps {
  reviews: EnhancedReview[];
  autoScroll?: boolean;
  autoScrollInterval?: number;
}

const ReviewsCarousel: React.FC<ReviewsCarouselProps> = ({ 
  reviews, 
  autoScroll = true, 
  autoScrollInterval = 5000 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(autoScroll);
  const autoScrollRef = useRef<NodeJS.Timeout>();

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
      const cardWidth = 380; // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 380; // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
      });
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
    stopAutoScroll();
  };

  const handleMouseLeave = () => {
    if (isAutoScrolling) {
      startAutoScroll();
    }
  };

  return (
    <div className="relative">
      {/* Navigation buttons - Positioned away from fade gradients */}
      <div className="absolute top-1/2 -translate-y-1/2 left-16 z-20">
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
      
      <div className="absolute top-1/2 -translate-y-1/2 right-16 z-20">
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

      {/* Carousel Container - Edge to Edge */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' },
          paddingLeft: 'max(1rem, calc(50vw - 672px))', // Responsive padding that goes edge-to-edge on mobile, contained on desktop
          paddingRight: 'max(1rem, calc(50vw - 672px))'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {reviews.map((review, index) => (
          <EnhancedReviewCard
            key={review.id}
            review={review}
            index={index}
          />
        ))}
      </div>

      {/* Edge Fade gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
    </div>
  );
};

export default ReviewsCarousel;