import React, { useState, useEffect, useRef } from 'react';
import { getWebPUrl } from '../utils/imageOptimizer.ts';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholderColor?: string;
  quality?: number;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * LazyImage component that lazy loads images and optimizes them for mobile
 * 
 * Features:
 * - Lazy loading using Intersection Observer API
 * - WebP conversion if supported
 * - Responsive image sizing
 * - Placeholder while loading
 * - Accessibility support
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderColor = '#f3f4f6', // Light gray placeholder
  quality = 80,
  threshold = 0.1,
  rootMargin = '50px 0px',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Optimize the image URL for WebP if supported
  const optimizedSrc = isInView ? getWebPUrl(src, width, quality) : '';
  
  useEffect(() => {
    // Skip if the image ref is not available
    if (!imgRef.current) return;
    
    // Create an intersection observer to detect when the image is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );
    
    // Start observing the image element
    observer.observe(imgRef.current);
    
    // Clean up the observer when the component unmounts
    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [threshold, rootMargin]);
  
  // Handle image load event
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  // Handle image error event
  const handleError = () => {
    if (onError) onError();
  };
  
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        backgroundColor: placeholderColor,
      }}
      aria-busy={!isLoaded}
    >
      {/* Placeholder shown while the image is loading */}
      {!isLoaded && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-100"
          aria-hidden="true"
        >
          <div className="w-8 h-8 border-4 border-teal border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* The actual image element */}
      <img
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        width={width}
        height={height}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default LazyImage;
