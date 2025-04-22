import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, AlertCircle, ChevronRight } from 'lucide-react';
import TrustIndicator from './TrustIndicator';
import { useCart } from '../context/CartContext';

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
  } = useCart();
  
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Helper functions for the free shipping calculation
  const calculateProgressPercentage = () => {
    if (!cartItems.length) return 0;
    
    let subtotal = 0;
    if (cart?.cost?.subtotalAmount?.amount) {
      subtotal = parseFloat(cart.cost.subtotalAmount.amount);
    } else if (cartTotal) {
      // Extract the numeric value from the formatted currency string
      subtotal = parseFloat(cartTotal.replace(/[^\d.-]/g, ''));
    } else {
      // Calculate from cart items if needed
      subtotal = cartItems.reduce((sum, item) => {
        return sum + (parseFloat(item.price.amount) * item.quantity);
      }, 0);
    }
    
    return Math.min(100, (subtotal / 10000) * 100);
  };
  
  const formatRemainingAmount = () => {
    if (!cartItems.length) return "$0.00";
    
    let subtotal = 0;
    let currencyCode = 'MXN';
    
    if (cart?.cost?.subtotalAmount?.amount) {
      subtotal = parseFloat(cart.cost.subtotalAmount.amount);
      currencyCode = cart.cost.subtotalAmount.currencyCode;
    } else if (cartTotal) {
      // Extract the numeric value from the formatted currency string
      subtotal = parseFloat(cartTotal.replace(/[^\d.-]/g, ''));
    } else {
      // Calculate from cart items
      subtotal = cartItems.reduce((sum, item) => {
        currencyCode = item.price.currencyCode; // Use currency from first item
        return sum + (parseFloat(item.price.amount) * item.quantity);
      }, 0);
    }
    
    const remaining = Math.max(0, 10000 - subtotal);
    
    return remaining.toLocaleString('es-MX', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  useEffect(() => {
    if (isCartOpen) {
      console.log('[MiniCart] Cart opened, current state:', {
        cartId,
        cartItems,
        cartCount,
        cartTotal,
        isLoading,
        isCartLoaded,
        rawCart: cart
      });
      
      console.log('[MiniCart] Cart structure details:');
      console.log('[MiniCart] cartId:', cartId);
      console.log('[MiniCart] cart object:', cart);
      console.log('[MiniCart] cart?.lines?.edges:', cart?.lines?.edges);
      console.log('[MiniCart] cartItems array:', cartItems);
      console.log('[MiniCart] cartCount:', cartCount);
      
      if (cartCount === 0) {
        console.log('[MiniCart] Cart appears empty (cartCount === 0)');
        if (cart?.lines?.edges && cart.lines.edges.length > 0) {
          console.warn('[MiniCart] Data inconsistency: cart has lines but cartCount is 0');
          console.log('[MiniCart] Raw cart lines:', cart.lines.edges);
        }
      }
      
      if (!isCartLoaded) {
        setIsCartLoaded(true);
      }
    }
  }, [isCartOpen, cartItems, cartCount, cartTotal, cart, cartId, isLoading, isCartLoaded]);
  
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2, delay: 0.1 } }
  };

  const cartVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { type: 'tween', duration: 0.3, ease: 'easeOut' } },
    exit: { x: '100%', transition: { type: 'tween', duration: 0.2 } }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 isolate">
      {/* Background overlay */}
      <motion.div 
        className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm"
        onClick={closeCart}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      />
      
      {/* Cart panel */}
      <div className="fixed inset-y-0 right-0 max-w-md z-[100]">
        <motion.div 
          className="w-screen max-w-md h-full flex flex-col"
          variants={cartVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: '0.5rem', borderBottomLeftRadius: '0.5rem', boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="flex flex-col h-full min-h-[500px] bg-white" style={{ borderTopLeftRadius: '0.5rem', borderBottomLeftRadius: '0.5rem' }}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white" style={{ borderTopLeftRadius: '0.5rem' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-heading font-bold">Tu Carrito</h2>
                <button 
                  className="p-1 rounded-full hover:bg-gray-100"
                  onClick={closeCart}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            {/* Cart content - scrollable */}
            <div className="flex-1 overflow-auto p-4 bg-white flex items-center justify-center min-h-[300px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
                  <p className="mt-4 text-gray-500 text-lg font-body">Cargando carrito...</p>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 max-w-xs mx-auto">
                  <ShoppingBag className="h-16 w-16 text-gray-300" />
                  <p className="mt-4 text-gray-500 text-lg font-body text-center">Tu carrito está vacío</p>
                  <button
                    className="mt-6 bg-teal text-white py-2 px-6 rounded hover:bg-teal-light font-heading font-semibold tracking-wide"
                    onClick={closeCart}
                  >
                    Continuar Comprando
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => {
                    const price = parseFloat(item.price.amount);
                    const formattedPrice = price.toLocaleString('es-MX', {
                      style: 'currency',
                      currency: item.price.currencyCode
                    });
                    
                    return (
                      <li key={item.id} className="py-4 flex">
                        <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                          {item.imageUrl ? (
                            <img 
                              src={item.imageUrl} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // If image fails to load, show placeholder
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  const placeholder = document.createElement('div');
                                  placeholder.className = 'w-full h-full bg-gray-100 flex items-center justify-center';
                                  placeholder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-gray-400"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>';
                                  parent.appendChild(placeholder);
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <ShoppingBag className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h3 className="text-base font-heading font-medium">
                              {item.productTitle || item.title}
                            </h3>
                            <p className="ml-4 font-heading font-semibold">{formattedPrice}</p>
                          </div>
                          
                          <p className="mt-1 text-sm text-gray-500 font-body">
                            {item.title !== item.productTitle ? item.title : ''}
                          </p>
                          
                          <div className="mt-2 flex justify-between">
                            <div className="flex items-center border border-gray-200 rounded-md">
                              <button 
                                onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                                disabled={isLoading}
                                className="p-1 text-gray-600 hover:text-teal"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-2 py-1 min-w-[32px] text-center text-sm font-heading font-medium">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateItem(item.id, item.quantity + 1)}
                                disabled={isLoading}
                                className="p-1 text-gray-600 hover:text-teal"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <button
                              className="text-teal hover:text-teal-dark text-sm font-heading font-medium flex items-center"
                              onClick={() => removeItem(item.id)}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              <span>Eliminar</span>
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer with totals and checkout button */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-4 bg-white" style={{ borderBottomLeftRadius: '0.5rem' }}>
                <div className="flex justify-between font-heading font-medium text-base mb-1">
                  <p>Subtotal</p>
                  <p>{cartTotal}</p>
                </div>
                
                {/* Free shipping threshold section */}
                <div className="my-3">
                  {cartItems.length > 0 && (
                    <>
                      {(cart?.cost?.subtotalAmount?.amount && parseFloat(cart.cost.subtotalAmount.amount) >= 10000) || 
                       (cartTotal && parseFloat(cartTotal.replace(/[^\d.-]/g, '')) >= 10000) ? (
                      <div className="bg-sage-extralight text-sage-dark p-2 rounded-md flex items-center">
                        <div className="mr-2 text-sage">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        </div>
                        <span className="text-sm font-heading font-medium">¡Tu pedido califica para envío gratis!</span>
                      </div>
                      ) : (
                        <div>
                          <div className="bg-gray-100 rounded-full h-2 mb-2">
                            <div 
                              className="bg-teal h-2 rounded-full" 
                              style={{ 
                                width: `${Math.min(100, calculateProgressPercentage())}%` 
                              }}
                            />
                          </div>
                          <div className="text-sm text-gray-600 font-body">
                            Te faltan <span className="font-heading font-medium text-teal">
                              {formatRemainingAmount()}
                            </span> para obtener envío gratis
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 mb-4 font-body">
                  Envío e impuestos calculados al finalizar la compra.
                </p>
                
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full bg-teal text-white py-3 rounded font-heading font-semibold tracking-wide hover:bg-teal-light flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <span>Finalizar Compra</span>
                      <ChevronRight className="ml-1 h-5 w-5" />
                    </>
                  )}
                </button>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500 font-body">
                    o{' '}
                    <Link
                      to="/cart"
                      onClick={closeCart}
                      className="text-teal font-heading font-medium hover:text-teal-dark"
                    >
                      Ver Carrito Completo
                    </Link>
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-center space-x-6">
                    <TrustIndicator 
                      type="warranty" 
                      size="small" 
                      layout="horizontal" 
                      showDescription={false} 
                    />
                    <TrustIndicator 
                      type="payment" 
                      size="small" 
                      layout="horizontal" 
                      showDescription={false} 
                    />
                  </div>
                  <p className="text-xs text-center text-gray-500 mt-2 font-body">
                    Garantía de Bienestar en todos nuestros productos
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MiniCart;
