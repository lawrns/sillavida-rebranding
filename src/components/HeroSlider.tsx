import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Star, CreditCard, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Mock Shopify variant IDs for the slider products
const SLIDER_VARIANT_IDS: Record<number, string> = {
  1: 'mock-variant-345678901', // Silla Ergonómica Xperience Helix (ergonomic model)
  2: 'mock-variant-123456789', // Silla Oficina ErgoComfort (ergonomic model)
  3: 'mock-variant-567890123', // Pack 4x Silla Vida Confort Pro (office model)
};

const slides = [
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
    features: ["Soporte Lumbar", "Ajuste Personalizado", "Materiales Transpirables", "12 MSI"]
  },
  {
    id: 2,
    title: "Silla Oficina ErgoComfort",
    subtitle: "Mejora tu productividad",
    description: "Confort que transforma tu espacio de trabajo en un santuario de productividad",
    price: 2239.91,
    originalPrice: 3200.00,
    image: "/images/—Pngtree—single comfort noise style sofa_4372281.png",
    theme: {
      bg: "from-sage-dark via-sage to-sage-dark",
      accent: "bg-sage-light/20",
      text: "text-beige-light",
      button: "bg-sage hover:bg-sage-light",
      gradient: "from-white via-white to-beige-extralight"
    },
    features: ["Ergonomía Certificada", "Reduce Fatiga", "Ajuste 4D", "12 MSI"]
  },
  {
    id: 3,
    title: "Pack 4x Silla Vida Confort Pro",
    subtitle: "Bienestar para tu equipo",
    description: "Invierte en el bienestar de tu equipo y potencia la productividad colectiva",
    price: 8499.91,
    originalPrice: 12800.00,
    image: "/images/bundle.png",
    theme: {
      bg: "from-terracotta-dark via-terracotta to-terracotta-dark",
      accent: "bg-terracotta-light/20",
      text: "text-beige-light",
      button: "bg-terracotta hover:bg-terracotta-light",
      gradient: "from-white via-white to-beige-extralight"
    },
    features: ["Confort Prolongado", "Diseño Ergonómico", "Durabilidad Premium", "12 MSI"]
  }
];

const HeroSlider = () => {
  const { addItem } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      // Get the variant ID for the current slide
      const variantId = SLIDER_VARIANT_IDS[currentSlide + 1];
      
      if (!variantId) {
        console.error('No variant ID found for slide:', currentSlide + 1);
        return;
      }
      
      // Add the item to the cart
      await addItem(variantId, 1);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentTheme = slides[currentSlide].theme;
  const currentSlideData = slides[currentSlide];

  return (
    <section className={`relative bg-gradient-to-r ${currentTheme.bg} overflow-hidden transition-colors duration-500 vida-bg-pattern-breathing`}>
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
              <div className={`inline-block px-4 py-1 rounded-full ${currentTheme.accent} ${currentTheme.text} text-sm mb-4 font-heading font-medium`}>
                {currentSlideData.subtitle}
              </div>
              <h1 className={`text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent tracking-tight`}>
                {currentSlideData.title}
              </h1>
              <p className="text-xl mb-4 text-white/90 font-body">
                {currentSlideData.description}
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {currentSlideData.features ? (
                  currentSlideData.features.map((feature, index) => (
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
                <button 
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className={`${
                    success 
                      ? 'bg-sage hover:bg-sage-light' 
                      : currentTheme.button
                  } text-white px-8 py-3 vida-shape-soft font-heading font-semibold tracking-wide transition-colors`}
                >
                  {isLoading ? 'Agregando...' : success ? '¡Agregado!' : 'Invierte en tu bienestar'}
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="relative w-full md:w-1/2 flex justify-end"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${currentTheme.bg}/80 via-transparent to-transparent md:hidden`} />
              <img 
                src="/images/perks.png" 
                alt="Perks"
                className="absolute bottom-20 right-[20%] w-32 h-auto object-contain z-20 mix-blend-screen"
                style={{ transform: 'scale(0.75)' }}
              />
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

        <div className="flex justify-center gap-2 pb-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide 
                  ? `${slides[index].theme.button} bg-opacity-100` 
                  : `${slides[index].theme.button} bg-opacity-30`
              }`}
            />
          ))}
        </div>
      </div>
      <div className="vida-divider-wave w-full"></div>
    </section>
  );
};

export default HeroSlider;
