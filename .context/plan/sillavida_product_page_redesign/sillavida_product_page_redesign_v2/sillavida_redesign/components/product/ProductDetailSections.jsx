import React from 'react';

// This component fetches images from the product media gallery based on Alt Text
// and displays them in separate sections with different layouts.

const ProductDetailSections = ({ product }) => {
  // Define the prefixes to identify feature and specification images
  const featurePrefix = 'feature-';
  const specPrefix = 'spec-';

  // Filter images for SPECIFICATIONS
  const specImages = (product.images || []).filter(image =>
    image.altText?.startsWith(specPrefix)
  );

  // Filter images for FEATURES
  const featureImages = (product.images || []).filter(image =>
    image.altText?.startsWith(featurePrefix)
  );

  // Function to parse Title and Description from Alt Text
  const parseAltText = (altText) => {
    let prefix = '';
    if (altText?.startsWith(featurePrefix)) {
      prefix = featurePrefix;
    } else if (altText?.startsWith(specPrefix)) {
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

  // --- Styles --- (Replace with CSS classes later)
  const styles = {
    // Styles for SPECIFICATION section (Horizontal Cards)
    specSection: {
      padding: '40px 0',
      borderBottom: '1px solid #eee',
      backgroundColor: '#f9f9f9', // Light background for distinction
    },
    specHeader: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    specTitle: {
      fontSize: '2em',
      fontWeight: '600',
      color: '#333',
    },
    specGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Responsive grid (e.g., 4 columns on wide screens)
      gap: '25px',
    },
    specCard: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
      textAlign: 'center',
      paddingBottom: '20px',
    },
    specCardImage: {
      width: '100%',
      height: '180px', // Fixed height for consistency
      objectFit: 'cover',
      display: 'block',
    },
    specCardContent: {
      padding: '15px',
    },
    specCardTitle: {
      fontSize: '1.2em',
      fontWeight: '600',
      color: '#008080', // Teal title
      margin: '0 0 8px 0',
    },
    specCardDescription: {
      fontSize: '0.9em',
      color: '#555',
      lineHeight: '1.5',
      margin: 0,
    },

    // Styles for FEATURE section (Larger Images/Captions)
    featureSection: {
      padding: '50px 0',
      borderBottom: '1px solid #eee',
    },
    featureHeader: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    featureTitle: {
      fontSize: '2em',
      fontWeight: '600',
      color: '#333',
    },
    featureGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', // Responsive grid (e.g., 2 columns on wide screens)
        gap: '40px',
        alignItems: 'start',
    },
    featureItem: {
      textAlign: 'center',
    },
    featureItemImage: {
      width: '100%',
      height: 'auto',
      display: 'block',
      borderRadius: '8px',
      marginBottom: '15px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    },
    featureItemTitle: {
      fontSize: '1.3em',
      fontWeight: '600',
      color: '#333',
      margin: '0 0 10px 0',
    },
    featureItemDescription: {
      fontSize: '1em',
      color: '#555',
      lineHeight: '1.6',
      margin: 0,
    },

    // Fallback style
    noDetails: {
        padding: '30px',
        textAlign: 'center',
        color: '#777',
        fontSize: '1.1em',
    }
  };

  return (
    <div className="product-detail-sections">
      {/* --- Specifications Section (Horizontal Cards) --- */}
      {specImages.length > 0 && (
        <section style={styles.specSection} className="specifications-detail-section">
          <div style={styles.specHeader}>
            {/* You might want a dynamic title here, or keep it static */}
            <h2 style={styles.specTitle}>Características Principales</h2>
          </div>
          <div style={styles.specGrid} className="spec-grid">
            {specImages.map((image, index) => {
              const { title, description } = parseAltText(image.altText);
              return (
                <div key={`spec-${index}`} style={styles.specCard} className="spec-card">
                  <img src={image.url} alt={title} style={styles.specCardImage} />
                  <div style={styles.specCardContent}>
                    <h3 style={styles.specCardTitle}>{title}</h3>
                    {description && <p style={styles.specCardDescription}>{description}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* --- Features Section (Larger Images/Captions) --- */}
      {featureImages.length > 0 && (
        <section style={styles.featureSection} className="features-detail-section">
           <div style={styles.featureHeader}>
             {/* You might want a dynamic title here, or keep it static */}
            <h2 style={styles.featureTitle}>Explora los Detalles</h2>
          </div>
          <div style={styles.featureGrid} className="feature-grid">
            {featureImages.map((image, index) => {
              const { title, description } = parseAltText(image.altText);
              return (
                <div key={`feature-${index}`} style={styles.featureItem} className="feature-item">
                  <img src={image.url} alt={title} style={styles.featureItemImage} />
                  <h3 style={styles.featureItemTitle}>{title}</h3>
                  {description && <p style={styles.featureItemDescription}>{description}</p>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Fallback if no images found */}
      {specImages.length === 0 && featureImages.length === 0 && (
         <div style={styles.noDetails}>
            <p>No se encontraron detalles adicionales (imágenes con Alt Text iniciando con '{specPrefix}' o '{featurePrefix}') en la galería del producto.</p>
        </div>
      )}
    </div>
  );
};

export default ProductDetailSections;

