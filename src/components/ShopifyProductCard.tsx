import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ShopifyProduct } from '../types/shopify';
import { useCart } from '../context/CartContext';

// Analytics tracking function (same as in HomePage)
const trackEvent = (eventName: string, eventData: Record<string, any> = {}) => {
  console.log(`[Analytics] ${eventName}:`, eventData);
};

// Generate a Shopify-compatible variant ID from the product ID
// This ensures we have a consistent format that matches Shopify API expectations
const generateVariantId = (productId: string): string => {
  // Create a deterministic numeric ID based on the product ID
  // In a real implementation, this would be the actual Shopify variant ID
  const numericId = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * 1000;
  return `gid://shopify/ProductVariant/${numericId}`;
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
      // Try to get the variant ID from the product
      let variantId = product.variants?.edges[0]?.node.id;
      
      // If no variant ID is found, generate one from the product ID
      if (!variantId) {
        console.warn('No variant ID found for product:', product.title);
        variantId = generateVariantId(product.id);
        console.log(`[Cart] Generated variant ID: ${variantId} for product: ${product.title}`);
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
      
      // Show error message to user
      alert(`Failed to add ${product.title} to cart. Please try again.`);
      
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
          <span className="ml-2 text-sm text-gray-600">{rating}</span>
        </div>
        <Link to={`/product/${product.handle}`} onClick={handleProductClick}>
          <h3 className="font-semibold mb-2 hover:text-red-600 transition-colors">{product.title}</h3>
        </Link>
        <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-2 mb-1">
          <p className="text-xl font-bold text-red-600">
            {formattedPrice}
          </p>
          {hasCompareAtPrice && (
            <p className="text-sm text-gray-500 line-through">
              {formattedCompareAtPrice}
            </p>
          )}
        </div>
        {hasCompareAtPrice && discountPercentage > 0 && (
          <p className="text-sm font-semibold text-green-600 mb-2">
            ¡{discountPercentage}% de descuento!
          </p>
        )}
        {error && (
          <div className="text-red-500 text-sm mt-2 mb-2">{error}</div>
        )}
        <button 
          onClick={handleAddToCart}
          disabled={isLoading}
          aria-label={`Agregar ${product.title} al carrito`}
          className={`w-full mt-4 py-2 rounded transition-colors ${
            success 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {isLoading ? 'Agregando...' : success ? '¡Agregado!' : 'Agregar al Carrito'}
        </button>
      </div>
    </div>
  );
};

export default ShopifyProductCard;
