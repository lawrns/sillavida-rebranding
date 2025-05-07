import React, { useState } from 'react';
import ImageZoomModal from './ImageZoomModal';
import './ProductDetailSections.css';

interface ProductDetailSectionsProps {
  product: any;
}

const ProductDetailSections: React.FC<ProductDetailSectionsProps> = ({ product }) => {
  // State for zoom modal
  const [zoomImage, setZoomImage] = useState<{ url: string; alt: string } | null>(null);
  
  // Define the prefixes to identify feature and specification images
  const featurePrefix = 'feature-';
  const specPrefix = 'spec-';

  // Filter and separate spec and feature images
  const specImages = (product.images?.edges || []).filter((image: any) => {
    const altText = image.node.altText || '';
    return altText.startsWith(specPrefix);
  });

  const featureImages = (product.images?.edges || []).filter((image: any) => {
    const altText = image.node.altText || '';
    return altText.startsWith(featurePrefix);
  });

  // Function to parse Title and Description from Alt Text
  const parseAltText = (altText: string | null) => {
    if (!altText) {
      return { title: 'Detalle', description: '' }; // Fallback
    }
    
    let prefix = '';
    if (altText.startsWith(featurePrefix)) {
      prefix = featurePrefix;
    } else if (altText.startsWith(specPrefix)) {
      prefix = specPrefix;
    }

    if (!prefix) {
      return { title: altText || 'Detalle', description: '' }; // Fallback
    }

    const content = altText.substring(prefix.length);
    const separatorIndex = content.indexOf(':');

    if (separatorIndex !== -1) {
      const title = content.substring(0, separatorIndex).trim();
      const description = content.substring(separatorIndex + 1).trim();
      return { title, description };
    } else {
      // If no colon separator, use the content as title
      return { title: content.trim(), description: '' };
    }
  };

  // Function to open zoom modal
  const handleImageClick = (url: string, alt: string) => {
    setZoomImage({ url, alt });
  };

  // Function to close zoom modal
  const closeZoomModal = () => {
    setZoomImage(null);
  };

  if (!product.images?.edges || product.images.edges.length === 0) {
    return (
      <div className="no-details">
        <p>No se encontraron imágenes para este producto.</p>
      </div>
    );
  }

  if (specImages.length === 0 && featureImages.length === 0) {
    return (
      <div className="no-details">
        <p>No se encontraron detalles adicionales (imágenes con Alt Text iniciando con '{featurePrefix}' o '{specPrefix}') en la galería del producto.</p>
        <p>Para mostrar características o especificaciones, agregue imágenes con Alt Text en el formato: "{featurePrefix}Título:Descripción" o "{specPrefix}Título:Descripción".</p>
      </div>
    );
  }

  return (
    <div className="product-detail-sections">
      {/* Specifications Section - Horizontal Card Layout */}
      {specImages.length > 0 && (
        <section className="specifications-detail-section">
          <h2 className="section-title">Especificaciones</h2>
          <div className={`spec-grid ${specImages.length === 1 ? 'spec-grid-single' : ''}`}>
            {specImages.map((image: any, index: number) => {
              const { title, description } = parseAltText(image.node.altText);
              
              return (
                <div key={`spec-${index}`} className="spec-card">
                  <div 
                    className="spec-card-image"
                    onClick={() => handleImageClick(image.node.url, title)}
                  >
                    <img 
                      src={image.node.url} 
                      alt={title}
                    />
                  </div>
                  <div className="spec-card-content">
                    <h3 className="spec-card-title">{title}</h3>
                    {description && <p className="spec-card-description">{description}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Features Section - Updated Card Layout */}
      {featureImages.length > 0 && (
        <section className="features-detail-section">
          <h2 className="section-title">Características</h2>
          <div className="feature-grid">
            {featureImages.map((image: any, index: number) => {
              const { title, description } = parseAltText(image.node.altText);
              
              return (
                <div key={`feature-${index}`} className="feature-card">
                  <div 
                    className="feature-card-image"
                    onClick={() => handleImageClick(image.node.url, title)}
                  >
                    <img 
                      src={image.node.url} 
                      alt={title}
                    />
                  </div>
                  <div className="feature-card-content">
                    <h3 className="feature-card-title">{title}</h3>
                    {description && <p className="feature-card-description">{description}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Image Zoom Modal */}
      {zoomImage && (
        <ImageZoomModal 
          imageUrl={zoomImage.url} 
          altText={zoomImage.alt} 
          onClose={closeZoomModal} 
        />
      )}
    </div>
  );
};

export default ProductDetailSections;
