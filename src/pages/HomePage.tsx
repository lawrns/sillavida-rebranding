import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Truck, CreditCard, Shield, Star, ChevronRight, Tag, Lock, FileCheck, HeadphonesIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion
import { chairs } from '../data/chairs';
import ProductCard from '../components/ProductCard';
import PromoBanner from '../components/PromoBanner';
import ShopifyPromoBanner from '../components/ShopifyPromoBanner';
import ShopifyProductCard from '../components/ShopifyProductCard';
import HeroSlider from '../components/HeroSlider';
import PersonalizedBanner from '../components/PersonalizedBanner';
import { getProducts, getFeaturedProducts, getCollections, shopifyClient } from '../lib/shopify';
import type { ShopifyProduct } from '../types/shopify';

// Analytics tracking function
const trackEvent = (eventName: string, eventData: Record<string, any> = {}) => {
  // In a real implementation, this would send data to an analytics service
  // For now, we'll just log to console
  console.log(`[Analytics] ${eventName}:`, eventData);
  
  // Example implementation with Google Analytics
  // if (window.gtag) {
  //   window.gtag('event', eventName, eventData);
  // }
};

const HomePage = () => {
  // Static data (fallback)
  const staticBestSellers = chairs.slice(0, 8);
  const staticFeaturedOfficeChair = chairs.find(chair => chair.id === 'ergopro-elite')!;
  const staticFeaturedGamingChair = chairs.find(chair => chair.id === 'xgamer-pro')!;
  
  // State for Shopify data
  const [bestSellers, setBestSellers] = useState<ShopifyProduct[]>([]);
  const [featuredOfficeChair, setFeaturedOfficeChair] = useState<ShopifyProduct | null>(null);
  const [featuredGamingChair, setFeaturedGamingChair] = useState<ShopifyProduct | null>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false); // Track if data has been fetched
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Fetch data from Shopify with retry logic
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Track page view
      trackEvent('page_view', { page: 'home' });
      
      // Fetch Shopify collections
      const shopifyCollections = await getCollections(20);
      setCollections(shopifyCollections);
      console.log('Shopify collections:', shopifyCollections);
      
      // Fetch products from Mas Vendidos collection
      const masVendidosProducts = await getFeaturedProducts({ 
        collectionHandle: 'mas-vendidos',
        limit: 6
      });
      
      let productData = masVendidosProducts;
      let hasFeaturedOffice = false;
      let hasFeaturedGaming = false;
      
      if (masVendidosProducts.length > 0) {
        setBestSellers(masVendidosProducts);
        
        // Use first two products for featured banners
        if (masVendidosProducts.length >= 1) {
          setFeaturedOfficeChair(masVendidosProducts[0]);
          hasFeaturedOffice = true;
        }
        
        if (masVendidosProducts.length >= 2) {
          setFeaturedGamingChair(masVendidosProducts[1]);
          hasFeaturedGaming = true;
        }
      } else {
        // If no products in Mas Vendidos collection, fall back to best sellers
        const result = await getProducts(6, 'BEST_SELLING');
        setBestSellers(result.products);
        productData = result.products;
        
        if (result.products.length > 0) {
          setFeaturedOfficeChair(result.products[0]);
          hasFeaturedOffice = true;
        }
        
        if (result.products.length > 1) {
          setFeaturedGamingChair(result.products[1]);
          hasFeaturedGaming = true;
        }
      }
      
      // Set loading and data states
      setIsLoading(false);
      setDataFetched(true);
      setError(null);
      
      // Track successful data load with the actual data we just fetched
      trackEvent('data_loaded', { 
        bestSellers: productData.length,
        hasFeaturedOffice,
        hasFeaturedGaming
      });
      
    } catch (error) {
      console.error('Error fetching data from Shopify:', error);
      
      // Track error
      trackEvent('data_error', { 
        message: error instanceof Error ? error.message : 'Unknown error',
        retryCount
      });
      
      // Retry logic (max 3 retries)
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
        setError(`Failed to load products. Retrying... (${retryCount + 1}/3)`);
        
        // Retry after a delay
        setTimeout(() => {
          fetchData();
        }, 2000);
      } else {
        // After all retries failed, use static data
        setError('Failed to load products. Using static data instead.');
        setIsLoading(false);
        setDataFetched(true); // Mark as fetched so we show static data instead of loading indefinitely
      }
    }
  }, [retryCount]);
  
  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    
    // Clear cache when component unmounts
    return () => {
      // This ensures fresh data on next visit
      shopifyClient.clearCache();
    };
  }, [fetchData]);
  
  // Use Shopify data if available, otherwise fall back to static data
  const displayedBestSellers = bestSellers.length > 0 ? bestSellers : staticBestSellers;
  const displayedFeaturedOfficeChair = featuredOfficeChair || staticFeaturedOfficeChair;
  const displayedFeaturedGamingChair = featuredGamingChair || staticFeaturedGamingChair;

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
      className="flex flex-col"
    >
      <HeroSlider />
      
      {/* Personalized Banner for logged-in users */}
      <PersonalizedBanner />

      {/* Trust Bar */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center justify-center">
            <Truck className="h-8 w-8 text-red-600 mr-4" />
            <div>
              <h3 className="font-semibold">Envío a Todo México</h3>
              <p className="text-gray-600">Entrega rápida y segura</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <CreditCard className="h-8 w-8 text-red-600 mr-4" />
            <div>
              <h3 className="font-semibold">Pagos Seguros</h3>
              <p className="text-gray-600">Múltiples métodos de pago</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Shield className="h-8 w-8 text-red-600 mr-4" />
            <div>
              <h3 className="font-semibold">Garantía de Calidad</h3>
              <p className="text-gray-600">12 meses de garantía</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <HeadphonesIcon className="h-8 w-8 text-red-600 mr-4" />
            <div>
              <h3 className="font-semibold">Atención al Cliente</h3>
              <p className="text-gray-600">Soporte 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Banners */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredOfficeChair ? (
              <ShopifyPromoBanner product={featuredOfficeChair} />
            ) : (
              <PromoBanner chair={staticFeaturedOfficeChair} />
            )}
            
            {featuredGamingChair ? (
              <ShopifyPromoBanner product={featuredGamingChair} dark />
            ) : (
              <PromoBanner chair={staticFeaturedGamingChair} dark />
            )}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestras Categorías</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.length > 0 ? (
              // Map through Shopify collections that start with "Silla"
              collections
                .filter(collection => collection.title.startsWith('Silla'))
                .map((collection, index) => {
                  // Map collection titles to image paths
                  const imageMap: Record<string, string> = {
                    'Sillas Ejecutivas': '/images/ejecutiva.png',
                    'Sillas Ergonómicas': '/images/ergonomica.png',
                    'Sillas Gamer': '/images/gamer.png',
                    'Sillas Secretariales': '/images/secretariales.png',
                    'Sillas de Visita': '/images/visita.png',
                    'Accesorios': '/images/accesorio.png'
                  };
                  
                  // Map collection titles to descriptions
                  const descriptionMap: Record<string, string> = {
                    'Sillas Ejecutivas': 'Elegancia y confort para ejecutivos',
                    'Sillas Ergonómicas': 'Diseñadas para tu bienestar',
                    'Sillas Gamer': 'Para sesiones épicas de juego',
                    'Sillas Secretariales': 'Funcionalidad y comodidad',
                    'Sillas de Visita': 'Para espacios de recepción',
                    'Accesorios': 'Complementos para tu silla'
                  };
                  
                  // Use the collection's image if available, otherwise use the mapped image
                  const imageSrc = collection.image?.url || imageMap[collection.title] || '/images/placeholder.png';
                  const description = descriptionMap[collection.title] || 'Explora nuestra colección';
                  
                  return (
                    <Link 
                      key={collection.id} 
                      to={`/category/${collection.handle}`} 
                      className="group relative overflow-hidden rounded-lg"
                    >
                      <img 
                        src={imageSrc} 
                        alt={collection.title} 
                        className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                        <div className="text-white">
                          <h3 className="text-2xl font-bold mb-2">{collection.title}</h3>
                          <p className="mb-4">{description}</p>
                          <span className="flex items-center text-red-400">
                            Ver colección <ChevronRight className="ml-2" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })
            ) : (
              // Fallback to static category cards if no collections are available
              <>
                <Link to="/category/sillas-ejecutivas" className="group relative overflow-hidden rounded-lg">
                  <img 
                    src="/images/ejecutiva.png" 
                    alt="Sillas Ejecutivas" 
                    className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-2">Sillas Ejecutivas</h3>
                      <p className="mb-4">Elegancia y confort para ejecutivos</p>
                      <span className="flex items-center text-red-400">
                        Ver colección <ChevronRight className="ml-2" />
                      </span>
                    </div>
                  </div>
                </Link>
                <Link to="/category/sillas-ergonomicas" className="group relative overflow-hidden rounded-lg">
                  <img 
                    src="/images/ergonomica.png" 
                    alt="Sillas Ergonómicas" 
                    className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-2">Sillas Ergonómicas</h3>
                      <p className="mb-4">Diseñadas para tu bienestar</p>
                      <span className="flex items-center text-red-400">
                        Ver colección <ChevronRight className="ml-2" />
                      </span>
                    </div>
                  </div>
                </Link>
                <Link to="/category/sillas-gamer" className="group relative overflow-hidden rounded-lg">
                  <img 
                    src="/images/gamer.png" 
                    alt="Sillas Gamer" 
                    className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-2">Sillas Gamer</h3>
                      <p className="mb-4">Para sesiones épicas de juego</p>
                      <span className="flex items-center text-red-400">
                        Ver colección <ChevronRight className="ml-2" />
                      </span>
                    </div>
                  </div>
                </Link>
                <Link to="/category/sillas-secretariales" className="group relative overflow-hidden rounded-lg">
                  <img 
                    src="/images/secretariales.png" 
                    alt="Sillas Secretariales" 
                    className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-2">Sillas Secretariales</h3>
                      <p className="mb-4">Funcionalidad y comodidad</p>
                      <span className="flex items-center text-red-400">
                        Ver colección <ChevronRight className="ml-2" />
                      </span>
                    </div>
                  </div>
                </Link>
                <Link to="/category/sillas-de-visita" className="group relative overflow-hidden rounded-lg">
                  <img 
                    src="/images/visita.png" 
                    alt="Sillas de Visita" 
                    className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-2">Sillas de Visita</h3>
                      <p className="mb-4">Para espacios de recepción</p>
                      <span className="flex items-center text-red-400">
                        Ver colección <ChevronRight className="ml-2" />
                      </span>
                    </div>
                  </div>
                </Link>
                <Link to="/category/accesorios" className="group relative overflow-hidden rounded-lg">
                  <img 
                    src="/images/accesorio.png" 
                    alt="Accesorios" 
                    className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-2">Accesorios</h3>
                      <p className="mb-4">Complementos para tu silla</p>
                      <span className="flex items-center text-red-400">
                        Ver colección <ChevronRight className="ml-2" />
                      </span>
                    </div>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Super Selección de los Más Vendidos</h2>
                <p className="text-gray-600 mb-6">¡Aprovecha las ofertas y compre!</p>
                <Link 
                  to="/category/mas-vendidos"
                  className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors"
                >
                  Ver Todos <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading && !dataFetched ? (
                // Loading skeleton - only show when loading and data hasn't been fetched yet
                Array(6).fill(0).map((_, index) => (
                  <div key={`skeleton-${index}`} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-300"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
                      <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
                      <div className="h-10 bg-gray-300 rounded w-full"></div>
                    </div>
                  </div>
                ))
              ) : bestSellers.length > 0 ? (
                // Shopify products - show when we have actual data
                bestSellers.slice(0, 6).map((product) => (
                  <ShopifyProductCard key={`shopify-${product.id}`} product={product} />
                ))
              ) : (
                // Fallback to static data - show when data has been fetched but no Shopify products available
                staticBestSellers.slice(0, 6).map((chair) => (
                  <ProductCard key={`static-${chair.id}`} chair={chair} />
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-yellow-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-yellow-400">
            <div className="flex items-center gap-3 p-4">
              <Tag className="h-6 w-6" />
              <div>
                <h4 className="font-bold">HASTA 12% DE DESCUENTO*</h4>
                <p className="text-sm">en Pix o Boleto. 1x en Tarjeta 5%</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <CreditCard className="h-6 w-6" />
              <div>
                <h4 className="font-bold">PAGO FÁCIL</h4>
                <p className="text-sm">Hasta 10x sin Intereses</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <Lock className="h-6 w-6" />
              <div>
                <h4 className="font-bold">COMPRA SEGURA</h4>
                <p className="text-sm">Ambiente seguro y certificado</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <FileCheck className="h-6 w-6" />
              <div>
                <h4 className="font-bold">NF Y GARANTÍA</h4>
                <p className="text-sm">En todos los productos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust and Payment Methods */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2">SEGURIDAD</h3>
              <div className="flex items-center gap-6">
                <div className="bg-white rounded-full p-2">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 bg-red-500 rounded-full opacity-20"></div>
                    <span className="text-red-600 font-bold text-xl">4.9</span>
                  </div>
                </div>
                <img 
                  src="/images/google-logo.png"
                  alt="Google Reviews"
                  className="h-8"
                />
                <img 
                  src="/images/procon-logo.png"
                  alt="Procon"
                  className="h-8"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2">FORMAS DE PAGO</h3>
              <div className="grid grid-cols-3 gap-4">
                <img src="/images/visa-logo.png" alt="Visa" className="h-8" />
                <img src="/images/mastercard-logo.png" alt="Mastercard" className="h-8" />
                <img src="/images/elo-logo.png" alt="Elo" className="h-8" />
                <img src="/images/hipercard-logo.png" alt="Hipercard" className="h-8" />
                <div className="bg-white text-gray-900 text-xs font-bold p-2 rounded flex items-center justify-center">
                  BOLETO
                </div>
                <img src="/images/pix-logo.png" alt="PIX" className="h-8" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2">ENVÍO</h3>
              <div className="bg-blue-900 p-4 rounded">
                <img 
                  src="/images/transportadora-logo.png"
                  alt="Transportadora"
                  className="h-12"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-red-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¡No te pierdas nuestras ofertas!</h2>
          <p className="text-red-100 mb-8">Suscríbete para recibir novedades y descuentos exclusivos</p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <button
              type="submit"
              className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
            >
              Suscribirse
            </button>
          </form>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;
