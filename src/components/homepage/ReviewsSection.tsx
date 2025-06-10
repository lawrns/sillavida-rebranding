import React from 'react';
import { motion } from 'framer-motion';
import { createLazyComponent } from '../common/LazyComponent';
import TrustIndicators from '../reviews/TrustIndicators';
import ReviewsCarousel from '../reviews/ReviewsCarousel';
import { enhancedReviews, getFeaturedReviews, currentTrustMetrics } from '../../data/enhanced-reviews';

// Lazy load Judge.me components for enhanced functionality
const LazyJudgeMeLoader = createLazyComponent(() => 
  import('../judgeMe').then(module => ({ default: module.JudgeMeLoader }))
);

/**
 * ReviewsSection - Enhanced reviews section with real customer data
 * Features trust indicators, horizontal carousel, verification badges, and authentic reviews
 */
const ReviewsSection: React.FC = () => {
  // Get all enhanced reviews
  const featuredReviews = enhancedReviews; // Show all 24 reviews in carousel

  return (
    <section className="bg-gray-50 py-16 lg:py-20">
      {/* Section Header - Contained */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-8">
            Lo Que Dicen Nuestros Clientes
          </h2>
        </motion.div>
      </div>

      {/* Enhanced Reviews Carousel - Edge to Edge */}
      <div className="mb-8 relative">
        <ReviewsCarousel 
          reviews={featuredReviews}
          autoScroll={true}
          autoScrollInterval={6000}
        />
      </div>

      {/* Trust Indicators - Contained */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TrustIndicators metrics={currentTrustMetrics} />
      </div>
        
      {/* Hidden Judge.me Integration for Enhanced Functionality */}
      <div className="hidden">
        <LazyJudgeMeLoader>
          <div className="jdgm-carousel-wrapper">
            <div data-score="" className="jdgm-all-reviews-rating"></div>
            <span className="jdgm-all-reviews-count"></span>
          </div>
        </LazyJudgeMeLoader>
      </div>
        
    </section>
  );
};

export default ReviewsSection;