import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { ShopifyProduct } from '../../types/shopify';
import { useMinimalCart } from '../../hooks/useMinimalCart';

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
  // Feature flags for easy reversal
  const ENABLE_PRODUCT_LABELS = true;
  const ENABLE_ADD_TO_CART = true;

  // Cart functionality
  const { addToCart: addToCartMinimal, toggleCart } = useMinimalCart();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  // Product tag label renderer
  const renderProductLabels = (tags: string[] = []) => {
    if (!ENABLE_PRODUCT_LABELS || !tags || tags.length === 0) return null;
    
    const tagStyleMap: Record<string, string> = {
      'Más vendidos': 'bg-green-500/90 border-green-500 text-white',
      'Calidad-precio': 'bg-blue-500/90 border-blue-500 text-white', 
      'En tendencia': 'bg-orange-500/90 border-orange-500 text-white',
      'Nuevo': 'bg-red-500/90 border-red-500 text-white'
    };

    return (
      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
        {tags.map((tag) => {
          const styleClasses = tagStyleMap[tag];
          if (styleClasses) {
            return (
              <span 
                key={tag}
                className={`px-2.5 py-1 text-xs font-bold rounded border ${styleClasses}`}
              >
                {tag}
              </span>
            );
          }
          return null;
        })}
      </div>
    );
  };

  // Generate random star rating between 3.5 and 5.0
  const generateMockRating = (productId: string) => {
    // Use product ID as seed for consistent ratings
    const seed = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (seed % 1000) / 1000; // Normalize to 0-1
    const rating = 3.5 + (random * 1.5); // 3.5 to 5.0
    return Math.round(rating * 2) / 2; // Round to nearest 0.5
  };

  // Render star rating component
  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative w-4 h-4">
          <Star className="w-4 h-4 text-gray-300 absolute" />
          <div className="overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  // Add to cart handler
  const handleAddToCart = async (product: ShopifyProduct, event: React.MouseEvent) => {
    event.preventDefault(); // Prevent navigation
    event.stopPropagation();

    if (!ENABLE_ADD_TO_CART) return;

    try {
      setAddingToCart(product.id);
      console.log('Adding to cart - Product:', product.title, 'ID:', product.id);
      
      // Get the actual Shopify variant ID - handle both GraphQL edges structure and transformed array
      let variant;
      let variantId;
      
      if (product.variants?.edges) {
        // Original GraphQL structure
        variant = product.variants.edges[0]?.node;
        variantId = variant?.id;
      } else if (Array.isArray(product.variants)) {
        // Transformed structure (direct array)
        variant = product.variants[0];
        variantId = variant?.id;
      }
      
      console.log('Product variants:', product.variants);
      console.log('Variant structure type:', Array.isArray(product.variants) ? 'array' : 'graphql-edges');
      console.log('First variant:', variant);
      console.log('Variant ID:', variantId);
      
      if (!variantId) {
        throw new Error(`No variant ID found for product: ${product.title}. Product may not have variants.`);
      }

      console.log('Calling addToCartMinimal...');
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Add to cart timeout')), 10000)
      );
      
      await Promise.race([
        addToCartMinimal(variantId, 1),
        timeoutPromise
      ]);
      
      console.log('Successfully added to cart');
      
      setAddSuccess(product.id);
      
      // Show success state briefly
      setTimeout(() => setAddSuccess(null), 2000);
      
      // Open cart to show the added item
      toggleCart();
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      console.error('Product data:', product);
      // Reset the loading state and show an error (you could add error state here)
      alert(`Error al agregar al carrito: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setAddingToCart(null);
    }
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    
    setCanScrollLeft(scrollLeft > 5); // Small threshold to account for rounding
    setCanScrollRight(scrollLeft < maxScroll - 5);
  };

  // Smooth scroll function
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const cardWidth = 320; // Approximate card width + gap
    const cardsToScroll = Math.max(1, Math.floor(container.clientWidth / cardWidth));
    const scrollAmount = cardWidth * cardsToScroll;
    
    const targetScrollLeft = direction === 'left' 
      ? Math.max(0, container.scrollLeft - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, container.scrollLeft + scrollAmount);
    
    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth'
    });

    // Update button states after scroll animation completes
    setTimeout(() => {
      checkScrollPosition();
    }, 500);
  };

  // Initialize and update scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Delay initial check to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      checkScrollPosition();
    }, 100);

    // Add scroll listener
    container.addEventListener('scroll', checkScrollPosition, { passive: true });
    
    return () => {
      clearTimeout(timer);
      container.removeEventListener('scroll', checkScrollPosition);
    };
  }, [products]);

  // Handle window resize and re-check positions
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => checkScrollPosition(), 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Also check when products array changes length
  useEffect(() => {
    if (products.length > 0) {
      setTimeout(() => checkScrollPosition(), 200);
    }
  }, [products.length]);


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
                  {/* Product Labels */}
                  {renderProductLabels(product.tags)}
                  
                  <Link to={`/product/${product.handle || 'product'}`}>
                    <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[4/5]">
                      {/* Primary Image */}
                      <img
                        src={productImage}
                        alt={product.title || 'Product'}
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                          hoverImage ? 'group-hover:opacity-0' : ''
                        }`}
                        loading="lazy"
                      />
                      
                      {/* Hover Image (if available) */}
                      {hoverImage && (
                        <img
                          src={hoverImage}
                          alt={`${product.title || 'Product'} - Vista 2`}
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                          loading="lazy"
                        />
                      )}

                      {/* Add to Cart Button - Visible on Hover */}
                      {ENABLE_ADD_TO_CART && (
                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          disabled={addingToCart === product.id}
                          className="absolute bottom-4 left-4 right-4 bg-black text-white py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 flex items-center justify-center space-x-2 hover:bg-gray-800 disabled:opacity-50"
                        >
                          {addingToCart === product.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              <span>Agregando...</span>
                            </>
                          ) : addSuccess === product.id ? (
                            <>
                              <div className="h-4 w-4 text-green-400">✓</div>
                              <span>¡Agregado!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4" />
                              <span>Agregar al Carrito</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </Link>

                  {/* Product details below image */}
                  <div className="mt-4 space-y-2">
                    {/* Product Title and Stars Row */}
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/product/${product.handle || 'product'}`} className="flex-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-gray-700 transition-colors">
                          {product.title || 'Sin título'}
                        </h3>
                      </Link>
                      
                      {/* Star Rating on the right */}
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <div className="flex items-center space-x-0.5">
                          {renderStarRating(generateMockRating(product.id))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">
                          ({Math.floor(Math.random() * 50) + 10})
                        </span>
                      </div>
                    </div>
                    
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