import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, CreditCard, Truck, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Helmet } from 'react-helmet';

const CartPage: React.FC = () => {
  const { 
    cartItems, 
    cartTotal, 
    cartCount,
    updateItem,
    removeItem,
    isLoading
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <>
      <Helmet>
        <title>Carrito de Compras | Silla Vida</title>
        <meta name="description" content="Revisa los productos en tu carrito de compras y procede al pago." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>
        
        {cartCount === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="h-24 w-24 text-gray-300" />
              <p className="mt-6 text-gray-500 text-xl">Tu carrito está vacío</p>
              <p className="mt-2 text-gray-500">Parece que aún no has agregado productos a tu carrito.</p>
              <Link
                to="/"
                className="mt-8 bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 inline-flex items-center"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Continuar Comprando
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Productos ({cartCount})</h2>
                </div>
                
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => {
                    const price = parseFloat(item.price.amount);
                    const formattedPrice = price.toLocaleString('es-MX', {
                      style: 'currency',
                      currency: item.price.currencyCode
                    });
                    const itemTotal = (price * item.quantity).toLocaleString('es-MX', {
                      style: 'currency',
                      currency: item.price.currencyCode
                    });
                    
                    return (
                      <li key={item.id} className="p-6 flex flex-col sm:flex-row">
                        <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-gray-200 rounded-md overflow-hidden mb-4 sm:mb-0">
                          {/* Placeholder image - in a real app, you'd fetch the product image */}
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-12 w-12 text-gray-400" />
                          </div>
                        </div>

                        <div className="sm:ml-6 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-lg font-medium text-gray-900">
                                {item.productTitle || item.title}
                              </h3>
                              <p className="ml-4 text-lg font-medium text-gray-900">{itemTotal}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.title !== item.productTitle ? item.title : ''}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Precio unitario: {formattedPrice}
                            </p>
                          </div>
                          
                          <div className="mt-4 flex justify-between items-center">
                            <div className="flex items-center border border-gray-300 rounded">
                              <button 
                                onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                                disabled={isLoading}
                                className="p-2 text-gray-600 hover:text-gray-900"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-2 min-w-[40px] text-center">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateItem(item.id, item.quantity + 1)}
                                disabled={isLoading}
                                className="p-2 text-gray-600 hover:text-gray-900"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <button
                              type="button"
                              className="font-medium text-red-600 hover:text-red-500 flex items-center"
                              onClick={() => removeItem(item.id)}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-5 w-5 mr-1" />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                
                <div className="p-6 border-t border-gray-200">
                  <Link
                    to="/"
                    className="text-red-600 hover:text-red-500 flex items-center"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Continuar Comprando
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-semibold mb-6">Resumen de la Orden</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium">{cartTotal}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Envío</p>
                    <p className="font-medium">Calculado al finalizar</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Impuestos</p>
                    <p className="font-medium">Calculado al finalizar</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-semibold">
                    <p>Total</p>
                    <p>{cartTotal}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Impuestos incluidos. El envío se calcula en el siguiente paso.
                  </p>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    'Finalizar Compra'
                  )}
                </button>
                
                {/* Additional Info */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <Truck className="h-6 w-6 text-gray-600" />
                    <div>
                      <h4 className="font-semibold">Envío Gratis</h4>
                      <p className="text-sm text-gray-600">En pedidos mayores a $999 MXN</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-gray-600" />
                    <div>
                      <h4 className="font-semibold">Garantía de 12 Meses</h4>
                      <p className="text-sm text-gray-600">En todos nuestros productos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-gray-600" />
                    <div>
                      <h4 className="font-semibold">Pago Seguro</h4>
                      <p className="text-sm text-gray-600">Múltiples métodos de pago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
