/**
 * BannerTest Component - Enhanced E-commerce Hero Banner Carousel
 * 
 * Features:
 * - Optimized 1920x600px banner size with responsive design
 * - Automatic carousel with 5-7 second transitions
 * - Manual navigation (arrows + dot indicators)
 * - Clickable banners with analytics tracking
 * - Pause on user interaction
 * - Smooth fade transitions
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Banner data with links and tracking
interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string; // Product page or category link
  ctaText: string;
  trackingEvent: string; // For analytics
  backgroundColor: string;
  textColor: string;
}

const bannerSlides: BannerSlide[] = [
  {
    id: 'banner-1',
    title: 'Revolución Ergonómica',
    subtitle: 'Diseño que Transforma tu Productividad',
    description: 'Descubre la nueva generación de sillas ergonómicas que están redefiniendo el confort en el trabajo.',
    image: '/images/Banner test/ChatGPT Image May 30, 2025, 05_24_57 PM.png',
    link: '/product/aura', // Random product assignment
    ctaText: 'Explorar Colección',
    trackingEvent: 'banner_click_revolution',
    backgroundColor: 'from-gray-900 via-gray-800 to-black',
    textColor: 'text-white'
  },
  {
    id: 'banner-2', 
    title: 'Confort Inteligente',
    subtitle: 'Tecnología al Servicio de tu Bienestar',
    description: 'Experimenta el futuro del diseño ergonómico con nuestras sillas de última generación.',
    image: '/images/Banner test/Gemini_Generated_Image_q1drcoq1drcoq1dr.png',
    link: '/product/terra', // Random product assignment
    ctaText: 'Ver Producto',
    trackingEvent: 'banner_click_smart_comfort',
    backgroundColor: 'from-blue-900 via-blue-800 to-indigo-900',
    textColor: 'text-white'
  },
  {
    id: 'banner-3',
    title: 'Máximo Rendimiento',
    subtitle: 'Ergonomía para Profesionales Exigentes',
    description: 'Lleva tu productividad al siguiente nivel con nuestras sillas diseñadas para largas jornadas laborales.',
    image: '/images/Banner test/DALL·E 2025-06-04 17.35.23 - A wide banner design featuring a high-end ergonomic office chair with white mesh backrest and headrest, armrests, and extendable footrest. The chai.webp',
    link: '/product/livina', // Random product assignment
    ctaText: 'Descubrir Más',
    trackingEvent: 'banner_click_performance',
    backgroundColor: 'from-purple-900 via-purple-800 to-indigo-900',
    textColor: 'text-white'
  },
  {
    id: 'banner-4',
    title: 'Bienestar Total',
    subtitle: 'Cuida tu Salud Postural',
    description: 'Invierte en tu bienestar con sillas ergonómicas que protegen tu salud y mejoran tu calidad de vida.',
    image: '/images/Banner test/DALL·E 2025-06-04 17.35.36 - A wide banner featuring a modern, ergonomic office chair in white mesh material with a headrest and extendable footrest, closely resembling .webp',
    link: '/product/serenidad', // Random product assignment
    ctaText: 'Cuidar mi Salud',
    trackingEvent: 'banner_click_wellness',
    backgroundColor: 'from-green-900 via-green-800 to-teal-900',
    textColor: 'text-white'
  }
];

// Analytics tracking function
const trackBannerClick = (eventName: string, bannerData: BannerSlide) => {
  // Implementation for analytics tracking
  console.log(`[Analytics] Banner Click: ${eventName}`, {
    bannerId: bannerData.id,
    bannerTitle: bannerData.title,
    targetLink: bannerData.link,
    timestamp: new Date().toISOString()
  });
  
  // Example with Google Analytics (if available)
  // if (window.gtag) {
  //   window.gtag('event', 'banner_click', {
  //     banner_id: bannerData.id,
  //     banner_title: bannerData.title,
  //     target_url: bannerData.link
  //   });
  // }
};

const BannerTest: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 6000); // 6 seconds between slides

    return () => clearInterval(timer);
  }, [isAutoPlaying, isPaused]);

  // Navigation functions
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    setIsAutoPlaying(false); // Pause auto-play on manual interaction
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume after 10 seconds
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
    setIsAutoPlaying(false); // Pause auto-play on manual interaction  
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume after 10 seconds
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  // Available product routes for random selection
  const productRoutes = [
    'serafin',
    'empirea', 
    'aura',
    'calma',
    'celeste',
    'livina',
    'serenidad',
    'terra'
  ];

  // Generate random product route
  const getRandomProductRoute = () => {
    const randomIndex = Math.floor(Math.random() * productRoutes.length);
    return `/product/${productRoutes[randomIndex]}`;
  };

  // Handle banner click with tracking
  const handleBannerClick = (banner: BannerSlide) => {
    trackBannerClick(banner.trackingEvent, banner);
  };

  const currentBanner = bannerSlides[currentSlide];

  return (
    <section className="relative w-full h-[600px] overflow-hidden bg-gray-900">
      {/* Banner Container - Optimized for 1920x600px */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={currentBanner.image}
                alt={currentBanner.title}
                className="w-full h-full object-cover object-center"
                style={{
                  minWidth: '1920px',
                  minHeight: '600px'
                }}
              />
              
            </div>

            {/* Clickable overlay for banner links */}
            <Link
              to={getRandomProductRoute()}
              onClick={() => handleBannerClick(currentBanner)}
              className="absolute inset-0 z-10 block"
              aria-label={`Ir a producto aleatorio`}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300 group"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300 group"
          aria-label="Siguiente slide"
        >
          <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-125 shadow-lg'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play Indicator */}
        <div className="absolute top-4 right-4 z-20">
          <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
            isAutoPlaying && !isPaused 
              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
              : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
          }`}>
            {isAutoPlaying && !isPaused ? 'Auto' : 'Paused'}
          </div>
        </div>
      </div>

      {/* Responsive Optimization for Mobile */}
      <style jsx>{`
        @media (max-width: 768px) {
          .banner-container {
            height: 400px;
          }
        }
        
        @media (max-width: 480px) {
          .banner-container {
            height: 350px;
          }
        }
      `}</style>
    </section>
  );
};

export default BannerTest;