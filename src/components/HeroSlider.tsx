import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Star, CreditCard, Package } from 'lucide-react';
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
  const { addItem } = useCart();
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
  const handleAddToCart = (slideData: SlideData) => {
    if (slideData.variantId) {
      // If we have a specific variant ID, use that
      addItem(slideData.variantId, 1);
    } else if (slideData.handle) {
      // If we have a product handle but no variant ID, use the handle
      // This assumes the first variant will be selected
      addItem(slideData.handle, 1);
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
    <section className="relative overflow-hidden transition-colors duration-500 h-[600px] w-full" style={{ margin: '0', padding: '0' }}>
      {errorMessage && (
        <div className="absolute top-2 right-2 bg-black/80 text-white px-4 py-2 rounded-md text-sm z-50">
          {errorMessage}
        </div>
      )}

      {/* Image container with improved background handling */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-gray-100">
        {/* Background with uniform color */}
        <div className="absolute inset-0 bg-gray-100 opacity-100"></div>

        {/* Soft white gradient on the right side */}
        <div className="absolute top-0 bottom-0 h-full overflow-hidden"
             style={{
               right: '-1px',
               width: 'calc(100vw - 50%)',
               minWidth: '50%',
               background: 'linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.8) 100%)'
             }}>
        </div>

        {/* Product image - extends to right edge with no gaps */}
        <div className="absolute top-0 bottom-0 h-full flex justify-end items-center" style={{
          right: '-1px',
          width: 'calc(100vw - 50%)',
          minWidth: '50%'
        }}>
          <img
            src={currentSlideData.image}
            alt={currentSlideData.title}
            className="h-full w-auto object-contain object-right"
            style={{
              maxHeight: '100%',
              marginRight: '0',
              paddingRight: '0'
            }}
          />
        </div>

        {/* Text readability gradient - reverted to white gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent z-0" data-component-name="HeroSlider"></div>
      </div>

      {/* Full-width container without horizontal padding constraints */}
      <div className="w-full h-full relative z-10">
        <AnimatePresence mode="wait">
          <div key={currentSlide} className="flex flex-col md:flex-row items-center h-full justify-between py-8 px-4 max-w-7xl mx-auto">
            <div className="md:w-1/2 h-full flex items-center justify-start pl-0 md:pl-0 lg:pl-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="text-black max-w-xl mb-8 md:mb-0 relative z-10"
              >
                <h1 className={`text-5xl md:text-6xl font-heading font-bold mb-4 text-black tracking-tight`} data-component-name="HeroSlider">
                  {currentSlideData.title}
                </h1>
                <p className="text-xl mb-4 text-black font-body">
                  {currentSlideData.description}
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  {currentSlideData.features ? (
                    currentSlideData.features.map((feature: string, index: number) => (
                      <span key={index} className={`bg-black/10 px-4 py-2 rounded-full text-black flex items-center font-body`}>
                        {index === 0 && <Shield className="h-4 w-4 mr-2" />}
                        {index === 1 && <Star className="h-4 w-4 mr-2" />}
                        {index === 2 && <Package className="h-4 w-4 mr-2" />}
                        {index === 3 && <CreditCard className="h-4 w-4 mr-2" />}
                        {feature}
                      </span>
                    ))
                  ) : (
                    <>
                      <span className={`bg-black/10 px-4 py-2 rounded-full text-black flex items-center font-body`}>
                        <Shield className="h-4 w-4 mr-2" />
                        Comodidad
                      </span>
                      <span className={`bg-black/10 px-4 py-2 rounded-full text-black flex items-center font-body`}>
                        <Star className="h-4 w-4 mr-2" />
                        Durabilidad
                      </span>
                      <span className={`bg-black/10 px-4 py-2 rounded-full text-black flex items-center font-body`}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        12 MSI
                      </span>
                    </>
                  )}
                </div>
                <div className="flex flex-col mb-6">
                  <div className="flex items-baseline gap-2">
                    <div className="text-4xl font-heading font-bold text-black">
                      ${currentSlideData.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base line-through text-gray-500 font-heading">
                      ${currentSlideData.originalPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                    </span>
                    <span className="text-sm font-semibold text-black">
                      Ahorra {Math.round(100 - (currentSlideData.price / currentSlideData.originalPrice) * 100)}%
                    </span>
                  </div>
                  <div className="flex mt-4 gap-3">
                    <button
                      className="bg-black hover:bg-black/90 text-white px-6 py-3 rounded-sm font-heading font-semibold tracking-wide transition-colors"
                      onClick={() => handleAddToCart(currentSlideData)}
                      data-component-name="HeroSlider"
                    >
                      Comprar Ahora
                    </button>
                    <Link
                      to={getProductUrl(currentSlideData)}
                      className="bg-white border border-black hover:bg-gray-50 text-black px-6 py-3 rounded-sm font-heading font-semibold tracking-wide transition-colors"
                    >
                      Ver Detalles
                    </Link>
                  </div>
                  <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Garantía de 5 años · Envío gratis · 30 días de prueba
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Image section takes up the right half */}
            <div className="md:w-1/2"></div>
          </div>
        </AnimatePresence>

        <div className="flex justify-center space-x-2 pb-6 px-4 max-w-7xl mx-auto">
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
