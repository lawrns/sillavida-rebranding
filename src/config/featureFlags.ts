/**
 * Feature Flags Configuration
 * 
 * This file contains feature flags for enabling/disabling features
 * across the SillaVida application.
 */

export interface FeatureFlags {
  productPage: {
    enableZoomableImages: boolean;
    enable360View: boolean;
    enableStickyAddToCart: boolean;
    enableSectionNavigation: boolean;
    enableProductComparison: boolean;
  };
  customerAccounts: {
    enabled: boolean;
    enableFallback: boolean;
    enableErrorReporting: boolean;
  };
}

// Default feature flags configuration
const featureFlags: FeatureFlags = {
  productPage: {
    enableZoomableImages: true,
    enable360View: true,
    enableStickyAddToCart: true,
    enableSectionNavigation: true,
    enableProductComparison: true,
  },
  customerAccounts: {
    enabled: true,
    enableFallback: true,
    enableErrorReporting: true,
  },
};

// Function to get feature flag value
export const getFeatureFlag = (path: string): boolean => {
  const parts = path.split('.');
  let value: any = featureFlags;
  
  for (const part of parts) {
    if (value === undefined) return false;
    value = value[part];
  }
  
  return !!value;
};

// Load flags from environment or localStorage
const loadFlags = (): void => {
  try {
    // Check for localStorage overrides (useful for testing)
    const localFlags = localStorage.getItem('sillavida_feature_flags');
    if (localFlags) {
      const parsedFlags = JSON.parse(localFlags);
      
      // Merge with default flags
      if (parsedFlags.customerAccounts) {
        featureFlags.customerAccounts = {
          ...featureFlags.customerAccounts,
          ...parsedFlags.customerAccounts
        };
      }
      
      if (parsedFlags.productPage) {
        featureFlags.productPage = {
          ...featureFlags.productPage,
          ...parsedFlags.productPage
        };
      }
    }
  } catch (error) {
    console.warn('Error loading feature flags:', error);
  }
};

// Set a specific feature flag
export const setFeatureFlag = (path: string, value: boolean): void => {
  const parts = path.split('.');
  let target: any = featureFlags;
  
  // Navigate to the parent object
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (target[part] === undefined) {
      target[part] = {};
    }
    target = target[part];
  }
  
  // Set the value
  const lastPart = parts[parts.length - 1];
  target[lastPart] = value;
  
  // Save to localStorage
  try {
    localStorage.setItem('sillavida_feature_flags', JSON.stringify(featureFlags));
  } catch (error) {
    console.warn('Error saving feature flags:', error);
  }
};

// Initialize flags on load
if (typeof window !== 'undefined') {
  loadFlags();
}

export default featureFlags;
