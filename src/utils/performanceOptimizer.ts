/**
 * Performance Optimizer - TASK-168 Implementation
 * 
 * Safe performance optimizations that won't break existing functionality
 */

import { preloadResource, getOptimizedImageUrl } from './resourcePreloader';
import { performanceMonitoring } from '../services/performanceMonitoring';

interface PerformanceConfig {
  enableImageOptimization: boolean;
  enableResourcePreloading: boolean;
  enableBundleOptimization: boolean;
  lazyLoadThreshold: number;
}

const DEFAULT_CONFIG: PerformanceConfig = {
  enableImageOptimization: true,
  enableResourcePreloading: true,
  enableBundleOptimization: true,
  lazyLoadThreshold: 200,
};

class PerformanceOptimizer {
  private config: PerformanceConfig;
  private observer?: IntersectionObserver;
  private isInitialized: boolean = false;

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize all performance optimizations
   */
  public init(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    // 1. Preload critical resources
    if (this.config.enableResourcePreloading) {
      this.preloadCriticalResources();
    }

    // 2. Optimize images
    if (this.config.enableImageOptimization) {
      this.optimizeImages();
    }

    // 3. Set up lazy loading observer
    this.setupLazyLoading();

    // 4. Optimize third-party scripts
    this.optimizeThirdPartyScripts();

    // 5. Set up performance monitoring
    this.setupPerformanceMonitoring();

    this.isInitialized = true;
    console.log('[Performance] Optimizer initialized');
  }

  /**
   * Preload critical above-the-fold resources
   */
  private preloadCriticalResources(): void {
    const criticalResources = [
      // Critical fonts
      { href: '/fonts/inter-var.woff2', as: 'font' as const, type: 'font/woff2', crossorigin: 'anonymous' as const },
      
      // Hero images (first visible images)
      { href: '/images/hero-chair.webp', as: 'image' as const },
      { href: '/images/logo.webp', as: 'image' as const },
      
      // Critical API endpoints
      { href: '/api/products/featured', as: 'fetch' as const },
    ];

    criticalResources.forEach(resource => {
      try {
        preloadResource(resource.href, resource);
      } catch (error) {
        console.warn('[Performance] Failed to preload resource:', resource.href);
      }
    });
  }

  /**
   * Optimize image loading
   */
  private optimizeImages(): void {
    // Find all images that need optimization
    const images = document.querySelectorAll('img:not([data-optimized])');
    
    images.forEach((img, index) => {
      const htmlImg = img as HTMLImageElement;
      
      // Mark as optimized to avoid double processing
      htmlImg.setAttribute('data-optimized', 'true');
      
      // Add loading attribute if not present
      if (!htmlImg.loading) {
        htmlImg.loading = index < 2 ? 'eager' : 'lazy';
      }
      
      // Add decoding attribute
      htmlImg.decoding = 'async';
      
      // Optimize src for WebP if supported
      if (htmlImg.src && !htmlImg.src.includes('data:')) {
        const width = htmlImg.getAttribute('width') ? parseInt(htmlImg.getAttribute('width')!) : undefined;
        const optimizedSrc = getOptimizedImageUrl(htmlImg.src, width);
        if (optimizedSrc !== htmlImg.src) {
          htmlImg.src = optimizedSrc;
        }
      }
    });
  }

  /**
   * Set up intersection observer for lazy loading
   */
  private setupLazyLoading(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            
            // Handle lazy images
            if (element.dataset.src) {
              this.loadLazyImage(element as HTMLImageElement);
            }
            
            // Handle lazy components
            if (element.dataset.lazyComponent) {
              this.loadLazyComponent(element);
            }
            
            this.observer?.unobserve(element);
          }
        });
      },
      {
        rootMargin: `${this.config.lazyLoadThreshold}px`,
        threshold: 0.1,
      }
    );
  }

  /**
   * Load lazy image
   */
  private loadLazyImage(img: HTMLImageElement): void {
    const src = img.dataset.src;
    if (!src) return;

    const width = img.getAttribute('width') ? parseInt(img.getAttribute('width')!) : undefined;
    const optimizedSrc = getOptimizedImageUrl(src, width);
    
    img.src = optimizedSrc;
    img.removeAttribute('data-src');
    img.classList.add('loaded');
  }

  /**
   * Load lazy component
   */
  private loadLazyComponent(element: HTMLElement): void {
    const componentName = element.dataset.lazyComponent;
    if (!componentName) return;

    // Dispatch custom event for component loading
    const event = new CustomEvent('loadLazyComponent', {
      detail: { componentName, element }
    });
    window.dispatchEvent(event);
  }

  /**
   * Optimize third-party script loading
   */
  private optimizeThirdPartyScripts(): void {
    // Defer non-critical scripts
    const scripts = document.querySelectorAll('script:not([data-optimized])');
    
    scripts.forEach(script => {
      const scriptEl = script as HTMLScriptElement;
      scriptEl.setAttribute('data-optimized', 'true');
      
      // Add defer to non-critical scripts
      if (!scriptEl.async && !scriptEl.defer && !scriptEl.src.includes('critical')) {
        scriptEl.defer = true;
      }
    });

    // Optimize Judge.me loading
    this.optimizeJudgeMeLoading();
  }

  /**
   * Optimize Judge.me script loading
   */
  private optimizeJudgeMeLoading(): void {
    // Load Judge.me on user interaction or after delay
    let judgeMeLoaded = false;
    
    const loadJudgeMe = () => {
      if (judgeMeLoaded) return;
      judgeMeLoaded = true;
      
      // Dispatch event to load Judge.me
      window.dispatchEvent(new CustomEvent('loadJudgeMe'));
    };

    // Load on user interaction
    const interactionEvents = ['mousedown', 'touchstart', 'keydown'];
    const loadOnce = () => {
      loadJudgeMe();
      interactionEvents.forEach(event => {
        window.removeEventListener(event, loadOnce);
      });
    };
    
    interactionEvents.forEach(event => {
      window.addEventListener(event, loadOnce, { passive: true });
    });
    
    // Fallback: load after 3 seconds
    setTimeout(loadJudgeMe, 3000);
  }

  /**
   * Set up performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    // Monitor Core Web Vitals
    this.monitorWebVitals();
    
    // Monitor resource usage
    this.monitorResourceUsage();
    
    // Set up performance budget alerts
    this.setupPerformanceBudget();
  }

  /**
   * Monitor Core Web Vitals
   */
  private monitorWebVitals(): void {
    // Monitor LCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        performanceMonitoring.recordMetric({
          name: 'largest_contentful_paint',
          value: lastEntry.startTime,
          category: 'user_experience',
          tags: { metric: 'lcp' }
        });
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Monitor FID
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        const fid = entry.processingStart - entry.startTime;
        performanceMonitoring.recordMetric({
          name: 'first_input_delay',
          value: fid,
          category: 'user_experience',
          tags: { metric: 'fid' }
        });
      });
    }).observe({ entryTypes: ['first-input'] });

    // Monitor CLS
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      performanceMonitoring.recordMetric({
        name: 'cumulative_layout_shift',
        value: clsValue,
        category: 'user_experience',
        tags: { metric: 'cls' }
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * Monitor resource usage
   */
  private monitorResourceUsage(): void {
    // Monitor memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      performanceMonitoring.recordMetric({
        name: 'memory_usage',
        value: memory.usedJSHeapSize,
        category: 'system',
        tags: { type: 'heap_size' }
      });
    }

    // Monitor resource timing
    setTimeout(() => {
      const resources = performance.getEntriesByType('resource');
      const totalSize = resources.reduce((sum, resource: any) => {
        return sum + (resource.transferSize || 0);
      }, 0);

      performanceMonitoring.recordMetric({
        name: 'total_resource_size',
        value: totalSize,
        category: 'system',
        tags: { type: 'transfer_size' }
      });
    }, 5000);
  }

  /**
   * Set up performance budget monitoring
   */
  private setupPerformanceBudget(): void {
    const budgets = {
      lcp: 2500, // 2.5s
      fid: 100,  // 100ms
      cls: 0.1,  // 0.1
      totalJavaScript: 300 * 1024, // 300KB
      totalImages: 1024 * 1024,    // 1MB
    };

    // Check budgets after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.checkPerformanceBudgets(budgets);
      }, 2000);
    });
  }

  /**
   * Check performance budgets
   */
  private checkPerformanceBudgets(budgets: any): void {
    const violations: string[] = [];

    // Check resource sizes
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    let jsSize = 0;
    let imageSize = 0;

    resources.forEach(resource => {
      const size = resource.transferSize || 0;
      if (resource.name.includes('.js')) {
        jsSize += size;
      } else if (resource.name.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
        imageSize += size;
      }
    });

    if (jsSize > budgets.totalJavaScript) {
      violations.push(`JavaScript size: ${Math.round(jsSize/1024)}KB > ${Math.round(budgets.totalJavaScript/1024)}KB`);
    }

    if (imageSize > budgets.totalImages) {
      violations.push(`Image size: ${Math.round(imageSize/1024)}KB > ${Math.round(budgets.totalImages/1024)}KB`);
    }

    if (violations.length > 0) {
      console.warn('[Performance Budget] Violations detected:', violations);
      
      // Report violations
      performanceMonitoring.recordMetric({
        name: 'performance_budget_violations',
        value: violations.length,
        category: 'system',
        tags: { type: 'budget_check' }
      });
    }
  }

  /**
   * Observe element for lazy loading
   */
  public observeElement(element: HTMLElement): void {
    if (this.observer) {
      this.observer.observe(element);
    }
  }

  /**
   * Get performance metrics summary
   */
  public getMetrics() {
    return {
      isInitialized: this.isInitialized,
      config: this.config,
      timestamp: Date.now()
    };
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Global instance
export const performanceOptimizer = new PerformanceOptimizer();

// Auto-initialize on import
if (typeof window !== 'undefined') {
  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      performanceOptimizer.init();
    });
  } else {
    performanceOptimizer.init();
  }
}

export default performanceOptimizer;