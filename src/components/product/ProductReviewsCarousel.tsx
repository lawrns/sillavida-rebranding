/**
 * ProductReviewsCarousel Component
 * Displays reviews specific to a single product in a horizontal carousel
 */

import React from 'react';
import { motion } from 'framer-motion';
import ReviewsCarousel from '../reviews/ReviewsCarousel';
import { enhancedReviews, getReviewsByChair, calculateTrustMetrics } from '../../data/enhanced-reviews';
import type { ChairModel } from '../../data/enhanced-reviews';

interface ProductReviewsCarouselProps {
  productHandle: ChairModel;
  productName?: string;
  showHeader?: boolean;
  autoScroll?: boolean;
  className?: string;
}

const ProductReviewsCarousel: React.FC<ProductReviewsCarouselProps> = ({
  productHandle,
  productName,
  showHeader = true,
  autoScroll = true,
  className = ''
}) => {
  // Get reviews specific to this product
  const productReviews = getReviewsByChair(productHandle);
  
  // Calculate metrics for this specific product
  const productMetrics = calculateTrustMetrics(productReviews);
  
  // If no reviews found, return null
  if (productReviews.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h3 className="text-2xl lg:text-3xl font-bold text-black mb-2">
            Opiniones de Clientes
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>
              <span className="font-semibold text-black">{productMetrics.averageRating}</span> 
              /5 estrellas
            </span>
            <span>•</span>
            <span>
              <span className="font-semibold text-black">{productMetrics.totalReviews}</span> 
              {productMetrics.totalReviews === 1 ? ' reseña' : ' reseñas'}
            </span>
            <span>•</span>
            <span>
              <span className="font-semibold text-green-600">{productMetrics.verificationRate}%</span> 
              verificadas
            </span>
          </div>
          {productName && (
            <p className="text-gray-600 mt-2">
              Experiencias reales de clientes que han probado {productName}
            </p>
          )}
        </motion.div>
      )}

      {/* Product-specific Reviews Carousel */}
      <ReviewsCarousel
        reviews={productReviews}
        autoScroll={autoScroll}
        autoScrollInterval={8000} // Slower auto-scroll for product pages
      />
    </div>
  );
};

export default ProductReviewsCarousel;