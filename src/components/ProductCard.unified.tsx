import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAddToCart } from '../hooks/useMinimalCart';
import { useEventBus } from '../hooks/useComponentComposition';
import LazyImage from './LazyImage';
import { PreviewBadge } from './judgeMe';
import { handleProductError } from '../utils/errorHandler';
import { getProductPriceDisplay } from '../utils/business/priceFormatter';

/**
 * Unified Product Interface
 * Standardizes data from different sources (Mock, Shopify, etc.)
 */
export interface UnifiedProduct {
  id: string;
  title: string;
  handle: string;
  price: {
    amount: string | number;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string | number;
    currencyCode: string;
  };
  image: {
    url: string;
    altText?: string;
  };
  variantId: string;
  source: 'mock' | 'shopify' | 'simple';
}

interface UnifiedProductCardProps {
  product: UnifiedProduct;
  variant?: 'card' | 'showcase' | 'simple';
  hideDescription?: boolean;
  showButtons?: boolean;
}

/**
 * Unified ProductCard Component
 * 
 * Replaces ProductCard.tsx, ShopifyProductCard.tsx, and ProductCardSimple.tsx
 * with a single, consistent implementation that handles all data sources.
 */
const UnifiedProductCard: React.FC<UnifiedProductCardProps> = ({ 
  product, 
  variant = 'card',
  showButtons = true 
}) => {
  const { addToCart: addToCartMinimal, isLoading: cartLoading } = useAddToCart();
  const eventBus = useEventBus();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const combinedLoading = isLoading || cartLoading;

  // Use centralized price formatting
  const priceDisplay = getProductPriceDisplay(
    product.price,
    product.compareAtPrice
  );

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    setError(null);

    // Emit event for tracking
    eventBus.emit('product:addToCart:start', {
      product_id: product.id,
      product_name: product.title,
      product_price: product.price.amount,
      quantity: 1,
      source: product.source
    });

    try {
      // Use the variant ID directly - no conversion needed
      await addToCartMinimal(product.variantId, 1);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);

      eventBus.emit('product:addToCart:success', {
        product_id: product.id,
        variant_id: product.variantId,
        source: product.source
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError('No se pudo agregar al carrito');

      await handleProductError(
        `Failed to add ${product.title} to cart: ${errorMessage}`, 
        { component: 'UnifiedProductCard', action: 'addToCart', source: product.source }
      );

      eventBus.emit('product:addToCart:error', {
        product_id: product.id,
        error: errorMessage,
        source: product.source
      });

      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = () => {
    eventBus.emit('product:click', {
      product_id: product.id,
      product_name: product.title,
      source: product.source
    });
  };

  // Simple variant for basic display
  if (variant === 'simple') {
    return (
      <div className="relative overflow-hidden rounded-md border border-neutral-100 shadow-sm hover:shadow-md transition-shadow bg-white">
        <div className="p-6">
          <h3 className="text-2xl font-heading font-bold mb-6 text-black">
            {product.title}
          </h3>
          
          <div className="flex items-center justify-between mb-6">
            <img 
              src={product.image.url} 
              alt={product.image.altText || product.title}
              className="w-32 h-32 object-contain"
            />
            
            <span className="text-2xl font-heading font-bold text-black">
              {priceDisplay.price}
            </span>
          </div>
          
          <Link to={`/product/${product.handle}`}>
            <button className="w-full py-3 bg-black text-white rounded-md font-heading font-semibold hover:bg-black/90 transition-colors">
              Ver Producto
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Standard card variant
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }
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
        <div className="relative w-full h-72 overflow-hidden">
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
          {product.source === 'mock' ? (
            <LazyImage
              src={product.image.url}
              alt={product.image.altText || product.title}
              className={`w-full h-72 object-contain p-2 ${imageLoaded && !imageError ? 'block' : 'hidden'}`}
              quality={85}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <img
              src={product.image.url}
              alt={product.image.altText || product.title}
              className={`w-full h-72 object-cover object-center ${imageLoaded && !imageError ? 'block' : 'hidden'}`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                setImageError(true);
                e.currentTarget.src = '/images/placeholder.png';
                e.currentTarget.onerror = null;
              }}
            />
          )}
        </div>
      </Link>
      
      <div className="p-3">
        <Link to={`/product/${product.handle}`} onClick={handleProductClick}>
          <h3 className="font-heading font-medium text-sm mb-1 text-[#000000] hover:text-black transition-colors product-title">
            {product.title}
          </h3>
        </Link>

        <PreviewBadge
          productId={product.id.split('/').pop() || product.id}
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
              {product.source === 'mock' ? 'Ahorra ' : ''}{priceDisplay.discount}
            </p>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-xs mt-1 mb-1 font-body">{error}</div>
        )}

        {showButtons && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddToCart}
              disabled={combinedLoading}
              className={`flex-1 py-2 px-3 rounded-sm text-white text-xs font-heading font-semibold tracking-wide ${
                success 
                  ? 'bg-black/80 hover:bg-black/70' 
                  : 'bg-black hover:bg-black/90'
              }`}
              aria-label={combinedLoading ? 'Agregando al carrito' : success ? 'Agregado al carrito' : `Agregar ${product.title} al carrito`}
            >
              {combinedLoading ? 'Añadir...' : success ? 'Añadido' : 'Comprar'}
            </button>
            
            <Link 
              to={`/product/${product.handle}`}
              className="py-2 px-3 border border-black rounded-sm text-xs font-heading font-semibold text-black text-center"
              onClick={(e) => e.stopPropagation()}
            >
              Ver
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UnifiedProductCard;