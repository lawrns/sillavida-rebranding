import React from 'react';
import { motion } from 'framer-motion';

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
    <div className="flex flex-wrap gap-2 mt-3">
      {images.map((img, i) => (
        <motion.button 
          key={i} 
          className={`relative w-16 h-16 rounded overflow-hidden p-0 border-2 ${selectedImage === img ? 'border-accent' : 'border-neutral-100 hover:border-neutral-300'} bg-transparent cursor-pointer transition-all md:w-14 md:h-14 sm:w-12 sm:h-12`}
          onClick={() => onSelectImage(img)}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Ver ${productTitle} - Vista ${i+1}`}
          aria-pressed={selectedImage === img}
        >
          <div className="w-full h-full flex items-center justify-center bg-white p-1">
            <img 
              src={img} 
              alt={`${productTitle} vista ${i+1}`} 
              loading="lazy"
              className="w-full h-full object-contain"
            />
          </div>
          {selectedImage === img && (
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent"
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
