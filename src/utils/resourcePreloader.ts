/**
 * Resource Preloader Utilities
 * 
 * This module provides utilities for preloading critical resources to improve performance
 */

interface PreloadOptions {
  as?: 'image' | 'script' | 'style' | 'font' | 'fetch';
  crossorigin?: 'anonymous' | 'use-credentials';
  type?: string;
  priority?: 'high' | 'low';
}

interface CriticalResource {
  href: string;
  as: 'image' | 'script' | 'style' | 'font' | 'fetch';
  crossorigin?: 'anonymous' | 'use-credentials';
  type?: string;
}

/**
 * Preloads a single resource
 */
export const preloadResource = (href: string, options: PreloadOptions = {}): void => {
  // Avoid duplicate preloads
  if (document.querySelector(`link[rel="preload"][href="${href}"]`)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  
  if (options.as) {
    link.as = options.as;
  }
  
  if (options.crossorigin) {
    link.crossOrigin = options.crossorigin;
  }
  
  if (options.type) {
    link.type = options.type;
  }

  // Add to document head
  document.head.appendChild(link);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Preloader] Preloaded resource: ${href} (${options.as || 'unknown'})`);
  }
};

/**
 * Preloads multiple resources
 */
export const preloadResources = (resources: CriticalResource[]): void => {
  resources.forEach((resource) => {
    preloadResource(resource.href, {
      as: resource.as,
      crossorigin: resource.crossorigin,
      type: resource.type,
    });
  });
};

/**
 * Critical resources that should be preloaded for better performance
 */
export const CRITICAL_RESOURCES: CriticalResource[] = [
  // Critical CSS (would be dynamically determined in a real app)
  {
    href: '/assets/css/critical.css',
    as: 'style',
  },
  // Hero images
  {
    href: '/images/hero-chair.webp',
    as: 'image',
  },
  // Critical fonts
  {
    href: '/fonts/inter-var.woff2',
    as: 'font',
    type: 'font/woff2',
    crossorigin: 'anonymous',
  },
  // Shopify API endpoints (if needed for above-the-fold content)
  {
    href: '/api/products/featured',
    as: 'fetch',
    crossorigin: 'anonymous',
  },
];

/**
 * Preloads critical above-the-fold resources
 */
export const preloadCriticalResources = (): void => {
  // Only preload on initial page load, not on route changes
  if (performance.navigation?.type === 1) { // TYPE_RELOAD
    return;
  }

  preloadResources(CRITICAL_RESOURCES);
};

/**
 * Preloads next page resources based on user interaction hints
 */
export const preloadNextPageResources = (routePath: string): void => {
  const nextPageResources: Record<string, CriticalResource[]> = {
    '/products': [
      { href: '/api/products', as: 'fetch', crossorigin: 'anonymous' },
      { href: '/images/product-placeholder.webp', as: 'image' },
    ],
    '/cart': [
      { href: '/api/cart', as: 'fetch', crossorigin: 'anonymous' },
      { href: '/images/payment-icons.webp', as: 'image' },
    ],
    '/checkout': [
      { href: '/api/checkout', as: 'fetch', crossorigin: 'anonymous' },
      { href: '/js/checkout.js', as: 'script' },
    ],
  };

  const resources = nextPageResources[routePath];
  if (resources) {
    preloadResources(resources);
  }
};

/**
 * DNS prefetch for external domains
 */
export const prefetchDNS = (domains: string[]): void => {
  domains.forEach((domain) => {
    // Avoid duplicate DNS prefetches
    if (document.querySelector(`link[rel="dns-prefetch"][href="//${domain}"]`)) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });
};

/**
 * External domains to prefetch DNS for
 */
export const EXTERNAL_DOMAINS = [
  'shopify.com',
  'shopifycdn.com',
  'judge.me',
  'google-analytics.com',
  'googletagmanager.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

/**
 * Initialize DNS prefetching for external domains
 */
export const initDNSPrefetch = (): void => {
  prefetchDNS(EXTERNAL_DOMAINS);
};

/**
 * Lazy load non-critical resources after page load
 */
export const loadNonCriticalResources = (): void => {
  // Wait for page load and idle time
  if (document.readyState === 'complete') {
    requestIdleCallback(() => {
      loadDeferredResources();
    });
  } else {
    window.addEventListener('load', () => {
      requestIdleCallback(() => {
        loadDeferredResources();
      });
    });
  }
};

/**
 * Load deferred resources that are not critical for initial page render
 */
const loadDeferredResources = (): void => {
  const deferredResources = [
    // Analytics scripts
    'https://www.googletagmanager.com/gtag/js',
    // Judge.me widget (if not already loaded)
    'https://judge.me/api/widgets',
    // Non-critical UI assets
    '/images/decorative-patterns.webp',
  ];

  deferredResources.forEach((src) => {
    if (src.endsWith('.js')) {
      loadDeferredScript(src);
    } else if (src.endsWith('.css')) {
      loadDeferredStyle(src);
    } else {
      preloadResource(src, { as: 'image' });
    }
  });
};

/**
 * Load a script with low priority
 */
const loadDeferredScript = (src: string): void => {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
};

/**
 * Load a stylesheet with low priority
 */
const loadDeferredStyle = (href: string): void => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.media = 'print'; // Load with low priority
  link.onload = () => {
    link.media = 'all'; // Apply styles after load
  };
  document.head.appendChild(link);
};

/**
 * Service Worker registration for caching strategies
 */
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[Service Worker] Registered successfully:', registration);
      }
      
      // Update on new service worker
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, show update notification
              if (confirm('Nueva versión disponible. ¿Recargar página?')) {
                window.location.reload();
              }
            }
          });
        }
      });
    } catch (error) {
      console.error('[Service Worker] Registration failed:', error);
    }
  }
};

/**
 * Intersection Observer for lazy loading components
 */
export const createLazyLoadObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '200px 0px',
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
};

/**
 * Image optimization with WebP support detection
 */
export const getOptimizedImageUrl = (
  originalUrl: string,
  width?: number,
  quality: number = 80
): string => {
  // In a real implementation, this would connect to an image CDN
  // For now, we'll return the original URL with optimization hints
  
  if (supportsWebP()) {
    const params = new URLSearchParams();
    params.set('format', 'webp');
    if (width) params.set('w', width.toString());
    params.set('q', quality.toString());
    
    return `${originalUrl}?${params.toString()}`;
  }
  
  return originalUrl;
};

/**
 * Check WebP support
 */
const supportsWebP = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

/**
 * Performance budget monitoring
 */
export const monitorPerformanceBudget = (): void => {
  const budgets = {
    totalJavaScript: 200 * 1024, // 200KB
    totalCSS: 50 * 1024,         // 50KB
    totalImages: 1024 * 1024,    // 1MB
    totalFonts: 100 * 1024,      // 100KB
  };

  const resourceTiming = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const usage = {
    totalJavaScript: 0,
    totalCSS: 0,
    totalImages: 0,
    totalFonts: 0,
  };

  resourceTiming.forEach((resource) => {
    const size = resource.transferSize || 0;
    
    if (resource.name.includes('.js')) {
      usage.totalJavaScript += size;
    } else if (resource.name.includes('.css')) {
      usage.totalCSS += size;
    } else if (resource.name.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
      usage.totalImages += size;
    } else if (resource.name.match(/\.(woff|woff2|ttf|eot)$/i)) {
      usage.totalFonts += size;
    }
  });

  // Check for budget violations
  Object.keys(budgets).forEach((key) => {
    const budget = budgets[key as keyof typeof budgets];
    const actual = usage[key as keyof typeof usage];
    
    if (actual > budget) {
      console.warn(`[Performance Budget] ${key} exceeded: ${(actual / 1024).toFixed(1)}KB > ${(budget / 1024).toFixed(1)}KB`);
    }
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('[Performance Budget]', { budgets, usage });
  }
};