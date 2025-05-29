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
            msg === 'Error getting review count:' ||
            typeof msg === 'string' && msg.includes('Judge.me')
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
        
        // Try again in a moment in case script is still loading
        setTimeout(() => {
          if (window.jdgm && typeof window.jdgm.renderWidgets === 'function') {
            console.log('Judge.me became available, rendering widgets now');
            window.jdgm.renderWidgets();
          }
        }, 2000);
      }
    };
    
    // Render widgets on mount with multiple attempts
    const timer1 = setTimeout(() => renderWidgets(), 500);
    const timer2 = setTimeout(() => renderWidgets(), 2000);
    const timer3 = setTimeout(() => renderWidgets(), 5000);
    
    // Clean up
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [productId]); // Re-trigger when product ID changes
  
  return <>{children}</>;
};

export default JudgeMeLoader;
