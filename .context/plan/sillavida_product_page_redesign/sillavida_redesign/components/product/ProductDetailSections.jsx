import React from 'react';

// This component fetches images from the product media gallery based on Alt Text
// and displays them vertically with descriptions.

const ProductDetailSections = ({ product }) => {
  // Define the prefixes to identify feature and specification images
  const featurePrefix = 'feature-';
  const specPrefix = 'spec-';

  // Filter images from the product media gallery based on Alt Text prefixes
  // Assumes product.images contains all media gallery items
  const detailImages = (product.images || []).filter(image =>
    image.altText?.startsWith(featurePrefix) || image.altText?.startsWith(specPrefix)
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

  // Basic inline styles - replace with CSS classes later
  const styles = {
    section: {
      padding: '40px 0',
      borderBottom: '1px solid #eee',
    },
    item: {
      marginBottom: '50px',
      textAlign: 'center', // Center align items
    },
    image: {
      maxWidth: '100%',
      height: 'auto',
      display: 'block',
      margin: '0 auto 20px auto', // Center image and add space below
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    title: {
      fontSize: '1.6em',
      fontWeight: '600',
      color: '#333',
      margin: '0 0 10px 0',
    },
    description: {
      fontSize: '1em',
      color: '#555',
      lineHeight: '1.6',
      maxWidth: '800px', // Limit description width for readability
      margin: '0 auto', // Center description text block
    },
    noDetails: {
        padding: '30px',
        textAlign: 'center',
        color: '#777',
        fontSize: '1.1em',
    }
  };

  if (detailImages.length === 0) {
    return (
        <div style={styles.noDetails}>
            <p>No se encontraron detalles adicionales (imágenes con Alt Text iniciando con '{featurePrefix}' o '{specPrefix}') en la galería del producto.</p>
        </div>
    );
  }

  return (
    <div className="product-detail-sections">
      {detailImages.map((image, index) => {
        const { title, description } = parseAltText(image.altText);
        return (
          <section key={index} style={styles.section} className={`detail-section detail-section-${index}`}>
            <div style={styles.item}>
              {/* You might want alternating text/image alignment later */}
              <img src={image.url} alt={title} style={styles.image} />
              <h3 style={styles.title}>{title}</h3>
              {description && <p style={styles.description}>{description}</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ProductDetailSections;

