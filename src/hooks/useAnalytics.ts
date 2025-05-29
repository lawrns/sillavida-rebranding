/**
 * Analytics Hook
 * 
 * This hook provides easy access to analytics functions within React components.
 * It handles initialization, page views, and custom events.
 */

import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA4, pageView, trackEvent, ecommerce } from '../utils/analytics';
import analyticsConfig, { ANALYTICS_CONFIG } from '../config/analytics';

export function useAnalytics() {
  const location = useLocation();
  
  // Initialize analytics on mount
  useEffect(() => {
    if (ANALYTICS_CONFIG.enabled && analyticsConfig.measurementId) {
      initGA4(analyticsConfig.measurementId);
    }
  }, []);
  
  // Track page views when location changes
  useEffect(() => {
    if (ANALYTICS_CONFIG.enabled) {
      pageView(window.location.pathname + window.location.search);
      
    }
  }, [location]);
  
  // Function to track custom events
  const trackCustomEvent = useCallback((eventName: string, params?: Record<string, any>) => {
    if (ANALYTICS_CONFIG.enabled) {
      trackEvent(eventName, params);
      
    }
  }, []);
  
  // Return all analytics functions
  return {
    // Basic tracking
    trackEvent: trackCustomEvent,
    
    // E-commerce tracking
    ecommerce: {
      viewItemList: useCallback((params: Parameters<typeof ecommerce.viewItemList>[0]) => {
        if (ANALYTICS_CONFIG.enabled && ANALYTICS_CONFIG.ecommerceEnabled) {
          ecommerce.viewItemList(params);
          
        }
      }, []),
      
      selectItem: useCallback((item: Parameters<typeof ecommerce.selectItem>[0], listName: Parameters<typeof ecommerce.selectItem>[1]) => {
        if (ANALYTICS_CONFIG.enabled && ANALYTICS_CONFIG.ecommerceEnabled) {
          ecommerce.selectItem(item, listName);
          
        }
      }, []),
      
      viewItem: useCallback((params: Parameters<typeof ecommerce.viewItem>[0]) => {
        if (ANALYTICS_CONFIG.enabled && ANALYTICS_CONFIG.ecommerceEnabled) {
          ecommerce.viewItem(params);
          
        }
      }, []),
      
      addToCart: useCallback((params: Parameters<typeof ecommerce.addToCart>[0]) => {
        if (ANALYTICS_CONFIG.enabled && ANALYTICS_CONFIG.ecommerceEnabled) {
          ecommerce.addToCart(params);
          
        }
      }, []),
      
      removeFromCart: useCallback((params: Parameters<typeof ecommerce.removeFromCart>[0]) => {
        if (ANALYTICS_CONFIG.enabled && ANALYTICS_CONFIG.ecommerceEnabled) {
          ecommerce.removeFromCart(params);
          
        }
      }, []),
      
      beginCheckout: useCallback((params: Parameters<typeof ecommerce.beginCheckout>[0]) => {
        if (ANALYTICS_CONFIG.enabled && ANALYTICS_CONFIG.ecommerceEnabled) {
          ecommerce.beginCheckout(params);
          
        }
      }, []),
      
      addShippingInfo: useCallback((params: Parameters<typeof ecommerce.addShippingInfo>[0]) => {
        if (ANALYTICS_CONFIG.enabled && ANALYTICS_CONFIG.ecommerceEnabled) {
          ecommerce.addShippingInfo(params);
          
        }
      }, []),
      
      addPaymentInfo: useCallback((params: Parameters<typeof ecommerce.addPaymentInfo>[0]) => {
        if (ANALYTICS_CONFIG.enabled && ANALYTICS_CONFIG.ecommerceEnabled) {
          ecommerce.addPaymentInfo(params);
          
        }
      }, []),
      
      purchase: useCallback((params: Parameters<typeof ecommerce.purchase>[0]) => {
        if (ANALYTICS_CONFIG.enabled && ANALYTICS_CONFIG.ecommerceEnabled) {
          ecommerce.purchase(params);
          
        }
      }, []),
    },
  };
}

export default useAnalytics;
