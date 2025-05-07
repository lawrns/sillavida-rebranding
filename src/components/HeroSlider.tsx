import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Star, CreditCard, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getHeroSlides, getSlideTheme, type HeroSlideMetaobject } from '../lib/metaobjects';

// Fallback slides in case metaobjects aren't available
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
  // Import context but comment out unused variable to fix lint warning
  const { /* addItem */ } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoadingSlides, setIsLoadingSlides] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [slides, setSlides] = useState<SlideData[]>(fallbackSlides); // Initialize with fallback slides

  // Fetch hero slides from Shopify Metaobjects
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        console.log('Fetching hero slides...');
        const heroSlides = await getHeroSlides();
        console.log('Hero slides fetched:', JSON.stringify(heroSlides, null, 2));
        
        if (heroSlides && heroSlides.length > 0) {
          // Transform metaobjects to the format expected by the component
          const formattedSlides = heroSlides.map((slide: HeroSlideMetaobject) => {
            try {
              // Extract product data
              console.log('Processing slide:', slide.id);
              console.log('Product data:', JSON.stringify(slide.productToFeature, null, 2));
              
              if (!slide.productToFeature) {
                console.error('Missing product data for slide:', slide.id);
                return null;
              }
              
              // IMPORTANT: metaobjects.ts transforms the Shopify API data structure
              // It changes variants.edges[0].node into variants[0]
              const variant = Array.isArray(slide.productToFeature.variants) 
                ? slide.productToFeature.variants[0] 
                : null;
                
              console.log('Extracted variant:', JSON.stringify(variant, null, 2));
              
              if (!variant) {
                console.error('Missing variant data for slide:', slide.id);
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
              
              console.log('Formatted slide data:', slideData);
              return slideData;
            } catch (err) {
              console.error('Error processing slide:', slide.id, err);
              return null;
            }
          }).filter(Boolean) as SlideData[];
          
          console.log('Total formatted slides:', formattedSlides.length);
          
          if (formattedSlides.length > 0) {
            setSlides(formattedSlides);
            setErrorMessage(null);
          } else {
            console.warn('No valid slides found after filtering');
            // Keep using fallback slides
            setErrorMessage('No se pudieron cargar todos los productos destacados. Mostrando contenido alternativo.');
          }
        } else {
          console.warn('No hero slides returned from API');
          // Keep using fallback slides
          setErrorMessage('No se pudieron cargar los productos destacados. Mostrando contenido alternativo.');
        }
      } catch (err) {
        console.error('Error fetching hero slides:', err);
        // Keep using fallback slides
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

  // Get product handle for navigation
  const getProductUrl = (slideData: SlideData) => {
    // If we have a direct handle from the product data, use it
    if (slideData.handle) {
      return `/product/${slideData.handle}`;
    }
    
    // Fallback to a sanitized version of the title
    return `/product/${slideData.title.toLowerCase().replace(/\s+/g, '-')}`;
  };

  // Note: This function is kept for potential future use if "Add to Cart" functionality is restored
  // but is not currently used in the component
  /* 
  const handleAddToCart = (slideData: SlideData) => {
    if (slideData.variantId) {
      addItem(slideData.variantId, 1);
    }
  };
  */

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
    <section className="relative overflow-hidden transition-colors duration-500 h-[600px]">
      {errorMessage && (
        <div className="absolute top-2 right-2 bg-black/80 text-white px-4 py-2 rounded-md text-sm z-50">
          {errorMessage}
        </div>
      )}
      
      {/* Full width background image with gradient overlay */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={currentSlideData.image}
          alt={currentSlideData.title}
          className="w-full h-full object-contain md:object-cover object-center"
          style={{ maxHeight: '100%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/40 to-transparent z-0"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 h-full relative z-10">
        <AnimatePresence mode="wait">
          <div key={currentSlide} className="flex flex-col md:flex-row items-center h-full justify-between py-8 md:pl-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="text-black max-w-xl mb-8 md:mb-0 relative z-10"
            >
              <h1 className={`text-4xl md:text-5xl font-heading font-bold mb-4 text-black tracking-tight`}>
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
                  <span className="text-sm font-semibold text-red-500">
                    Ahorra {Math.round(100 - (currentSlideData.price / currentSlideData.originalPrice) * 100)}%
                  </span>
                </div>
                <div className="flex mt-4 gap-3">
                  <button 
                    className="bg-black hover:bg-black/90 text-white px-6 py-3 rounded-sm font-heading font-semibold tracking-wide transition-colors"
                    onClick={() => {
                      // Would typically call the addToCart function here
                      console.log('Add to cart:', currentSlideData.title);
                    }}
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
            
            {/* We don't need a separate image container since we're using the image as background */}
            <div className="md:w-1/2"></div>
          </div>
        </AnimatePresence>
        
        <div className="flex justify-center space-x-2 pb-6">
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
