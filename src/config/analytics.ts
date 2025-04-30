/**
 * Analytics Configuration
 * 
 * This file contains configuration for analytics services used in the application.
 * Environment variables are used to store sensitive information like API keys.
 */

// Google Analytics 4 Measurement ID
// This should be set in the environment variables
export const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || '';

// Analytics feature flags
export const ANALYTICS_CONFIG = {
  // Enable/disable analytics tracking
  enabled: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
  
  // Enable/disable enhanced e-commerce tracking
  ecommerceEnabled: import.meta.env.VITE_ENABLE_ECOMMERCE_TRACKING !== 'false',
  
  // Enable/disable debug mode (logs events to console)
  debug: import.meta.env.VITE_ANALYTICS_DEBUG === 'true',
  
  // Consent settings
  requireConsent: true,
  
  // Anonymize IP addresses
  anonymizeIp: true,
};

// Analytics event categories
export const EVENT_CATEGORIES = {
  ENGAGEMENT: 'engagement',
  ECOMMERCE: 'ecommerce',
  NAVIGATION: 'navigation',
  USER: 'user',
  PERFORMANCE: 'performance',
  ERROR: 'error',
};

// Analytics event actions
export const EVENT_ACTIONS = {
  // Engagement events
  CLICK: 'click',
  SCROLL: 'scroll',
  VIEW: 'view',
  INTERACT: 'interact',
  
  // E-commerce events
  VIEW_ITEM_LIST: 'view_item_list',
  VIEW_ITEM: 'view_item',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  PURCHASE: 'purchase',
  
  // Navigation events
  PAGE_VIEW: 'page_view',
  SEARCH: 'search',
  
  // User events
  SIGN_UP: 'sign_up',
  LOGIN: 'login',
  LOGOUT: 'logout',
  
  // Performance events
  PAGE_LOAD: 'page_load',
  RESOURCE_LOAD: 'resource_load',
  
  // Error events
  API_ERROR: 'api_error',
  JS_ERROR: 'js_error',
};

// Default consent settings
export const DEFAULT_CONSENT_SETTINGS = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  functionality_storage: 'granted',
  personalization_storage: 'denied',
  security_storage: 'granted',
};

// Consent modes
export const CONSENT_MODES = {
  GRANTED: 'granted',
  DENIED: 'denied',
};

// Export default configuration
export default {
  measurementId: GA4_MEASUREMENT_ID,
  config: ANALYTICS_CONFIG,
  eventCategories: EVENT_CATEGORIES,
  eventActions: EVENT_ACTIONS,
  defaultConsentSettings: DEFAULT_CONSENT_SETTINGS,
  consentModes: CONSENT_MODES,
};
