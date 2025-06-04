import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Star, CreditCard, Package, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getHeroSlides, getSlideTheme, type HeroSlideMetaobject } from '../lib/metaobjects';
import { errorHandler, ErrorSeverity } from '../utils/errorHandler';

/**
 * HeroSlider - A premium hero section component featuring rotating product slides.
 *
 * Integrates with Shopify Metaobjects API to display featured products with:
 * - Automatic slide rotation (5-second intervals)
 * - Dynamic pricing and discount calculations
 * - Product feature highlights with icons
 * - Direct add-to-cart functionality
 * - Responsive design with mobile optimization
 * - Fallback content for offline/error states
 *
 * Data Sources:
 * - Primary: Shopify Metaobjects (hero_slide type)
 * - Fallback: Static slide data for reliability
 *
 * @component
 * @example
 * ```tsx
 * <HeroSlider />
 * ```
 */

/**
 * Fallback slide data used when Shopify Metaobjects are unavailable.
 * Ensures the hero section always displays content with consistent theming.
 *
 * @constant {Array<Object>} fallbackSlides
 */
const fallbackSlides = [
  {
    id: 1,
    title: "Silla Ergonómica Xperience Helix",
    subtitle: "Invierte en tu bienestar",
    description: "Diseñada para largas jornadas, construida para tu salud postural",
    price: 2639.91,
    originalPrice: 3800.00,
    image: "/images/gamer2.png",
    theme: {
      bg: "from-white via-white to-white",
      accent: "bg-black/10",
      text: "text-black",
      button: "bg-black hover:bg-black/90",
      gradient: "from-black via-black to-neutral-800"
    },
    features: ["Soporte Lumbar", "Ajuste Personalizado", "Materiales Transpirables", "12 MSI"],
    handle: "silla-ergonomica-xperience-helix"
  },
  {
    id: 2,
    title: "Silla Ejecutiva ErgoComfort Pro",
    subtitle: "Confort Ejecutivo",
    description: "La combinación perfecta de elegancia y ergonomía para tu espacio de trabajo profesional.",
    price: 3799,
    originalPrice: 4599,
    image: "/images/ejecutiva.png",
    theme: {
      bg: "from-white via-white to-white",
      accent: "bg-black/10",
      text: "text-black",
      button: "bg-black hover:bg-black/90",
      gradient: "from-black via-black to-neutral-800"
    },
    features: ["Ergonomía Certificada", "Reduce Fatiga", "Ajuste 4D", "12 MSI"],
    handle: "silla-ejecutiva-ergocomfort-pro"
  },
  {
    id: 3,
    title: "Pack 4x Silla Vida Confort",
    subtitle: "Oferta Especial",
    description: "Equipa tu oficina con nuestro pack de 4 sillas ergonómicas a un precio especial.",
    price: 9999,
    originalPrice: 13999,
    image: "/images/pack.png",
    theme: {
      bg: "from-white via-white to-white",
      accent: "bg-black/10",
      text: "text-black",
      button: "bg-black hover:bg-black/90",
      gradient: "from-black via-black to-neutral-800"
    },
    features: ["Confort Prolongado", "Diseño Ergonómico", "Durabilidad Premium", "12 MSI"],
    handle: "pack-4x-silla-vida-confort"
  }
];

/**
 * Interface defining the structure of slide data used throughout the component.
 * Supports both Shopify Metaobject data and fallback static data.
 *
 * @interface SlideData
 */
interface SlideData {
  id: string | number;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  theme: {
    bg: string;
    accent: string;
    text: string;
    button: string;
    gradient: string;
  };
  features: string[];
  variantId?: string;
  handle?: string;
}

const HeroSlider = () => {
  // Import context to use cart functionality
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoadingSlides, setIsLoadingSlides] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [slides, setSlides] = useState<SlideData[]>(fallbackSlides); // Initialize with fallback slides

  /**
   * Fetches hero slides from Shopify Metaobjects API.
   * Transforms raw Shopify data into component-compatible format.
   * Handles errors gracefully with fallback content.
   */
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const heroSlides = await getHeroSlides();

        if (heroSlides && heroSlides.length > 0) {
          // Transform metaobjects to the format expected by the component
          const formattedSlides = heroSlides.map((slide: HeroSlideMetaobject) => {
            try {
              // Extract product data
              if (!slide.productToFeature) {
                return null;
              }

              // IMPORTANT: metaobjects.ts transforms the Shopify API data structure
              // It changes variants.edges[0].node into variants[0]
              const variant = Array.isArray(slide.productToFeature.variants)
                ? slide.productToFeature.variants[0]
                : null;

              if (!variant) {
                return null;
              }

              const price = parseFloat(variant.price?.amount || '0');
              const originalPrice = variant.compareAtPrice
                ? parseFloat(variant.compareAtPrice.amount)
                : price * 1.3; // Fallback if no compare price

              // Extract features from slide details (assuming they're comma-separated)
              const features = slide.slideDetails.split(',').map(f => f.trim()).filter(f => f);

              // Create the formatted slide data
              const slideData = {
                id: slide.id,
                title: slide.productToFeature.title || 'Product Title',
                subtitle: slide.slideSubtitle || 'Product Subtitle',
                description: slide.productToFeature.description || 'Product Description',
                price: price,
                originalPrice: originalPrice,
                image: slide.slideImage?.url || '/images/placeholder.png',
                theme: getSlideTheme(slide.themeColor),
                features: features.length > 0 ? features : ["Comodidad", "Durabilidad", "Ergonomía", "12 MSI"],
                variantId: variant.id,
                handle: slide.productToFeature.handle
              };

              return slideData;
            } catch (err) {
              errorHandler.handleError(err as Error, {
                component: 'HeroSlider',
                action: 'formatSlide'
              });
              return null;
            }
          }).filter(Boolean) as SlideData[];

          if (formattedSlides.length > 0) {
            setSlides(formattedSlides);
            setErrorMessage(null);
          } else {
            // Keep using fallback slides
            const error = errorHandler.createError('PRODUCT_LOAD_FAILED', {
              severity: ErrorSeverity.LOW,
              userMessage: 'No se pudieron cargar todos los productos destacados. Mostrando contenido alternativo.'
            }, { component: 'HeroSlider', action: 'fetchSlides' });
            setErrorMessage(error.userMessage);
          }
        } else {
          // Keep using fallback slides
          const error = errorHandler.createError('PRODUCT_LOAD_FAILED', {
            severity: ErrorSeverity.LOW,
            userMessage: 'No se pudieron cargar los productos destacados. Mostrando contenido alternativo.'
          }, { component: 'HeroSlider', action: 'fetchSlides' });
          setErrorMessage(error.userMessage);
        }
      } catch (err) {
        // Keep using fallback slides
        errorHandler.handleError(err as Error, {
          component: 'HeroSlider',
          action: 'fetchSlides'
        });
        setErrorMessage('Error al cargar los productos destacados. Mostrando contenido alternativo.');
      } finally {
        setIsLoadingSlides(false);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  /**
   * Generates the product URL for navigation based on slide data.
   * Prioritizes Shopify product handles over title-based URLs.
   *
   * @param {SlideData} slideData - The slide containing product information
   * @returns {string} Product page URL path
   */
  const getProductUrl = (slideData: SlideData) => {
    // If we have a direct handle from the product data, use it
    if (slideData.handle) {
      return `/product/${slideData.handle}`;
    }

    // Fallback to a sanitized version of the title
    return `/product/${slideData.title.toLowerCase().replace(/\s+/g, '-')}`;
  };

  /**
   * Handles adding the featured product to cart with error handling.
   * Supports both variant ID and product handle-based cart additions.
   *
   * @param {SlideData} slideData - The slide containing product and variant information
   */
  const handleAddToCart = async (slideData: SlideData) => {
    if (slideData.variantId) {
      // If we have a specific variant ID, use that
      await addToCart(slideData.variantId, 1);
    } else if (slideData.handle) {
      // If we have a product handle but no variant ID, use the handle
      // This assumes the first variant will be selected
      await addToCart(slideData.handle, 1);
    } else {
      // Fallback if neither variantId nor handle is available
      const error = errorHandler.createError('CART_UPDATE_FAILED', {
        severity: ErrorSeverity.MEDIUM,
        userMessage: 'No se pudo agregar al carrito. Por favor, intente desde la página del producto.'
      }, { component: 'HeroSlider', action: 'addToCart' });
      setErrorMessage(error.userMessage);
      // Clear error message after 3 seconds
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  if (isLoadingSlides) {
    return (
      <section className="bg-white h-[600px] flex items-center justify-center">
        <div className="text-black text-center">
          <div className="animate-pulse mb-4">
            <div className="h-8 w-48 bg-black/20 rounded mx-auto"></div>
          </div>
          <div className="animate-pulse mb-6">
            <div className="h-16 w-64 bg-black/20 rounded mx-auto"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-10 w-40 bg-black/20 rounded mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section className="bg-white py-12 lg:py-20 overflow-hidden">
      {errorMessage && (
        <div className="absolute top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-md text-sm z-50">
          {errorMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          >
            
            {/* Left Column - Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-8"
            >
              {/* Product Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 text-sm font-medium text-black">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Producto Destacado
              </div>
              
              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-black leading-tight">
                  {currentSlideData.title}
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  {currentSlideData.description}
                </p>
              </div>

              {/* USP Bullets */}
              <div className="space-y-3">
                {currentSlideData.features ? (
                  currentSlideData.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">Reduce dolor de espalda hasta 85%</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">Mejora productividad y concentración</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">Diseño ergonómico certificado</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">Garantía extendida de 5 años</span>
                    </div>
                  </>
                )}
              </div>

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-bold text-black">
                    ${currentSlideData.price.toLocaleString('es-MX')}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ${currentSlideData.originalPrice.toLocaleString('es-MX')}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                    -{Math.round(100 - (currentSlideData.price / currentSlideData.originalPrice) * 100)}%
                  </span>
                </div>
                <p className="text-sm text-gray-600">12 meses sin intereses disponibles</p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleAddToCart(currentSlideData)}
                    className="bg-black text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-black/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Agregar al Carrito
                  </button>
                  <Link
                    to={getProductUrl(currentSlideData)}
                    className="border border-black text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-black hover:text-white transition-all duration-200 text-center"
                  >
                    Ver Detalles
                  </Link>
                </div>
                
                {/* Value Props Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Garantía extendida</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-green-600" />
                    <span>Calidad premium</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CreditCard className="w-4 h-4 text-green-600" />
                    <span>12 MSI</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Package className="w-4 h-4 text-green-600" />
                    <span>Envío gratis</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Product Image */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={currentSlideData.image}
                  alt={currentSlideData.title}
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                />
                
                {/* Floating Price Badge */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-black">
                      ${currentSlideData.price.toLocaleString('es-MX')}
                    </div>
                    <div className="text-xs text-gray-500 line-through">
                      ${currentSlideData.originalPrice.toLocaleString('es-MX')}
                    </div>
                  </div>
                </div>
                
                {/* Quality Badge */}
                <div className="absolute bottom-6 left-6 bg-black/90 backdrop-blur-sm rounded-lg px-3 py-2 text-white">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Calidad Premium</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="flex justify-center space-x-2 mt-12">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-black scale-125'
                  : 'bg-black/30 hover:bg-black/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
