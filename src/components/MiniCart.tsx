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
  
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  
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
          className="w-screen max-w-md h-full"
          variants={cartVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: '0.5rem', borderBottomLeftRadius: '0.5rem', boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="flex flex-col h-full bg-white" style={{ borderTopLeftRadius: '0.5rem', borderBottomLeftRadius: '0.5rem' }}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white" style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: '0.5rem' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Tu Carrito</h2>
                <button 
                  className="p-1 rounded-full hover:bg-gray-100"
                  onClick={closeCart}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            {/* Cart content - scrollable */}
            <div className="flex-1 overflow-auto p-4 bg-white" style={{ backgroundColor: '#FFFFFF' }}>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                  <p className="mt-4 text-gray-500 text-lg">Cargando carrito...</p>
                </div>
              ) : cartItems.length === 0 ? (
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
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>

                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h3 className="text-base font-medium">
                              {item.productTitle || item.title}
                            </h3>
                            <p className="ml-4 font-medium">{formattedPrice}</p>
                          </div>
                          
                          <p className="mt-1 text-sm text-gray-500">
                            {item.title !== item.productTitle ? item.title : ''}
                          </p>
                          
                          <div className="mt-2 flex justify-between">
                            <div className="flex items-center border border-gray-200 rounded-md">
                              <button 
                                onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                                disabled={isLoading}
                                className="p-1 text-gray-600 hover:text-red-600"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-2 py-1 min-w-[32px] text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateItem(item.id, item.quantity + 1)}
                                disabled={isLoading}
                                className="p-1 text-gray-600 hover:text-red-600"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <button
                              className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
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
              <div className="border-t border-gray-200 p-4 bg-white" style={{ backgroundColor: '#FFFFFF', borderBottomLeftRadius: '0.5rem' }}>
                <div className="flex justify-between font-medium text-base mb-1">
                  <p>Subtotal</p>
                  <p>{cartTotal}</p>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Envío e impuestos calculados al finalizar la compra.
                </p>
                
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full bg-red-600 text-white py-3 rounded-md font-medium hover:bg-red-700 flex items-center justify-center"
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
                  <p className="text-sm text-gray-500">
                    o{' '}
                    <Link
                      to="/cart"
                      onClick={closeCart}
                      className="text-red-600 font-medium hover:text-red-800"
                    >
                      Ver Carrito Completo
                    </Link>
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center space-x-4">
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
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MiniCart;
