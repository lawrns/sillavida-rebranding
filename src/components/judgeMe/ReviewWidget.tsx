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
  productTitle?: string;
  className?: string;
  containerClassName?: string;
  showIfEmpty?: boolean;
  showLoadingState?: boolean;
  showErrorState?: boolean;
  widgetType?: 'inline' | 'carousel' | 'featured';
}

const ReviewWidget: React.FC<ReviewWidgetProps> = ({
  productId,
  productTitle,
  className = '',
  containerClassName = '',
  showIfEmpty = true,
  showLoadingState = true,
  showErrorState = false,
  widgetType = 'inline',
}) => {
  const { ready, loading, error, getProductReviewCount, judgeMe } = useJudgeMeContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);
  const [localLoading, setLocalLoading] = useState<boolean>(true);
  const [localError, setLocalError] = useState<Error | null>(null);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

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
          setIsEmpty(count === 0);
          
          // If no reviews and showIfEmpty is false, we don't display
          if (count === 0 && !showIfEmpty) {
            setLocalLoading(false);
            return;
          }
          
          // Initialize Judge.me review widget
          if (containerRef.current && !hasInitialized) {
            // Create widget container
            const widgetContainer = document.createElement('div');
            widgetContainer.setAttribute('data-judge-me-widget', widgetType + '-widget');
            widgetContainer.setAttribute('data-id', productId.toString());
            
            if (productTitle) {
              widgetContainer.setAttribute('data-product-title', productTitle);
            }
            
            widgetContainer.className = `jdgm-widget jdgm-review-widget jdgm-${widgetType}-widget ${className}`;
            
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
  }, [ready, productId, productTitle, widgetType, showIfEmpty, getProductReviewCount]);

  // Create empty state component with write review button
  const emptyComponent = (
    <div className="text-center py-4">
      <p className="mb-2 text-white/80">¡Sé el primero en opinar sobre este producto!</p>
      <button 
        className="bg-[#4b7cae] hover:bg-[#4b7cae]/90 text-white py-2 px-4 rounded transition-colors"
        onClick={() => judgeMe?.openReviewDrawer(productId.toString())}
      >
        Escribir una reseña
      </button>
    </div>
  );

  return (
    <JudgeMeContainer
      isLoading={loading || localLoading}
      error={error || localError}
      isEmpty={isEmpty}
      showIfEmpty={showIfEmpty}
      className={`judge-me-reviews ${containerClassName}`}
      showLoadingState={showLoadingState}
      showErrorState={showErrorState}
      emptyComponent={emptyComponent}
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
