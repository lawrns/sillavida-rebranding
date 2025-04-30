import React, { useState, useEffect, useRef } from 'react';

/**
 * Image Optimization Utilities
 * 
 * This module provides utilities for optimizing images for mobile devices.
 * It includes functions for lazy loading, WebP conversion, and responsive image sizing.
 */

/**
 * Generates a WebP URL for a given image URL if supported
 * @param originalUrl - The original image URL
 * @param width - The desired width of the image
 * @param quality - The quality of the WebP image (0-100)
 * @returns The WebP URL or original URL if WebP is not supported
 */
export const getWebPUrl = (originalUrl: string, width: number = 800, quality: number = 80): string => {
  // In a real implementation, this would connect to a CDN or image service
  // that can dynamically generate WebP images
  
  // For this demo, we'll just check if the browser supports WebP
  // and return the original URL with a query parameter
  if (supportsWebP()) {
    // Add query parameters to indicate WebP conversion
    // In a real implementation, this would be handled by a CDN or image service
    return `${originalUrl}?format=webp&width=${width}&quality=${quality}`;
  }
  
  // Return the original URL if WebP is not supported
  return originalUrl;
};

/**
 * Checks if the browser supports WebP format
 * @returns Whether the browser supports WebP
 */
export const supportsWebP = (): boolean => {
  // Feature detection for WebP support
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    // Check if toDataURL returns a WebP data URL
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

interface LazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
}

/**
 * Lazy loads an image when it comes into view
 * @param imgElement - The image element to lazy load
 * @param src - The source URL of the image
 * @param options - Options for lazy loading
 */
export const lazyLoadImage = (
  imgElement: HTMLImageElement, 
  src: string, 
  options: LazyLoadOptions = {}
): void => {
  const defaultOptions = {
    rootMargin: '50px 0px',
    threshold: 0.1
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Create an intersection observer to detect when the image is in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Load the image when it comes into view
        const img = entry.target as HTMLImageElement;
        img.src = src;
        
        // Stop observing once the image is loaded
        observer.unobserve(img);
      }
    });
  }, mergedOptions);
  
  // Start observing the image element
  observer.observe(imgElement);
};

interface UseLazyImageResult {
  ref: React.RefObject<HTMLImageElement>;
  loaded: boolean;
}

/**
 * React hook for lazy loading images
 * @param src - The source URL of the image
 * @param options - Options for lazy loading
 * @returns The ref to attach to the image element and the loaded state
 */
export const useLazyImage = (
  src: string, 
  options: LazyLoadOptions = {}
): UseLazyImageResult => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (imgRef.current) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Set the src attribute when the image comes into view
            if (imgRef.current) {
              imgRef.current.src = src;
            }
            setLoaded(true);
            
            // Stop observing once the image is loaded
            observer.unobserve(entry.target);
          }
        });
      }, options);
      
      // Start observing the image element
      observer.observe(imgRef.current);
      
      return () => {
        if (imgRef.current) {
          observer.unobserve(imgRef.current);
        }
      };
    }
  }, [src, options]);
  
  return { ref: imgRef, loaded };
};

interface ResponsiveImageSizes {
  mobile: string;
  tablet: string;
  desktop: string;
}

/**
 * Gets the appropriate image size based on the device
 * @param sizes - Object containing different image sizes
 * @returns The appropriate image URL for the current device
 */
export const getResponsiveImageUrl = (sizes: ResponsiveImageSizes): string => {
  const width = window.innerWidth;
  
  if (width < 640) {
    return sizes.mobile;
  } else if (width < 1024) {
    return sizes.tablet;
  } else {
    return sizes.desktop;
  }
};

/**
 * Preloads critical images
 * @param urls - Array of image URLs to preload
 */
export const preloadCriticalImages = (urls: string[]): void => {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};
