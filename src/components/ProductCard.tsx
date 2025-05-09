import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Chair } from '../data/chairs';
import { useCart } from '../context/CartContext';
import LazyImage from './LazyImage';
import { PreviewBadge } from './judgeMe';

// Generate a stable Shopify-compatible mock variant ID from the chair ID
// For demonstration purposes - generates a consistent test ID
const generateVariantId = (chairId: string): string => {
  // For testing purposes, generate a predictable ID based on the chair ID
  // In a real implementation, this would be the actual Shopify variant ID
  
  // Use a fixed numeric ID based on the number of chairs we have
  // This avoids errors with trying to reference non-existent Shopify variants
  let mockId = "";
  
  // Map known chair IDs to fixed test variant IDs
  // In a real implementation, this would come from the actual Shopify data
  if (chairId === "ergonomic") mockId = "123456789";
  else if (chairId === "executive") mockId = "234567890";
  else if (chairId === "gamer") mockId = "345678901";
  else if (chairId === "visitor") mockId = "456789012";
  else if (chairId === "secretarial") mockId = "567890123";
  else if (chairId === "gamer2") mockId = "678901234";
  else if (chairId === "accessory") mockId = "789012345";
  else {
    // Generate a deterministic but consistent ID for any other chairs
    mockId = chairId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString();
  }
  
  return `mock-variant-${mockId}`;
};

interface ProductCardProps {
  chair: Chair;
}

const ProductCard: React.FC<ProductCardProps> = ({ chair }) => {
  const { addItem } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation(); // Stop event propagation
    
    setIsLoading(true);
    try {
      // Generate a Shopify variant ID from the chair ID
      const variantId = generateVariantId(chair.id);
      
      console.log(`[Cart] Adding item to cart: ${chair.name} (${chair.id})`);
      console.log(`[Cart] Using mock variant ID: ${variantId}`);
      
      // Add the item to the cart with retry logic
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          await addItem(variantId, 1);
          console.log(`[Cart] Successfully added item to cart: ${chair.name}`);
          break; // Success, exit the retry loop
        } catch (retryError) {
          retryCount++;
          if (retryCount > maxRetries) {
            throw retryError; // Rethrow the error after max retries
          }
          console.warn(`[Cart] Retry ${retryCount}/${maxRetries} adding to cart: ${chair.name}`);
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
        }
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Show error message to user
      alert(`Failed to add ${chair.name} to cart. Please try again.`);
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
            productId={generateVariantId(chair.id).replace('mock-variant-', '')}
            containerClassName="mt-1 mb-1"
          />
          
          <div className="flex flex-col mb-2 mt-1">
            <div className="flex items-baseline gap-2">
              <p className="text-base font-heading font-bold text-black product-price">
                ${chair.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
              </p>
              {chair.compareAtPrice && chair.compareAtPrice > chair.price && (
                <p className="text-xs text-gray-500 line-through font-heading">
                  ${chair.compareAtPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                </p>
              )}
            </div>
            {chair.compareAtPrice && chair.compareAtPrice > chair.price && (
              <p className="text-xs font-heading font-semibold text-red-500">
                Ahorra {Math.round(100 - (chair.price / chair.compareAtPrice) * 100)}%
              </p>
            )}
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className={`flex-1 py-2 px-3 rounded-sm text-white text-xs font-heading font-semibold tracking-wide ${
                success 
                  ? 'bg-black/80 hover:bg-black/70' 
                  : 'bg-black hover:bg-black/90'
                }`}
              aria-label={isLoading ? 'Agregando al carrito' : success ? 'Agregado al carrito' : `Agregar ${chair.name} al carrito`}
            >
              {isLoading ? 'Añadir...' : success ? 'Añadido' : 'Comprar'}
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

export default ProductCard;
