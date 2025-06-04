import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import type { ShopifyProduct } from '../../types/shopify';
import { chairs } from '../../data/chairs';

interface BestSellersSectionProps {
  bestSellers: ShopifyProduct[];
  isLoading: boolean;
  dataFetched: boolean;
}

/**
 * BestSellersSection - Single featured product showcase (template-inspired)
 * Optimized for attention spans with focused product presentation
 */
const BestSellersSection: React.FC<BestSellersSectionProps> = ({
  bestSellers,
  isLoading,
  dataFetched
}) => {
  const { addToCart } = useCart();
  
  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Use all products for carousel, fallback to chairs if no Shopify data
  const carouselProducts = bestSellers.length > 0 ? bestSellers : chairs.slice(0, 3);
  const isShopifyProduct = bestSellers.length > 0;
  
  // Get current featured product
  const featuredProduct = carouselProducts[currentIndex];
  
  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying || carouselProducts.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % carouselProducts.length);
    }, 8000); // 8 seconds per product
    
    return () => clearInterval(timer);
  }, [isAutoPlaying, carouselProducts.length]);
  
  // Manual navigation functions
  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % carouselProducts.length);
    setIsAutoPlaying(false); // Pause auto-play when user interacts
  };
  
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + carouselProducts.length) % carouselProducts.length);
    setIsAutoPlaying(false);
  };
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };
  
  // Resume auto-play after user interaction pause
  useEffect(() => {
    if (!isAutoPlaying) {
      const resumeTimer = setTimeout(() => setIsAutoPlaying(true), 15000); // Resume after 15s
      return () => clearTimeout(resumeTimer);
    }
  }, [isAutoPlaying]);
  
  
  // Extract product data with correct Shopify GraphQL structure
  const productData = isShopifyProduct ? {
    id: featuredProduct.id,
    title: featuredProduct.title,
    description: featuredProduct.description || 'Silla ergonómica de alta calidad',
    price: featuredProduct.priceRange?.minVariantPrice?.amount ? 
      parseFloat(featuredProduct.priceRange.minVariantPrice.amount) : 
      (featuredProduct.variants?.[0]?.price?.amount ? 
        parseFloat(featuredProduct.variants[0].price.amount) : 0),
    originalPrice: featuredProduct.compareAtPriceRange?.minVariantPrice?.amount ? 
      parseFloat(featuredProduct.compareAtPriceRange.minVariantPrice.amount) : 
      (featuredProduct.priceRange?.minVariantPrice?.amount ? 
        parseFloat(featuredProduct.priceRange.minVariantPrice.amount) * 1.3 : 0),
    image: featuredProduct.images?.edges?.[0]?.node?.url || 
           featuredProduct.featuredImage?.url || 
           featuredProduct.images?.[0]?.url || 
           '/images/placeholder.png',
    handle: featuredProduct.handle,
    variantId: featuredProduct.variants?.[0]?.id
  } : {
    id: featuredProduct.id,
    title: featuredProduct.name,
    description: featuredProduct.description,
    price: featuredProduct.price,
    originalPrice: featuredProduct.compareAtPrice || featuredProduct.price * 1.2,
    image: featuredProduct.image,
    handle: featuredProduct.name.toLowerCase().replace(/\s+/g, '-'),
    variantId: null
  };
  
  
  const discountPercentage = Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100);
  
  const handleAddToCart = async () => {
    try {
      if (isShopifyProduct && productData.variantId) {
        await addToCart(productData.variantId, 1);
        // Could add success feedback here
      } else {
        console.warn('No variant ID available for add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Could add error feedback here
    }
  };
  
  if (isLoading && !dataFetched) {
    return (
      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6 animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-6 bg-gray-300 rounded w-full"></div>
              <div className="h-6 bg-gray-300 rounded w-2/3"></div>
              <div className="h-12 bg-gray-300 rounded w-48"></div>
            </div>
            <div className="aspect-square bg-gray-300 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-3">Producto Destacado</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">El favorito de nuestros clientes: diseño, calidad y ergonomía en una silla</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Product Details */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="space-y-8"
              >
            {/* Product Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
              <Star className="w-4 h-4 mr-2 fill-current" />
              Más Vendido
            </div>
            
            {/* Product Info */}
            <div className="space-y-4">
              <h3 className="text-3xl lg:text-4xl font-bold text-black leading-tight">
                {productData.title}
              </h3>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                {productData.description}
              </p>
            </div>

            {/* Key Features */}
            <div className="space-y-3">
              <h4 className="font-semibold text-black mb-3">Características principales:</h4>
              {[
                'Soporte lumbar ajustable',
                'Reposabrazos ergonómicos 4D', 
                'Base de aluminio resistente',
                'Certificación ergonómica'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="space-y-3">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-black">
                  ${productData.price > 0 ? productData.price.toLocaleString('es-MX') : 'N/A'}
                </span>
                {productData.originalPrice > productData.price && productData.price > 0 && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      ${productData.originalPrice.toLocaleString('es-MX')}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                      -{discountPercentage}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">Envío gratis • 12 meses sin intereses</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center bg-black text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-black/90 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Agregar al Carrito
              </button>
              <Link
                to={`/product/${productData.handle}`}
                className="flex items-center justify-center border border-black text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-black hover:text-white transition-colors"
              >
                Ver Detalles
              </Link>
            </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column - Product Image */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={`image-${currentIndex}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="relative"
              >
            <div className="aspect-square relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-xl">
              <img
                src={productData.image}
                alt={productData.title}
                className="w-full h-full object-cover object-center"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder.png';
                }}
              />
              
              {/* Floating Discount Badge */}
              {productData.originalPrice > productData.price && (
                <div className="absolute top-6 right-6 bg-red-500 text-white rounded-full px-4 py-2 font-bold text-lg shadow-lg">
                  -{discountPercentage}%
                </div>
              )}
              
              {/* Trust Badge */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-black">4.8/5 • +500 reseñas</span>
                </div>
              </div>
            </div>
              </motion.div>
            </AnimatePresence>
            
          </div>
          
        </div>
        
        {/* Carousel Indicators */}
        {carouselProducts.length > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {carouselProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-black scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir al producto ${index + 1}`}
              />
            ))}
          </div>
        )}
        
      </div>
    </section>
  );
};

export default BestSellersSection;