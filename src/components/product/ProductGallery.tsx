import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomableImage } from './index';
import ImageThumbnailSelector from './ImageThumbnailSelector';
import ProductView360 from './ProductView360';
import { RotateCw, Maximize, X } from 'lucide-react';
import './ProductGallery.css';

interface ProductGalleryProps {
  images: string[];
  productTitle: string;
  enable360View?: boolean;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productTitle,
  enable360View = false
}) => {
  const [selectedImage, setSelectedImage] = useState(images[0] || '');
  const [is360ModalOpen, setIs360ModalOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);
  
  // Handle image selection
  const handleSelectImage = (image: string) => {
    setSelectedImage(image);
    // Update fullscreen index when thumbnail is selected
    const index = images.findIndex(img => img === image);
    if (index !== -1) {
      setFullscreenImageIndex(index);
    }
  };

  // Toggle 360 view modal
  const toggle360Modal = () => {
    setIs360ModalOpen(!is360ModalOpen);
  };
  
  // Toggle fullscreen gallery
  const toggleFullscreen = () => {
    setIsFullscreenOpen(!isFullscreenOpen);
  };
  
  // Navigate fullscreen gallery
  const navigateFullscreen = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setFullscreenImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setFullscreenImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Check if 360 view is available (need at least 8 images)
  const has360View = enable360View && images.length >= 8;

  return (
    <div className="product-gallery">
      <div className="gallery-main-view">
        <ZoomableImage
          src={selectedImage}
          alt={productTitle}
          className="main-product-image"
        />
        
        {/* Action buttons overlay */}
        <div className="gallery-actions">
          <motion.button
            className="gallery-action-btn fullscreen-btn"
            onClick={toggleFullscreen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Ver en pantalla completa"
          >
            <Maximize size={18} />
          </motion.button>
          
          {has360View && (
            <motion.button
              className="gallery-action-btn view-360-btn"
              onClick={toggle360Modal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Ver vista 360°"
            >
              <RotateCw size={18} />
              <span>360°</span>
            </motion.button>
          )}
        </div>
      </div>

      <div className="gallery-controls">
        <ImageThumbnailSelector
          images={images}
          selectedImage={selectedImage}
          onSelectImage={handleSelectImage}
          productTitle={productTitle}
        />
      </div>
      
      {/* 360 View Modal */}
      <AnimatePresence>
        {is360ModalOpen && (
          <motion.div 
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggle360Modal}
          >
            <motion.div 
              className="modal-content view-360-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="modal-close-btn"
                onClick={toggle360Modal}
                aria-label="Cerrar vista 360°"
              >
                <X size={24} />
              </button>
              <div className="modal-header">
                <h3>{productTitle} - Vista 360°</h3>
              </div>
              <div className="modal-body">
                <ProductView360
                  images={images.slice(0, 8)}
                  alt={productTitle}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Fullscreen Gallery Modal */}
      <AnimatePresence>
        {isFullscreenOpen && (
          <motion.div 
            className="modal-backdrop fullscreen-gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleFullscreen}
          >
            <motion.div 
              className="fullscreen-controls"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="fullscreen-close-btn"
                onClick={toggleFullscreen}
                aria-label="Cerrar pantalla completa"
              >
                <X size={24} />
              </button>
              
              <button 
                className="fullscreen-nav-btn prev-btn"
                onClick={() => navigateFullscreen('prev')}
                aria-label="Imagen anterior"
              >
                ‹
              </button>
              
              <div className="fullscreen-image-container">
                <img 
                  src={images[fullscreenImageIndex]} 
                  alt={`${productTitle} - Imagen ${fullscreenImageIndex + 1} de ${images.length}`}
                  className="fullscreen-image"
                />
              </div>
              
              <button 
                className="fullscreen-nav-btn next-btn"
                onClick={() => navigateFullscreen('next')}
                aria-label="Imagen siguiente"
              >
                ›
              </button>
              
              <div className="fullscreen-thumbnails">
                {images.map((img, i) => (
                  <button 
                    key={i}
                    className={`fullscreen-thumbnail ${i === fullscreenImageIndex ? 'active' : ''}`}
                    onClick={() => setFullscreenImageIndex(i)}
                    aria-label={`Ver imagen ${i + 1}`}
                    aria-pressed={i === fullscreenImageIndex}
                  >
                    <img src={img} alt={`Miniatura ${i + 1}`} />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductGallery;
