import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BadgeCheck } from 'lucide-react';
import { Testimonial, getCategoryIcon, getCategoryLabel } from '../data/testimonials';

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoRotate?: boolean;
  rotationInterval?: number;
  className?: string;
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  autoRotate = true,
  rotationInterval = 8000,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Handle auto-rotation
  useEffect(() => {
    if (autoRotate && !isPaused) {
      timerRef.current = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, rotationInterval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [autoRotate, isPaused, testimonials.length, rotationInterval]);

  // Navigate to previous testimonial
  const prevTestimonial = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
    if (autoRotate) resetTimer();
  };

  // Navigate to next testimonial
  const nextTestimonial = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    if (autoRotate) resetTimer();
  };

  // Reset the auto-rotation timer
  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, rotationInterval);
  };

  // Pause auto-rotation on hover
  const handleMouseEnter = () => {
    setIsPaused(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Resume auto-rotation on mouse leave
  const handleMouseLeave = () => {
    setIsPaused(false);
    if (autoRotate) resetTimer();
  };

  // Get current testimonial
  const currentTestimonial = testimonials[currentIndex];
  
  // Get category icon
  const CategoryIcon = getCategoryIcon(currentTestimonial.category);

  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div 
      className={`relative overflow-hidden bg-beige rounded-lg shadow-md ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Historias de Vida - Testimonios de clientes"
    >
      <div className="absolute top-4 right-4 z-20 flex space-x-2">
        <button
          onClick={prevTestimonial}
          className="p-2 rounded-full bg-beige text-sage hover:bg-beige-dark transition-colors focus:outline-none focus:ring-2 focus:ring-sage-light border-2 border-sage/30 shadow-md"
          aria-label="Testimonio anterior"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextTestimonial}
          className="p-2 rounded-full bg-beige text-sage hover:bg-beige-dark transition-colors focus:outline-none focus:ring-2 focus:ring-sage-light border-2 border-sage/30 shadow-md"
          aria-label="Testimonio siguiente"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="relative h-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              {/* Photo Section */}
              <div className="relative bg-teal-dark flex items-center justify-center p-6 md:p-0">
                <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
                  <div className={`
                    p-2 rounded-full 
                    ${currentTestimonial.category === 'health' ? 'bg-terracotta-extralight text-terracotta' : 
                      currentTestimonial.category === 'productivity' ? 'bg-sage-extralight text-sage-dark' : 
                      'bg-teal-extralight text-teal'}
                  `}>
                    <CategoryIcon size={20} />
                  </div>
                  <span className="text-sm font-medium bg-beige-light px-2 py-1 rounded-full shadow-sm">
                    {getCategoryLabel(currentTestimonial.category)}
                  </span>
                </div>
                <img
                  src={currentTestimonial.photo}
                  alt={`${currentTestimonial.name}, ${currentTestimonial.profession}`}
                  className="object-cover w-full h-full max-h-[300px] md:max-h-none"
                />
              </div>

              {/* Content Section */}
              <div className="p-6 md:p-8 flex flex-col justify-between bg-beige-light">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-heading font-bold text-teal-dark">
                        {currentTestimonial.name}
                      </h3>
                      <p className="text-gray-700 font-body">
                        {currentTestimonial.profession}, {currentTestimonial.location}
                      </p>
                      <p className="text-sm text-sage-dark font-medium mt-1">
                        {currentTestimonial.chairModel}
                      </p>
                    </div>
                    {currentTestimonial.verified && (
                      <div className="text-sage">
                        <BadgeCheck size={20} />
                      </div>
                    )}
                  </div>

                  <blockquote className="mb-6">
                    <p className="text-xl font-heading font-bold text-teal italic mb-4">
                      "{currentTestimonial.quote}"
                    </p>
                    <div className="space-y-4 text-gray-700 font-body">
                      <p>{currentTestimonial.context}</p>
                      <p>{currentTestimonial.transformation}</p>
                      <p className="font-medium">{currentTestimonial.conclusion}</p>
                    </div>
                  </blockquote>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-600">
                    Usando desde: {currentTestimonial.timeUsing}
                  </span>
                  <div className="flex space-x-1">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentIndex(index);
                          if (timerRef.current) clearInterval(timerRef.current);
                          if (autoRotate) resetTimer();
                        }}
                        className={`w-2 h-2 rounded-full ${
                          index === currentIndex ? 'bg-sage' : 'bg-beige-dark'
                        }`}
                        aria-label={`Ir al testimonio ${index + 1}`}
                        aria-current={index === currentIndex ? 'true' : 'false'}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
