/**
 * LazyMedia Component
 * Optimized lazy loading for images and videos in UGC cards
 */

import React, { useState, useRef, useEffect } from 'react';

interface LazyMediaProps {
  src: string;
  poster?: string;
  alt: string;
  type: 'image' | 'video';
  className?: string;
  onLoad?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

const LazyMedia: React.FC<LazyMediaProps> = ({
  src,
  poster,
  alt,
  type,
  className = '',
  onLoad,
  onPlay,
  onPause,
  controls = false,
  muted = true,
  loop = true,
  playsInline = true,
  videoRef
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!mediaRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px' // Start loading 50px before element is visible
      }
    );

    observerRef.current.observe(mediaRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
  };

  const handlePlay = () => {
    onPlay?.();
  };

  const handlePause = () => {
    onPause?.();
  };

  // Loading placeholder
  const LoadingPlaceholder = () => (
    <div className={`absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  // Error fallback
  const ErrorFallback = () => (
    <div className={`absolute inset-0 bg-gray-100 flex items-center justify-center ${className}`}>
      <div className="text-center text-gray-500">
        <div className="text-2xl mb-2">📷</div>
        <div className="text-xs">Media no disponible</div>
      </div>
    </div>
  );

  if (hasError) {
    return <ErrorFallback />;
  }

  if (!isInView) {
    return (
      <div ref={mediaRef} className="absolute inset-0">
        <LoadingPlaceholder />
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className="absolute inset-0">
        {!isLoaded && <LoadingPlaceholder />}
        <video
          ref={videoRef || (mediaRef as React.RefObject<HTMLVideoElement>)}
          className={`absolute inset-0 ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          controls={controls}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          onLoadedData={handleLoad}
          onError={handleError}
          onPlay={handlePlay}
          onPause={handlePause}
          preload="metadata" // Load metadata and first frame
        >
          <source src={src} type="video/mp4" />
          {/* Fallback for unsupported video */}
          {poster && (
            <img
              src={poster}
              alt={alt}
              className="w-full h-full object-cover"
              onLoad={handleLoad}
              onError={handleError}
            />
          )}
        </video>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {!isLoaded && <LoadingPlaceholder />}
      <img
        ref={mediaRef as React.RefObject<HTMLImageElement>}
        src={src}
        alt={alt}
        className={`absolute inset-0 ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default LazyMedia;