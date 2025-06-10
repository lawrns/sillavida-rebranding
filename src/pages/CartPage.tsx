import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, Truck, CreditCard, Shield, HeadphonesIcon } from 'lucide-react';
import TrustIndicatorGroup from '../components/TrustIndicatorGroup';
import { useCart } from '../context/CartContext';
import { getFeaturedProducts } from '../lib/shopify';
import type { ShopifyProduct } from '../types/shopify';
import ShopifyProductCard from '../components/ShopifyProductCard';
import { Helmet } from 'react-helmet';
import { logger } from '../utils/logger';
import { BUSINESS } from '../constants/layout';

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
  const [recommendedProducts, setRecommendedProducts] = useState<ShopifyProduct[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // No mapping needed - use ShopifyProductCard directly

  useEffect(() => {
    // Fetch recommendations only if the cart is empty
    if (cartCount === 0) {
      const fetchRecommendations = async () => {
        setLoadingRecommendations(true);
        try {
          // Fetch e.g., 4 featured products
          const products = await getFeaturedProducts({ limit: 4 });
          setRecommendedProducts(products);
        } catch (error) {
          console.error("Error fetching recommended products:", error);
        } finally {
          setLoadingRecommendations(false);
        }
      };
      fetchRecommendations();
    }
  }, [cartCount]); // Re-run when cartCount changes

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Helmet>
        <title>Carrito de Compras | Silla Vida</title>
        <meta name="description" content="Revisa los productos en tu carrito de compras y procede al pago." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-black">Carrito de Compras</h1>

        {cartCount === 0 ? (
          <motion.div
            className="bg-white rounded-md shadow-md p-6 sm:p-8 text-center border border-neutral-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="flex flex-col items-center justify-center py-8 sm:py-12"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <ShoppingBag className="h-16 w-16 sm:h-24 sm:w-24 text-neutral-300" />
              </motion.div>
              <motion.p
                className="mt-6 text-black text-lg sm:text-xl font-medium"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Tu carrito está vacío
              </motion.p>
              <motion.p
                className="mt-2 text-neutral-500 max-w-md mx-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Parece que aún no has agregado productos a tu carrito. Descubre nuestros productos destacados a continuación.
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/"
                  className="mt-8 bg-[#000000] text-white py-3 px-6 rounded-md hover:bg-black inline-flex items-center font-medium shadow-sm"
                  aria-label="Continuar comprando"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Continuar Comprando
                </Link>
              </motion.div>
            </motion.div>

            {/* Enhanced Recommended Products Section */}
            {recommendedProducts.length > 0 ? (
              <motion.div
                className="mt-12"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-center text-black">Productos Recomendados</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {recommendedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                    >
                      <ShopifyProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : loadingRecommendations ? (
              <motion.div
                className="mt-12 flex justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="w-10 h-10 border-4 border-neutral-200 border-t-accent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            ) : null}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items with animations */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-md shadow-md overflow-hidden border border-neutral-100">
                <div className="p-6 border-b border-neutral-200">
                  <h2 className="text-xl font-semibold text-black">Productos ({cartCount})</h2>
                </div>

                <ul className="divide-y divide-neutral-200">
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
                        <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-neutral-50 rounded-md overflow-hidden mb-4 sm:mb-0 border border-neutral-100">
                          {/* Display product image with fallback to placeholder */}
                          {item.imageUrl ? (
                            <div className="w-full h-full relative">
                              <img
                                src={item.imageUrl}
                                alt={item.productTitle || item.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // If image fails to load, show fallback icon
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                              <div className="w-full h-full flex items-center justify-center absolute inset-0 hidden">
                                <ShoppingBag className="h-12 w-12 text-neutral-400" />
                              </div>
                            </div>
                          ) : (
                            // Try to load image based on variant ID as fallback
                            <div className="w-full h-full relative">
                              <img
                                src={`https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/cdn/shop/products/${item.merchandiseId.split('/').pop()}.jpg`}
                                alt={item.productTitle || item.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // If image fails to load, show fallback icon
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                              <div className="w-full h-full flex items-center justify-center absolute inset-0 hidden">
                                <ShoppingBag className="h-12 w-12 text-neutral-400" />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="sm:ml-6 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-lg font-medium text-black">
                                {item.productTitle || item.title}
                              </h3>
                              <p className="ml-4 text-lg font-medium text-accent">{itemTotal}</p>
                            </div>
                            <p className="mt-1 text-sm text-neutral-500">
                              {item.title !== item.productTitle ? item.title : ''}
                            </p>
                            <p className="mt-1 text-sm text-neutral-500">
                              Precio unitario: {formattedPrice}
                            </p>
                          </div>

                          <div className="mt-4 flex justify-between items-center">
                            <div className="flex items-center border border-neutral-200 rounded-md">
                              <button
                                onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                                disabled={isLoading}
                                className="p-3 text-neutral-600 hover:text-accent transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-2 min-w-[40px] text-center text-black">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateItem(item.id, item.quantity + 1)}
                                disabled={isLoading}
                                className="p-3 text-neutral-600 hover:text-accent transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <button
                              type="button"
                              className="font-medium text-accent hover:text-accent/80 flex items-center transition-colors"
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

                <div className="p-6 border-t border-neutral-200">
                  <Link
                    to="/"
                    className="text-accent hover:text-accent/80 flex items-center transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Continuar Comprando
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-md shadow-md p-6 sticky top-6 border border-neutral-100">
                <h2 className="text-xl font-semibold mb-6 text-black">Resumen de la Orden</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <p className="text-neutral-600">Subtotal</p>
                    <p className="font-medium text-accent">{cartTotal}</p>
                  </div>

                  {/* Free shipping threshold section */}
                  {cartItems.length > 0 && (
                    <div className="py-2">
                      {parseFloat(cartTotal.replace(/[^\d.-]/g, '')) >= BUSINESS.FREE_SHIPPING_THRESHOLD ? (
                        <div className="bg-neutral-50 text-accent p-3 rounded-md flex items-center border border-neutral-100">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2 text-accent">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          <div>
                            <span className="font-medium">¡Calificado para envío gratis!</span>
                            <p className="text-sm text-neutral-600">Tu pedido califica para envío gratuito en todo México.</p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-neutral-600">Progreso hacia envío gratis</span>
                            <span className="font-medium text-black">
                              {(() => {
                                try {
                                  return Math.min(100, (parseFloat(cartTotal.replace(/[^\d.-]/g, '')) / BUSINESS.FREE_SHIPPING_THRESHOLD) * 100).toFixed(0) + '%';
                                } catch (e) {
                                  logger.warn('Error calculating shipping progress percentage', { component: 'CartPage', action: 'shippingProgress', data: e });
                                  return '0%';
                                }
                              })()}
                            </span>
                          </div>
                          <div className="bg-neutral-100 rounded-full h-2.5 mb-2">
                            <div
                              className="bg-black h-2.5 rounded-full"
                              style={{
                                width: (() => {
                                  try {
                                    return `${Math.min(100, (parseFloat(cartTotal.replace(/[^\d.-]/g, '')) / BUSINESS.FREE_SHIPPING_THRESHOLD) * 100)}%`;
                                  } catch (e) {
                                    logger.warn('Error calculating shipping progress width', { component: 'CartPage', action: 'shippingProgress', data: e });
                                    return '0%';
                                  }
                                })()
                              }}
                            />
                          </div>
                          <div className="text-sm text-neutral-600">
                            <span>Añade </span>
                            <span className="font-medium text-accent">
                              {(() => {
                                try {
                                  return (BUSINESS.FREE_SHIPPING_THRESHOLD - parseFloat(cartTotal.replace(/[^\d.-]/g, ''))).toLocaleString(BUSINESS.CURRENCY.LOCALE, {
                                    style: 'currency',
                                    currency: BUSINESS.CURRENCY.CODE
                                  });
                                } catch (e) {
                                  logger.warn('Error calculating remaining amount', { component: 'CartPage', action: 'shippingProgress', data: e });
                                  return '$10,000.00';
                                }
                              })()}
                            </span> más para obtener envío gratis
                            <Link to="/promociones" className="ml-1 text-accent underline hover:text-accent/80 transition-colors">Ver detalles</Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between">
                    <p className="text-neutral-600">Envío</p>
                    {parseFloat(cartTotal.replace(/[^\d.-]/g, '')) >= BUSINESS.FREE_SHIPPING_THRESHOLD ? (
                      <p className="font-medium text-accent">Gratis</p>
                    ) : (
                      <p className="font-medium text-black">Calculado al finalizar</p>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <p className="text-neutral-600">Impuestos</p>
                    <p className="font-medium text-black">Calculado al finalizar</p>
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-semibold">
                    <p className="text-black">Total</p>
                    <p className="text-accent">{cartTotal}</p>
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">
                    Impuestos incluidos. El envío se calcula en el siguiente paso.
                  </p>
                </div>

                <motion.button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  whileHover={{ scale: 1.02 }}
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
                    'Finalizar Compra'
                  )}
                </motion.button>

                {/* Trust Indicators - Matching Homepage Style */}
                <div className="mt-8">
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <div className="flex items-baseline space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Truck className="h-5 w-5 text-black translate-y-0.5" />
                      <h4 className="font-semibold text-black text-sm leading-5">Envío Asegurado</h4>
                      <p className="text-gray-600 text-xs leading-5">A todo México</p>
                    </div>
                    <div className="flex items-baseline space-x-3 p-3 bg-gray-50 rounded-lg">
                      <CreditCard className="h-5 w-5 text-black translate-y-0.5" />
                      <h4 className="font-semibold text-black text-sm leading-5">Pagos Seguros</h4>
                      <p className="text-gray-600 text-xs leading-5">12 MSI disponibles</p>
                    </div>
                    <div className="flex items-baseline space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Shield className="h-5 w-5 text-black translate-y-0.5" />
                      <h4 className="font-semibold text-black text-sm leading-5">Garantía</h4>
                      <p className="text-gray-600 text-xs leading-5">5 años extendida</p>
                    </div>
                    <div className="flex items-baseline space-x-3 p-3 bg-gray-50 rounded-lg">
                      <HeadphonesIcon className="h-5 w-5 text-black translate-y-0.5" />
                      <h4 className="font-semibold text-black text-sm leading-5">Soporte</h4>
                      <p className="text-gray-600 text-xs leading-5">Atención 24/7</p>
                    </div>
                  </div>

                  {/* Payment Methods Icons */}
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-3">Métodos de pago aceptados:</p>
                    
                    {/* First row - Main payment processors */}
                    <div className="flex items-center justify-center space-x-3 mb-3">
                      <div className="flex items-center justify-center bg-white border border-gray-200 rounded-lg px-3 py-2 min-w-[80px] h-10">
                        <img
                          src="/images/Metodos de pago/PayPal-1024x271px.svg.png"
                          alt="PayPal"
                          className="h-8 object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex items-center justify-center bg-white border border-gray-200 rounded-lg px-3 py-2 min-w-[80px] h-10">
                        <img
                          src="/images/Metodos de pago/Logotipo_Conekta_2023_logotipo_conekta_arquitectura+copia+3.png"
                          alt="Conekta"
                          className="h-8 object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Second row - Credit cards and additional methods */}
                    <div className="flex items-center justify-center flex-wrap gap-2">
                      {/* Visa */}
                      <div className="flex items-center justify-center bg-white border border-gray-200 rounded px-2.5 py-1.5 min-w-[55px] h-7">
                        <img
                          src="/icons/Metodos de pago/visa.sxIq5Dot.svg"
                          alt="Visa"
                          className="h-5 object-contain"
                          loading="lazy"
                        />
                      </div>

                      {/* MasterCard */}
                      <div className="flex items-center justify-center bg-white border border-gray-200 rounded px-2.5 py-1.5 min-w-[55px] h-7">
                        <img
                          src="/icons/Metodos de pago/master.CzeoQWmc.svg"
                          alt="MasterCard"
                          className="h-5 object-contain"
                          loading="lazy"
                        />
                      </div>

                      {/* American Express */}
                      <div className="flex items-center justify-center bg-white border border-gray-200 rounded px-2.5 py-1.5 min-w-[55px] h-7">
                        <img
                          src="/icons/Metodos de pago/american_express.C3z4WB9r.svg"
                          alt="American Express"
                          className="h-5 object-contain"
                          loading="lazy"
                        />
                      </div>

                      {/* BBVA */}
                      <div className="flex items-center justify-center bg-white border border-gray-200 rounded px-2.5 py-1.5 min-w-[55px] h-7">
                        <img
                          src="/icons/Metodos de pago/bbvacie.ClnMUhdH.svg"
                          alt="BBVA"
                          className="h-5 object-contain"
                          loading="lazy"
                        />
                      </div>

                      {/* SPEI */}
                      <div className="flex items-center justify-center bg-white border border-gray-200 rounded px-2.5 py-1.5 min-w-[55px] h-7">
                        <img
                          src="/icons/Metodos de pago/spei.D-9zZLEi.svg"
                          alt="SPEI"
                          className="h-5 object-contain"
                          loading="lazy"
                        />
                      </div>

                      {/* 7-Eleven */}
                      <div className="flex items-center justify-center bg-white border border-gray-200 rounded px-2.5 py-1.5 min-w-[55px] h-7">
                        <img
                          src="/icons/Metodos de pago/seveneleven.JDz9NISN.svg"
                          alt="7-Eleven"
                          className="h-5 object-contain"
                          loading="lazy"
                        />
                      </div>

                      {/* Circle K */}
                      <div className="flex items-center justify-center bg-white border border-gray-200 rounded px-2.5 py-1.5 min-w-[55px] h-7">
                        <img
                          src="/icons/Metodos de pago/circlek.DCOZEm2y.svg"
                          alt="Circle K"
                          className="h-5 object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CartPage;
