/**
 * Judge.me Service
 * 
 * This module provides a centralized service for interacting with Judge.me review widgets.
 * It handles script loading, initialization, and provides a clean API for accessing
 * Judge.me functionality throughout the application.
 */

import { initializeScript, isJudgeMeReady, getScriptStatus } from './scriptLoader';
import { 
  renderReviewWidget, 
  renderStarRating, 
  renderReviewsTab,
  getProductReviewCount,
  getAverageRating
} from './widgets';
import { 
  JudgeMeGlobal, 
  JudgeMeWidgetType, 
  JudgeMeWidgetConfig,
  hasJudgeMeGlobal,
  getJudgeMeGlobal
} from './types';

// Re-export all functionality for easy importing
// Export functions
export {
  // Script loading
  initializeScript,
  isJudgeMeReady,
  getScriptStatus,
  
  // Widgets
  renderReviewWidget,
  renderStarRating,
  renderReviewsTab,
  
  // Data functions
  getProductReviewCount,
  getAverageRating,
  
  // Utilities
  hasJudgeMeGlobal,
  getJudgeMeGlobal
};

// Export types
export type {
  JudgeMeGlobal,
  JudgeMeWidgetConfig
};

// Export enum
export { JudgeMeWidgetType };

/**
 * Main Judge.me service object providing access to all functionality
 */
const JudgeMeService = {
  // Script initialization
  initialize: initializeScript,
  isReady: isJudgeMeReady,
  status: getScriptStatus,
  
  // Widget rendering
  widgets: {
    renderReviewWidget,
    renderStarRating,
    renderReviewsTab,
  },
  
  // Data retrieval
  data: {
    getProductReviewCount,
    getAverageRating
  },
  
  // Utility functions
  utils: {
    hasJudgeMeGlobal,
    getJudgeMeGlobal
  }
};

export default JudgeMeService;
