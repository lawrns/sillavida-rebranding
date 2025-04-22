import React, { useState, useEffect, useRef } from 'react';

/**
 * Image Optimization Utilities
 * 
 * This module provides utilities for optimizing images for mobile devices.
 * It includes functions for lazy loading, WebP conversion, and responsive image sizing.
 */

/**
 * Generates a WebP URL for a given image URL if supported
 * @param {string} originalUrl - The original image URL
 * @param {number} width - The desired width of the image
 * @param {number} quality - The quality of the WebP image (0-100)
 * @returns {string} - The WebP URL or original URL if WebP is not supported
 */
export const getWebPUrl = (originalUrl, width = 800, quality = 80) => {
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
 * @returns {boolean} - Whether the browser supports WebP
 */
export const supportsWebP = () => {
  // Feature detection for WebP support
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    // Check if toDataURL returns a WebP data URL
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

/**
 * Lazy loads an image when it comes into view
 * @param {HTMLImageElement} imgElement - The image element to lazy load
 * @param {string} src - The source URL of the image
 * @param {Object} options - Options for lazy loading
 * @param {number} options.rootMargin - The margin around the root
 * @param {number} options.threshold - The threshold for intersection
 */
export const lazyLoadImage = (imgElement, src, options = {}) => {
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
        const img = entry.target;
        img.src = src;
        
        // Stop observing once the image is loaded
        observer.unobserve(img);
      }
    });
  }, mergedOptions);
  
  // Start observing the image element
  observer.observe(imgElement);
};

/**
 * React hook for lazy loading images
 * @param {string} src - The source URL of the image
 * @param {Object} options - Options for lazy loading
 * @returns {Object} - The ref to attach to the image element and the loaded state
 */
export const useLazyImage = (src, options = {}) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);
  
  useEffect(() => {
    if (imgRef.current) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Set the src attribute when the image comes into view
            imgRef.current.src = src;
            setLoaded(true);
            
            // Stop observing once the image is loaded
            observer.unobserve(imgRef.current);
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

/**
 * Gets the appropriate image size based on the device
 * @param {Object} sizes - Object containing different image sizes
 * @param {string} sizes.mobile - URL for mobile devices
 * @param {string} sizes.tablet - URL for tablet devices
 * @param {string} sizes.desktop - URL for desktop devices
 * @returns {string} - The appropriate image URL for the current device
 */
export const getResponsiveImageUrl = (sizes) => {
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
 * @param {Array<string>} urls - Array of image URLs to preload
 */
export const preloadCriticalImages = (urls) => {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};
