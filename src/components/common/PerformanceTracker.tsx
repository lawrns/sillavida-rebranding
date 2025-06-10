/**
 * Performance Tracker Component
 * 
 * Tracks page performance metrics and reports them
 */

import React, { useEffect } from 'react';
import { performanceMonitoring } from '../../services/performanceMonitoring';

interface PerformanceTrackerProps {
  pageName: string;
  children: React.ReactNode;
}

const PerformanceTracker: React.FC<PerformanceTrackerProps> = ({ 
  pageName, 
  children 
}) => {
  useEffect(() => {
    const startTime = performance.now();
    
    // Track page start
    performanceMonitoring.recordMetric({
      name: 'page_start',
      value: startTime,
      category: 'user_experience',
      tags: { page: pageName }
    });

    // Track when component mounts (page ready)
    const mountTime = performance.now();
    performanceMonitoring.recordMetric({
      name: 'page_mount_time',
      value: mountTime - startTime,
      category: 'user_experience',
      tags: { page: pageName }
    });

    // Track when page is fully loaded
    const handleLoad = () => {
      const loadTime = performance.now();
      performanceMonitoring.recordMetric({
        name: 'page_load_complete',
        value: loadTime - startTime,
        category: 'user_experience',
        tags: { page: pageName }
      });
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Track when page becomes interactive
    const handleInteractive = () => {
      const interactiveTime = performance.now();
      performanceMonitoring.recordMetric({
        name: 'page_interactive_time',
        value: interactiveTime - startTime,
        category: 'user_experience',
        tags: { page: pageName }
      });
    };

    // Use timeout to check if page is interactive
    setTimeout(handleInteractive, 100);

    return () => {
      window.removeEventListener('load', handleLoad);
      
      // Track page unload
      const endTime = performance.now();
      performanceMonitoring.recordMetric({
        name: 'page_duration',
        value: endTime - startTime,
        category: 'user_experience',
        tags: { page: pageName }
      });
    };
  }, [pageName]);

  return <>{children}</>;
};

export default PerformanceTracker;