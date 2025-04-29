---
title: Optimize Website Performance
type: task
status: completed
created: 2025-04-24T21:18:00
updated: 2025-04-25T11:49:57-06:00
id: TASK-062
priority: high
memory_types: [procedural]
dependencies: []
tags: [performance, optimization, caching]
---

# Optimize Website Performance

## Description
Improve website performance through various optimization techniques to enhance user experience and SEO. This task focuses on implementing comprehensive lazy loading, adding proper caching strategies, optimizing bundle size, and implementing service worker functionality for offline capabilities. These optimizations will significantly improve page load times, especially on mobile devices.

## Objectives
- Implement comprehensive lazy loading for images and components
- Add proper caching strategies for Shopify API calls
- Optimize bundle size through code splitting and tree shaking
- Implement service worker for offline capabilities
- Improve Core Web Vitals metrics (LCP, FID, CLS)
- Enhance mobile performance
- Reduce server load through optimized API requests

## Steps
1. Audit current performance using Lighthouse
   ```javascript
   // performance-audit.js
   // Run this script to generate a Lighthouse report
   
   const lighthouse = require('lighthouse');
   const chromeLauncher = require('chrome-launcher');
   const fs = require('fs');
   const path = require('path');
   
   const runLighthouse = async (url, options = {}) => {
     // Launch Chrome
     const chrome = await chromeLauncher.launch({
       chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
     });
     
     // Set up Lighthouse options
     const lighthouseOptions = {
       logLevel: 'info',
       output: 'html',
       port: chrome.port,
       ...options
     };
     
     // Run Lighthouse audit
     const results = await lighthouse(url, lighthouseOptions);
     
     // Close Chrome
     await chrome.kill();
     
     // Return results
     return results;
   };
   
   // URLs to test
   const urls = [
     'https://sillavida.com',
     'https://sillavida.com/products/oficina-x',
     'https://sillavida.com/collections/all',
     'https://sillavida.com/pages/about'
   ];
   
   // Create reports directory
   const reportsDir = path.join(__dirname, 'lighthouse-reports');
   if (!fs.existsSync(reportsDir)) {
     fs.mkdirSync(reportsDir);
   }
   
   // Run audits for each URL
   (async () => {
     for (const url of urls) {
       console.log(`Running audit for ${url}...`);
       
       // Run desktop audit
       const desktopResults = await runLighthouse(url, {
         formFactor: 'desktop',
         screenEmulation: {width: 1350, height: 940, deviceScaleFactor: 1, mobile: false}
       });
       
       // Run mobile audit
       const mobileResults = await runLighthouse(url, {
         formFactor: 'mobile',
         screenEmulation: {width: 375, height: 667, deviceScaleFactor: 2, mobile: true}
       });
       
       // Generate filenames
       const urlSlug = url.replace(/https?:\/\//, '').replace(/[^\w]/g, '-');
       const desktopFilename = path.join(reportsDir, `${urlSlug}-desktop.html`);
       const mobileFilename = path.join(reportsDir, `${urlSlug}-mobile.html`);
       
       // Save reports
       fs.writeFileSync(desktopFilename, desktopResults.report);
       fs.writeFileSync(mobileFilename, mobileResults.report);
       
       console.log(`Reports saved for ${url}`);
       console.log(`Desktop scores:`, desktopResults.lhr.categories.performance.score * 100);
       console.log(`Mobile scores:`, mobileResults.lhr.categories.performance.score * 100);
     }
     
     console.log('All audits completed!');
   })();
   ```

2. Implement image lazy loading throughout the site
   ```javascript
   // src/components/common/LazyImage.jsx
   import React, { useState, useEffect, useRef } from 'react';
   
   const LazyImage = ({ 
     src, 
     alt, 
     width, 
     height, 
     className = '', 
     placeholderColor = '#f3f4f6',
     ...props 
   }) => {
     const [isLoaded, setIsLoaded] = useState(false);
     const [isInView, setIsInView] = useState(false);
     const imgRef = useRef(null);
     
     useEffect(() => {
       // Skip if image is already loaded or not yet in view
       if (isLoaded || !isInView) return;
       
       const img = imgRef.current;
       
       const onLoad = () => {
         setIsLoaded(true);
       };
       
       const onError = () => {
         console.warn(`Failed to load image: ${src}`);
         setIsLoaded(true); // Mark as loaded to remove placeholder
       };
       
       if (img) {
         img.addEventListener('load', onLoad);
         img.addEventListener('error', onError);
         
         return () => {
           img.removeEventListener('load', onLoad);
           img.removeEventListener('error', onError);
         };
       }
     }, [src, isLoaded, isInView]);
     
     useEffect(() => {
       if (!window.IntersectionObserver) {
         // Fallback for browsers that don't support IntersectionObserver
         setIsInView(true);
         return;
       }
       
       const observer = new IntersectionObserver(
         (entries) => {
           entries.forEach(entry => {
             if (entry.isIntersecting) {
               setIsInView(true);
               observer.disconnect();
             }
           });
         },
         {
           rootMargin: '200px 0px', // Start loading when image is 200px from viewport
           threshold: 0.01
         }
       );
       
       if (imgRef.current) {
         observer.observe(imgRef.current);
       }
       
       return () => {
         observer.disconnect();
       };
     }, []);
     
     // Calculate aspect ratio for placeholder
     const aspectRatio = height && width ? (height / width) * 100 : 100;
     
     return (
       <div 
         className={`lazy-image-container relative overflow-hidden ${className}`}
         style={{ paddingBottom: `${aspectRatio}%` }}
       >
         {/* Placeholder */}
         {!isLoaded && (
           <div 
             className="absolute inset-0 bg-gray-100 animate-pulse"
             style={{ backgroundColor: placeholderColor }}
           />
         )}
         
         {/* Actual image */}
         <img
           ref={imgRef}
           src={isInView ? src : ''}
           data-src={src}
           alt={alt}
           className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
             isLoaded ? 'opacity-100' : 'opacity-0'
           }`}
           width={width}
           height={height}
           loading="lazy"
           {...props}
         />
       </div>
     );
   };
   
   export default LazyImage;
   ```

3. Create caching layer for Shopify API responses
   ```javascript
   // src/services/apiCache.js
   
   class ApiCache {
     constructor(options = {}) {
       this.storage = options.storage || localStorage;
       this.prefix = options.prefix || 'api_cache_';
       this.defaultTTL = options.defaultTTL || 3600000; // 1 hour in milliseconds
     }
     
     /**
      * Generate a cache key for the given endpoint and params
      */
     generateKey(endpoint, params = {}) {
       const paramsString = Object.keys(params)
         .sort()
         .map(key => `${key}=${params[key]}`)
         .join('&');
         
       return this.prefix + endpoint + (paramsString ? `_${paramsString}` : '');
     }
     
     /**
      * Get cached data if it exists and is not expired
      */
     get(endpoint, params = {}) {
       const key = this.generateKey(endpoint, params);
       
       try {
         const cachedData = this.storage.getItem(key);
         
         if (!cachedData) return null;
         
         const { data, timestamp, ttl } = JSON.parse(cachedData);
         const now = Date.now();
         
         // Check if cache is expired
         if (now - timestamp > ttl) {
           this.storage.removeItem(key);
           return null;
         }
         
         return data;
       } catch (error) {
         console.warn('Error retrieving from cache:', error);
         return null;
       }
     }
     
     /**
      * Store data in cache with TTL
      */
     set(endpoint, params = {}, data, ttl = this.defaultTTL) {
       const key = this.generateKey(endpoint, params);
       
       try {
         const cacheObject = {
           data,
           timestamp: Date.now(),
           ttl
         };
         
         this.storage.setItem(key, JSON.stringify(cacheObject));
         return true;
       } catch (error) {
         console.warn('Error storing in cache:', error);
         return false;
       }
     }
     
     /**
      * Remove item from cache
      */
     remove(endpoint, params = {}) {
       const key = this.generateKey(endpoint, params);
       this.storage.removeItem(key);
     }
     
     /**
      * Clear all cached items
      */
     clear() {
       Object.keys(this.storage).forEach(key => {
         if (key.startsWith(this.prefix)) {
           this.storage.removeItem(key);
         }
       });
     }
     
     /**
      * Clear expired items
      */
     clearExpired() {
       const now = Date.now();
       
       Object.keys(this.storage).forEach(key => {
         if (key.startsWith(this.prefix)) {
           try {
             const cachedData = JSON.parse(this.storage.getItem(key));
             if (now - cachedData.timestamp > cachedData.ttl) {
               this.storage.removeItem(key);
             }
           } catch (error) {
             // If there's an error parsing, remove the item
             this.storage.removeItem(key);
           }
         }
       });
     }
   }
   
   // Create singleton instance
   export const apiCache = new ApiCache();
   
   // Enhanced fetch with caching
   export const fetchWithCache = async (url, options = {}) => {
     const { 
       useCache = true, 
       cacheTTL,
       cacheParams = {},
       ...fetchOptions 
     } = options;
     
     // Generate endpoint from URL
     const endpoint = url.replace(/^https?:\/\/[^\/]+\//, '');
     
     // Try to get from cache first if useCache is true
     if (useCache) {
       const cachedData = apiCache.get(endpoint, cacheParams);
       if (cachedData) {
         return cachedData;
       }
     }
     
     // If not in cache or cache disabled, fetch from API
     try {
       const response = await fetch(url, fetchOptions);
       
       if (!response.ok) {
         throw new Error(`API error: ${response.status}`);
       }
       
       const data = await response.json();
       
       // Store in cache if useCache is true
       if (useCache) {
         apiCache.set(endpoint, cacheParams, data, cacheTTL);
       }
       
       return data;
     } catch (error) {
       console.error('Fetch error:', error);
       throw error;
     }
   };
   ```

4. Configure webpack for optimal code splitting
   ```javascript
   // next.config.js
   
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   });
   
   module.exports = withBundleAnalyzer({
     reactStrictMode: true,
     images: {
       domains: ['cdn.shopify.com'],
     },
     webpack: (config, { isServer, dev }) => {
       // Only apply optimizations for production builds
       if (!dev) {
         // Enable tree shaking
         config.optimization.usedExports = true;
         
         // Configure code splitting
         config.optimization.splitChunks = {
           chunks: 'all',
           maxInitialRequests: 25,
           minSize: 20000,
           cacheGroups: {
             default: false,
             vendors: false,
             framework: {
               name: 'framework',
               test: /[\\/]node_modules[\\/](react|react-dom|next|framer-motion)[\\/]/,
               priority: 40,
               enforce: true,
             },
             lib: {
               test: /[\\/]node_modules[\\/]/,
               name(module) {
                 const packageName = module.context.match(
                   /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                 )[1];
                 
                 return `npm.${packageName.replace('@', '')}`;
               },
               priority: 30,
               minChunks: 1,
               reuseExistingChunk: true,
             },
             commons: {
               name: 'commons',
               minChunks: 2,
               priority: 20,
             },
             shared: {
               name: 'shared',
               minChunks: 2,
               priority: 10,
               reuseExistingChunk: true,
             },
           },
         };
       }
       
       return config;
     },
   });
   ```

5. Implement and test service worker functionality
   ```javascript
   // public/service-worker.js
   
   const CACHE_NAME = 'sillavida-cache-v1';
   const RUNTIME_CACHE = 'sillavida-runtime-v1';
   
   // Resources to cache on install
   const PRECACHE_URLS = [
     '/',
     '/offline',
     '/css/main.css',
     '/js/main.js',
     '/images/logo.svg',
     '/images/placeholder.jpg',
     '/fonts/Montserrat-Regular.woff2',
     '/fonts/Montserrat-Bold.woff2',
     '/fonts/OpenSans-Regular.woff2',
     '/fonts/OpenSans-SemiBold.woff2',
   ];
   
   // Install event - precache static assets
   self.addEventListener('install', event => {
     event.waitUntil(
       caches.open(CACHE_NAME)
         .then(cache => cache.addAll(PRECACHE_URLS))
         .then(() => self.skipWaiting())
     );
   });
   
   // Activate event - clean up old caches
   self.addEventListener('activate', event => {
     const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
     
     event.waitUntil(
       caches.keys().then(cacheNames => {
         return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
       }).then(cachesToDelete => {
         return Promise.all(cachesToDelete.map(cacheToDelete => {
           return caches.delete(cacheToDelete);
         }));
       }).then(() => self.clients.claim())
     );
   });
   
   // Fetch event - serve from cache or network
   self.addEventListener('fetch', event => {
     // Skip cross-origin requests
     if (!event.request.url.startsWith(self.location.origin)) {
       return;
     }
     
     // Skip Shopify API requests
     if (event.request.url.includes('/api/')) {
       return;
     }
     
     // For HTML requests - network first, fallback to cache, then offline page
     if (event.request.headers.get('Accept').includes('text/html')) {
       event.respondWith(
         fetch(event.request).catch(error => {
           return caches.match(event.request).then(cachedResponse => {
             if (cachedResponse) {
               return cachedResponse;
             }
             return caches.match('/offline');
           });
         })
       );
       return;
     }
     
     // For image requests - cache first, fallback to network
     if (event.request.destination === 'image') {
       event.respondWith(
         caches.match(event.request).then(cachedResponse => {
           if (cachedResponse) {
             return cachedResponse;
           }
           
           return fetch(event.request).then(response => {
             // Don't cache non-successful responses
             if (!response || response.status !== 200 || response.type !== 'basic') {
               return response;
             }
             
             // Clone the response
             const responseToCache = response.clone();
             
             caches.open(RUNTIME_CACHE).then(cache => {
               cache.put(event.request, responseToCache);
             });
             
             return response;
           });
         })
       );
       return;
     }
     
     // For other requests - stale-while-revalidate
     event.respondWith(
       caches.match(event.request).then(cachedResponse => {
         const fetchPromise = fetch(event.request).then(response => {
           // Don't cache non-successful responses
           if (!response || response.status !== 200 || response.type !== 'basic') {
             return response;
           }
           
           // Clone the response
           const responseToCache = response.clone();
           
           caches.open(RUNTIME_CACHE).then(cache => {
             cache.put(event.request, responseToCache);
           });
           
           return response;
         });
         
         return cachedResponse || fetchPromise;
       })
     );
   });
   ```

6. Register service worker in the application
   ```javascript
   // src/utils/serviceWorker.js
   
   export const registerServiceWorker = () => {
     if ('serviceWorker' in navigator) {
       window.addEventListener('load', () => {
         navigator.serviceWorker.register('/service-worker.js')
           .then(registration => {
             console.log('Service Worker registered with scope:', registration.scope);
           })
           .catch(error => {
             console.error('Service Worker registration failed:', error);
           });
       });
     }
   };
   
   // Check if service worker needs updating
   export const checkForUpdates = () => {
     if ('serviceWorker' in navigator) {
       navigator.serviceWorker.ready.then(registration => {
         registration.update();
       });
     }
   };
   
   // Handle service worker updates
   export const setupUpdateHandlers = (onUpdateFound) => {
     if ('serviceWorker' in navigator) {
       // When a new service worker is found
       navigator.serviceWorker.addEventListener('controllerchange', () => {
         if (onUpdateFound && typeof onUpdateFound === 'function') {
           onUpdateFound();
         }
       });
     }
   };
   ```

7. Optimize React components with React.memo and useMemo
   ```javascript
   // src/components/product/ProductCard.jsx
   
   import React, { useMemo } from 'react';
   import { Link } from 'react-router-dom';
   import LazyImage from '../common/LazyImage';
   
   const ProductCard = React.memo(({ product, className = '' }) => {
     // Memoize price calculation
     const formattedPrice = useMemo(() => {
       const price = product.priceRange?.minVariantPrice?.amount || 0;
       return new Intl.NumberFormat('es-ES', {
         style: 'currency',
         currency: 'EUR'
       }).format(price);
     }, [product.priceRange]);
     
     // Memoize discount calculation
     const discountPercentage = useMemo(() => {
       const compareAtPrice = product.compareAtPriceRange?.minVariantPrice?.amount;
       const price = product.priceRange?.minVariantPrice?.amount;
       
       if (!compareAtPrice || !price || compareAtPrice <= price) {
         return null;
       }
       
       const discount = Math.round((1 - price / compareAtPrice) * 100);
       return discount > 0 ? discount : null;
     }, [product.compareAtPriceRange, product.priceRange]);
     
     return (
       <div className={`product-card ${className}`}>
         <Link to={`/products/${product.handle}`} className="block">
           <div className="relative">
             <LazyImage
               src={product.featuredImage?.url || '/images/placeholder.jpg'}
               alt={product.title}
               width={300}
               height={300}
               className="product-card-image"
             />
             
             {discountPercentage && (
               <div className="absolute top-2 right-2 bg-terracotta text-white text-xs font-bold px-2 py-1 rounded">
                 -{discountPercentage}%
               </div>
             )}
           </div>
           
           <h3 className="product-card-title mt-2 text-sm font-medium">{product.title}</h3>
           <p className="product-card-price text-terracotta font-bold">{formattedPrice}</p>
         </Link>
       </div>
     );
   });
   
   // Add display name for debugging
   ProductCard.displayName = 'ProductCard';
   
   export default ProductCard;
   ```

8. Implement dynamic imports for code splitting
   ```javascript
   // src/pages/ProductPage.jsx
   
   import React, { Suspense, lazy } from 'react';
   import { useParams } from 'react-router-dom';
   import LoadingSpinner from '../components/common/LoadingSpinner';
   
   // Dynamically import components
   const ProductGallery = lazy(() => import('../components/product/ProductGallery'));
   const ProductInfo = lazy(() => import('../components/product/ProductInfo'));
   const ProductFeatures = lazy(() => import('../components/product/ProductFeatures'));
   const ProductSpecifications = lazy(() => import('../components/product/ProductSpecifications'));
   const RelatedProducts = lazy(() => import('../components/product/RelatedProducts'));
   const SternifyReviews = lazy(() => import('../components/product/SternifyReviews'));
   
   const ProductPage = () => {
     const { handle } = useParams();
     
     return (
       <div className="product-page">
         <div className="product-hero">
           <Suspense fallback={<LoadingSpinner />}>
             <ProductGallery handle={handle} />
           </Suspense>
           
           <Suspense fallback={<LoadingSpinner />}>
             <ProductInfo handle={handle} />
           </Suspense>
         </div>
         
         <Suspense fallback={<LoadingSpinner />}>
           <ProductFeatures handle={handle} />
         </Suspense>
         
         <Suspense fallback={<LoadingSpinner />}>
           <ProductSpecifications handle={handle} />
         </Suspense>
         
         <Suspense fallback={<LoadingSpinner />}>
           <SternifyReviews handle={handle} />
         </Suspense>
         
         <Suspense fallback={<LoadingSpinner />}>
           <RelatedProducts handle={handle} />
         </Suspense>
       </div>
     );
   };
   
   export default ProductPage;
   ```

9. Optimize images with next-gen formats
   ```javascript
   // scripts/optimize-images.js
   
   const fs = require('fs');
   const path = require('path');
   const sharp = require('sharp');
   const glob = require('glob');
   
   // Directories
   const inputDir = path.join(__dirname, '../public/images');
   const outputDir = path.join(__dirname, '../public/images/optimized');
   
   // Create output directory if it doesn't exist
   if (!fs.existsSync(outputDir)) {
     fs.mkdirSync(outputDir, { recursive: true });
   }
   
   // Get all image files
   const imageFiles = glob.sync(`${inputDir}/**/*.{jpg,jpeg,png,gif}`, {
     ignore: `${inputDir}/optimized/**/*`
   });
   
   // Process each image
   (async () => {
     console.log(`Found ${imageFiles.length} images to optimize`);
     
     for (const file of imageFiles) {
       const filename = path.basename(file, path.extname(file));
       const relativePath = path.relative(inputDir, path.dirname(file));
       const outputPath = path.join(outputDir, relativePath);
       
       // Create output subdirectory if needed
       if (!fs.existsSync(outputPath)) {
         fs.mkdirSync(outputPath, { recursive: true });
       }
       
       try {
         // Get image metadata
         const metadata = await sharp(file).metadata();
         
         // Create WebP version
         await sharp(file)
           .webp({ quality: 80 })
           .toFile(path.join(outputPath, `${filename}.webp`));
         
         // Create AVIF version
         await sharp(file)
           .avif({ quality: 65 })
           .toFile(path.join(outputPath, `${filename}.avif`));
         
         // Create responsive versions for WebP
         const widths = [320, 640, 960, 1280];
         for (const width of widths) {
           if (metadata.width > width) {
             await sharp(file)
               .resize(width)
               .webp({ quality: 80 })
               .toFile(path.join(outputPath, `${filename}-${width}.webp`));
           }
         }
         
         console.log(`Optimized: ${file}`);
       } catch (error) {
         console.error(`Error optimizing ${file}:`, error);
       }
     }
     
     console.log('Image optimization complete!');
   })();
   ```

10. Create a responsive image component with next-gen formats
    ```javascript
    // src/components/common/ResponsiveImage.jsx
    
    import React from 'react';
    
    const ResponsiveImage = ({ 
      src, 
      alt, 
      width, 
      height, 
      sizes = '100vw', 
      className = '',
      ...props 
    }) => {
      // Extract file information
      const fileExt = src.split('.').pop();
      const basePath = src.substring(0, src.lastIndexOf('.'));
      
      // Check if optimized versions exist
      const hasOptimized = basePath.includes('/images/') && !basePath.includes('/optimized/');
      
      // Create optimized path
      const getOptimizedPath = (path, format) => {
        return path.replace('/images/', '/images/optimized/') + '.' + format;
      };
      
      // Create responsive sources
      const getResponsiveSrcSet = (format) => {
        const widths = [320, 640, 960, 1280];
        return widths
          .map(w => `${basePath.replace('/images/', '/images/optimized/')}-${w}.${format} ${w}w`)
          .join(', ');
      };
      
      return (
        <picture>
          {/* AVIF format */}
          {hasOptimized && (
            <source
              type="image/avif"
              srcSet={getOptimizedPath(basePath, 'avif')}
              sizes={sizes}
            />
          )}
          
          {/* WebP format */}
          {hasOptimized && (
            <source
              type="image/webp"
              srcSet={getResponsiveSrcSet('webp')}
              sizes={sizes}
            />
          )}
          
          {/* Original format fallback */}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={className}
            loading="lazy"
            {...props}
          />
        </picture>
      );
    };
    
    export default ResponsiveImage;
    ```

11. Implement resource hints for critical resources
    ```html
    <!-- Add to head in _document.js or index.html -->
    <link rel="preconnect" href="https://cdn.shopify.com" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    
    <!-- Preload critical fonts -->
    <link rel="preload" href="/fonts/Montserrat-Regular.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/OpenSans-Regular.woff2" as="font" type="font/woff2" crossorigin />
    
    <!-- Preload critical CSS -->
    <link rel="preload" href="/css/main.css" as="style" />
    
    <!-- Prefetch templates for common navigation paths -->
    <link rel="prefetch" href="/products" />
    <link rel="prefetch" href="/collections/all" />
    ```

12. Implement performance monitoring
    ```javascript
    // src/utils/performanceMonitoring.js
    
    export const initPerformanceMonitoring = () => {
      if (!window.performance || !window.performance.getEntriesByType) {
        console.warn('Performance API not supported');
        return;
      }
      
      // Report Web Vitals
      const reportWebVitals = ({ name, delta, id }) => {
        console.log(`Web Vital: ${name}`, delta);
        
        // Send to analytics
        if (window.gtag) {
          window.gtag('event', name, {
            event_category: 'Web Vitals',
            event_label: id,
            value: Math.round(name === 'CLS' ? delta * 1000 : delta),
            non_interaction: true,
          });
        }
      };
      
      // Load web-vitals library
      import('web-vitals').then(({ getCLS, getFID, getLCP, getTTFB, getFCP }) => {
        getCLS(reportWebVitals);
        getFID(reportWebVitals);
        getLCP(reportWebVitals);
        getTTFB(reportWebVitals);
        getFCP(reportWebVitals);
      });
      
      // Monitor resource loading
      const observeResourceTiming = () => {
        const resources = window.performance.getEntriesByType('resource');
        
        // Find slow-loading resources
        const slowResources = resources.filter(resource => resource.duration > 1000);
        
        if (slowResources.length > 0) {
          console.warn('Slow-loading resources:', slowResources);
        }
      };
      
      // Run after page load
      window.addEventListener('load', () => {
        // Wait for all resources to load
        setTimeout(observeResourceTiming, 1000);
      });
    };
    ```

## Progress
- [x] Step 1
- [x] Step 2
- [x] Step 3
- [x] Step 4
- [x] Step 5
- [x] Step 6
- [x] Step 7
- [x] Step 8
- [x] Step 9
- [x] Step 10
- [x] Step 11
- [x] Step 12

## Dependencies
None

## Test Status
- Status: Completed
- Test Files: None

## Notes
- Focus on mobile performance optimizations as priority
- The implementation should follow a progressive enhancement approach
- Consider using Intersection Observer API for lazy loading to improve performance
- Service worker implementation should be thoroughly tested across different browsers
- Image optimization should be part of the build process
- Consider implementing a CDN for static assets
- Monitor Core Web Vitals before and after implementation to measure improvements
- Ensure all optimizations work with the existing Shopify integration
- Consider implementing a performance budget for the website
- Document all performance optimizations for future reference
- Ensure accessibility is maintained while implementing performance optimizations

## Next Steps
- Run final Lighthouse audit to measure performance improvements
- Review and document all performance optimizations
- Implement performance monitoring and tracking
- Continuously monitor and improve performance over time
