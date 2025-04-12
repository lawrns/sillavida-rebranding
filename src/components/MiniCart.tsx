import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
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
    isLoading
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
        aria-hidden="true"
        onClick={closeCart}
      ></div>
      
      {/* Cart panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            {/* Cart header */}
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">
                  Carrito de Compras
                </h2>
                <div className="ml-3 h-7 flex items-center">
                  <button
                    type="button"
                    className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                    onClick={closeCart}
                  >
                    <span className="sr-only">Cerrar panel</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="mt-8">
                {cartCount === 0 ? (
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
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                      {cartItems.map((item) => {
                        const price = parseFloat(item.price.amount);
                        const formattedPrice = price.toLocaleString('es-MX', {
                          style: 'currency',
                          currency: item.price.currencyCode
                        });
                        
                        return (
                          <li key={item.id} className="py-6 flex">
                            <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                              {/* Placeholder image - in a real app, you'd fetch the product image */}
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <ShoppingBag className="h-8 w-8 text-gray-400" />
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
                                <div className="flex items-center border border-gray-300 rounded">
                                  <button 
                                    onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                                    disabled={isLoading}
                                    className="p-1 text-gray-600 hover:text-gray-900"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="px-2 py-1 min-w-[30px] text-center">
                                    {item.quantity}
                                  </span>
                                  <button 
                                    onClick={() => updateItem(item.id, item.quantity + 1)}
                                    disabled={isLoading}
                                    className="p-1 text-gray-600 hover:text-gray-900"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>

                                <div className="flex">
                                  <button
                                    type="button"
                                    className="font-medium text-red-600 hover:text-red-500 flex items-center"
                                    onClick={() => removeItem(item.id)}
                                    disabled={isLoading}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Cart footer */}
            {cartCount > 0 && (
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>{cartTotal}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  Envío e impuestos calculados al finalizar la compra.
                </p>
                <div className="mt-6">
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
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    o{' '}
                    <Link
                      to="/cart"
                      onClick={closeCart}
                      className="text-red-600 font-medium hover:text-red-500"
                    >
                      Ver Carrito Completo
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniCart;
