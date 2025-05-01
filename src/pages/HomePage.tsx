import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Truck, CreditCard, Shield, Star, ChevronRight, Tag, Lock, FileCheck, HeadphonesIcon, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion
import { chairs } from '../data/chairs';
import ProductCard from '../components/ProductCard';
import PromoBanner from '../components/PromoBanner';
import ShopifyPromoBanner from '../components/ShopifyPromoBanner';
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

      {/* Trust Bar - Optimized for mobile with horizontal scrolling */}
      <section className="bg-white py-8 sm:py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto pb-4 sm:pb-0 sm:grid sm:grid-cols-4 gap-6 hide-scrollbar">
            <div className="flex items-center justify-center flex-shrink-0 min-w-[250px] sm:min-w-0">
              <Truck className="h-7 w-7 sm:h-8 sm:w-8 text-teal mr-3 sm:mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-heading font-semibold text-base">Envío a Todo México</h3>
                <p className="text-gray-600 font-body text-sm">Entrega rápida y segura</p>
              </div>
            </div>
            <div className="flex items-center justify-center flex-shrink-0 min-w-[250px] sm:min-w-0">
              <CreditCard className="h-7 w-7 sm:h-8 sm:w-8 text-teal mr-3 sm:mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-heading font-semibold text-base">Pagos Seguros</h3>
                <p className="text-gray-600 font-body text-sm">Múltiples métodos de pago</p>
              </div>
            </div>
            <div className="flex items-center justify-center flex-shrink-0 min-w-[250px] sm:min-w-0">
              <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-teal mr-3 sm:mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-heading font-semibold text-base">Garantía de Calidad</h3>
                <p className="text-gray-600 font-body text-sm">12 meses de garantía</p>
              </div>
            </div>
            <div className="flex items-center justify-center flex-shrink-0 min-w-[250px] sm:min-w-0">
              <HeadphonesIcon className="h-7 w-7 sm:h-8 sm:w-8 text-teal mr-3 sm:mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-heading font-semibold text-base">Atención al Cliente</h3>
                <p className="text-gray-600 font-body text-sm">Soporte 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-[#7D9D8C]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-3xl font-heading font-bold text-[#1E5959] mb-4">Selección de los Más Vendidos</h2>
                <p className="text-[#7D9D8C] mb-6 font-body">¡Aprovecha las ofertas y compre!</p>
                <Link 
                  to="/category/mas-vendidos"
                  className="inline-flex items-center text-beige hover:text-beige-dark transition-colors"
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

      {/* Featured Products Banners section removed as requested */}

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12 text-teal-dark">Nuestras Categorías</h2>
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
                      <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/80 to-transparent flex items-end p-6 sm:p-8">
                        <div className="text-beige">
                          <h3 className="text-xl sm:text-2xl font-heading font-bold mb-2 home-category-heading">{collection.title}</h3>
                          <p className="mb-4 font-body text-base home-category-description">{description}</p>
                          <span className="flex items-center text-base home-category-link">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/80 to-transparent flex items-end p-6 sm:p-8">
                    <div className="text-beige">
                      <h3 className="text-xl sm:text-2xl font-heading font-bold mb-2 home-category-heading">Sillas Ejecutivas</h3>
                      <p className="mb-4 font-body text-base home-category-description">Elegancia y confort para ejecutivos</p>
                      <span className="flex items-center text-base home-category-link">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/80 to-transparent flex items-end p-6 sm:p-8">
                    <div className="text-beige">
                      <h3 className="text-xl sm:text-2xl font-heading font-bold mb-2 home-category-heading">Sillas Ergonómicas</h3>
                      <p className="mb-4 font-body text-base home-category-description">Diseñadas para tu bienestar</p>
                      <span className="flex items-center text-base home-category-link">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/80 to-transparent flex items-end p-6 sm:p-8">
                    <div className="text-beige">
                      <h3 className="text-xl sm:text-2xl font-heading font-bold mb-2 home-category-heading">Sillas Gamer</h3>
                      <p className="mb-4 font-body text-base home-category-description">Para sesiones épicas de juego</p>
                      <span className="flex items-center text-base home-category-link">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/80 to-transparent flex items-end p-6 sm:p-8">
                    <div className="text-beige">
                      <h3 className="text-xl sm:text-2xl font-heading font-bold mb-2 home-category-heading">Sillas Secretariales</h3>
                      <p className="mb-4 font-body text-base home-category-description">Funcionalidad y comodidad</p>
                      <span className="flex items-center text-base home-category-link">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/80 to-transparent flex items-end p-6 sm:p-8">
                    <div className="text-beige">
                      <h3 className="text-xl sm:text-2xl font-heading font-bold mb-2 home-category-heading">Sillas de Visita</h3>
                      <p className="mb-4 font-body text-base home-category-description">Para espacios de recepción</p>
                      <span className="flex items-center text-base home-category-link">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/80 to-transparent flex items-end p-6 sm:p-8">
                    <div className="text-beige">
                      <h3 className="text-xl sm:text-2xl font-heading font-bold mb-2 home-category-heading">Accesorios</h3>
                      <p className="mb-4 font-body text-base home-category-description">Complementos para tu silla</p>
                      <span className="flex items-center text-base home-category-link">
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
            <h2 className="text-3xl font-heading font-bold text-teal-dark mb-4">Historias de Vida</h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-body">
              Descubre cómo nuestras sillas han transformado la vida de nuestros clientes, mejorando su salud, productividad y bienestar.
            </p>
          </div>
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2 px-4 py-2 bg-teal/10 rounded-full">
              <Users className="h-5 w-5 text-teal" />
              <span className="text-sm font-medium text-teal">Experiencias reales de nuestros clientes</span>
            </div>
          </div>
          <TestimonialCarousel testimonials={getFeaturedTestimonials()} className="max-w-4xl mx-auto" />
          <div className="text-center mt-8">
            <Link 
              to="/testimonios"
              className="inline-flex items-center text-teal hover:text-teal-light transition-colors"
            >
              Ver más historias <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>


      {/* Promotional Banner - Optimized for mobile with horizontal scrolling */}
      <section className="bg-[#E8DED1] py-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto pb-4 sm:pb-0 sm:grid sm:grid-cols-4 gap-6 hide-scrollbar">
            <div className="flex items-center gap-3 p-4 flex-shrink-0 min-w-[250px] sm:min-w-0">
              <Tag className="h-6 w-6 flex-shrink-0" />
              <div>
                <h4 className="font-heading font-bold text-[#7D9D8C] text-sm sm:text-base">HASTA 12% DE DESCUENTO*</h4>
                <p className="text-xs sm:text-sm font-body text-[#C87D55]">en Pix o Boleto. 1x en Tarjeta 5%</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 flex-shrink-0 min-w-[250px] sm:min-w-0">
              <CreditCard className="h-6 w-6 flex-shrink-0" />
              <div>
                <h4 className="font-heading font-bold text-[#7D9D8C] text-sm sm:text-base">PAGO FÁCIL</h4>
                <p className="text-xs sm:text-sm font-body text-[#C87D55]">Hasta 10x sin Intereses</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 flex-shrink-0 min-w-[250px] sm:min-w-0">
              <Lock className="h-6 w-6 flex-shrink-0" />
              <div>
                <h4 className="font-heading font-bold text-[#7D9D8C] text-sm sm:text-base">COMPRA SEGURA</h4>
                <p className="text-xs sm:text-sm font-body text-[#C87D55]">Ambiente seguro y certificado</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 flex-shrink-0 min-w-[250px] sm:min-w-0">
              <FileCheck className="h-6 w-6 flex-shrink-0" />
              <div>
                <h4 className="font-heading font-bold text-[#7D9D8C] text-sm sm:text-base">NF Y GARANTÍA</h4>
                <p className="text-xs sm:text-sm font-body text-[#C87D55]">En todos los productos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter - Optimized for mobile */}
      <section className="bg-[#7D9D8C] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#E8DED1] mb-3 sm:mb-4">¡No te pierdas nuestras ofertas!</h2>
          <p className="text-[#E8DED1]/80 mb-6 sm:mb-8 font-body text-base">Suscríbete para recibir novedades y descuentos exclusivos</p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8DED1] text-base"
              aria-label="Correo electrónico para suscripción"
            />
            <button
              type="submit"
              className="bg-[#E8DED1] text-[#7D9D8C] px-6 py-3 rounded-lg font-heading font-semibold hover:bg-[#E8DED1]/90 transition-colors text-base"
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
