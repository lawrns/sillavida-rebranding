/**
 * Environment Configuration
 * Centralizes environment variables and API endpoints
 */

// Development mode check
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Shopify Configuration
export const SHOPIFY_CONFIG = {
  domain: import.meta.env.VITE_SHOPIFY_DOMAIN || 'silla-vida.myshopify.com',
  storefrontToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
  apiVersion: '2024-01',
} as const;

// Judge.me Configuration
export const JUDGEME_CONFIG = {
  shopDomain: import.meta.env.VITE_JUDGEME_SHOP_DOMAIN || 'silla-vida.myshopify.com',
  apiToken: import.meta.env.VITE_JUDGEME_API_TOKEN || '',
  publicToken: import.meta.env.VITE_JUDGEME_PUBLIC_TOKEN || '',
  baseUrl: 'https://judge.me',
} as const;

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  enabled: isProduction,
  debugMode: isDevelopment,
  googleAnalyticsId: import.meta.env.VITE_GA_ID || '',
  facebookPixelId: import.meta.env.VITE_FB_PIXEL_ID || '',
} as const;

// API Configuration
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.sillavida.com',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
} as const;

// Application Configuration
export const APP_CONFIG = {
  name: 'SillaVida',
  version: '1.0.0',
  supportEmail: 'soporte@sillavida.com',
  maxCartItems: 10,
  freeShippingThreshold: 10000, // MXN
  defaultCurrency: 'MXN',
  defaultLocale: 'es-MX',
} as const;

// Development URLs (only used in development)
export const DEV_CONFIG = {
  localhost: 'http://localhost:3000',
  testApiUrl: 'http://localhost:4000',
  mockDataEnabled: isDevelopment,
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  enableJudgeMe: true,
  enableAnalytics: isProduction,
  enableDevTools: isDevelopment,
  enableMockData: isDevelopment,
  enableErrorBoundary: true,
  enableServiceWorker: isProduction,
} as const;

// Export all configurations as a single object for convenience
export const CONFIG = {
  shopify: SHOPIFY_CONFIG,
  judgeme: JUDGEME_CONFIG,
  analytics: ANALYTICS_CONFIG,
  api: API_CONFIG,
  app: APP_CONFIG,
  dev: DEV_CONFIG,
  features: FEATURE_FLAGS,
  environment: {
    isDevelopment,
    isProduction,
  },
} as const;

// Type exports for TypeScript support
export type ShopifyConfig = typeof SHOPIFY_CONFIG;
export type JudgeMeConfig = typeof JUDGEME_CONFIG;
export type AnalyticsConfig = typeof ANALYTICS_CONFIG;
export type ApiConfig = typeof API_CONFIG;
export type AppConfig = typeof APP_CONFIG;
export type DevConfig = typeof DEV_CONFIG;
export type FeatureFlags = typeof FEATURE_FLAGS;
export type Config = typeof CONFIG;