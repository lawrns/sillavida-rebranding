/**
 * ReviewStars Component
 * 
 * Displays star ratings for products using Judge.me's widget.
 * This component handles loading states and proper DOM initialization.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useJudgeMeContext } from '../../context/JudgeMeContext';
import { extractShopifyId } from '../../utils/business/productTransformer';
import JudgeMeContainer from './JudgeMeContainer';

interface ReviewStarsProps {
  productId: string | number;
  className?: string;
  containerClassName?: string;
  showIfEmpty?: boolean;
  showLoadingState?: boolean;
  showErrorState?: boolean;
}

const ReviewStars: React.FC<ReviewStarsProps> = ({
  productId,
  className = '',
  containerClassName = '',
  showIfEmpty = true,
  showLoadingState = true,
  showErrorState = false,
}) => {
  const { ready, loading, error, getAverageRating, getProductReviewCount } = useJudgeMeContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);
  const [localLoading, setLocalLoading] = useState<boolean>(true);
  const [localError, setLocalError] = useState<Error | null>(null);

  // Load review data and initialize widget
  useEffect(() => {
    let isMounted = true;
    
    const loadReviewData = async () => {
      if (!ready) return;
      
      try {
        setLocalLoading(true);
        
        // Get review data
        const [avgRating, count] = await Promise.all([
          getAverageRating(productId),
          getProductReviewCount(productId)
        ]);
        
        if (isMounted) {
          setAverageRating(avgRating);
          setReviewCount(count);
          
          // If no reviews and showIfEmpty is false, we don't display
          if (count === 0 && !showIfEmpty) {
            setLocalLoading(false);
            return;
          }
          
          // Initialize Judge.me star rating widget
          if (containerRef.current && !hasInitialized) {
            // Create widget container
            const widgetContainer = document.createElement('div');
            widgetContainer.setAttribute('data-judge-me-widget', 'star-rating');
            widgetContainer.setAttribute('data-id', extractShopifyId(productId));
            widgetContainer.className = className || '';
            
            // Clear any existing content and append new widget container
            containerRef.current.innerHTML = '';
            containerRef.current.appendChild(widgetContainer);
            
            // Trigger Judge.me to render the widget
            const jdgm = (window as any).jdgm;
            if (jdgm && typeof jdgm.renderWidgets === 'function') {
              jdgm.renderWidgets();
              setHasInitialized(true);
            }
          }
          
          setLocalLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading Judge.me review stars:', err);
          setLocalError(err instanceof Error ? err : new Error(String(err)));
          setLocalLoading(false);
        }
      }
    };
    
    loadReviewData();
    
    return () => {
      isMounted = false;
    };
  }, [ready, productId, showIfEmpty, getAverageRating, getProductReviewCount]);

  return (
    <JudgeMeContainer
      isLoading={loading || localLoading}
      error={error || localError}
      className={`judge-me-stars ${containerClassName}`}
      showLoadingState={showLoadingState}
      showErrorState={showErrorState}
    >
      <div 
        ref={containerRef} 
        className="judge-me-stars-container"
        aria-label={`Product rating: ${averageRating} out of 5 stars from ${reviewCount} reviews`}
      />
    </JudgeMeContainer>
  );
};

export default ReviewStars;
