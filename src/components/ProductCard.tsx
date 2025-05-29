import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Chair } from '../data/chairs';
import { useAddToCart } from '../hooks/useMinimalCart';
import { useEventBus, createProductComponent } from '../hooks/useComponentComposition';
import LazyImage from './LazyImage';
import { PreviewBadge } from './judgeMe';
import { handleProductError } from '../utils/errorHandler';
import { getProductPriceDisplay } from '../utils/business/priceFormatter';
import { generateVariantId, transformMockProduct } from '../utils/business/productTransformer';

// Legacy function replaced by centralized utility
// Now uses generateVariantId from productTransformer

interface ProductCardProps {
  chair: Chair;
}

// Base ProductCard component with decoupled patterns
const BaseProductCard: React.FC<ProductCardProps> = ({ chair }) => {
  const { addToCart: addToCartMinimal, isLoading: cartLoading } = useAddToCart();
  const eventBus = useEventBus();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // Combine local and cart loading states
  const combinedLoading = isLoading || cartLoading;

  // Use centralized price formatting
  const priceDisplay = getProductPriceDisplay(
    { amount: chair.price, currencyCode: 'MXN' },
    chair.compareAtPrice ? { amount: chair.compareAtPrice, currencyCode: 'MXN' } : undefined
  );

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation(); // Stop event propagation
    
    setIsLoading(true);
    
    // Emit event for product tracking
    eventBus.emit('product:addToCart:start', {
      product_id: chair.id,
      product_name: chair.name,
      product_price: chair.price,
      quantity: 1,
      type: 'mock'
    });
    
    try {
      // Generate a variant ID from the chair ID using centralized utility
      const variantId = generateVariantId({ id: chair.id });
      
      // Use the minimal cart interface
      await addToCartMinimal(variantId, 1);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      
      // Emit success event
      eventBus.emit('product:addToCart:success', {
        product_id: chair.id,
        variant_id: variantId,
        type: 'mock'
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Use standardized error handling
      await handleProductError(`Failed to add ${chair.name} to cart`, { component: 'ProductCard', action: 'addToCart' });
      
      // Emit error event
      eventBus.emit('product:addToCart:error', {
        product_id: chair.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        type: 'mock'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    // Wrap the Link with motion.div for animation
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible" // Animate directly on mount for simplicity
      transition={{ duration: 0.5, ease: "easeOut" }} 
      className="block" // Apply block display to the motion div
    >
      <Link to={`/product/${chair.id}`} className="block"> {/* Link remains block inside motion div */}
        <div className="bg-white border border-neutral-100 rounded-md shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"> {/* Updated to match Hbada aesthetic */}
          <LazyImage
            src={chair.image}
            alt={chair.name}
            className="w-full h-48 object-contain p-2"
            quality={85}
          />
        <div className="p-3">
          <h3 className="font-heading font-medium text-sm mb-1 hover:text-black transition-colors product-title">{chair.name}</h3>
          
          <PreviewBadge 
            productId={generateVariantId({ id: chair.id }).replace('variant-', '')}
            containerClassName="mt-1 mb-1"
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
                Ahorra {priceDisplay.discount}
              </p>
            )}
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddToCart}
              disabled={combinedLoading}
              className={`flex-1 py-2 px-3 rounded-sm text-white text-xs font-heading font-semibold tracking-wide ${
                success 
                  ? 'bg-black/80 hover:bg-black/70' 
                  : 'bg-black hover:bg-black/90'
                }`}
              aria-label={combinedLoading ? 'Agregando al carrito' : success ? 'Agregado al carrito' : `Agregar ${chair.name} al carrito`}
            >
              {combinedLoading ? 'Añadir...' : success ? 'Añadido' : 'Comprar'}
            </button>
            
            <Link 
              to={`/product/${chair.id}`}
              className="py-2 px-3 border border-black rounded-sm text-xs font-heading font-semibold text-black text-center"
              onClick={(e) => e.stopPropagation()} // Prevent the main card's Link from activating
            >
              Ver
            </Link>
          </div>
        </div> {/* This is the closing div for p-4 */}
      </div> {/* This is the closing div for bg-white */}
    </Link>
    </motion.div>
  );
};

// Create the composed ProductCard with dependency injection
const ProductCard = createProductComponent(BaseProductCard);

export default ProductCard;
