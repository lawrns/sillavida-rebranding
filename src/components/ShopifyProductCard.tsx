import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion
import type { ShopifyProduct } from '../types/shopify';
import { useAddToCart } from '../hooks/useMinimalCart';
import { useEventBus } from '../hooks/useComponentComposition';
import { PreviewBadge } from './judgeMe';
import { handleProductError } from '../utils/errorHandler';
import { getProductPriceDisplay } from '../utils/business/priceFormatter';
import { transformShopifyProduct, generateVariantId } from '../utils/business/productTransformer';

// Analytics tracking function (same as in HomePage)
const trackEvent = (eventName: string, eventData: Record<string, any> = {}) => {
  console.log(`[Analytics] ${eventName}:`, eventData);
};

interface ShopifyProductCardProps {
  product: ShopifyProduct;
  hideDescription?: boolean;
}

const ShopifyProductCard: React.FC<ShopifyProductCardProps> = ({ product }) => {
  const { addToCart: addToCartMinimal, isLoading: cartLoading } = useAddToCart();
  const eventBus = useEventBus();
  const [isLoading, setIsLoading] = useState(false);
  // Combine local and cart loading states
  const combinedLoading = isLoading || cartLoading;
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [secondImageLoaded, setSecondImageLoaded] = useState(false);

  // Get variant-level pricing (like HeroSlider does)
  const variant = product.variants?.edges[0]?.node;
  const currentPrice = {
    amount: product.priceRange.minVariantPrice.amount,
    currencyCode: product.priceRange.minVariantPrice.currencyCode
  };
  
  // Use variant compareAtPrice if available (this is where Shopify stores sale prices)
  const compareAtPrice = variant?.compareAtPrice ? {
    amount: variant.compareAtPrice.amount,
    currencyCode: variant.compareAtPrice.currencyCode
  } : undefined;

  // Use centralized price formatting with variant-level compareAtPrice
  const priceDisplay = getProductPriceDisplay(currentPrice, compareAtPrice);

  // Parse price for analytics (keep backward compatibility)
  const price = parseFloat(product.priceRange.minVariantPrice.amount);

  // Get primary and hover images
  const primaryImage = product.images.edges[0]?.node;
  const hoverImage = product.images.edges[1]?.node;
  const hasHoverImage = !!hoverImage;



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

    // Emit event for product tracking
    eventBus.emit('product:addToCart:start', {
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

      // Use Shopify variant ID directly - no conversion needed
      // This eliminates hybrid logic and simplifies cart handling

      // Use the minimal cart interface
      await addToCartMinimal(variantId, 1);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);

      // Emit success event
      eventBus.emit('product:addToCart:success', {
        product_id: product.id,
        variant_id: variantId
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('No se pudo agregar al carrito');

      // Use standardized error handling
      if (error instanceof Error) {
        if (error.message.includes('No variant ID found')) {
          await handleProductError(`Cannot add ${product.title} to cart: Missing variant information`, { component: 'ShopifyProductCard', action: 'addToCart' });
        } else if (error.message.includes('no existe')) {
          await handleProductError(`Cannot add ${product.title} to cart: Product variant not found`, { component: 'ShopifyProductCard', action: 'addToCart' });
        } else {
          await handleProductError(`Failed to add ${product.title} to cart: ${error.message}`, { component: 'ShopifyProductCard', action: 'addToCart' });
        }
      } else {
        await handleProductError(`Failed to add ${product.title} to cart`, { component: 'ShopifyProductCard', action: 'addToCart' });
      }

      // Emit error event
      eventBus.emit('product:addToCart:error', {
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
    success: { backgroundColor: "#EB281B" } // Red accent color
  };

  return (
    <motion.div
      className="bg-white border border-neutral-100 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col"
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
        <div 
          className="relative w-full h-72 overflow-hidden rounded-t-lg"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Sale Badge */}
          {priceDisplay.isOnSale && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
              SALE
            </div>
          )}

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
          
          {/* Primary Image */}
          <img
            src={primaryImage?.url}
            alt={primaryImage?.altText || product.title}
            className={`absolute inset-0 w-full h-72 object-cover object-center transition-opacity duration-300 ${
              imageLoaded && !imageError ? 'opacity-100' : 'opacity-0'
            } ${isHovered && hasHoverImage && secondImageLoaded ? 'opacity-0' : 'opacity-100'}`}
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
          
          {/* Hover Image (Second Image) */}
          {hasHoverImage && (
            <img
              src={hoverImage.url}
              alt={hoverImage.altText || `${product.title} - Vista 2`}
              className={`absolute inset-0 w-full h-72 object-cover object-center transition-opacity duration-300 ${
                isHovered && secondImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={() => {
                setSecondImageLoaded(true);
                trackEvent('hover_image_loaded', { product_id: product.id });
              }}
              onError={(e) => {
                console.warn('Hover image failed to load for product:', product.id);
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>
      </Link>
      <div className="p-4">
        {/* Star Rating with Review Count */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400">
            {"★★★★★".split("").map((star, index) => (
              <span key={index} className="text-sm">{star}</span>
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-1">(127)</span>
        </div>

        {/* Product Title */}
        <Link to={`/product/${product.handle}`} onClick={handleProductClick}>
          <h3 className="font-semibold text-lg mb-2 text-gray-900 hover:text-black transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Product Description */}
        <p className="text-gray-600 text-sm mb-3 leading-relaxed" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.description || "Premium ergonomic design for enhanced comfort and productivity"}
        </p>

        {/* Pricing - Matching Screenshot 14 style */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="text-xl font-bold text-black">
            {priceDisplay.price}
          </span>
          {priceDisplay.isOnSale && priceDisplay.originalPrice && (
            <>
              <span className="text-base text-gray-400 line-through font-normal">
                {priceDisplay.originalPrice}
              </span>
              {priceDisplay.discount && (
                <span className="text-sm font-medium text-white bg-red-500 px-2 py-1 rounded">
                  {priceDisplay.discount}
                </span>
              )}
            </>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={combinedLoading}
          className={`w-full py-2 px-4 text-white font-medium rounded transition-all text-sm ${
            combinedLoading
              ? 'bg-gray-300 cursor-not-allowed'
              : success
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-black hover:bg-gray-800'
          }`}
        >
          {combinedLoading ? 'Agregando...' : success ? '¡Agregado!' : 'Agregar al carrito'}
        </button>

        {error && (
          <div className="text-red-500 text-xs mt-2">{error}</div>
        )}
      </div>
    </motion.div>
  );
};

export default ShopifyProductCard;
