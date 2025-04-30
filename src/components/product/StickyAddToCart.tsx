import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import './StickyAddToCart.css';

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
  const { addItem } = useCart();

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
      await addItem(variantId, quantity);
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
          className="sticky-add-to-cart"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="sticky-product-info">
            <div className="sticky-product-image">
              <img src={thumbnailUrl} alt={productTitle} />
            </div>
            <div className="sticky-product-details">
              <h3 className="sticky-product-title">{productTitle}</h3>
              <div className="sticky-product-price">
                <span className="current-price">${price.toFixed(2)}</span>
                {compareAtPrice && compareAtPrice > price && (
                  <span className="compare-price">${compareAtPrice.toFixed(2)}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="sticky-actions">
            <div className="sticky-quantity">
              <button 
                className="quantity-btn minus"
                onClick={() => setQuantity(q => Math.max(1, q-1))}
                disabled={quantity <= 1 || !inStock}
                aria-label="Disminuir cantidad"
              >
                -
              </button>
              <span className="quantity-value">{quantity}</span>
              <button 
                className="quantity-btn plus"
                onClick={() => setQuantity(q => q+1)}
                disabled={!inStock}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
            
            <motion.button 
              className={`sticky-add-btn ${!inStock ? 'out-of-stock' : ''} ${success ? 'success' : ''}`}
              onClick={handleAddToCart}
              disabled={!inStock || addingToCart}
              whileTap={{ scale: 0.95 }}
            >
              {addingToCart ? (
                <span className="loading-dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </span>
              ) : success ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
