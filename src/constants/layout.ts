/**
 * Layout Constants
 * Centralized layout constants to improve maintainability and consistency
 */

export const LAYOUT = {
  // Card dimensions for different screen sizes
  CARD_WIDTH: {
    MOBILE: 280,
    TABLET: 320,
    DESKTOP: 360
  },
  
  // Touch target minimum sizes for accessibility
  TOUCH_TARGET: {
    MIN_SIZE: 44, // WCAG AA minimum touch target size
    COMFORTABLE_SIZE: 48
  },
  
  // Breakpoints (matching Tailwind defaults)
  BREAKPOINTS: {
    SM: 640,   // tablet
    MD: 768,   // tablet
    LG: 1024,  // desktop
    XL: 1280,  // large desktop
    '2XL': 1536 // extra large desktop
  },
  
  // Carousel settings
  CAROUSEL: {
    SCROLL_THRESHOLD: 50, // pixels to trigger swipe
    ANIMATION_DURATION: 500, // milliseconds
    CARDS_PER_SCROLL: 1 // number of cards to scroll at once
  }
} as const;

export const BUSINESS = {
  // E-commerce thresholds
  FREE_SHIPPING_THRESHOLD: 10000, // MXN
  
  // Rating system
  RATING: {
    MIN: 3.5,
    MAX: 5.0,
    DEFAULT: 4.8
  },
  
  // Pricing
  CURRENCY: {
    CODE: 'MXN',
    LOCALE: 'es-MX'
  }
} as const;

export const UI = {
  // Animation durations
  ANIMATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
    VERY_SLOW: 1000
  },
  
  // Z-index layers
  Z_INDEX: {
    DROPDOWN: 10,
    STICKY: 20,
    MODAL: 50,
    CART: 9999
  },
  
  // Common delays
  DELAYS: {
    TOOLTIP: 300,
    SUCCESS_MESSAGE: 2000,
    ERROR_MESSAGE: 3000
  }
} as const;

// Type exports for TypeScript
export type LayoutConfig = typeof LAYOUT;
export type BusinessConfig = typeof BUSINESS;
export type UIConfig = typeof UI;