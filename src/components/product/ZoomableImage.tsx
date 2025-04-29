import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ZoomableImage.css';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  zoomFactor?: number;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({
  src,
  alt,
  className = '',
  zoomFactor = 2.5
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Calculate zoom position based on mouse position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isZoomed) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate position as percentage of container
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPosition({ x, y });
  };

  // Toggle zoom on click
  const handleClick = () => {
    setIsZoomed(!isZoomed);
  };

  // Reset zoom when mouse leaves container
  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  // Add keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsZoomed(!isZoomed);
    } else if (e.key === 'Escape' && isZoomed) {
      setIsZoomed(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`zoomable-image-container ${className} ${isZoomed ? 'zoomed' : ''}`}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={isZoomed ? `Zoom out of ${alt}` : `Zoom in on ${alt}`}
    >
      {!imageLoaded && (
        <div className="loading-placeholder">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      <motion.img
        ref={imageRef}
        src={src}
        alt={alt}
        className="zoomable-image"
        style={{
          transformOrigin: `${position.x}% ${position.y}%`,
          transform: isZoomed ? `scale(${zoomFactor})` : 'scale(1)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: imageLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onLoad={handleImageLoad}
        draggable={false}
      />
      
      {isZoomed && (
        <div className="zoom-instructions">
          <span>Mueve el cursor para explorar</span>
          <span className="zoom-close">Haz clic para cerrar</span>
        </div>
      )}
      
      {!isZoomed && imageLoaded && (
        <div className="zoom-hint">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
      )}
    </div>
  );
};

export default ZoomableImage;
