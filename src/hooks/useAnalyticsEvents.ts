/**
 * Analytics Event Listener
 * Demonstrates decoupled event handling using the event bus pattern
 */

import { useEffect } from 'react';
import { useEventBus } from './useComponentComposition';

/**
 * Hook that listens to product events and tracks analytics
 * This shows how components can communicate without direct coupling
 */
export function useAnalyticsEvents() {
  const eventBus = useEventBus();

  useEffect(() => {
    // Listen for add to cart events
    const unsubscribeAddToCartStart = eventBus.subscribe('product:addToCart:start', (data) => {
      console.log('[Analytics] Add to Cart Started:', data);
      // Track with actual analytics service
      if (typeof gtag !== 'undefined') {
        gtag('event', 'add_to_cart_start', {
          item_id: data.product_id,
          item_name: data.product_name,
          price: data.product_price,
          quantity: data.quantity,
          product_type: data.type
        });
      }
    });

    const unsubscribeAddToCartSuccess = eventBus.subscribe('product:addToCart:success', (data) => {
      console.log('[Analytics] Add to Cart Success:', data);
      // Track with actual analytics service
      if (typeof gtag !== 'undefined') {
        gtag('event', 'add_to_cart', {
          item_id: data.product_id,
          variant_id: data.variant_id,
          product_type: data.type
        });
      }
    });

    const unsubscribeAddToCartError = eventBus.subscribe('product:addToCart:error', (data) => {
      console.log('[Analytics] Add to Cart Error:', data);
      // Track with actual analytics service
      if (typeof gtag !== 'undefined') {
        gtag('event', 'add_to_cart_error', {
          item_id: data.product_id,
          error_message: data.error,
          product_type: data.type
        });
      }
    });

    // Listen for cart toggle events
    const unsubscribeCartToggle = eventBus.subscribe('cart:toggle', (data) => {
      console.log('[Analytics] Cart Toggle:', data);
      // Track cart interaction
      if (typeof gtag !== 'undefined') {
        gtag('event', 'view_cart', {
          cart_count: data.cartCount
        });
      }
    });

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeAddToCartStart();
      unsubscribeAddToCartSuccess();
      unsubscribeAddToCartError();
      unsubscribeCartToggle();
    };
  }, [eventBus]);
}

/**
 * Hook for performance tracking
 * Shows how different concerns can be separated
 */
export function usePerformanceEvents() {
  const eventBus = useEventBus();

  useEffect(() => {
    // Listen for image loading events
    const unsubscribeImageLoaded = eventBus.subscribe('image:loaded', (data) => {
      console.log('[Performance] Image Loaded:', data);
      // Track loading performance
    });

    const unsubscribeImageError = eventBus.subscribe('image:error', (data) => {
      console.log('[Performance] Image Error:', data);
      // Track loading errors
    });

    return () => {
      unsubscribeImageLoaded();
      unsubscribeImageError();
    };
  }, [eventBus]);
}

/**
 * Hook for user behavior tracking
 * Another example of separated concerns
 */
export function useUserBehaviorEvents() {
  const eventBus = useEventBus();

  useEffect(() => {
    // Listen for product view events
    const unsubscribeProductView = eventBus.subscribe('product:view', (data) => {
      console.log('[User Behavior] Product View:', data);
      // Track product impressions
    });

    // Listen for navigation events
    const unsubscribeNavigation = eventBus.subscribe('navigation:click', (data) => {
      console.log('[User Behavior] Navigation Click:', data);
      // Track navigation patterns
    });

    return () => {
      unsubscribeProductView();
      unsubscribeNavigation();
    };
  }, [eventBus]);
}