/**
 * ReviewsCarousel Component
 * 
 * Displays a carousel of featured customer reviews from Judge.me.
 * This component is designed to be placed below the HeroSlider on the homepage.
 */

import React from 'react';
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
  
  const renderCarousel = () => {
    return (
      <div className={`jdgm-carousel-wrapper ${className}`}>
        <h2 className="jdgm-carousel-title text-2xl font-bold text-[#111827] mb-6 font-heading">{title}</h2>
        {showAllReviewsLink && (
          <a href="/reviews" className="jdgm-all-reviews-rating-wrapper flex items-center mb-4 text-[#4b7cae] hover:text-[#3a6b9d] transition-colors">
            <div data-score="" className="jdgm-all-reviews-rating"></div>
            <span className="ml-2">from <span className="jdgm-all-reviews-count"></span> reviews</span>
          </a>
        )}
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
