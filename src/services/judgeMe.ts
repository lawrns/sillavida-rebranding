/**
 * Judge.me Service
 * 
 * Provides utilities for interacting with Judge.me's API and widgets.
 * Handles script loading, initialization, and data retrieval.
 */

import { errorHandler, ErrorCategory, ErrorSeverity } from '../utils/errorHandler';

// URL for Judge.me script
const JUDGEME_CDN_URL = 'https://cdn.judge.me/widget_v3/init.js';
const JUDGEME_ATTRIBUTES = "async data-api-host='https://judge.me'";

// Script loading status
let scriptStatus = {
  loading: false,
  loaded: false,
  error: null as Error | null
};

// Interfaces
export interface JudgeMeRating {
  average: number;
  count: number;
}

export interface JudgeMeGlobal {
  getReviewCount: (productId: string | number) => number;
  getAverageRating: (productId: string | number) => number;
  renderWidgets: (container?: Element) => void;
  openReviewDrawer: (productId: string) => void;
}

/**
 * Check if Judge.me is already loaded and ready
 * @returns {boolean} True if Judge.me is loaded and available
 */
export const isJudgeMeReady = (): boolean => {
  return typeof (window as any).jdgm !== 'undefined' && (window as any).jdgm !== null;
};

/**
 * Get current script loading status
 * @returns {Object} Script loading status object
 * @returns {boolean} returns.loading - Whether script is currently loading
 * @returns {boolean} returns.loaded - Whether script is loaded
 * @returns {Error|null} returns.error - Any loading errors
 */
export const getScriptStatus = () => {
  return { ...scriptStatus };
};

/**
 * Initialize the Judge.me script
 * @returns {Promise<void>} Promise that resolves when the script is loaded
 */
export const initializeScript = (): Promise<void> => {
  // If already loaded, resolve immediately
  if (isJudgeMeReady()) {
    scriptStatus = { ...scriptStatus, loaded: true, loading: false };
    return Promise.resolve();
  }
  
  // If already loading, return the existing promise
  if (scriptStatus.loading) {
    return new Promise<void>((resolve, reject) => {
      const checkLoaded = setInterval(() => {
        if (isJudgeMeReady()) {
          clearInterval(checkLoaded);
          resolve();
        } else if (scriptStatus.error) {
          clearInterval(checkLoaded);
          reject(scriptStatus.error);
        }
      }, 100);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkLoaded);
        if (!isJudgeMeReady()) {
          const timeoutError = new Error('Judge.me script loading timed out');
          scriptStatus.error = timeoutError;
          reject(timeoutError);
        }
      }, 10000);
    });
  }
  
  // Start loading the script
  return new Promise<void>((resolve, reject) => {
    try {
      scriptStatus = { loading: true, loaded: false, error: null };
      
      // Create the script element
      const script = document.createElement('script');
      script.src = JUDGEME_CDN_URL;
      JUDGEME_ATTRIBUTES.split(' ').forEach(attr => {
        if (attr.includes('=')) {
          const [key, value] = attr.split('=');
          script.setAttribute(key, value.replace(/['"]/g, ''));
        } else if (attr) {
          script.setAttribute(attr, '');
        }
      });
      
      // Set up load handlers
      script.onload = () => {
        scriptStatus = { loading: false, loaded: true, error: null };
        
        // Additional initialization if needed
        if (typeof (window as any).jdgm !== 'undefined') {
          // Make sure widgets render
          setTimeout(() => {
            if (typeof (window as any).jdgm.renderWidgets === 'function') {
              (window as any).jdgm.renderWidgets();
            }
          }, 100);
        }
        
        resolve();
      };
      
      script.onerror = (event) => {
        const error = new Error('Failed to load Judge.me script');
        scriptStatus = { loading: false, loaded: false, error };
        reject(error);
      };
      
      // Add to document
      document.head.appendChild(script);
      
    } catch (error) {
      scriptStatus = { 
        loading: false, 
        loaded: false, 
        error: error instanceof Error ? error : new Error(String(error)) 
      };
      reject(error);
    }
  });
};

/**
 * Get the number of reviews for a product
 * @param {string|number} productId - The product ID to get review count for
 * @returns {Promise<number>} Number of reviews for the product
 */
export const getProductReviewCount = async (productId: string | number): Promise<number> => {
  if (!isJudgeMeReady()) {
    await initializeScript();
  }
  
  try {
    const jdgm = (window as any).jdgm as JudgeMeGlobal;
    
    if (typeof jdgm.getReviewCount === 'function') {
      return jdgm.getReviewCount(productId);
    }
    
    // Fallback if direct method isn't available
    const badges = document.querySelectorAll(`[data-api-product-id="${productId}"]`);
    if (badges.length > 0) {
      const countEl = badges[0].querySelector('.jdgm-prev-badge__text');
      if (countEl) {
        const match = countEl.textContent?.match(/\d+/);
        if (match) {
          return parseInt(match[0], 10);
        }
      }
    }
    
    return 0;
  } catch (error) {
    errorHandler.handleError(error as Error, {
      component: 'JudgeMeService',
      action: 'getProductReviewCount'
    });
    return 0;
  }
};

/**
 * Get the average rating for a product
 * @param {string|number} productId - The product ID to get rating for
 * @returns {Promise<number>} Average rating (0-5) for the product
 */
export const getAverageRating = async (productId: string | number): Promise<number> => {
  if (!isJudgeMeReady()) {
    await initializeScript();
  }
  
  try {
    const jdgm = (window as any).jdgm as JudgeMeGlobal;
    
    if (typeof jdgm.getAverageRating === 'function') {
      return jdgm.getAverageRating(productId);
    }
    
    // Fallback if direct method isn't available
    const badges = document.querySelectorAll(`[data-api-product-id="${productId}"]`);
    if (badges.length > 0) {
      const starsEl = badges[0].querySelector('.jdgm-prev-badge__stars');
      if (starsEl && starsEl.getAttribute('data-score')) {
        return parseFloat(starsEl.getAttribute('data-score') || '0');
      }
    }
    
    return 0;
  } catch (error) {
    errorHandler.handleError(error as Error, {
      component: 'JudgeMeService', 
      action: 'getAverageRating'
    });
    return 0;
  }
};

/**
 * Manual re-initialization of widgets
 * Call this after dynamic content changes
 */
export const renderWidgets = (container?: Element): void => {
  if (isJudgeMeReady()) {
    const jdgm = (window as any).jdgm as JudgeMeGlobal;
    if (typeof jdgm.renderWidgets === 'function') {
      jdgm.renderWidgets(container);
    }
  }
};

// Default export
export default {
  isJudgeMeReady,
  initializeScript,
  getProductReviewCount,
  getAverageRating,
  renderWidgets
};
