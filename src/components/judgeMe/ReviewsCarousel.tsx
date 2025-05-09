/**
 * ReviewsCarousel Component
 * 
 * Displays a carousel of featured customer reviews from Judge.me.
 * This component is designed to be placed below the HeroSlider on the homepage.
 */

import React, { useEffect, useRef } from 'react';
import JudgeMeContainer from './JudgeMeContainer';
import { useJudgeMe } from '../../hooks/useJudgeMe';

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
  const { loading, error } = useJudgeMe();
  const carouselRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Ensure widgets are rendered when the component mounts
    if (!loading && !error && window.jdgm && typeof window.jdgm.renderWidgets === 'function') {
      console.log('Initializing Judge.me carousel');
      window.jdgm.renderWidgets();
    }
  }, [loading, error]);

  const renderCarousel = () => {
    return (
      <div ref={carouselRef}>
        {/* Using the exact Judge.me Reviews Carousel code */}
        <div className="jdgm-carousel-wrapper" data-number-of-reviews="8" data-auto-rotate="5000"> 
          <h2 className="jdgm-carousel-title">{title}</h2> 
          {showAllReviewsLink && (
            <a href="/reviews" className="jdgm-all-reviews-rating-wrapper"> 
              <div data-score="" className="jdgm-all-reviews-rating"></div> 
              <span className="jdgm-text-español">Ver todas las <span className="jdgm-all-reviews-count"></span> opiniones</span>
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
