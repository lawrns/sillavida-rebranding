import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomableImage } from './index';
import ImageThumbnailSelector from './ImageThumbnailSelector';
import ProductView360 from './ProductView360';
import { RotateCw, Maximize, X } from 'lucide-react';

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
    <div className="flex flex-col w-full">
      <div className="relative w-full h-[400px] rounded bg-white border border-neutral-100 overflow-hidden">
        <ZoomableImage
          src={selectedImage}
          alt={productTitle}
          className="w-full h-full p-2.5 object-contain"
        />
        
        {/* Action buttons overlay */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          <motion.button
            className="flex items-center justify-center p-1.5 bg-white/90 rounded text-black shadow-sm"
            onClick={toggleFullscreen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Ver en pantalla completa"
          >
            <Maximize size={18} />
          </motion.button>
          
          {has360View && (
            <motion.button
              className="flex items-center justify-center gap-1 bg-black px-2.5 py-1.5 rounded text-white shadow-sm"
              onClick={toggle360Modal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Ver vista 360°"
            >
              <RotateCw size={18} />
              <span className="text-xs font-medium">360°</span>
            </motion.button>
          )}
        </div>
      </div>

      <div className="flex flex-col mt-4 md:flex-row md:items-center md:justify-start">
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
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggle360Modal}
          >
            <motion.div 
              className="relative bg-white rounded w-[90%] max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-2.5 right-2.5 bg-white/90 border-none flex items-center justify-center text-black z-10 p-1 rounded-full shadow-sm hover:bg-white hover:scale-110 transition-all"
                onClick={toggle360Modal}
                aria-label="Cerrar vista 360°"
              >
                <X size={24} />
              </button>
              <div className="p-4 border-b border-neutral-100">
                <h3 className="m-0 text-lg font-heading font-medium text-black">{productTitle} - Vista 360°</h3>
              </div>
              <div className="flex-1 p-4 overflow-auto flex items-center justify-center">
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
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleFullscreen}
          >
            <motion.div 
              className="relative w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-5 right-5 bg-black/50 border-none text-white z-10 flex items-center justify-center p-2 rounded-full hover:bg-black/80 hover:scale-110 transition-all"
                onClick={toggleFullscreen}
                aria-label="Cerrar pantalla completa"
              >
                <X size={24} />
              </button>
              
              <button 
                className="absolute top-1/2 left-5 -translate-y-1/2 bg-black/50 text-white border-none w-[50px] h-[50px] rounded-full text-3xl flex items-center justify-center cursor-pointer hover:bg-accent hover:scale-110 hover:-translate-y-1/2 transition-all md:left-5"
                onClick={() => navigateFullscreen('prev')}
                aria-label="Imagen anterior"
              >
                ‹
              </button>
              
              <div className="w-full h-[70vh] md:h-[80vh] flex items-center justify-center">
                <img 
                  src={images[fullscreenImageIndex]} 
                  alt={`${productTitle} - Imagen ${fullscreenImageIndex + 1} de ${images.length}`}
                  className="max-w-[90%] max-h-[90%] object-contain"
                />
              </div>
              
              <button 
                className="absolute top-1/2 right-5 -translate-y-1/2 bg-black/50 text-white border-none w-[50px] h-[50px] rounded-full text-3xl flex items-center justify-center cursor-pointer hover:bg-accent hover:scale-110 hover:-translate-y-1/2 transition-all md:right-5"
                onClick={() => navigateFullscreen('next')}
                aria-label="Imagen siguiente"
              >
                ›
              </button>
              
              <div className="flex gap-2.5 p-5 overflow-x-auto max-w-full mt-5">
                {images.map((img, i) => (
                  <button 
                    key={i}
                    className={`w-[60px] h-[60px] border-2 ${i === fullscreenImageIndex ? 'border-accent' : 'border-transparent hover:border-white/50'} rounded overflow-hidden p-0 bg-transparent cursor-pointer transition-all hover:scale-105 sm:w-[50px] sm:h-[50px]`}
                    onClick={() => setFullscreenImageIndex(i)}
                    aria-label={`Ver imagen ${i + 1}`}
                    aria-pressed={i === fullscreenImageIndex}
                  >
                    <img src={img} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" />
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
