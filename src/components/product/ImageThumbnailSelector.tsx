import React from 'react';
import { motion } from 'framer-motion';
import './ImageThumbnailSelector.css';

interface ImageThumbnailSelectorProps {
  images: string[];
  selectedImage: string;
  onSelectImage: (image: string) => void;
  productTitle: string;
}

const ImageThumbnailSelector: React.FC<ImageThumbnailSelectorProps> = ({
  images,
  selectedImage,
  onSelectImage,
  productTitle
}) => {
  if (images.length <= 1) return null;

  return (
    <div className="image-thumbnail-selector">
      {images.map((img, i) => (
        <motion.button 
          key={i} 
          className={`thumbnail-item ${selectedImage === img ? 'selected' : ''}`}
          onClick={() => onSelectImage(img)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Ver ${productTitle} - Vista ${i+1}`}
          aria-pressed={selectedImage === img}
        >
          <div className="thumbnail-image-container">
            <img 
              src={img} 
              alt={`${productTitle} vista ${i+1}`} 
              loading="lazy"
            />
          </div>
          {selectedImage === img && (
            <motion.div 
              className="selected-indicator"
              layoutId="selectedThumbnail"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default ImageThumbnailSelector;
