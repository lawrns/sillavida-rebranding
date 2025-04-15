import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, CreditCard, Truck, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getFeaturedProducts } from '../lib/shopify';
import type { ShopifyProduct } from '../types/shopify'; // Import product type
import ProductCard from '../components/ProductCard'; // Import ProductCard
import { Chair } from '../data/chairs'; // Import Chair type for mapping
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
  const [recommendedProducts, setRecommendedProducts] = useState<ShopifyProduct[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Helper function to map Shopify Product to Chair structure (similar to SearchPage)
  const mapProductToChair = (product: ShopifyProduct): Chair => {
    return {
      id: product.handle, 
      name: product.title,
      description: product.description || 'No description available.',
      price: parseFloat(product.priceRange.minVariantPrice.amount),
      image: product.images?.edges[0]?.node?.url || '/images/placeholder.png',
      category: 'office', // Default category, adjust if possible
      features: product.tags || [],
      rating: 4.5, // Default rating
    };
  };

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
        <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>
        
        {cartCount === 0 ? (
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center"
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
                <ShoppingBag className="h-16 w-16 sm:h-24 sm:w-24 text-gray-300" />
              </motion.div>
              <motion.p 
                className="mt-6 text-gray-700 text-lg sm:text-xl font-medium"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Tu carrito está vacío
              </motion.p>
              <motion.p 
                className="mt-2 text-gray-500 max-w-md mx-auto"
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
                  className="mt-8 bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 inline-flex items-center font-medium shadow-sm"
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
                <h2 className="text-2xl font-semibold mb-6 text-center">Productos Recomendados</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {recommendedProducts.map((product, index) => {
                     const chairData = mapProductToChair(product);
                     return (
                       <motion.div
                         key={product.id}
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                       >
                         <ProductCard chair={chairData} />
                       </motion.div>
                     );
                  })}
                </div>
              </motion.div>
            ) : loadingRecommendations ? (
              <motion.div 
                className="mt-12 flex justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div 
                  className="w-10 h-10 border-4 border-gray-200 border-t-red-600 rounded-full"
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
            </motion.div>
            
            {/* Order Summary */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
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
                
                <motion.button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  whileHover={{ scale: 1.03 }}
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
                
                {/* Trust Elements - Enhanced as per TASK-031 */}
                <div className="mt-8 space-y-5">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Compra con confianza</h3>
                  <motion.div 
                    className="p-4 border border-gray-200 rounded-lg"
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="h-6 w-6 text-red-600" />
                      <div>
                        <h4 className="font-semibold">Envío Gratis</h4>
                        <p className="text-sm text-gray-600">En pedidos mayores a $999 MXN</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="p-4 border border-gray-200 rounded-lg"
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="h-6 w-6 text-red-600" />
                      <div>
                        <h4 className="font-semibold">Garantía de 12 Meses</h4>
                        <p className="text-sm text-gray-600">En todos nuestros productos</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="p-4 border border-gray-200 rounded-lg"
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6 text-red-600" />
                      <div>
                        <h4 className="font-semibold">Pago Seguro</h4>
                        <p className="text-sm text-gray-600">Múltiples métodos de pago</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Payment methods logos */}
                  <div className="mt-4 flex justify-center gap-3">
                    <img src="/images/visa.png" alt="Visa" className="h-6" />
                    <img src="/images/mastercard.png" alt="Mastercard" className="h-6" />
                    <img src="/images/amex.png" alt="American Express" className="h-6" />
                    <img src="/images/paypal.png" alt="PayPal" className="h-6" />
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
