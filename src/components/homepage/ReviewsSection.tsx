import React from 'react';
import { createLazyComponent } from '../common/LazyComponent';

// Lazy load Judge.me components
const LazyJudgeMeLoader = createLazyComponent(() => 
  import('../judgeMe').then(module => ({ default: module.JudgeMeLoader }))
);

const LazyReviewsCarousel = createLazyComponent(() => 
  import('../judgeMe').then(module => ({ default: module.ReviewsCarousel }))
);

/**
 * ReviewsSection - Encapsulates customer reviews functionality
 * Uses lazy loading and minimal interface for Judge.me integration
 */
const ReviewsSection: React.FC = () => {
  return (
    <LazyJudgeMeLoader>
      <LazyReviewsCarousel
        title="Opiniones de Nuestros Clientes"
        containerClassName=""
        showAllReviewsLink={true}
      />
    </LazyJudgeMeLoader>
  );
};

export default ReviewsSection;