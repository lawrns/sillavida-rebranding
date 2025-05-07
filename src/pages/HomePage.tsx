import { useState, useEffect, useCallback } from 'react';
import { Truck, CreditCard, Shield, ChevronRight, Tag, Lock, FileCheck, HeadphonesIcon, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion
import { chairs } from '../data/chairs';
import ProductCard from '../components/ProductCard';
import ShopifyProductCard from '../components/ShopifyProductCard';
import HeroSlider from '../components/HeroSlider';
import PersonalizedBanner from '../components/PersonalizedBanner';
import ErgonomicEducationalSectionCondensed from '../components/ErgonomicEducationalSectionCondensed';
import TestimonialCarousel from '../components/TestimonialCarousel';
import LazyImage from '../components/LazyImage';
import { getFeaturedTestimonials } from '../data/testimonials';
import { getProducts, getFeaturedProducts, getCollections, shopifyClient } from '../lib/shopify';
import type { ShopifyProduct } from '../types/shopify';
import './HomePage.css'; // Import the custom CSS for text styling

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

      {/* Why Choose SillaVida Section */}
      <section className="bg-gray-50 py-12 overflow-hidden border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-[#111827] mb-2">Por Qué Elegir SillaVida</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Nos comprometemos a ofrecerte la mejor experiencia en cada aspecto</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-start">
              <div className="bg-green-50 p-3 rounded-full mb-4 flex items-center justify-center">
                <Truck className="h-6 w-6 text-[#425e99]" />
              </div>
              <h3 className="font-heading font-bold text-[#111827] text-lg mb-2">Envío a Todo México</h3>
              <p className="text-gray-600 text-sm">Entrega rápida y segura a cualquier parte del país.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-start">
              <div className="bg-green-50 p-3 rounded-full mb-4 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-[#425e99]" />
              </div>
              <h3 className="font-heading font-bold text-[#111827] text-lg mb-2">Pagos Seguros</h3>
              <p className="text-gray-600 text-sm">Múltiples métodos de pago con seguridad garantizada.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-start">
              <div className="bg-green-50 p-3 rounded-full mb-4 flex items-center justify-center">
                <Shield className="h-6 w-6 text-[#425e99]" />
              </div>
              <h3 className="font-heading font-bold text-[#111827] text-lg mb-2">Garantía de Calidad</h3>
              <p className="text-gray-600 text-sm">12 meses de garantía en todos nuestros productos.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-start">
              <div className="bg-green-50 p-3 rounded-full mb-4 flex items-center justify-center">
                <HeadphonesIcon className="h-6 w-6 text-[#425e99]" />
              </div>
              <h3 className="font-heading font-bold text-[#111827] text-lg mb-2">Atención al Cliente</h3>
              <p className="text-gray-600 text-sm">Soporte personalizado para resolver todas tus dudas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-8">
            <div className="w-full text-center mb-4">
              <h2 className="text-3xl font-heading font-bold text-black mb-4">Nuestros Más Vendidos</h2>
              <p className="text-gray-600 mb-6 font-body max-w-2xl mx-auto">Descubre por qué nuestros clientes eligen estas sillas. Combinan ergonomía, calidad y estilo para mejorar tu experiencia de trabajo o juego.</p>
            </div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                  <ShopifyProductCard key={`shopify-${product.id}`} product={product} hideDescription={true} />
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

      {/* Featured Products Banners section removed as requested */}

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-4 text-black">Encuentra tu silla ideal</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">Descubre nuestra colección de sillas ergonómicas diseñadas para mejorar tu postura, productividad y bienestar durante largas jornadas de trabajo.</p>
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
                      <div className="w-full h-[300px]">
                        <LazyImage 
                          src={imageSrc} 
                          alt={collection.title} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#21303f]/80 to-transparent flex items-end p-6 sm:p-8">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-heading font-bold mb-2 text-[#d8dce5] home-category-heading">{collection.title}</h3>
                          {/* Description removed as requested */}
                          <span className="flex items-center text-[#d8dce5] home-category-link">
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
                  <div className="w-full h-[300px]">
                    <LazyImage 
                      src="/images/ejecutiva.png" 
                      alt="Sillas Ejecutivas" 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#21303f]/80 to-transparent flex items-end p-6 sm:p-8">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-heading font-bold mb-2 text-[#d8dce5] home-category-heading">Sillas Ejecutivas</h3>
                      {/* Description removed as requested */}
                      <span className="flex items-center text-[#d8dce5] home-category-link">
                        Ver colección <ChevronRight className="ml-2" />
                      </span>
                    </div>
                  </div>
                </Link>
                <Link to="/category/sillas-ergonomicas" className="group relative overflow-hidden rounded-lg">
                  <div className="w-full h-[300px]">
                    <LazyImage 
                      src="/images/ergonomica.png" 
                      alt="Sillas Ergonómicas" 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#21303f]/80 to-transparent flex items-end p-6 sm:p-8">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-heading font-bold mb-2 text-[#d8dce5] home-category-heading">Sillas Ergonómicas</h3>
                      {/* Description removed as requested */}
                      <span className="flex items-center text-[#d8dce5] home-category-link">
                        Ver colección <ChevronRight className="ml-2" />
                      </span>
                    </div>
                  </div>
                </Link>
                <Link to="/category/sillas-gamer" className="group relative overflow-hidden rounded-lg">
                  <div className="w-full h-[300px]">
                    <LazyImage 
                      src="/images/gamer.png" 
                      alt="Sillas Gamer" 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#21303f]/80 to-transparent flex items-end p-6 sm:p-8">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-heading font-bold mb-2 text-[#d8dce5] home-category-heading">Sillas Gamer</h3>
                      {/* Description removed as requested */}
                      <span className="flex items-center text-[#d8dce5] home-category-link">
                        Ver colección <ChevronRight className="ml-2" />
                      </span>
                    </div>
                  </div>
                </Link>
                <Link to="/category/sillas-secretariales" className="group relative overflow-hidden rounded-lg">
                  <div className="w-full h-[300px]">
                    <LazyImage 
                      src="/images/secretariales.png" 
                      alt="Sillas Secretariales" 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#21303f]/80 to-transparent flex items-end p-6 sm:p-8">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-heading font-bold mb-2 text-[#d8dce5] home-category-heading">Sillas Secretariales</h3>
                      {/* Description removed as requested */}
                      <span className="flex items-center text-[#d8dce5] home-category-link">
                        Ver colección <ChevronRight className="ml-2" />
                      </span>
                    </div>
                  </div>
                </Link>
                <Link to="/category/sillas-de-visita" className="group relative overflow-hidden rounded-lg">
                  <div className="w-full h-[300px]">
                    <LazyImage 
                      src="/images/visita.png" 
                      alt="Sillas de Visita" 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#21303f]/80 to-transparent flex items-end p-6 sm:p-8">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-heading font-bold mb-2 text-[#d8dce5] home-category-heading">Sillas de Visita</h3>
                      {/* Description removed as requested */}
                      <span className="flex items-center text-[#d8dce5] home-category-link">
                        Ver colección <ChevronRight className="ml-2" />
                      </span>
                    </div>
                  </div>
                </Link>
                <Link to="/category/accesorios" className="group relative overflow-hidden rounded-lg">
                  <div className="w-full h-[300px]">
                    <LazyImage 
                      src="/images/accesorio.png" 
                      alt="Accesorios" 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#21303f]/80 to-transparent flex items-end p-6 sm:p-8">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-heading font-bold mb-2 text-[#d8dce5] home-category-heading">Accesorios</h3>
                      {/* Description removed as requested */}
                      <span className="flex items-center text-[#d8dce5] home-category-link">
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

      {/* Educational Section - Why Invest in an Ergonomic Chair */}
      <ErgonomicEducationalSectionCondensed />

      {/* Historias de Vida - Customer Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-black mb-4">Historias de Vida</h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-body">
              Descubre cómo nuestras sillas han transformado la vida de nuestros clientes, mejorando su salud, productividad y bienestar.
            </p>
          </div>
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2 px-4 py-2 bg-[#21303f]/10 rounded-full">
              <Users className="h-5 w-5 text-[#21303f]" />
              <span className="text-sm font-medium text-[#21303f]">Experiencias reales de nuestros clientes</span>
            </div>
          </div>
          <TestimonialCarousel testimonials={getFeaturedTestimonials()} className="max-w-4xl mx-auto" />
          <div className="text-center mt-8">
            <Link 
              to="/testimonios"
              className="inline-flex items-center text-[#21303f] hover:text-[#111827] transition-colors"
            >
              Ver más historias <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>


      {/* Why Choose SillaVida Section */}
      <section className="bg-gray-50 py-12 overflow-hidden border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-[#111827] mb-2">Por Qué Elegir SillaVida</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Nos comprometemos a ofrecerte la mejor experiencia en cada aspecto</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-start">
              <div className="bg-green-50 p-3 rounded-full mb-4 flex items-center justify-center">
                <Truck className="h-6 w-6 text-[#425e99]" />
              </div>
              <h3 className="font-heading font-bold text-[#111827] text-lg mb-2">Envío a Todo México</h3>
              <p className="text-gray-600 text-sm">Entrega rápida y segura a cualquier parte del país.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-start">
              <div className="bg-green-50 p-3 rounded-full mb-4 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-[#425e99]" />
              </div>
              <h3 className="font-heading font-bold text-[#111827] text-lg mb-2">Pagos Seguros</h3>
              <p className="text-gray-600 text-sm">Múltiples métodos de pago con seguridad garantizada.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-start">
              <div className="bg-green-50 p-3 rounded-full mb-4 flex items-center justify-center">
                <Shield className="h-6 w-6 text-[#425e99]" />
              </div>
              <h3 className="font-heading font-bold text-[#111827] text-lg mb-2">Garantía de Calidad</h3>
              <p className="text-gray-600 text-sm">12 meses de garantía en todos nuestros productos.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-start">
              <div className="bg-green-50 p-3 rounded-full mb-4 flex items-center justify-center">
                <HeadphonesIcon className="h-6 w-6 text-[#425e99]" />
              </div>
              <h3 className="font-heading font-bold text-[#111827] text-lg mb-2">Atención al Cliente</h3>
              <p className="text-gray-600 text-sm">Soporte personalizado para resolver todas tus dudas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter - Optimized for mobile */}
      <section className="bg-[#111827] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3 sm:mb-4">¡No te pierdas nuestras ofertas!</h2>
          <p className="text-white/80 mb-6 sm:mb-8 font-body text-base">Suscríbete para recibir novedades y descuentos exclusivos</p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Tu correo electrónico" 
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-base"
              aria-label="Correo electrónico para suscripción"
            />
            <button 
              type="submit"
              className="bg-[#628de5] text-white px-6 py-3 rounded-lg font-heading font-semibold hover:bg-[#628de5]/90 transition-colors text-base"
              aria-label="Suscribirse al boletín"
            >
              Suscribirse
            </button>
          </form>
        </div>
      </section>

      {/* Back to Top Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-teal text-white p-3 rounded-full shadow-lg hover:bg-teal-light transition-colors"
          aria-label="Volver al inicio"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default HomePage;
