import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useCart } from '../context/CartContext';

const OrderConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  
  // Get order information from URL parameters
  const orderId = searchParams.get('order_id') || 'N/A';
  const orderNumber = searchParams.get('order_number') || 'N/A';
  
  // Clear the cart when the order is confirmed
  useEffect(() => {
    if (orderId !== 'N/A') {
      clearCart();
    }
  }, [orderId, clearCart]);

  return (
    <>
      <Helmet>
        <title>¡Pedido Confirmado! | Silla Vida</title>
        <meta name="description" content="Tu pedido ha sido confirmado. Gracias por comprar en Silla Vida." />
      </Helmet>
      
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-20 w-20 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">¡Gracias por tu compra!</h1>
            <p className="text-gray-600 text-lg mb-2">
              Tu pedido ha sido confirmado y está siendo procesado.
            </p>
            <p className="text-gray-600">
              Te hemos enviado un correo electrónico con los detalles de tu pedido.
            </p>
          </div>
          
          <div className="border-t border-b border-gray-200 py-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <h2 className="font-semibold text-gray-700">Número de Pedido</h2>
                <p className="text-gray-600">{orderNumber}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <h2 className="font-semibold text-gray-700">Fecha</h2>
                <p className="text-gray-600">{new Date().toLocaleDateString('es-MX')}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">¿Qué sigue?</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-red-100 rounded-full p-3 mr-4">
                  <Package className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Preparación de tu pedido</h3>
                  <p className="text-gray-600">
                    Estamos preparando tu pedido para enviarlo. Recibirás una notificación cuando sea despachado.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-red-100 rounded-full p-3 mr-4">
                  <ArrowRight className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Seguimiento de envío</h3>
                  <p className="text-gray-600">
                    Una vez que tu pedido sea enviado, recibirás un correo electrónico con la información de seguimiento.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <Home className="h-5 w-5 mr-2" />
              Volver a la Tienda
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmationPage;
