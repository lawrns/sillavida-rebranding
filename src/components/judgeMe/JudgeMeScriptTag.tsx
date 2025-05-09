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
  shopDomain = window.location.hostname,
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
    
    // Build the script URL with query parameters
    const params = new URLSearchParams();
    params.append('api_host', 'https://judge.me');
    params.append('platform_independent', String(platformIndependent));
    if (shopDomain) params.append('shop_domain', shopDomain);
    params.append('locale', 'es'); // Force Spanish locale for Mexican market
    
    script.src = `https://cdn.judge.me/widget_v3/init.js?${params.toString()}`;
    
    // Add additional script settings
    script.dataset.locale = 'es';
    
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
