/**
 * ReviewsCarousel Component
 * 
 * Displays a carousel of featured customer reviews from Judge.me.
 * This component is designed to be placed below the HeroSlider on the homepage.
 */

import React, { useEffect, useRef, useState } from 'react';
import JudgeMeContainer from './JudgeMeContainer';

interface ReviewsCarouselProps {
  containerClassName?: string;
  className?: string;
  title?: string;
  showAllReviewsLink?: boolean;
}

const ReviewsCarousel: React.FC<ReviewsCarouselProps> = ({
  containerClassName = '',
  className = '',
  title = 'Featured Reviews',
  showAllReviewsLink = true
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Function to try rendering the carousel
    const renderCarousel = () => {
      if (window.jdgm) {
        console.log('Judge.me available, attempting to render carousel');
        
        // Try different rendering methods
        if (typeof window.jdgm.renderWidgets === 'function') {
          console.log('Using renderWidgets method');
          window.jdgm.renderWidgets();
        } else if (typeof window.jdgm.docReady === 'function') {
          console.log('Using docReady method');
          window.jdgm.docReady(() => {
            if (typeof window.jdgm.renderWidgets === 'function') {
              window.jdgm.renderWidgets();
            }
          });
        } else {
          console.log('Judge.me loaded but no rendering methods available yet');
        }
      }
    };

    // Try to render immediately
    renderCarousel();

    // Also try after delays in case Judge.me is still loading
    const timer1 = setTimeout(renderCarousel, 2000);
    const timer2 = setTimeout(renderCarousel, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [loading, error]);

  const renderCarousel = () => {
    return (
      <div ref={carouselRef}>
        {/* Judge.me Reviews Carousel - using exact code provided */}
        <div className="jdgm-carousel-wrapper">
          <h2 className="jdgm-carousel-title">{title}</h2>
          {showAllReviewsLink && (
            <a href="/reviews" className="jdgm-all-reviews-rating-wrapper">
              <div data-score="" className="jdgm-all-reviews-rating"></div>
              from <span className="jdgm-all-reviews-count"></span> reviews
            </a>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <JudgeMeContainer
      isLoading={loading}
      error={error}
      className={`reviews-carousel-container ${containerClassName}`}
      showLoadingState={true}
      showErrorState={true}
    >
      {renderCarousel()}
    </JudgeMeContainer>
  );
};

export default ReviewsCarousel;
