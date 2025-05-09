/**
 * useJudgeMeWidgetInitialization.ts
 * 
 * A custom hook for properly initializing and rendering Judge.me widgets
 * after component mounts. Fixes issues with React's strict mode
 * and ensures widgets render properly in SPAs.
 */

import { useEffect, useRef } from 'react';
import { loadJudgeMeScript, initializeJudgeMeWidgets } from '../lib/judgeMe';

interface UseJudgeMeWidgetInitializationOptions {
  productId?: string | number;
  container?: React.RefObject<HTMLElement>;
  delay?: number;
  retryCount?: number;
  retryInterval?: number;
}

/**
 * Hook to properly initialize and render Judge.me widgets
 * 
 * @param options Configuration options for widget initialization
 * @returns Object with the initialized status
 */
export const useJudgeMeWidgetInitialization = (
  options: UseJudgeMeWidgetInitializationOptions = {}
) => {
  const {
    productId,
    container,
    delay = 200,
    retryCount = 3,
    retryInterval = 500
  } = options;
  
  const initialized = useRef(false);
  const attemptCount = useRef(0);
  
  useEffect(() => {
    // Reset counters when productId changes
    if (productId) {
      initialized.current = false;
      attemptCount.current = 0;
    }
    
    const initializeWidgets = async () => {
      // If already initialized and no product ID change, don't re-initialize
      if (initialized.current && !productId) {
        return;
      }
      
      // Load Judge.me script if not ready
      if (typeof window.jdgm === 'undefined') {
        if (attemptCount.current < retryCount) {
          attemptCount.current += 1;
          try {
            await loadJudgeMeScript();
          } catch (error) {
            console.error('Failed to load Judge.me script:', error);
            setTimeout(initializeWidgets, retryInterval);
            return;
          }
        } else {
          console.warn('Judge.me failed to initialize after multiple attempts');
          return;
        }
      }
      
      // Small delay to ensure DOM is fully rendered
      setTimeout(() => {
        try {
          const containerElement = container?.current || undefined;
          
          // Initialize widgets using our script loader
          if (typeof (window as any).jdgm !== 'undefined' && 
              typeof (window as any).jdgm.renderWidgets === 'function') {
            (window as any).jdgm.renderWidgets(containerElement);
          } else {
            // Fall back to our initialization function
            initializeJudgeMeWidgets();
          }
          
          // Additional initialization for UGC Media Grid if needed
          const ugcGrids = document.querySelectorAll('.jdgm-ugc-media-wrapper');
          if (ugcGrids.length > 0) {
            ugcGrids.forEach(grid => {
              // If no product ID is set on the element but we have one in options
              if (productId && !grid.getAttribute('data-product-id')) {
                grid.setAttribute('data-product-id', String(productId));
              }
            });
            
            // Re-render after attributes are added
            if (typeof (window as any).jdgm !== 'undefined' && 
                typeof (window as any).jdgm.renderWidgets === 'function') {
              (window as any).jdgm.renderWidgets();
            }
          }
          
          initialized.current = true;
        } catch (error) {
          console.error('Error initializing Judge.me widgets:', error);
        }
      }, delay);
    };
    
    // Start the initialization process
    initializeWidgets();
    
    // Re-initialize when visibility changes (e.g., tab switching)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !initialized.current) {
        initializeWidgets();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [productId, container, delay, retryCount, retryInterval]);
  
  return {
    initialized: initialized.current,
    reinitialize: () => {
      initialized.current = false;
      attemptCount.current = 0;
      const containerElement = container?.current || undefined;
      renderWidgets(containerElement);
    }
  };
};

export default useJudgeMeWidgetInitialization;
