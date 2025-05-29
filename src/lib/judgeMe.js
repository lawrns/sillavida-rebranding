/**
 * Judge.me Script Loader
 * 
 * This module ensures the Judge.me script is properly loaded and initialized
 * in a way that's compatible with React and Vite.
 */

/**
 * URL for Judge.me script
 * Using the exact script URL provided by Shopify Judge.me admin
 */
const JUDGEME_CDN_URL = 'https://cdnwidget.judge.me/widget_preloader.js';

/**
 * Load the Judge.me script into the document
 * @returns {Promise<void>} A promise that resolves when the script is loaded
 */
export const loadJudgeMeScript = () => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.jdgm && typeof window.jdgm.renderWidgets === 'function') {
      resolve();
      return;
    }

    // Initialize Judge.me object with Shopify configuration
    window.jdgm = window.jdgm || {};
    window.jdgm.SHOP_DOMAIN = 'sbz5wk-e9.myshopify.com';
    window.jdgm.PLATFORM = 'shopify';
    window.jdgm.PUBLIC_TOKEN = 'CmgUOrdFZ2WZCDoTpirgmdavI4c';

    // Check if script tag already exists
    const existingScript = document.querySelector(`script[src="${JUDGEME_CDN_URL}"]`);
    if (existingScript) {
      // If script exists but isn't loaded, wait for it
      if (existingScript.dataset.loading === 'true') {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', (e) => reject(e));
        return;
      }
    }
    
    // Create the script element exactly as Shopify provides
    const script = document.createElement('script');
    script.src = JUDGEME_CDN_URL;
    script.async = true;
    script.dataset.cfasync = 'false';
    script.type = 'text/javascript';
    script.dataset.loading = 'true';
    
    // Add load handler
    script.onload = () => {
      script.dataset.loading = 'false';
      resolve();
    };
    
    // Add error handler
    script.onerror = (e) => {
      script.dataset.loading = 'false';
      reject(e);
    };
    
    // Add to document head
    document.head.appendChild(script);
  });
};

/**
 * Initialize the Judge.me widgets after the script has loaded
 * @returns {void}
 */
export const initializeJudgeMeWidgets = () => {
  if (window.jdgm && typeof window.jdgm.renderWidgets === 'function') {
    window.jdgm.renderWidgets();
  }
};

/**
 * Auto initialize Judge.me script and widgets
 * @returns {Promise<boolean>} True if initialization succeeded, false otherwise
 */
export const initializeJudgeMe = async () => {
  try {
    await loadJudgeMeScript();
    initializeJudgeMeWidgets();
    return true;
  } catch (error) {
    return false;
  }
};

export default {
  loadJudgeMeScript,
  initializeJudgeMeWidgets,
  initializeJudgeMe
};
