import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, AlertCircle, ChevronRight, CreditCard, Shield } from 'lucide-react';
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
  
  // Local state to track if cart data has been loaded
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  
  // Enhanced debug logging
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
      
      // Log detailed cart structure
      console.log('[MiniCart] Cart structure details:');
      console.log('[MiniCart] cartId:', cartId);
      console.log('[MiniCart] cart object:', cart);
      console.log('[MiniCart] cart?.lines?.edges:', cart?.lines?.edges);
      console.log('[MiniCart] cartItems array:', cartItems);
      console.log('[MiniCart] cartCount:', cartCount);
      
      // Check if cart is actually empty or if there's a data issue
      if (cartCount === 0) {
        console.log('[MiniCart] Cart appears empty (cartCount === 0)');
        if (cart?.lines?.edges && cart.lines.edges.length > 0) {
          console.warn('[MiniCart] Data inconsistency: cart has lines but cartCount is 0');
          console.log('[MiniCart] Raw cart lines:', cart.lines.edges);
        }
      }
      
      // Mark cart as loaded after initial render
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

  const listItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      x: 0, 
      transition: { 
        delay: i * 0.05,
        duration: 0.3
      } 
    })
  };

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
        {/* Background overlay */}
        <motion.div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity" 
          aria-hidden="true"
          onClick={closeCart}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        />
        
        {/* Cart panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex">
          <motion.div 
            className="w-screen max-w-md"
            variants={cartVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="h-full flex flex-col bg-white shadow-xl rounded-l-lg overflow-hidden">
              {/* Cart header */}
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <motion.h2 
                    className="text-xl font-bold text-gray-900" 
                    id="slide-over-title"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Tu Carrito
                  </motion.h2>
                  <div className="ml-3 h-7 flex items-center">
                    <motion.button
                      type="button"
                      className="-m-2 p-2 text-gray-400 hover:text-[#B02020] transition-colors duration-200 rounded-full"
                      onClick={closeCart}
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(254, 242, 242, 1)" }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Cerrar carrito"
                    >
                      <span className="sr-only">Cerrar panel</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </motion.button>
                  </div>
                </div>

                <div className="mt-8">
                  {isLoading ? (
                    // Loading state
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                      <p className="mt-4 text-gray-500 text-lg">Cargando carrito...</p>
                    </div>
                  ) : cart?.lines?.edges && cart.lines.edges.length > 0 && cartItems.length === 0 ? (
                    // Data inconsistency state - cart has items but cartItems is empty
                    <div className="flex flex-col items-center justify-center py-12">
                      <AlertCircle className="h-16 w-16 text-yellow-500" />
                      <p className="mt-4 text-gray-700 text-lg text-center">
                        Hay un problema al mostrar tu carrito
                      </p>
                      <p className="mt-2 text-gray-500 text-sm text-center">
                        Intenta recargar la página o cerrar y abrir el carrito nuevamente
                      </p>
                      <div className="mt-6 flex space-x-4">
                        <button
                          className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                          onClick={closeCart}
                        >
                          Cerrar
                        </button>
                        <button
                          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                          onClick={() => window.location.reload()}
                        >
                          Recargar página
                        </button>
                      </div>
                    </div>
                  ) : cartItems.length === 0 ? (
                    // Empty cart state - using cartItems.length instead of cartCount
                    <div className="flex flex-col items-center justify-center py-12">
                      <ShoppingBag className="h-16 w-16 text-gray-300" />
                      <p className="mt-4 text-gray-500 text-lg">Tu carrito está vacío</p>
                      <button
                        className="mt-6 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                        onClick={closeCart}
                      >
                        Continuar Comprando
                      </button>
                    </div>
                  ) : (
                    // Cart with items
                    <div className="flow-root">
                      <ul role="list" className="-my-6 divide-y divide-gray-200">
                        {cartItems.map((item, index) => {
                          const price = parseFloat(item.price.amount);
                          const formattedPrice = price.toLocaleString('es-MX', {
                            style: 'currency',
                            currency: item.price.currencyCode
                          });
                          
                          return (
                            <motion.li 
                              key={item.id} 
                              className="py-6 flex"
                              custom={index}
                              variants={listItemVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                {/* Placeholder image with animated loading effect */}
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center relative overflow-hidden">
                                  <motion.div 
                                    className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"
                                    animate={{
                                      x: ["100%", "-100%"],
                                    }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 1.5,
                                      ease: "linear",
                                    }}
                                  />
                                  <ShoppingBag className="h-8 w-8 text-gray-400 z-10" />
                                </div>
                              </div>

                              <div className="ml-4 flex-1 flex flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>
                                      {item.productTitle || item.title}
                                    </h3>
                                    <p className="ml-4">{formattedPrice}</p>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {item.title !== item.productTitle ? item.title : ''}
                                  </p>
                                </div>
                                
                                <div className="flex-1 flex items-end justify-between text-sm">
                                  <div className="flex items-center border border-gray-200 rounded-md shadow-sm">
                                    <motion.button 
                                      onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                                      disabled={isLoading}
                                      className="p-1.5 text-gray-600 hover:text-[#B02020] transition-colors duration-200"
                                      whileHover={{ backgroundColor: "rgba(254, 242, 242, 1)" }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <Minus className="h-3.5 w-3.5" />
                                    </motion.button>
                                    <span className="px-2 py-1 min-w-[32px] text-center text-sm font-medium">
                                      {item.quantity}
                                    </span>
                                    <motion.button 
                                      onClick={() => updateItem(item.id, item.quantity + 1)}
                                      disabled={isLoading}
                                      className="p-1.5 text-gray-600 hover:text-[#B02020] transition-colors duration-200"
                                      whileHover={{ backgroundColor: "rgba(254, 242, 242, 1)" }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <Plus className="h-3.5 w-3.5" />
                                    </motion.button>
                                  </div>

                                  <div className="flex">
                                    <motion.button
                                      type="button"
                                      className="font-medium text-[#B02020] hover:text-red-700 flex items-center"
                                      onClick={() => removeItem(item.id)}
                                      disabled={isLoading}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      aria-label={`Eliminar ${item.productTitle || item.title} del carrito`}
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      <span className="text-sm">Eliminar</span>
                                    </motion.button>
                                  </div>
                                </div>
                              </div>
                            </motion.li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Cart footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>{cartTotal}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Envío e impuestos calculados al finalizar la compra.
                  </p>
                  <div className="mt-6">
                    <motion.button
                      onClick={handleCheckout}
                      disabled={isLoading}
                      className={`w-full flex justify-center items-center px-6 py-3.5 border border-transparent rounded-md shadow-md text-base font-medium text-white bg-[#B02020] hover:bg-red-700 ${
                        isLoading ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                      whileHover={{ scale: 1.03, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isLoading ? (
                        <>
                          <motion.div 
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <span>Finalizar Compra</span>
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </motion.button>
                  </div>
                  <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                    <p>
                      o{' '}
                      <motion.span whileHover={{ scale: 1.03 }}>
                        <Link
                          to="/cart"
                          onClick={closeCart}
                          className="text-[#B02020] font-medium hover:text-red-700 transition-colors duration-200"
                        >
                          Ver Carrito Completo
                        </Link>
                      </motion.span>
                    </p>
                  </div>
                  
                  {/* Trust badges */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex justify-center space-x-4 mb-2">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 text-green-600 mr-1.5" />
                        <span className="text-xs text-gray-500">Pago Seguro</span>
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 text-green-600 mr-1.5" />
                        <span className="text-xs text-gray-500">Métodos de Pago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default MiniCart;
