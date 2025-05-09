/**
 * Judge.me Script Loader
 * 
 * This module ensures the Judge.me script is properly loaded and initialized
 * in a way that's compatible with React and Vite.
 */

// URL for Judge.me script
// Using standard script URL without query parameters, as they'll be added via attributes
const JUDGEME_CDN_URL = 'https://cdn.judge.me/widget_v3/init.js';

/**
 * Load the Judge.me script into the document
 * @returns {Promise<void>} A promise that resolves when the script is loaded
 */
export const loadJudgeMeScript = () => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.jdgm) {
      console.log('Judge.me script already loaded');
      resolve();
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector(`script[src="${JUDGEME_CDN_URL}"]`);
    if (existingScript) {
      console.log('Judge.me script tag exists but not loaded yet');
      
      // If script exists but isn't loaded, wait for it
      if (existingScript.dataset.loading === 'true') {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', (e) => reject(e));
        return;
      }
    }
    
    // Debug info
    console.log('Adding Judge.me script to the page');
    
    // Create the script element with proper attributes
    const script = document.createElement('script');
    script.src = JUDGEME_CDN_URL;
    script.async = true;
    script.dataset.loading = 'true';
    script.dataset.apiHost = 'https://judge.me';
    script.dataset.platformIndependent = 'true';
    script.dataset.debug = 'true'; // Enable debugging
    
    // Add specific attributes as URL parameters to help with CORS and hosting
    script.src = `${JUDGEME_CDN_URL}?api_host=https://judge.me&platform_independent=true&shop_domain=${encodeURIComponent(window.location.hostname)}`;
    
    // Add load handler
    script.onload = () => {
      console.log('Judge.me script loaded successfully');
      script.dataset.loading = 'false';
      
      // Check if window.jdgm was created
      if (window.jdgm) {
        console.log('Judge.me global object found');
        console.log('Available Judge.me methods:', Object.keys(window.jdgm).filter(k => typeof window.jdgm[k] === 'function'));
      } else {
        console.warn('Judge.me script loaded but global object not created');
      }
      
      resolve();
    };
    
    // Add error handler
    script.onerror = (e) => {
      console.error('Error loading Judge.me script:', e);
      script.dataset.loading = 'false';
      reject(e);
    };
    
    // Add to document head
    document.head.appendChild(script);
    console.log('Judge.me script added to document head');
  });
};

/**
 * Initialize the Judge.me widgets after the script has loaded
 */
export const initializeJudgeMeWidgets = () => {
  if (window.jdgm && typeof window.jdgm.renderWidgets === 'function') {
    console.log('Initializing Judge.me widgets');
    window.jdgm.renderWidgets();
  } else {
    console.warn('Judge.me not available for widget initialization');
  }
};

// Auto initialize
export const initializeJudgeMe = async () => {
  try {
    await loadJudgeMeScript();
    initializeJudgeMeWidgets();
    return true;
  } catch (error) {
    console.error('Failed to initialize Judge.me:', error);
    return false;
  }
};

export default {
  loadJudgeMeScript,
  initializeJudgeMeWidgets,
  initializeJudgeMe
};
