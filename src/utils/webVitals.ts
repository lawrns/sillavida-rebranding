/**
 * Web Vitals Monitoring Utilities
 * 
 * This module provides utilities for monitoring Core Web Vitals and performance metrics
 */

interface PerformanceMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
  entries: PerformanceEntry[];
}

interface WebVitalsConfig {
  reportAllChanges?: boolean;
  debug?: boolean;
}

// Performance thresholds based on Core Web Vitals recommendations
export const PERFORMANCE_THRESHOLDS = {
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  FID: { good: 100, needsImprovement: 300 },   // First Input Delay
  CLS: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte
  INP: { good: 200, needsImprovement: 500 },   // Interaction to Next Paint
} as const;

/**
 * Reports performance metrics to console (development) or analytics (production)
 */
const reportMetric = (metric: PerformanceMetric, config: WebVitalsConfig = {}) => {
  const threshold = PERFORMANCE_THRESHOLDS[metric.name as keyof typeof PERFORMANCE_THRESHOLDS];
  let rating = 'poor';
  
  if (threshold) {
    if (metric.value <= threshold.good) {
      rating = 'good';
    } else if (metric.value <= threshold.needsImprovement) {
      rating = 'needs-improvement';
    }
  }

  const report = {
    metric: metric.name,
    value: metric.value,
    rating,
    id: metric.id,
    delta: metric.delta,
    timestamp: Date.now(),
  };

  if (config.debug || process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}: ${metric.value}ms (${rating})`, report);
  }

  // In production, you would send this to your analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics 4
    // gtag('event', metric.name, {
    //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    //   metric_rating: rating,
    //   metric_id: metric.id,
    //   metric_delta: metric.delta,
    // });
  }
};

/**
 * Measures First Contentful Paint (FCP)
 */
export const getFCP = (config: WebVitalsConfig = {}) => {
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
    
    if (fcpEntry) {
      reportMetric({
        name: 'FCP',
        value: fcpEntry.startTime,
        id: generateUniqueId(),
        delta: fcpEntry.startTime,
        entries: [fcpEntry],
      }, config);
      observer.disconnect();
    }
  });

  try {
    observer.observe({ entryTypes: ['paint'] });
  } catch (e) {
    // Browser doesn't support Performance Observer
  }
};

/**
 * Measures Largest Contentful Paint (LCP)
 */
export const getLCP = (config: WebVitalsConfig = {}) => {
  let lcpValue = 0;
  let lcpEntries: PerformanceEntry[] = [];

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    
    if (lastEntry) {
      lcpValue = lastEntry.startTime;
      lcpEntries = [...entries];
    }
  });

  const reportLCP = () => {
    if (lcpValue) {
      reportMetric({
        name: 'LCP',
        value: lcpValue,
        id: generateUniqueId(),
        delta: lcpValue,
        entries: lcpEntries,
      }, config);
    }
  };

  try {
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // Report when the page is about to be unloaded
    window.addEventListener('beforeunload', reportLCP);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportLCP();
      }
    });
  } catch (e) {
    // Browser doesn't support Performance Observer
  }
};

/**
 * Measures First Input Delay (FID)
 */
export const getFID = (config: WebVitalsConfig = {}) => {
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (entry.name === 'first-input') {
        const fid = (entry as any).processingStart - entry.startTime;
        reportMetric({
          name: 'FID',
          value: fid,
          id: generateUniqueId(),
          delta: fid,
          entries: [entry],
        }, config);
      }
    });
  });

  try {
    observer.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    // Browser doesn't support Performance Observer
  }
};

/**
 * Measures Cumulative Layout Shift (CLS)
 */
export const getCLS = (config: WebVitalsConfig = {}) => {
  let clsValue = 0;
  let clsEntries: PerformanceEntry[] = [];

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
        clsEntries.push(entry);
      }
    });
  });

  const reportCLS = () => {
    reportMetric({
      name: 'CLS',
      value: clsValue,
      id: generateUniqueId(),
      delta: clsValue,
      entries: clsEntries,
    }, config);
  };

  try {
    observer.observe({ entryTypes: ['layout-shift'] });
    
    // Report when the page is about to be unloaded
    window.addEventListener('beforeunload', reportCLS);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportCLS();
      }
    });
  } catch (e) {
    // Browser doesn't support Performance Observer
  }
};

/**
 * Measures Time to First Byte (TTFB)
 */
export const getTTFB = (config: WebVitalsConfig = {}) => {
  const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (navigationEntry) {
    const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
    reportMetric({
      name: 'TTFB',
      value: ttfb,
      id: generateUniqueId(),
      delta: ttfb,
      entries: [navigationEntry],
    }, config);
  }
};

/**
 * Initializes all Web Vitals monitoring
 */
export const initWebVitals = (config: WebVitalsConfig = {}) => {
  if (typeof window === 'undefined') return;

  getFCP(config);
  getLCP(config);
  getFID(config);
  getCLS(config);
  getTTFB(config);
};

/**
 * Performance monitoring for route changes
 */
export const measureRouteChange = (routeName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Route Performance] ${routeName}: ${duration.toFixed(2)}ms`);
    }
    
    // In production, send to analytics
    if (process.env.NODE_ENV === 'production') {
      // Example: gtag('event', 'route_change', { route: routeName, duration });
    }
  };
};

/**
 * Generates a unique ID for tracking metrics
 */
const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Resource timing analysis
 */
export const analyzeResourceTiming = () => {
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const analysis = {
    totalResources: resources.length,
    slowResources: [] as Array<{ name: string; duration: number; size?: number }>,
    byType: {} as Record<string, { count: number; totalDuration: number; averageDuration: number }>,
  };

  resources.forEach((resource) => {
    const duration = resource.responseEnd - resource.requestStart;
    const type = getResourceType(resource.name);
    
    // Track slow resources (>1 second)
    if (duration > 1000) {
      analysis.slowResources.push({
        name: resource.name,
        duration,
        size: resource.transferSize,
      });
    }
    
    // Group by resource type
    if (!analysis.byType[type]) {
      analysis.byType[type] = { count: 0, totalDuration: 0, averageDuration: 0 };
    }
    analysis.byType[type].count++;
    analysis.byType[type].totalDuration += duration;
  });

  // Calculate averages
  Object.keys(analysis.byType).forEach((type) => {
    const typeData = analysis.byType[type];
    typeData.averageDuration = typeData.totalDuration / typeData.count;
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('[Resource Timing Analysis]', analysis);
  }

  return analysis;
};

/**
 * Gets resource type from URL
 */
const getResourceType = (url: string): string => {
  if (url.includes('.css')) return 'CSS';
  if (url.includes('.js')) return 'JavaScript';
  if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) return 'Image';
  if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return 'Font';
  if (url.includes('api/') || url.includes('graphql')) return 'API';
  return 'Other';
};

/**
 * Memory usage monitoring
 */
export const monitorMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    const usage = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('[Memory Usage]', usage);
    }

    return usage;
  }
  return null;
};