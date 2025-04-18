import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import framer-motion
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowRight, Loader, CheckCircle } from 'lucide-react';
import TrustIndicatorGroup from './TrustIndicatorGroup';
import { Helmet } from 'react-helmet';

const CheckoutRedirect: React.FC = () => {
  const { getCheckout, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [checkoutUrl, setCheckoutUrl] = useState<string>('');

  useEffect(() => {
    const redirectToCheckout = async () => {
      if (cartCount === 0) {
        navigate('/cart');
        return;
      }

      try {
        setStatus('loading');
        
        // Get the base URL for the return URL
        const baseUrl = window.location.origin;
        const returnUrl = `${baseUrl}/order-confirmation`;
        
        // Get checkout URL
        const url = await getCheckout();
        
        if (!url) {
          throw new Error('No se pudo obtener la URL de pago');
        }
        
        // Add return_to parameter to the checkout URL
        const checkoutUrlWithReturn = `${url}&return_to=${encodeURIComponent(returnUrl)}`;
        
        setCheckoutUrl(checkoutUrlWithReturn);
        setStatus('redirecting');
        
        // Short delay before redirecting to show the transition screen
        setTimeout(() => {
          window.location.href = checkoutUrlWithReturn;
        }, 1500);
      } catch (error) {
        console.error('Error redirecting to checkout:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
      }
    };

    redirectToCheckout();
  }, [getCheckout, navigate, cartCount]);

  return (
    <>
      <Helmet>
        <title>Redirigiendo al Pago | Silla Vida</title>
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
        <motion.div 
          className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {status === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="flex justify-center mb-6"
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <motion.div 
                    className="rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"
                    animate={{ rotate: 360 }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                  />
                </motion.div>
                <motion.h1 
                  className="text-2xl font-bold mb-4"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Preparando tu pedido
                </motion.h1>
                <motion.p 
                  className="text-gray-600 mb-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Estamos preparando tu pedido para el pago.
                </motion.p>
                <motion.p 
                  className="text-gray-600"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Serás redirigido automáticamente.
                </motion.p>
              </motion.div>
            )}
          
            {status === 'redirecting' && (
              <motion.div
                key="redirecting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="flex justify-center mb-6"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      color: ["#dc2626", "#ef4444", "#dc2626"] 
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-red-600"
                  >
                    <CheckCircle className="h-16 w-16" />
                  </motion.div>
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-2xl font-bold mb-4">¡Todo listo!</h1>
                  <p className="text-gray-600 mb-2">Total: {cartTotal}</p>
                  <p className="text-gray-600 mb-6">Redirigiendo a la página de pago seguro...</p>
                </motion.div>
                
                <motion.div 
                  className="flex items-center justify-center text-red-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader className="h-5 w-5 mr-2" />
                  </motion.div>
                  <span>Redirigiendo</span>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div 
                  className="mt-8 border-t pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-base font-medium text-gray-800 mb-4">Invierte en tu bienestar con total tranquilidad</p>
                  
                  {/* Trust Indicator Group */}
                  <TrustIndicatorGroup 
                    types={['warranty', 'payment']} 
                    layout="grid" 
                    size="small" 
                    showDescription={false}
                  />
                  
                  {/* Payment Method Logos */}
                  <p className="text-sm font-medium text-gray-700 mt-4 mb-3">Aceptamos</p>
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <img src="/images/visa.png" alt="Visa" className="h-8" />
                    <img src="/images/mastercard.png" alt="Mastercard" className="h-8" />
                    <img src="/images/amex.png" alt="American Express" className="h-8" />
                    <img src="/images/paypal.png" alt="PayPal" className="h-8" />
                  </div>
                  
                  {/* Compromiso Vida Message */}
                  <p className="text-xs text-center text-gray-600 mt-4">
                    Nuestro Compromiso Vida va más allá de una simple venta. Estamos dedicados a apoyar tu inversión en bienestar.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <p className="text-sm text-gray-500">
                    Si no eres redirigido automáticamente,{' '}
                    <motion.a 
                      href={checkoutUrl} 
                      className="text-red-600 hover:text-red-700 font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      haz clic aquí
                    </motion.a>
                  </p>
                </motion.div>
              </motion.div>
            )}
          
            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="flex justify-center mb-6 text-red-600"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1, 
                    rotate: [0, 5, 0, -5, 0] 
                  }}
                  transition={{ 
                    duration: 0.5,
                    times: [0, 0.25, 0.5, 0.75, 1],
                    delay: 0.2
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h1 className="text-2xl font-bold mb-4">Ocurrió un error</h1>
                  <p className="text-gray-600 mb-6">{errorMessage || 'No se pudo procesar tu pedido. Por favor, inténtalo de nuevo.'}</p>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col space-y-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button
                    onClick={() => navigate('/cart')}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 flex items-center justify-center"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Volver al carrito
                  </motion.button>
                  
                  <motion.button
                    onClick={() => window.location.reload()}
                    className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 flex items-center justify-center"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Intentar de nuevo
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};

export default CheckoutRedirect;
