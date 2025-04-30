import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './ImageZoomModal.css';

interface ImageZoomModalProps {
  imageUrl: string;
  altText: string;
  onClose: () => void;
}

const ImageZoomModal: React.FC<ImageZoomModalProps> = ({ imageUrl, altText, onClose }) => {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    
    // Prevent scrolling on the body when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  // Close modal when clicking outside the image
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="image-zoom-modal" onClick={handleBackdropClick}>
      <div className="image-zoom-content">
        <button className="image-zoom-close" onClick={onClose} aria-label="Cerrar">
          <X size={24} />
        </button>
        <img src={imageUrl} alt={altText} className="image-zoom-img" />
      </div>
    </div>
  );
};

export default ImageZoomModal;
