import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowRight, Loader } from 'lucide-react';
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
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
              </div>
              <h1 className="text-2xl font-bold mb-4">Preparando tu pedido</h1>
              <p className="text-gray-600 mb-2">Estamos preparando tu pedido para el pago.</p>
              <p className="text-gray-600">Serás redirigido automáticamente.</p>
            </>
          )}
          
          {status === 'redirecting' && (
            <>
              <div className="flex justify-center mb-6">
                <ShoppingBag className="h-16 w-16 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold mb-4">¡Todo listo!</h1>
              <p className="text-gray-600 mb-2">Total: {cartTotal}</p>
              <p className="text-gray-600 mb-6">Redirigiendo a la página de pago seguro...</p>
              <div className="flex items-center justify-center text-red-600">
                <Loader className="animate-spin h-5 w-5 mr-2" />
                <span>Redirigiendo</span>
              </div>
              
              <div className="mt-8">
                <p className="text-sm text-gray-500">
                  Si no eres redirigido automáticamente,{' '}
                  <a 
                    href={checkoutUrl} 
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    haz clic aquí
                  </a>
                </p>
              </div>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="flex justify-center mb-6 text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-4">Ocurrió un error</h1>
              <p className="text-gray-600 mb-6">{errorMessage || 'No se pudo procesar tu pedido. Por favor, inténtalo de nuevo.'}</p>
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => navigate('/cart')}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 flex items-center justify-center"
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Volver al carrito
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 flex items-center justify-center"
                >
                  Intentar de nuevo
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CheckoutRedirect;
