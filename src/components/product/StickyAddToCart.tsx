import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

interface StickyAddToCartProps {
  productTitle: string;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  variantId: string;
  thumbnailUrl: string;
}

const StickyAddToCart: React.FC<StickyAddToCartProps> = ({
  productTitle,
  price,
  compareAtPrice,
  inStock,
  variantId,
  thumbnailUrl
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addToCart } = useCart();

  // Show the sticky bar when scrolling down past a certain point
  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past the hero section (approx 500px)
      const scrollPosition = window.scrollY;
      const shouldShow = scrollPosition > 500;
      
      if (shouldShow !== isVisible) {
        setIsVisible(shouldShow);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!inStock || addingToCart) return;
    
    setAddingToCart(true);
    
    try {
      await addToCart(variantId, quantity);
      setSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 bg-white py-3 px-4 shadow-lg flex items-center justify-between z-50 md:max-w-[500px] md:left-auto md:right-5 md:bottom-5 md:rounded-lg"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="flex items-center flex-1 min-w-0">
            <div className="w-[50px] h-[50px] rounded overflow-hidden mr-3 flex-shrink-0 bg-neutral-50">
              <img src={thumbnailUrl} alt={productTitle} className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-black mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{productTitle}</h3>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-accent">${price.toFixed(2)}</span>
                {compareAtPrice && compareAtPrice > price && (
                  <span className="text-sm text-neutral-500 line-through">${compareAtPrice.toFixed(2)}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-neutral-200 rounded overflow-hidden">
              <button 
                className="w-8 h-8 flex items-center justify-center bg-neutral-50 border-0 cursor-pointer text-base font-semibold text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setQuantity(q => Math.max(1, q-1))}
                disabled={quantity <= 1 || !inStock}
                aria-label="Disminuir cantidad"
              >
                -
              </button>
              <span className="w-8 h-8 flex items-center justify-center text-sm font-medium text-black">
                {quantity}
              </span>
              <button 
                className="w-8 h-8 flex items-center justify-center bg-neutral-50 border-0 cursor-pointer text-base font-semibold text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setQuantity(q => q+1)}
                disabled={!inStock}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
            
            <motion.button 
              className={`bg-black text-white border-0 rounded px-4 h-10 text-sm font-semibold cursor-pointer transition-colors flex items-center justify-center min-w-[140px] 
                ${!inStock ? 'bg-neutral-400' : ''} 
                ${success ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-gray-800'} 
                disabled:cursor-not-allowed`}
              onClick={handleAddToCart}
              disabled={!inStock || addingToCart}
              whileTap={{ scale: 0.95 }}
            >
              {addingToCart ? (
                <span className="flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0ms]"></span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:200ms]"></span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:400ms]"></span>
                </span>
              ) : success ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>¡Agregado!</span>
                </>
              ) : !inStock ? (
                'Agotado'
              ) : (
                'Agregar al carrito'
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyAddToCart;
