import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMinimalCart } from '../hooks/useMinimalCart';
import {
  CartItem,
  CartHeader,
  CartEmptyState,
  CartLoadingState,
  CartFooter
} from './cart';

/**
 * MiniCart - Isolated cart panel component using composition pattern
 * 
 * This component has been decoupled to use:
 * - Minimal cart interface instead of full cart context
 * - Composed child components for each section
 * - Lazy loading for better performance
 * - Event-driven communication for analytics
 * 
 * Benefits:
 * - Reduced coupling to cart context
 * - Better testability through composition
 * - Easier to maintain and extend
 * - Performance optimized with lazy loading
 */

const MiniCart: React.FC = () => {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    cartTotal,
    cartCount,
    updateItem,
    removeItem,
    isLoading,
    cart,
    cartId
  } = useMinimalCart();

  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isCartOpen) {
      if (!isCartLoaded) {
        setIsCartLoaded(true);
      }
    }
  }, [isCartOpen, cartItems, cartCount, cartTotal, cart, cartId, isLoading, isCartLoaded]);

  /**
   * Handles the checkout process by closing the cart and navigating to checkout page.
   */
  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  /**
   * Handles closing cart and continuing shopping
   */
  const handleContinueShopping = () => {
    closeCart();
  };

  /**
   * Framer Motion animation variants for the cart backdrop overlay.
   */
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2, delay: 0.1 } }
  };

  /**
   * Framer Motion animation variants for the cart panel slide animation.
   */
  const cartVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { type: 'tween', duration: 0.3, ease: 'easeOut' } },
    exit: { x: '100%', transition: { type: 'tween', duration: 0.2 } }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] isolate">
      {/* Background overlay */}
      <motion.div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[9999]"
        onClick={closeCart}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      />

      {/* Cart panel */}
      <div className="fixed inset-y-0 right-0 max-w-md z-[9999]">
        <motion.div
          className="w-screen max-w-md h-full flex flex-col"
          variants={cartVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ 
            backgroundColor: '#FFFFFF', 
            borderTopLeftRadius: '0.5rem', 
            borderBottomLeftRadius: '0.5rem', 
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' 
          }}
        >
          <div className="flex flex-col h-full min-h-[500px] bg-white" style={{ borderTopLeftRadius: '0.5rem', borderBottomLeftRadius: '0.5rem' }}>
            {/* Header */}
            <CartHeader onClose={closeCart} />

            {/* Cart content - scrollable */}
            <div className="flex-1 overflow-auto bg-white min-h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full p-4">
                  <CartLoadingState />
                </div>
              ) : cartItems.length === 0 ? (
                <div className="flex items-center justify-center h-full p-4">
                  <CartEmptyState onContinueShopping={handleContinueShopping} />
                </div>
              ) : (
                <div className="p-4">
                  <ul>
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        isLoading={isLoading}
                        onQuantityChange={updateItem}
                        onRemove={removeItem}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer with totals and checkout button */}
            <CartFooter
              cartTotal={cartTotal}
              cartItems={cartItems}
              cart={cart}
              isLoading={isLoading}
              onCheckout={handleCheckout}
              onCloseCart={closeCart}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MiniCart;