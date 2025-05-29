/**
 * JudgeMeScriptTag.tsx
 * 
 * A React component that directly injects the Judge.me script tag into the document.
 * This ensures the script is properly loaded in a headless Shopify store context.
 */

import React, { useEffect } from 'react';

interface JudgeMeScriptTagProps {
  shopDomain?: string;
  platformIndependent?: boolean;
  debug?: boolean;
  onLoad?: () => void;
  onError?: (error: any) => void;
}

const JudgeMeScriptTag: React.FC<JudgeMeScriptTagProps> = ({
  shopDomain = window.location.hostname === 'localhost' ? 'sbz5wk-e9.myshopify.com' : window.location.hostname,
  platformIndependent = true,
  debug = true,
  onLoad,
  onError
}) => {
  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="judge.me"]');
    if (existingScript) {
      console.log('Judge.me script already exists in the document');
      if (onLoad) onLoad();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    
    // Set core attributes
    script.async = true;
    script.type = 'text/javascript';
    
    // Set data attributes
    script.dataset.apiHost = 'https://judge.me';
    script.dataset.platformIndependent = String(platformIndependent);
    if (debug) script.dataset.debug = 'true';
    
    // Initialize Judge.me object with Shopify configuration
    window.jdgm = window.jdgm || {};
    window.jdgm.SHOP_DOMAIN = 'sbz5wk-e9.myshopify.com';
    window.jdgm.PLATFORM = 'shopify';
    window.jdgm.PUBLIC_TOKEN = 'CmgUOrdFZ2WZCDoTpirgmdavI4c';
    
    // Use the exact script URL from Shopify
    script.src = 'https://cdnwidget.judge.me/widget_preloader.js';
    
    // Add additional script settings exactly as Shopify provides
    script.dataset.cfasync = 'false';
    
    // Add event handlers
    script.onload = () => {
      console.log('Judge.me script loaded successfully via JudgeMeScriptTag');
      if (window.jdgm) {
        console.log('Judge.me global object is available');
      } else {
        console.warn('Judge.me script loaded but global object not available');
      }
      if (onLoad) onLoad();
    };
    
    script.onerror = (error) => {
      console.error('Error loading Judge.me script via JudgeMeScriptTag:', error);
      if (onError) onError(error);
    };
    
    // Append to document head
    document.head.appendChild(script);
    console.log('Judge.me script tag added to document head');
    
    // Cleanup on unmount
    return () => {
      // We don't remove the script on unmount as it should remain available
    };
  }, [shopDomain, platformIndependent, debug, onLoad, onError]);
  
  // This component doesn't render anything visible
  return null;
};

export default JudgeMeScriptTag;
