import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { Testimonial } from '../data/testimonials';
import { getFeaturedProducts } from '../lib/shopify';
import type { ShopifyProduct } from '../types/shopify';

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
  const [productImages, setProductImages] = useState<string[]>([]);
  const [productNames, setProductNames] = useState<string[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

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

  // Fetch Shopify product images on component mount
  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        setIsLoadingImages(true);
        // Fetch best-selling products to use their images
        const products = await getFeaturedProducts({
          collectionHandle: 'mas-vendidos',
          limit: testimonials.length
        });
        
        // Extract image URLs from products
        const images = products.map(product => 
          product.images.edges[0]?.node.url || '/images/placeholder.png'
        );
        
        // Extract product names from products
        const names = products.map(product => product.title);
        
        setProductImages(images);
        setProductNames(names);
        console.log('Fetched product images for testimonials:', images);
      } catch (error) {
        console.error('Error fetching product images:', error);
        // Use mock images as fallback
        setProductImages(testimonials.map(t => t.photo));
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchProductImages();
  }, [testimonials.length]);

  // Get current testimonial
  const currentTestimonial = testimonials[currentIndex];
  
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
      className={`relative overflow-hidden bg-white rounded-lg shadow-md ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Historias de Vida - Testimonios de clientes"
    >
      {/* Navigation buttons removed as requested - testimonials will auto-rotate */}
      
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
            <div className="grid grid-cols-1 md:grid-cols-2 h-full bg-white">
              {/* Photo Section */}
              <div className="relative bg-black flex items-center justify-center p-4 md:p-0">
                {/* Category icons and labels removed as requested */}
                {isLoadingImages ? (
                  <img
                    src={currentTestimonial.photo}
                    alt={`${currentTestimonial.name}, ${currentTestimonial.profession}`}
                    className="object-cover w-full h-full max-h-[300px] md:max-h-[400px]"
                  />
                ) : (
                  <img
                    src={productImages[currentIndex]}
                    alt={`${currentTestimonial.name}, ${currentTestimonial.profession}`}
                    className="object-cover w-full h-full max-h-[300px] md:max-h-[400px]"
                  />
                )}
              </div>

              {/* Content Section */}
              <div className="p-4 md:p-6 flex flex-col justify-between bg-[#f3f4f6] max-h-[300px] md:max-h-[400px] overflow-y-auto">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-heading font-bold text-black">
                        {currentTestimonial.name}
                      </h3>
                      <p className="text-gray-700 font-body">
                        {currentTestimonial.profession}, {currentTestimonial.location}
                      </p>
                      <p className="text-sm text-[#111827] font-medium mt-1">
                        {isLoadingImages ? currentTestimonial.chairModel : productNames[currentIndex] || currentTestimonial.chairModel}
                      </p>
                    </div>
                    {currentTestimonial.verified && (
                      <div className="text-[#111827]">
                        <BadgeCheck size={20} />
                      </div>
                    )}
                  </div>

                  <blockquote className="mb-4">
                    <p className="text-lg font-heading font-bold text-[#111827] italic mb-2">
                      "{currentTestimonial.quote}"
                    </p>
                    <div className="space-y-2 text-gray-700 font-body text-sm">
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
                          setDirection(index > currentIndex ? 1 : -1);
                          setCurrentIndex(index);
                          if (autoRotate) resetTimer();
                        }}
                        className={`w-2 h-2 rounded-full ${
                          index === currentIndex ? 'bg-[#111827]' : 'bg-neutral-300'
                        } focus:outline-none`}
                        aria-label={`Go to testimonial ${index + 1}`}
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
