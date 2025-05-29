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

  // Use centralized price formatting
  const priceDisplay = getProductPriceDisplay(
    {
      amount: product.priceRange.minVariantPrice.amount,
      currencyCode: product.priceRange.minVariantPrice.currencyCode
    },
    product.compareAtPriceRange?.minVariantPrice ? {
      amount: product.compareAtPriceRange.minVariantPrice.amount,
      currencyCode: product.compareAtPriceRange.minVariantPrice.currencyCode
    } : undefined
  );

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
      className="bg-white border border-neutral-100 rounded-md shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
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
          className="relative w-full h-72 overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
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
      <div className="p-3">
        <Link to={`/product/${product.handle}`} onClick={handleProductClick}>
          <h3 className="font-heading font-medium text-sm mb-1 text-[#000000] hover:text-black transition-colors product-title">{product.title}</h3>
        </Link>

        <PreviewBadge
          productId={product.id.split('/').pop() || ''}
          containerClassName="mt-1 mb-2"
        />

        <div className="flex flex-col mb-2 mt-1">
          <div className="flex items-baseline gap-2">
            <p className="text-base font-heading font-bold text-black product-price">
              {priceDisplay.price}
            </p>
            {priceDisplay.isOnSale && priceDisplay.originalPrice && (
              <p className="text-xs text-gray-500 line-through font-heading">
                {priceDisplay.originalPrice}
              </p>
            )}
          </div>
          {priceDisplay.isOnSale && priceDisplay.discount && (
            <p className="text-xs font-heading font-semibold text-red-500">
              {priceDisplay.discount}
            </p>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-xs mt-1 mb-1 font-body">{error}</div>
        )}

        {/* Buttons removed as requested */}
      </div>
    </motion.div>
  );
};

export default ShopifyProductCard;
