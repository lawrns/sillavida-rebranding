import React, { useState, useEffect, useRef } from 'react';
import { errorHandler, ErrorSeverity } from '../../utils/errorHandler';
import { useInView } from 'react-intersection-observer';
import { getOptimizedImageUrl } from '../../utils/resourcePreloader';
import './LazyImage.css';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  placeholderSrc?: string;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  aspectRatio?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderSrc = '/images/placeholder.svg',
  threshold = 0.1,
  rootMargin = '200px 0px',
  onLoad,
  aspectRatio,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  const imageRef = useRef<HTMLImageElement>(null);
  
  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  // Handle image error
  const handleError = () => {
    setError(true);
    errorHandler.createError('SYSTEM_ERROR', {
      severity: ErrorSeverity.LOW,
      message: `Failed to load image: ${src}`,
      userMessage: 'No se pudo cargar la imagen'
    }, { component: 'LazyImage', action: 'loadImage' });
  };

  // Load image when it comes into view
  useEffect(() => {
    if (inView && imageRef.current) {
      const img = imageRef.current;
      
      // If the image is already cached, it might have loaded before we attached the event listener
      if (img.complete) {
        handleLoad();
      } else {
        // Use optimized image URL with WebP support
        const optimizedSrc = getOptimizedImageUrl(src, width as number);
        
        // Add fade-in transition
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        img.src = optimizedSrc;
        
        // Ensure onLoad is called for transition
        const originalOnLoad = img.onload;
        img.onload = (e) => {
          img.style.opacity = '1';
          if (originalOnLoad) originalOnLoad.call(img, e);
        };
      }
    }
  }, [inView, src, width]);

  // Generate inline style for aspect ratio
  const inlineStyle: React.CSSProperties = {};
  if (aspectRatio) {
    inlineStyle.aspectRatio = aspectRatio;
  }
  if (width) {
    inlineStyle.width = typeof width === 'number' ? `${width}px` : width;
  }
  if (height) {
    inlineStyle.height = typeof height === 'number' ? `${height}px` : height;
  }

  return (
    <div 
      ref={ref}
      className={`lazy-image-container ${className}`}
      style={inlineStyle}
    >
      {!isLoaded && !error && (
        <div className="lazy-image-placeholder">
          <img 
            src={placeholderSrc} 
            alt={`Loading ${alt}`}
            className="placeholder-img"
          />
        </div>
      )}
      
      {error && (
        <div className="lazy-image-error">
          <span>Failed to load image</span>
        </div>
      )}
      
      <img
        ref={imageRef}
        src={inView ? getOptimizedImageUrl(src, width as number) : ''}
        alt={alt}
        className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

export default LazyImage;
