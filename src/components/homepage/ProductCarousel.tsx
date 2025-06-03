import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { ShopifyProduct } from '../../types/shopify';

interface ProductCarouselProps {
  products: ShopifyProduct[];
  title?: string;
  isLoading?: boolean;
}

/**
 * ProductCarousel - Netflix-style horizontal scrolling product carousel
 * Features full-width layout, smooth scrolling, and arrow navigation
 */
const ProductCarousel: React.FC<ProductCarouselProps> = ({ 
  products, 
  title = "Descubre Nuestros Productos",
  isLoading = false 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Smooth scroll function
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const cardWidth = 320; // Approximate card width + gap
    const cardsToScroll = Math.floor(container.clientWidth / cardWidth);
    const scrollAmount = cardWidth * cardsToScroll;
    
    const targetScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth'
    });
  };

  // Initialize scroll position check
  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [products]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => checkScrollPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="flex space-x-4 px-4 sm:px-6 lg:px-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <div 
          key={index}
          className="flex-shrink-0 w-80 h-96 bg-gray-200 rounded-xl animate-pulse"
        />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <section className="py-16 lg:py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-black">
            {title}
          </h2>
        </div>
        <LoadingSkeleton />
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
            Encuentra Tu Silla Ideal
          </h2>
          <p className="text-gray-600">Error: No se pudieron cargar los productos de Shopify.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Enhanced Section Header - Same as CategoriesSection */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
            Encuentra Tu Silla Ideal
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre nuestra colección completa de sillas ergonómicas diseñadas para 
            mejorar tu postura, productividad y bienestar durante largas jornadas de trabajo.
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-end mb-8">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full transition-all duration-200 ${
                canScrollLeft
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full transition-all duration-200 ${
                canScrollRight
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Full-width scrollable container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}
        >
          {products.map((product, index) => {
            // Handle both transformed StandardProduct and original Shopify GraphQL structures
            let productImage: string;
            let hoverImage: string | null = null;
            let productPrice: string;
            
            // Check if this is a transformed StandardProduct (has price object and images array)
            if (product.price && product.images && Array.isArray(product.images) && !product.images.edges) {
              // Transformed StandardProduct structure
              productImage = product.images?.[0]?.url || '/images/placeholder.png';
              hoverImage = product.images?.length > 1 ? product.images[1]?.url || null : null;
              productPrice = product.price ? 
                parseFloat(product.price.amount).toLocaleString('es-MX', {
                  style: 'currency',
                  currency: 'MXN',
                  minimumFractionDigits: 0
                }) : 'Precio no disponible';
            } else if (product.priceRange && product.images?.edges) {
              // Original Shopify GraphQL structure
              productImage = product.images.edges[0]?.node?.url || '/images/placeholder.png';
              hoverImage = product.images.edges.length > 1 ? product.images.edges[1]?.node?.url || null : null;
              productPrice = product.priceRange.minVariantPrice?.amount ? 
                parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString('es-MX', {
                  style: 'currency',
                  currency: 'MXN',
                  minimumFractionDigits: 0
                }) : 'Precio no disponible';
            } else {
              // Fallback for unknown structure
              productImage = '/images/placeholder.png';
              hoverImage = null;
              productPrice = 'Precio no disponible';
            }
            
            return (
              <motion.div
                key={product.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-80"
              >
                <div className="group relative">
                  <Link to={`/product/${product.handle || 'product'}`}>
                    <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[4/5]">
                      {/* Primary Image */}
                      <img
                        src={productImage}
                        alt={product.title || 'Product'}
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'
                        }`}
                        loading="lazy"
                      />
                      
                      {/* Hover Image (if available) */}
                      {hoverImage && (
                        <img
                          src={hoverImage}
                          alt={`${product.title || 'Product'} - Vista 2`}
                          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                          loading="lazy"
                        />
                      )}
                    </div>
                  </Link>

                  {/* Product details below image */}
                  <div className="mt-4 space-y-2">
                    <Link to={`/product/${product.handle || 'product'}`}>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-gray-700 transition-colors">
                        {product.title || 'Sin título'}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-black">
                        {productPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

    </section>
  );
};

export default ProductCarousel;