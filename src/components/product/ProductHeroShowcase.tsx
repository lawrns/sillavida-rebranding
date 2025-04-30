import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import './ProductHeroShowcase.css';

interface ProductHeroShowcaseProps {
  product: any;
  useCart: any;
}

const ProductHeroShowcase: React.FC<ProductHeroShowcaseProps> = ({ product, useCart }) => {
  // Initialize state with the first variant if available
  const initialVariant = product.variants?.edges && product.variants.edges.length > 0 
    ? product.variants.edges[0].node 
    : null;
  
  const [selectedVariant, setSelectedVariant] = useState(initialVariant);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  // Get the addItem function from the passed useCart object
  const { addItem } = useCart;

  // Set initial main image when product loads
  useEffect(() => {
    if (product.images?.edges && product.images.edges.length > 0) {
      setMainImage(product.images.edges[0].node.url);
    }
  }, [product]);

  // Ensure selectedVariant is updated if product changes
  useEffect(() => {
    if (!selectedVariant && product.variants?.edges && product.variants.edges.length > 0) {
      setSelectedVariant(product.variants.edges[0].node);
    }
  }, [product, selectedVariant]);

  const handleVariantChange = (variantId: string) => {
    const variant = product.variants.edges.find((v: any) => v.node.id === variantId)?.node;
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, parseInt(value.toString()) || 1);
    setQuantity(newQuantity);
  };

  const handleThumbnailClick = (imageUrl: string) => {
    setMainImage(imageUrl);
  };

  const handleAddToCart = async () => {
    if (selectedVariant && selectedVariant.availableForSale) {
      setAddingToCart(true);
      try {
        console.log('Adding to cart:', selectedVariant.id, quantity);
        await addItem(selectedVariant.id, quantity);
        setCartSuccess(true);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setCartSuccess(false);
        }, 3000);
      } catch (error) {
        console.error('Error adding item to cart:', error);
        alert('Hubo un error al agregar el producto al carrito. Por favor, inténtalo de nuevo.');
      } finally {
        setAddingToCart(false);
      }
    } else {
      console.warn('Attempted to add unavailable variant to cart');
      alert('Este producto o variante no está disponible actualmente.');
    }
  };

  // Filter images for the thumbnail gallery, excluding feature/spec images
  const featurePrefix = 'feature-';
  const specPrefix = 'spec-';
  const galleryImages = (product.images?.edges || []).filter((image: any) => {
    const altText = image.node.altText || '';
    return !altText.startsWith(featurePrefix) && !altText.startsWith(specPrefix);
  });

  // Format price with currency
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Calculate price from the selected variant
  let price = 0;
  if (selectedVariant && selectedVariant.price && selectedVariant.price.amount) {
    price = parseFloat(selectedVariant.price.amount);
  } else if (product.priceRange?.minVariantPrice?.amount) {
    price = parseFloat(product.priceRange.minVariantPrice.amount);
  }
  
  // Calculate compare at price
  let compareAtPrice;
  if (selectedVariant && selectedVariant.compareAtPrice && selectedVariant.compareAtPrice.amount) {
    compareAtPrice = parseFloat(selectedVariant.compareAtPrice.amount);
  } else if (product.compareAtPriceRange?.minVariantPrice?.amount) {
    compareAtPrice = parseFloat(product.compareAtPriceRange.minVariantPrice.amount);
  }

  const discount = compareAtPrice && compareAtPrice > price ? Math.round((1 - price / compareAtPrice) * 100) : 0;
  const isAvailable = selectedVariant?.availableForSale || false;

  // If no main image is set yet, use a placeholder
  const displayMainImage = mainImage || '/images/placeholder.jpg';

  return (
    <div className="product-hero-showcase">
      <div className="product-gallery">
        <div className="main-image-container">
          {displayMainImage && (
            <img 
              src={displayMainImage} 
              alt={product.title} 
              className="main-image"
            />
          )}
          {discount > 0 && (
            <div className="discount-badge">
              -{discount}%
            </div>
          )}
        </div>
        
        <div className="thumbnail-gallery">
          {galleryImages.map((image: any, index: number) => (
            <div 
              key={index}
              className={`thumbnail ${mainImage === image.node.url ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(image.node.url)}
            >
              <img 
                src={image.node.url} 
                alt={image.node.altText || `${product.title} - Vista ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="product-info">
        <h1 className="product-title">{product.title}</h1>
        
        <div className="product-subtitle">
          {product.description?.split('.')[0] || 'Invierte en tu bienestar'}
        </div>
        
        <div className="product-price">
          {formatPrice(price)}
          {compareAtPrice && compareAtPrice > price && (
            <span className="original-price">{formatPrice(compareAtPrice)}</span>
          )}
          <span className={`stock-status ${isAvailable ? 'available' : 'unavailable'}`}>
            {isAvailable ? 'En stock' : 'Agotado'}
          </span>
        </div>
        
        {product.variants?.edges.length > 1 && (
          <div className="variant-selector">
            <label>Variante:</label>
            <div className="variant-options">
              {product.variants.edges.map((variant: any) => (
                <button
                  key={variant.node.id}
                  className={`variant-option ${selectedVariant?.id === variant.node.id ? 'selected' : ''}`}
                  onClick={() => handleVariantChange(variant.node.id)}
                  disabled={!variant.node.availableForSale}
                >
                  {variant.node.title}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="product-purchase-container">
          <div className="quantity-selector">
            <label>Cantidad:</label>
            <div className="quantity-controls">
              <button 
                className="quantity-btn"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                aria-label="Disminuir cantidad"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                className="quantity-input"
                aria-label="Cantidad"
              />
              <button 
                className="quantity-btn"
                onClick={() => handleQuantityChange(quantity + 1)}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="product-actions">
            <button
              className={`add-to-cart-button ${!isAvailable ? 'disabled' : ''} ${addingToCart ? 'loading' : ''}`}
              onClick={handleAddToCart}
              disabled={!isAvailable || addingToCart}
            >
              {addingToCart ? 'Agregando...' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
        
        {cartSuccess && (
          <motion.div 
            className="cart-success"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Check size={20} />
            <span>¡Producto agregado al carrito!</span>
          </motion.div>
        )}
        
        <div className="product-description" 
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml || '' }} 
        />
      </div>
    </div>
  );
};

export default ProductHeroShowcase;
