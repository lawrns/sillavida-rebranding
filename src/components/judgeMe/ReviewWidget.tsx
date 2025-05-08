/**
 * ReviewWidget Component
 * 
 * Displays full product reviews using Judge.me's widget.
 * This component handles loading states and proper DOM initialization.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useJudgeMeContext } from '../../context/JudgeMeContext';
import JudgeMeContainer from './JudgeMeContainer';

interface ReviewWidgetProps {
  productId: string | number;
  className?: string;
  containerClassName?: string;
  showIfEmpty?: boolean;
  showLoadingState?: boolean;
  showErrorState?: boolean;
}

const ReviewWidget: React.FC<ReviewWidgetProps> = ({
  productId,
  className = '',
  containerClassName = '',
  showIfEmpty = true,
  showLoadingState = true,
  showErrorState = false,
}) => {
  const { ready, loading, error, getProductReviewCount } = useJudgeMeContext();
  const containerRef = useRef<HTMLDivElement>(null);
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
        
        // Get review count
        const count = await getProductReviewCount(productId);
        
        if (isMounted) {
          setReviewCount(count);
          
          // If no reviews and showIfEmpty is false, we don't display
          if (count === 0 && !showIfEmpty) {
            setLocalLoading(false);
            return;
          }
          
          // Initialize Judge.me review widget
          if (containerRef.current && !hasInitialized) {
            // Create widget container
            const widgetContainer = document.createElement('div');
            widgetContainer.setAttribute('data-judge-me-widget', 'review-widget');
            widgetContainer.setAttribute('data-id', productId.toString());
            widgetContainer.className = className || '';
            
            // Clear any existing content and append new widget container
            containerRef.current.innerHTML = '';
            containerRef.current.appendChild(widgetContainer);
            
            // Trigger Judge.me to render the widget
            const jdgm = (window as any).jdgm;
            if (jdgm && typeof jdgm.renderWidget === 'function') {
              jdgm.renderWidget(containerRef.current.querySelector('[data-judge-me-widget]'));
              setHasInitialized(true);
            }
          }
          
          setLocalLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading Judge.me review widget:', err);
          setLocalError(err instanceof Error ? err : new Error(String(err)));
          setLocalLoading(false);
        }
      }
    };
    
    loadReviewData();
    
    return () => {
      isMounted = false;
    };
  }, [ready, productId, showIfEmpty, getProductReviewCount]);

  return (
    <JudgeMeContainer
      isLoading={loading || localLoading}
      error={error || localError}
      className={`judge-me-reviews ${containerClassName}`}
      showLoadingState={showLoadingState}
      showErrorState={showErrorState}
    >
      <div 
        ref={containerRef} 
        className="judge-me-reviews-container"
        aria-label={`Product reviews: ${reviewCount} total reviews`}
      />
    </JudgeMeContainer>
  );
};

export default ReviewWidget;
