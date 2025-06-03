import React, { useEffect, useRef } from 'react';
import JudgeMeConfig from '../config/judgeme.config';
import { extractShopifyId } from '../utils/business/productTransformer';
import './JudgeMeReviews.css';

interface JudgeMeReviewsProps {
  productId: string;
  shopDomain?: string;
  language?: 'es' | 'en';
}

const JudgeMeReviews: React.FC<JudgeMeReviewsProps> = ({ 
  productId, 
  shopDomain = JudgeMeConfig.shopDomain,
  language = 'es'
}) => {
  const reviewsContainerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef<boolean>(false);
  const { reviews, reviewForm } = JudgeMeConfig.widgets;
  const translations = JudgeMeConfig.translations[language];
  
  // Extract numerical ID for Judge.me compatibility
  const numericProductId = extractShopifyId(productId);

  useEffect(() => {
    // Only load the script once
    if (scriptLoaded.current) return;
    
    // Create and load the Judge.me script
    const script = document.createElement('script');
    script.src = `${JudgeMeConfig.cdnUrl}/widget_preloader.js`;
    script.async = true;
    script.setAttribute('data-shop-domain', shopDomain);
    
    script.onload = () => {
      // Initialize the widgets once the script is loaded
      if (window.jdgm && typeof window.jdgm.initializeWidgets === 'function') {
        window.jdgm.initializeWidgets();
      }
    };
    
    document.head.appendChild(script);
    scriptLoaded.current = true;
    
    return () => {
      // Cleanup if needed
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [shopDomain]);

  return (
    <div className="experiencias-vida-container" ref={reviewsContainerRef}>
      <div className="experiencias-vida-header">
        <h2>{translations.reviewsTitle}</h2>
        <p>{translations.reviewsSubtitle}</p>
      </div>
      
      {/* Judge.me review widget */}
      <div 
        className="jdgm-widget jdgm-reviews-widget"
        data-id={numericProductId}
        data-auto-install={reviews.autoInstall.toString()}
        data-per-page={reviews.perPage.toString()}
        data-rating-text={reviews.ratingText}
        data-no-reviews-text={reviews.noReviewsText}
        data-write-review-text={reviews.writeReviewText}
        data-verified-buyer-text={reviews.verifiedBuyerText}
      ></div>
      
      {/* Judge.me review form */}
      <div 
        className="jdgm-widget jdgm-review-form"
        data-id={numericProductId}
        data-auto-install={reviewForm.autoInstall.toString()}
        data-form-title={reviewForm.formTitle}
        data-submit-text={reviewForm.submitText}
        data-name-text={reviewForm.nameText}
        data-email-text={reviewForm.emailText}
        data-title-text={reviewForm.titleText}
        data-body-text={reviewForm.bodyText}
      ></div>
    </div>
  );
};

// Add TypeScript interface for the Judge.me global object
declare global {
  interface Window {
    jdgm: {
      initializeWidgets: () => void;
    };
  }
}

export default JudgeMeReviews;
