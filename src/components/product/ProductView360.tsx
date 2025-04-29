import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ProductView360.css';

interface ProductView360Props {
  images: string[];
  alt: string;
  className?: string;
}

const ProductView360: React.FC<ProductView360Props> = ({
  images,
  alt,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // Preload all images
  useEffect(() => {
    let loadedCount = 0;
    const imageObjects: HTMLImageElement[] = [];
    
    images.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
      };
      img.onerror = () => {
        console.error(`Failed to load image at index ${index}`);
      };
      imageObjects.push(img);
    });
    
    return () => {
      // Clean up image objects
      imageObjects.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [images]);

  // Handle auto-rotation animation
  useEffect(() => {
    if (isPlaying) {
      const startAnimation = () => {
        animationRef.current = requestAnimationFrame(() => {
          setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
          startAnimation();
        });
      };
      
      const timeoutId = setTimeout(() => {
        startAnimation();
      }, 100); // Delay between frames
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        clearTimeout(timeoutId);
      };
    }
  }, [isPlaying, images.length]);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setIsPlaying(false); // Stop auto-rotation when user interacts
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const sensitivity = 5; // Higher value means less sensitive
    
    if (Math.abs(deltaX) > sensitivity) {
      const direction = deltaX > 0 ? -1 : 1; // Right to left increases index
      setCurrentIndex(prevIndex => {
        const newIndex = (prevIndex + direction + images.length) % images.length;
        setStartX(e.clientX);
        return newIndex;
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setIsPlaying(false); // Stop auto-rotation when user interacts
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - startX;
    const sensitivity = 5; // Higher value means less sensitive
    
    if (Math.abs(deltaX) > sensitivity) {
      const direction = deltaX > 0 ? -1 : 1; // Right to left increases index
      setCurrentIndex(prevIndex => {
        const newIndex = (prevIndex + direction + images.length) % images.length;
        setStartX(e.touches[0].clientX);
        return newIndex;
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Toggle auto-rotation
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Calculate loading progress
  const loadingProgress = Math.round((imagesLoaded / images.length) * 100);
  const isFullyLoaded = imagesLoaded === images.length;

  return (
    <div className={`product-view-360-container ${className}`}>
      <div 
        ref={containerRef}
        className={`product-view-360 ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading indicator */}
        {!isFullyLoaded && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div className="loading-progress">{loadingProgress}%</div>
          </div>
        )}
        
        {/* Current image */}
        <motion.img
          src={images[currentIndex]}
          alt={`${alt} - Vista 360° (${currentIndex + 1}/${images.length})`}
          className="product-view-360-image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          draggable={false}
        />
        
        {/* Controls */}
        <div className="product-view-360-controls">
          <button 
            className={`play-button ${isPlaying ? 'playing' : ''}`}
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pausar rotación' : 'Iniciar rotación'}
            disabled={!isFullyLoaded}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </button>
        </div>
        
        {/* Drag indicator */}
        {isFullyLoaded && !isPlaying && (
          <div className="drag-indicator">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
            <span>Arrastra para rotar</span>
          </div>
        )}
        
        {/* 360 badge */}
        <div className="view-360-badge">
          <span>360°</span>
        </div>
      </div>
    </div>
  );
};

export default ProductView360;
