import React, { useState, useEffect } from 'react';
import { ArrowRight, Truck, CreditCard, Shield, Star, ChevronRight, Tag, Lock, FileCheck, HeadphonesIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { chairs } from '../data/chairs';
import ProductCard from '../components/ProductCard';
import PromoBanner from '../components/PromoBanner';
import ShopifyPromoBanner from '../components/ShopifyPromoBanner';
import ShopifyProductCard from '../components/ShopifyProductCard';
import HeroSlider from '../components/HeroSlider';
import { getProducts, getProductsByCollection } from '../lib/shopify';
import type { ShopifyProduct } from '../types/shopify';

const HomePage = () => {
  // Static data (fallback)
  const staticBestSellers = chairs.slice(0, 8);
  const staticFeaturedOfficeChair = chairs.find(chair => chair.id === 'ergopro-elite')!;
  const staticFeaturedGamingChair = chairs.find(chair => chair.id === 'xgamer-pro')!;
  
  // State for Shopify data
  const [bestSellers, setBestSellers] = useState<ShopifyProduct[]>([]);
  const [featuredOfficeChair, setFeaturedOfficeChair] = useState<ShopifyProduct | null>(null);
  const [featuredGamingChair, setFeaturedGamingChair] = useState<ShopifyProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch data from Shopify
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch best sellers
        const products = await getProducts(6);
        setBestSellers(products);
        
        // Fetch featured office chair
        // In a real implementation, we would use collection handles or tags to filter
        // For now, we'll just use the first product as a demo
        if (products.length > 0) {
          setFeaturedOfficeChair(products[0]);
        }
        
        // Fetch featured gaming chair
        // For demo purposes, we'll use the second product
        if (products.length > 1) {
          setFeaturedGamingChair(products[1]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data from Shopify:', error);
        setError('Failed to load products. Using static data instead.');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Use Shopify data if available, otherwise fall back to static data
  const displayedBestSellers = bestSellers.length > 0 ? bestSellers : staticBestSellers;
  const displayedFeaturedOfficeChair = featuredOfficeChair || staticFeaturedOfficeChair;
  const displayedFeaturedGamingChair = featuredGamingChair || staticFeaturedGamingChair;

  return (
    <div className="flex flex-col">
      <HeroSlider />

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
          {error && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8" role="alert">
              <p>{error}</p>
            </div>
          )}
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
            <Link to="/category/ejecutivas" className="group relative overflow-hidden rounded-lg">
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
            <Link to="/category/ergonomicas" className="group relative overflow-hidden rounded-lg">
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
            <Link to="/category/gamer" className="group relative overflow-hidden rounded-lg">
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
            <Link to="/category/secretariales" className="group relative overflow-hidden rounded-lg">
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
            <Link to="/category/visitas" className="group relative overflow-hidden rounded-lg">
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
              {isLoading ? (
                // Loading skeleton
                Array(6).fill(0).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
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
                // Shopify products
                bestSellers.slice(0, 6).map((product) => (
                  <ShopifyProductCard key={product.id} product={product} />
                ))
              ) : (
                // Fallback to static data
                staticBestSellers.slice(0, 6).map((chair) => (
                  <ProductCard key={chair.id} chair={chair} />
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
                  src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
                  alt="Google Reviews"
                  className="h-8"
                />
                <img 
                  src="https://www.procon.sp.gov.br/wp-content/uploads/2011/03/logo_procon_sp.png"
                  alt="Procon"
                  className="h-8"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2">FORMAS DE PAGO</h3>
              <div className="grid grid-cols-3 gap-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-8" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-8" />
                <img src="https://logodownload.org/wp-content/uploads/2019/09/elo-logo.png" alt="Elo" className="h-8" />
                <img src="https://logodownload.org/wp-content/uploads/2017/08/hipercard-logo.png" alt="Hipercard" className="h-8" />
                <div className="bg-white text-gray-900 text-xs font-bold p-2 rounded flex items-center justify-center">
                  BOLETO
                </div>
                <img src="https://logopng.com.br/logos/pix-106.png" alt="PIX" className="h-8" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2">ENVÍO</h3>
              <div className="bg-blue-900 p-4 rounded">
                <img 
                  src="https://static.wixstatic.com/media/544ee6_e5b38c5a61024c3d8c42e13a40c8f832~mv2.png/v1/fill/w_560,h_148,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/transportadora-logo.png"
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
    </div>
  );
};

export default HomePage;
