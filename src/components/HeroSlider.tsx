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
      bg: "from-teal-dark via-teal to-teal-dark",
      accent: "bg-teal-light/20",
      text: "text-beige-light",
      button: "bg-teal hover:bg-teal-light",
      gradient: "from-white via-white to-beige-extralight"
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
      bg: "from-sage-dark via-sage to-sage-dark",
      accent: "bg-sage-light/20",
      text: "text-beige-light",
      button: "bg-sage hover:bg-sage-light",
      gradient: "from-white via-white to-beige-extralight"
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
      bg: "from-terracotta-dark via-terracotta to-terracotta-dark",
      accent: "bg-terracotta-light/20",
      text: "text-beige-light",
      button: "bg-terracotta hover:bg-terracotta-light",
      gradient: "from-white via-white to-beige-extralight"
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
      <section className="bg-gradient-to-r from-teal-dark via-teal to-teal-dark h-[600px] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-pulse mb-4">
            <div className="h-8 w-48 bg-white/20 rounded mx-auto"></div>
          </div>
          <div className="animate-pulse mb-6">
            <div className="h-16 w-64 bg-white/20 rounded mx-auto"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-10 w-40 bg-white/20 rounded mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];
  const currentTheme = currentSlideData.theme;

  return (
    <section className={`relative bg-gradient-to-r ${currentTheme.bg} overflow-hidden transition-colors duration-500 vida-bg-pattern-breathing`}>
      {errorMessage && (
        <div className="absolute top-2 right-2 bg-terracotta/80 text-white px-4 py-2 rounded-md text-sm z-50">
          {errorMessage}
        </div>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4">
        <AnimatePresence mode="wait">
          <div key={currentSlide} className="flex flex-col md:flex-row items-center justify-between py-8 md:pl-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="text-white max-w-xl mb-8 md:mb-0 relative z-10"
            >
              <h1 className={`text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent tracking-tight`}>
                {currentSlideData.title}
              </h1>
              <p className="text-xl mb-4 text-white/90 font-body">
                {currentSlideData.description}
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {currentSlideData.features ? (
                  currentSlideData.features.map((feature: string, index: number) => (
                    <span key={index} className={`${currentTheme.accent} px-4 py-2 rounded-full ${currentTheme.text} flex items-center font-body`}>
                      {index === 0 && <Shield className="h-4 w-4 mr-2" />}
                      {index === 1 && <Star className="h-4 w-4 mr-2" />}
                      {index === 2 && <Package className="h-4 w-4 mr-2" />}
                      {index === 3 && <CreditCard className="h-4 w-4 mr-2" />}
                      {feature}
                    </span>
                  ))
                ) : (
                  <>
                    <span className={`${currentTheme.accent} px-4 py-2 rounded-full ${currentTheme.text} flex items-center font-body`}>
                      <Shield className="h-4 w-4 mr-2" />
                      Comodidad
                    </span>
                    <span className={`${currentTheme.accent} px-4 py-2 rounded-full ${currentTheme.text} flex items-center font-body`}>
                      <Star className="h-4 w-4 mr-2" />
                      Durabilidad
                    </span>
                    <span className={`${currentTheme.accent} px-4 py-2 rounded-full ${currentTheme.text} flex items-center font-body`}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      12 MSI
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-white">
                  <span className={`text-lg line-through ${currentTheme.text} font-heading`}>
                    ${currentSlideData.originalPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                  <div className="text-4xl font-heading font-bold">
                    ${currentSlideData.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <Link 
                  to={getProductUrl(currentSlideData)}
                  className={`${currentTheme.button} text-white px-8 py-3 vida-shape-soft font-heading font-semibold tracking-wide transition-colors`}
                >
                  Ver producto
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="relative w-full md:w-1/2 flex justify-end"
            >
              {/* Mobile gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${currentTheme.bg}/80 via-transparent to-transparent md:hidden`} />
              
              <motion.div
                className="w-full h-[600px] relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.img 
                  src={currentSlideData.image}
                  alt={currentSlideData.title}
                  className="w-full h-full object-contain relative z-0 vida-hover-breathing"
                  style={{ 
                    objectPosition: 'center',
                    maxWidth: '100%'
                  }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            </motion.div>
          </div>
        </AnimatePresence>
        
        <div className="flex justify-center space-x-2 pb-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
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
