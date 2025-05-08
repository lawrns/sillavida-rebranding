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
import ChairChooserBanner from '../components/ChairChooserBanner';
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
  const staticFeaturedProducts = chairs.slice(0, 4);
  const staticTestimonials = getFeaturedTestimonials();
  
  // State for Shopify data
  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ShopifyProduct[]>([]);
  const [bestSellers, setBestSellers] = useState<ShopifyProduct[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch Shopify data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const products = await getProducts();
        setShopifyProducts(products);
        
        // Fetch featured products
        const featured = await getFeaturedProducts();
        setFeaturedProducts(featured);
        
        // Set best sellers (in a real app, you'd fetch this from a specific collection)
        setBestSellers(products.slice(0, 4));
        
        // Fetch collections
        const cols = await getCollections();
        setCollections(cols);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Track page view
    trackEvent('page_view', { page: 'home' });
  }, []);
  
  // Handle product click
  const handleProductClick = useCallback((product: any) => {
    trackEvent('product_click', {
      product_id: product.id,
      product_name: product.title,
      product_price: product.price
    });
  }, []);
  
  // Handle category click
  const handleCategoryClick = useCallback((category: string) => {
    trackEvent('category_click', { category });
  }, []);
  
  // Animations
  const pageVariants = {
    in: {
      opacity: 1,
      y: 0
    },
    out: {
      opacity: 0,
      y: '-1%'
    }
  };
  
  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };
  
  // Determine which products to display based on loading state
  const displayedFeaturedProducts = loading ? staticFeaturedProducts : featuredProducts;
  const displayedBestSellers = loading ? staticFeaturedProducts : bestSellers;
  const displayedFeaturedOfficeChair = loading ? chairs[0] : featuredProducts[0];
  const displayedFeaturedGamingChair = loading ? chairs[1] : featuredProducts[1];
  
  return (
    <motion.div
      initial="out"
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
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-heading font-bold text-[#111827]">Los Más Vendidos</h2>
              <p className="text-gray-600">Descubre nuestros productos más populares</p>
            </div>
            <Link to="/tienda" className="text-[#4b7cae] hover:text-[#4b7cae]/80 font-medium flex items-center">
              Ver todos
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedFeaturedProducts.map((product, index) => (
              <div key={product.id || index} onClick={() => handleProductClick(product)}>
                {product.id ? (
                  <ShopifyProductCard product={product} />
                ) : (
                  <ProductCard product={product} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Educational Section - Why Invest in an Ergonomic Chair */}
      <ErgonomicEducationalSectionCondensed />
      
      {/* Featured Products - Office Chair */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block bg-[#4b7cae]/10 text-[#4b7cae] text-xs font-semibold px-3 py-1 rounded-full mb-4">
                DESTACADO
              </div>
              <h2 className="text-3xl font-heading font-bold text-[#111827] mb-4">Silla de Oficina Ergonómica</h2>
              <p className="text-gray-600 mb-6">
                Diseñada para largas jornadas de trabajo, nuestra silla ergonómica te brinda el soporte que necesitas para mantener una postura saludable y productiva.
              </p>
              
              <ul className="space-y-3 mb-6">
                {['Soporte lumbar ajustable', 'Apoyabrazos 4D', 'Malla transpirable', 'Ajuste de altura neumático'].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-[#4b7cae]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="ml-2 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/producto/silla-oficina-ergonomica" 
                  className="bg-[#4b7cae] text-white px-6 py-3 rounded-lg font-heading font-semibold hover:bg-[#4b7cae]/90 transition-colors"
                  onClick={() => trackEvent('cta_click', { cta: 'office_chair_details' })}
                >
                  Ver detalles
                </Link>
                <button 
                  className="bg-gray-100 text-[#111827] px-6 py-3 rounded-lg font-heading font-semibold hover:bg-gray-200 transition-colors"
                  onClick={() => trackEvent('cta_click', { cta: 'office_chair_add_to_cart' })}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-4 -right-4 bg-[#4b7cae] text-white text-sm font-bold px-3 py-1 rounded-full">
                -15%
              </div>
              <div className="bg-gray-50 rounded-lg overflow-hidden p-6">
                <LazyImage 
                  src={displayedFeaturedOfficeChair?.images?.[0] || '/images/office-chair-featured.jpg'} 
                  alt="Silla de Oficina Ergonómica" 
                  className="w-full h-auto object-contain"
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <TestimonialCarousel testimonials={staticTestimonials} />
      
      {/* Chair Chooser Banner */}
      <ChairChooserBanner />

      {/* Newsletter - Optimized for mobile */}
      <section className="bg-[#111827] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block bg-[#4b7cae] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            NEWSLETTER
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-3">Mantente al día con nuestras novedades</h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Suscríbete para recibir actualizaciones sobre nuevos productos, ofertas especiales y consejos para mejorar tu postura, productividad y bienestar.
          </p>
          
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4 mb-6">
            <input 
              type="email" 
              placeholder="Tu correo electrónico" 
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b7cae]"
              aria-label="Correo electrónico para newsletter"
            />
            <button 
              type="submit"
              className="bg-[#4b7cae] text-white px-6 py-3 rounded-lg font-heading font-semibold hover:bg-[#4b7cae]/90 transition-colors"
              aria-label="Suscribirse al newsletter"
            >
              Suscribirse
            </button>
          </form>
          
          <div className="text-white/60 text-xs">
            Al suscribirte, aceptas recibir correos de marketing. Puedes darte de baja en cualquier momento.
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;
