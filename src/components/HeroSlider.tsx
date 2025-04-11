import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Star, CreditCard, Package } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Silla Gamer Xperience Helix",
    subtitle: "Nueva Colección 2024",
    description: "Diseñada para la victoria, construida para la comodidad",
    price: 2639.91,
    originalPrice: 3800.00,
    image: "/images/gamer2.png",
    theme: {
      bg: "from-red-900 via-red-800 to-red-900",
      accent: "bg-red-500/20",
      text: "text-red-300",
      button: "bg-red-500 hover:bg-red-400",
      gradient: "from-white via-white to-red-200"
    }
  },
  {
    id: 2,
    title: "Silla Oficina ErgoComfort",
    subtitle: "Nueva Colección 2024",
    description: "Pensada para largas jornadas, diseñada para tu bienestar",
    price: 2239.91,
    originalPrice: 3200.00,
    image: "/images/sand.png",
    theme: {
      bg: "from-yellow-700 via-yellow-600 to-yellow-700",
      accent: "bg-yellow-500/20",
      text: "text-yellow-300",
      button: "bg-yellow-500 hover:bg-yellow-400",
      gradient: "from-white via-white to-yellow-200"
    }
  },
  {
    id: 3,
    title: "Pack 4x Silla Vida Confort Pro",
    subtitle: "Oferta Especial",
    description: "El paquete ideal para oficinas modernas y espacios productivos",
    price: 8499.91,
    originalPrice: 12800.00,
    image: "/images/bundle.png",
    theme: {
      bg: "from-gray-800 via-gray-700 to-gray-800",
      accent: "bg-gray-500/20",
      text: "text-gray-300",
      button: "bg-gray-600 hover:bg-gray-500",
      gradient: "from-white via-white to-gray-200"
    },
    features: ["Comodidad", "Estilo", "Durabilidad", "12 MSI"]
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentTheme = slides[currentSlide].theme;
  const currentSlideData = slides[currentSlide];

  return (
    <section className={`relative bg-gradient-to-r ${currentTheme.bg} overflow-hidden transition-colors duration-500`}>
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
              <div className={`inline-block px-4 py-1 rounded-full ${currentTheme.accent} ${currentTheme.text} text-sm mb-4`}>
                {currentSlideData.subtitle}
              </div>
              <h1 className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}>
                {currentSlideData.title}
              </h1>
              <p className="text-xl mb-4 text-white/90">
                {currentSlideData.description}
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {currentSlideData.features ? (
                  currentSlideData.features.map((feature, index) => (
                    <span key={index} className={`${currentTheme.accent} px-4 py-2 rounded-full ${currentTheme.text} flex items-center`}>
                      {index === 0 && <Shield className="h-4 w-4 mr-2" />}
                      {index === 1 && <Star className="h-4 w-4 mr-2" />}
                      {index === 2 && <Package className="h-4 w-4 mr-2" />}
                      {index === 3 && <CreditCard className="h-4 w-4 mr-2" />}
                      {feature}
                    </span>
                  ))
                ) : (
                  <>
                    <span className={`${currentTheme.accent} px-4 py-2 rounded-full ${currentTheme.text} flex items-center`}>
                      <Shield className="h-4 w-4 mr-2" />
                      Comodidad
                    </span>
                    <span className={`${currentTheme.accent} px-4 py-2 rounded-full ${currentTheme.text} flex items-center`}>
                      <Star className="h-4 w-4 mr-2" />
                      Durabilidad
                    </span>
                    <span className={`${currentTheme.accent} px-4 py-2 rounded-full ${currentTheme.text} flex items-center`}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      12 MSI
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-white">
                  <span className={`text-lg line-through ${currentTheme.text}`}>
                    ${currentSlideData.originalPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                  <div className="text-4xl font-bold">
                    ${currentSlideData.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <button className={`${currentTheme.button} text-white px-8 py-3 rounded-lg font-bold transition-colors`}>
                  COMPRAR AHORA
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
              <motion.img 
                src={currentSlideData.image}
                alt={currentSlideData.title}
                className="w-full h-auto max-h-[400px] object-contain relative z-0"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
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
    </section>
  );
};

export default HeroSlider;