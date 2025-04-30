import React, { useState } from 'react';
// Removed direct import of useCart, passing it as a prop from ProductPage

const ProductHeroShowcase = ({ product, useCart }) => {
  // Initialize selectedVariant safely, checking if variants exist
  const initialVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  const [selectedVariant, setSelectedVariant] = useState(initialVariant);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product.featuredImage?.url || '/images/placeholder.jpg');

  // Get the addItem function from the passed useCart hook result
  const { addItem } = useCart();

  // Ensure selectedVariant is updated if product changes or initialVariant was null
  React.useEffect(() => {
    if (!selectedVariant && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
    // Ensure main image updates if the product featured image changes
    if (product.featuredImage?.url && mainImage !== product.featuredImage.url) {
        // Only update if it's different, avoid potential loops if variant selection also changes image
        // A more robust logic might be needed if variants have their own primary images
        setMainImage(product.featuredImage.url);
    }
  }, [product, selectedVariant, mainImage]);

  const handleVariantChange = (variantId) => {
    const variant = product.variants.find(v => v.id === variantId);
    if (variant) {
      setSelectedVariant(variant);
      // Optionally update main image based on variant selection if variant images are available
      // setMainImage(variant.image?.url || product.featuredImage?.url);
    }
  };

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, parseInt(value) || 1); // Ensure value is a positive integer
    setQuantity(newQuantity);
  };

  const handleThumbnailClick = (imageUrl) => {
    setMainImage(imageUrl);
  };

  const handleAddToCart = () => {
    if (selectedVariant && selectedVariant.available) {
      addItem(selectedVariant.id, quantity);
    } else {
        console.warn('Attempted to add unavailable variant to cart');
        alert('Este producto o variante no está disponible actualmente.');
    }
  };

  // Filter images for the thumbnail gallery, excluding feature/spec images
  const featurePrefix = 'feature-';
  const specPrefix = 'spec-';
  const galleryImages = (product.images || []).filter(image =>
    !image.altText?.startsWith(featurePrefix) && !image.altText?.startsWith(specPrefix)
  );

  // Basic inline styles - replace with CSS classes later
  const styles = {
    productHero: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '40px',
      marginBottom: '40px',
      padding: '20px',
      borderBottom: '1px solid #eee',
    },
    productGallery: {
      flex: '1 1 55%', // Takes up slightly more space
      minWidth: '300px',
    },
    mainImageContainer: {
      marginBottom: '15px',
      border: '1px solid #eee',
      borderRadius: '8px',
      overflow: 'hidden',
      position: 'relative', // For potential zoom/badge elements
    },
    mainImage: {
      width: '100%',
      height: 'auto',
      display: 'block',
    },
    thumbnailGallery: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
    },
    thumbnail: {
      width: '80px',
      height: '80px',
      objectFit: 'cover',
      cursor: 'pointer',
      border: '1px solid #ddd',
      borderRadius: '4px',
      opacity: 0.7,
      transition: 'opacity 0.2s, border-color 0.2s',
    },
    thumbnailActive: {
        border: '2px solid #008080', // Teal border for active
        opacity: 1,
    },
    productInfo: {
      flex: '1 1 40%', // Takes up slightly less space
      minWidth: '300px',
    },
    productTitle: {
      fontSize: '2.2em',
      margin: '0 0 10px 0',
      fontWeight: '600',
      color: '#333',
    },
    productSubtitle: {
        fontSize: '1.1em',
        margin: '0 0 20px 0',
        color: '#555',
    },
    productPrice: {
      fontSize: '1.8em',
      margin: '0 0 20px 0',
      color: '#008080', // Teal color for price
      fontWeight: 'bold',
    },
    originalPrice: {
      fontSize: '0.7em',
      textDecoration: 'line-through',
      color: '#999',
      marginLeft: '10px',
    },
    stockStatus: {
        fontSize: '0.8em',
        marginLeft: '15px',
        fontWeight: '500',
    },
    available: { color: 'green' },
    unavailable: { color: 'red' },
    variantSelector: { marginBottom: '20px' },
    quantitySelector: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '25px',
    },
    quantityBtn: {
      padding: '8px 12px',
      border: '1px solid #ccc',
      background: '#f9f9f9',
      cursor: 'pointer',
    },
    quantityInput: {
      width: '50px',
      textAlign: 'center',
      padding: '8px 0',
      border: '1px solid #ccc',
      borderLeft: 'none',
      borderRight: 'none',
      margin: '0',
    },
    productActions: {
      display: 'flex',
      gap: '15px',
      marginBottom: '25px',
    },
    addToCartButton: {
      padding: '12px 25px',
      fontSize: '1.1em',
      fontWeight: 'bold',
      background: '#008080', // Teal background
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    addToCartButtonDisabled: {
        background: '#ccc',
        cursor: 'not-allowed',
    },
    secondaryButton: {
        padding: '12px 20px',
        fontSize: '1.1em',
        background: 'transparent',
        color: '#555',
        border: '1px solid #ccc',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    productDescription: {
        marginTop: '20px',
        lineHeight: '1.6',
        color: '#444',
    }
  };

  if (!selectedVariant) {
    // Handle case where product has no variants or data is incomplete
    return (
        <div style={styles.productHero}>
            <div style={styles.productInfo}>
                <h1 style={styles.productTitle}>{product.title}</h1>
                <p style={{color: 'red'}}>Información de variante no disponible.</p>
                {/* Display description or other available info */}
                <div style={styles.productDescription}
                     dangerouslySetInnerHTML={{ __html: product.descriptionHtml || '<p>No description available.</p>' }}
                />
            </div>
        </div>
    );
  }

  return (
    <div style={styles.productHero} className="product-hero-showcase">
      <div style={styles.productGallery} className="product-gallery">
        <div style={styles.mainImageContainer} className="main-image-container">
          <img
            src={mainImage}
            alt={product.title}
            style={styles.mainImage}
            className="product-main-image"
          />
        </div>

        <div style={styles.thumbnailGallery} className="thumbnail-gallery">
          {/* Use the filtered galleryImages array here */}
          {galleryImages.map((image, index) => (
            <img
              key={index} // Using index might be okay if galleryImages order is stable, otherwise use image.id if available
              src={image.url}
              alt={image.altText || `${product.title} - Image ${index + 1}`}
              style={{
                ...styles.thumbnail,
                ...(mainImage === image.url ? styles.thumbnailActive : {}),
              }}
              className={`thumbnail ${mainImage === image.url ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(image.url)}
            />
          ))}
        </div>
      </div>

      <div style={styles.productInfo} className="product-info">
        <h1 style={styles.productTitle}>{product.title}</h1>
        {/* Assuming subtitle comes from description or a metafield - using placeholder */}
        <p style={styles.productSubtitle}>La silla ergonómica perfecta para tu espacio.</p>

        <div style={styles.productPrice}>
          <span className="price">${selectedVariant.price}</span>
          {selectedVariant.compareAtPrice && (
            <span style={styles.originalPrice} className="original-price">${selectedVariant.compareAtPrice}</span>
          )}
          <span style={{...styles.stockStatus, ...(selectedVariant.available ? styles.available : styles.unavailable)}}>
            {selectedVariant.available ? 'En stock' : 'Agotado'}
          </span>
        </div>

        {product.variants.length > 1 && (
          <div style={styles.variantSelector} className="variant-selector">
            <label htmlFor="variant-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>Variante:</label>
            <select
              id="variant-select"
              value={selectedVariant.id}
              onChange={(e) => handleVariantChange(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px' }}
            >
              {product.variants.map(variant => (
                <option key={variant.id} value={variant.id}>
                  {variant.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={styles.quantitySelector} className="quantity-selector">
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Cantidad:</label>
          <button
            style={styles.quantityBtn}
            className="quantity-btn decrease"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            min="1"
            style={styles.quantityInput}
            className="quantity-input"
            onChange={(e) => handleQuantityChange(e.target.value)}
            readOnly // Prevent direct typing, use buttons
          />
          <button
            style={styles.quantityBtn}
            className="quantity-btn increase"
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            +
          </button>
        </div>

        <div style={styles.productActions} className="product-actions">
          <button
            style={{
                ...styles.addToCartButton,
                ...( !selectedVariant.available ? styles.addToCartButtonDisabled : {} )
            }}
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={!selectedVariant.available}
          >
            {selectedVariant.available ? 'Agregar al carrito' : 'Agotado'}
          </button>
          {/* <button style={styles.secondaryButton} className="secondary-button">Compartir</button> */}
          {/* Share button removed as per plan focus */}
        </div>

        {/* Displaying product description */}
        <div style={styles.productDescription} className="product-description"
             dangerouslySetInnerHTML={{ __html: product.descriptionHtml || '<p>No description available.</p>' }}
        />
      </div>
    </div>
  );
};

export default ProductHeroShowcase;

