/**
 * JudgeMeLoader.tsx
 * 
 * This component ensures Judge.me widgets are properly rendered in React environment
 * by automatically re-rendering them after component mount.
 */

import React, { useEffect } from 'react';

interface JudgeMeLoaderProps {
  productId?: string | number;
  children?: React.ReactNode;
}

const JudgeMeLoader: React.FC<JudgeMeLoaderProps> = ({ productId, children }) => {
  useEffect(() => {
    // Function to render widgets
    const renderWidgets = () => {
      if (window.jdgm && typeof window.jdgm.renderWidgets === 'function') {
        console.log('Re-rendering Judge.me widgets');
        
        // Override error handlers to prevent console errors
        const originalConsoleError = console.error;
        console.error = function(msg, ...args) {
          if (
            msg === 'Error getting average rating:' ||
            msg === 'Error getting review count:'
          ) {
            // Suppress these specific errors
            console.log('Judge.me info: No reviews or ratings found, this is normal for new stores');
            return;
          }
          return originalConsoleError.apply(console, [msg, ...args]);
        };
        
        // Render the widgets
        window.jdgm.renderWidgets();
        
        // Restore original console.error
        setTimeout(() => {
          console.error = originalConsoleError;
        }, 1000);
      } else {
        console.warn('Judge.me global object not found or renderWidgets not available');
      }
    };
    
    // Render widgets on mount with a slight delay to ensure DOM is ready
    const timer = setTimeout(() => {
      renderWidgets();
    }, 500);
    
    // Clean up
    return () => clearTimeout(timer);
  }, [productId]); // Re-trigger when product ID changes
  
  return <>{children}</>;
};

export default JudgeMeLoader;
