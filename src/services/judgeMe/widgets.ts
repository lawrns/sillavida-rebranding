/**
 * Judge.me Widgets
 * 
 * This module provides helper functions for rendering Judge.me widgets.
 * It handles the DOM manipulations required for widget placement and initialization.
 */

import { getJudgeMeGlobal, JudgeMeWidgetType, JudgeMeWidgetConfig } from './types';
import { isJudgeMeReady, initializeScript } from './scriptLoader';

/**
 * Internal function to ensure Judge.me is initialized before attempting to render widgets
 */
const ensureJudgeMeInitialized = async (): Promise<boolean> => {
  if (!isJudgeMeReady()) {
    try {
      await initializeScript();
      return true;
    } catch (error) {
      console.error('Failed to initialize Judge.me script:', error);
      return false;
    }
  }
  return true;
};

/**
 * Create a container element for a Judge.me widget with proper data attributes
 */
const createWidgetContainer = (
  widgetType: JudgeMeWidgetType,
  config: Partial<JudgeMeWidgetConfig> = {}
): HTMLElement => {
  const container = document.createElement('div');
  
  // Add common data attributes
  container.setAttribute('data-judge-me-widget', widgetType);
  
  // Add class name if provided
  if (config.containerClassName) {
    container.className = config.containerClassName;
  }
  
  // Set product-specific attributes if provided
  if (config.productId) {
    container.setAttribute('data-id', config.productId.toString());
  }
  
  if (config.productHandle) {
    container.setAttribute('data-handle', config.productHandle);
  }
  
  if (config.showIfEmpty === false) {
    container.setAttribute('data-show-if-empty', 'false');
  }
  
  return container;
};

/**
 * Render a full review widget for a product
 */
export async function renderReviewWidget(
  elementSelector: string,
  productId: string | number,
  config: Partial<JudgeMeWidgetConfig> = {}
): Promise<boolean> {
  try {
    const initialized = await ensureJudgeMeInitialized();
    if (!initialized) return false;
    
    const targetElement = document.querySelector(elementSelector);
    if (!targetElement) {
      console.error(`Target element not found: ${elementSelector}`);
      return false;
    }
    
    const widgetContainer = createWidgetContainer(JudgeMeWidgetType.REVIEW_WIDGET, {
      ...config,
      productId
    });
    
    targetElement.appendChild(widgetContainer);
    
    // Trigger Judge.me to render the widget
    const jdgm = getJudgeMeGlobal();
    if (jdgm) {
      jdgm.renderWidget(elementSelector + ' [data-judge-me-widget]');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to render review widget:', error);
    return false;
  }
}

/**
 * Render star rating for a product
 */
export async function renderStarRating(
  elementSelector: string,
  productId: string | number,
  config: Partial<JudgeMeWidgetConfig> = {}
): Promise<boolean> {
  try {
    const initialized = await ensureJudgeMeInitialized();
    if (!initialized) return false;
    
    const targetElement = document.querySelector(elementSelector);
    if (!targetElement) {
      console.error(`Target element not found: ${elementSelector}`);
      return false;
    }
    
    const widgetContainer = createWidgetContainer(JudgeMeWidgetType.STAR_RATING, {
      ...config,
      productId
    });
    
    targetElement.appendChild(widgetContainer);
    
    // Trigger Judge.me to render the widget
    const jdgm = getJudgeMeGlobal();
    if (jdgm) {
      jdgm.renderWidget(elementSelector + ' [data-judge-me-widget]');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to render star rating:', error);
    return false;
  }
}

/**
 * Render a reviews tab for product tabs interface
 */
export async function renderReviewsTab(
  tabContentSelector: string,
  productId: string | number,
  config: Partial<JudgeMeWidgetConfig> = {}
): Promise<boolean> {
  try {
    const initialized = await ensureJudgeMeInitialized();
    if (!initialized) return false;
    
    const tabContentElement = document.querySelector(tabContentSelector);
    if (!tabContentElement) {
      console.error(`Target tab content element not found: ${tabContentSelector}`);
      return false;
    }
    
    const widgetContainer = createWidgetContainer(JudgeMeWidgetType.ALL_REVIEWS, {
      ...config,
      productId
    });
    
    tabContentElement.appendChild(widgetContainer);
    
    // Trigger Judge.me to render the widget
    const jdgm = getJudgeMeGlobal();
    if (jdgm) {
      jdgm.renderWidget(tabContentSelector + ' [data-judge-me-widget]');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to render reviews tab:', error);
    return false;
  }
}

/**
 * Get the number of reviews for a product
 */
export async function getProductReviewCount(productId: string | number): Promise<number> {
  try {
    const initialized = await ensureJudgeMeInitialized();
    if (!initialized) return 0;
    
    const jdgm = getJudgeMeGlobal();
    if (jdgm && typeof jdgm.getProductReviewCount === 'function') {
      return await jdgm.getProductReviewCount(productId);
    }
    
    return 0;
  } catch (error) {
    console.error('Failed to get product review count:', error);
    return 0;
  }
}

/**
 * Get the average rating for a product
 */
export async function getAverageRating(productId: string | number): Promise<number> {
  try {
    const initialized = await ensureJudgeMeInitialized();
    if (!initialized) return 0;
    
    const jdgm = getJudgeMeGlobal();
    if (jdgm && typeof jdgm.getAverageRating === 'function') {
      return await jdgm.getAverageRating(productId);
    }
    
    return 0;
  } catch (error) {
    console.error('Failed to get average rating:', error);
    return 0;
  }
}
