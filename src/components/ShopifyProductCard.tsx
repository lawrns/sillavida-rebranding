import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion
import type { ShopifyProduct } from '../types/shopify';
import { useCart } from '../context/CartContext';

// Analytics tracking function (same as in HomePage)
const trackEvent = (eventName: string, eventData: Record<string, any> = {}) => {
  console.log(`[Analytics] ${eventName}:`, eventData);
};

interface ShopifyProductCardProps {
  product: ShopifyProduct;
}

const ShopifyProductCard: React.FC<ShopifyProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Parse the price from string to number
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  
  // Format the price with the currency
  const formattedPrice = price.toLocaleString('es-MX', {
    style: 'currency',
    currency: product.priceRange.minVariantPrice.currencyCode
  });
  
  // Check if there's a compare-at price
  const hasCompareAtPrice = product.compareAtPriceRange?.minVariantPrice?.amount && 
    parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > price;
  
  // Parse and format the compare-at price if it exists
  const compareAtPrice = hasCompareAtPrice ? 
    parseFloat(product.compareAtPriceRange!.minVariantPrice.amount) : 0;
  
  const formattedCompareAtPrice = hasCompareAtPrice ? 
    compareAtPrice.toLocaleString('es-MX', {
      style: 'currency',
      currency: product.compareAtPriceRange!.minVariantPrice.currencyCode
    }) : '';
    
  // Calculate discount percentage if there's a compare-at price
  const discountPercentage = hasCompareAtPrice ? 
    Math.round((1 - (price / compareAtPrice)) * 100) : 0;

  // Default rating for now (could be fetched from Shopify metafields in the future)
  const rating = 4.5;
  
  // Track product impression when component mounts
  useEffect(() => {
    trackEvent('product_impression', {
      product_id: product.id,
      product_name: product.title,
      product_price: price,
      location: 'product_card'
    });
  }, [product.id, product.title, price]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation(); // Stop event propagation
    
    setIsLoading(true);
    setError(null);
    
    // Track add to cart event
    trackEvent('add_to_cart', {
      product_id: product.id,
      product_name: product.title,
      product_price: price,
      quantity: 1
    });
    
    try {
      // Get the variant ID from the product
      let variantId = product.variants?.edges[0]?.node.id;
      
      // Validate that we have a variant ID
      if (!variantId) {
        throw new Error(`No variant ID found for product: ${product.title}`);
      }
      
      // Extract the numeric part from Shopify variant ID if present
      if (variantId.startsWith('gid://shopify/ProductVariant/')) {
        const numericPart = variantId.split('/').pop() || '';
        
        // Check if this is a test product ID that should be converted to a mock variant
        if (['111222333', '444555666', '777888999'].includes(numericPart)) {
          console.log(`[Cart] Converting Shopify variant ID to mock variant ID: ${variantId}`);
          
          // Map specific test IDs to mock variants
          if (numericPart === '111222333') {
            variantId = 'mock-variant-345678901'; // Gamer model
          } else if (numericPart === '444555666') {
            variantId = 'mock-variant-123456789'; // Ergonomic model
          } else if (numericPart === '777888999') {
            variantId = 'mock-variant-567890123'; // Secretarial model
          }
          
          console.log(`[Cart] Converted to mock variant ID: ${variantId}`);
        }
      }
      
      console.log(`[Cart] Adding Shopify product to cart: ${product.title} with variant ID: ${variantId}`);
      
      // Add the item to the cart with retry logic
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          await addItem(variantId, 1);
          console.log(`[Cart] Successfully added Shopify product to cart: ${product.title}`);
          break; // Success, exit the retry loop
        } catch (retryError) {
          retryCount++;
          if (retryCount > maxRetries) {
            throw retryError; // Rethrow the error after max retries
          }
          console.warn(`[Cart] Retry ${retryCount}/${maxRetries} adding to cart: ${product.title}`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
        }
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      
      // Track successful add to cart
      trackEvent('add_to_cart_success', {
        product_id: product.id,
        variant_id: variantId
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('No se pudo agregar al carrito');
      
      // Show more specific error message
      if (error instanceof Error) {
        if (error.message.includes('No variant ID found')) {
          alert(`Cannot add ${product.title} to cart: Missing variant information. Please contact support.`);
        } else if (error.message.includes('no existe')) {
          alert(`Cannot add ${product.title} to cart: Product variant not found in Shopify.`);
        } else {
          alert(`Failed to add ${product.title} to cart: ${error.message}`);
        }
      } else {
        alert(`Failed to add ${product.title} to cart. Please try again.`);
      }
      
      // Track error
      trackEvent('add_to_cart_error', {
        product_id: product.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleProductClick = () => {
    // Track product click
    trackEvent('product_click', {
      product_id: product.id,
      product_name: product.title,
      product_price: price,
      location: 'product_card'
    });
  };

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }
  };

  // Button animation variants
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.98 },
    success: { backgroundColor: "#7D9D8C" } // Sage color
  };

  return (
    <motion.div 
      className="bg-white vida-shape-organic vida-bg-pattern-leaf shadow-md overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ 
        duration: 0.5,
        ease: "easeOut" 
      }}
    >
      <Link to={`/product/${product.handle}`} onClick={handleProductClick}>
        <div className="relative w-full h-48">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <span className="text-gray-400">Cargando...</span>
            </div>
          )}
          {imageError && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Imagen no disponible</span>
            </div>
          )}
          <img 
            src={product.images.edges[0]?.node.url}
            alt={product.images.edges[0]?.node.altText || product.title} 
            className={`w-full h-48 object-cover ${imageLoaded && !imageError ? 'block' : 'hidden'}`}
            loading="lazy"
            onLoad={() => {
              setImageLoaded(true);
              trackEvent('image_loaded', { product_id: product.id });
            }}
            onError={(e) => {
              setImageError(true);
              trackEvent('image_error', { product_id: product.id });
              e.currentTarget.src = '/images/placeholder.png';
              e.currentTarget.onerror = null;
            }}
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
            />
          ))}
          <span className="ml-2 text-sm text-gray-600 font-body">{rating}</span>
        </div>
        <Link to={`/product/${product.handle}`} onClick={handleProductClick}>
          <h3 className="font-heading font-semibold mb-2 hover:text-teal transition-colors product-title">{product.title}</h3>
        </Link>
        
        {/* Feature highlights with Vida theme styling */}
        <ul className="vida-feature-list text-sm text-gray-700 mb-3">
          {product.description
            .split('.')
            .filter(sentence => sentence.trim().length > 0)
            .slice(0, 2)
            .map((feature, index) => (
              <li key={index} className="font-body">{feature.trim()}</li>
            ))}
        </ul>
        <div className="flex items-center gap-2 mb-1">
          <p className="text-xl font-heading font-bold text-teal product-price">
            {formattedPrice}
          </p>
          {hasCompareAtPrice && (
            <p className="text-sm text-gray-500 line-through font-heading">
              {formattedCompareAtPrice}
            </p>
          )}
        </div>
        {hasCompareAtPrice && discountPercentage > 0 && (
          <p className="text-sm font-heading font-semibold text-green-600 mb-2">
            ¡{discountPercentage}% de descuento!
          </p>
        )}
        {error && (
          <div className="text-red-500 text-sm mt-2 mb-2 font-body">{error}</div>
        )}
        <motion.button 
          onClick={handleAddToCart}
          disabled={isLoading}
          aria-label={`Agregar ${product.title} al carrito`}
          className={`w-full mt-4 py-3 vida-shape-soft text-white font-heading font-semibold tracking-wide ${
            success 
              ? 'bg-sage' 
              : 'bg-teal'
          }`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          animate={success ? "success" : ""}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Agregando...
            </span>
          ) : success ? '¡Agregado!' : 'Invierte en tu bienestar'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ShopifyProductCard;
