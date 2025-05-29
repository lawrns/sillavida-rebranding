import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Filter, Heart, Activity, User } from 'lucide-react';
import { testimonials, TestimonialCategory, getCategoryLabel } from '../data/testimonials';
import TestimonialCarousel from '../components/TestimonialCarousel';

const TestimonialsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<TestimonialCategory | 'all'>('all');

  // Filter testimonials based on active category
  const filteredTestimonials = activeCategory === 'all'
    ? testimonials
    : testimonials.filter(testimonial => testimonial.category === activeCategory);

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-gray-50"
    >
      {/* Hero Section */}
      <section className="bg-teal text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-3 rounded-full">
              <Users className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-[#FFFFFF]">Historias de Vida</h1>
          <p className="text-xl max-w-2xl mx-auto font-body text-[#F5F0E8]">
            Descubre cómo nuestras sillas ergonómicas han transformado la vida de nuestros clientes, mejorando su salud, productividad y bienestar.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <span className="font-heading font-medium">Filtrar por categoría:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-teal text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveCategory('health')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
                  activeCategory === 'health'
                    ? 'bg-red-500 text-white'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                <Heart className="h-4 w-4 mr-1" />
                {getCategoryLabel('health')}
              </button>
              <button
                onClick={() => setActiveCategory('productivity')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
                  activeCategory === 'productivity'
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <Activity className="h-4 w-4 mr-1" />
                {getCategoryLabel('productivity')}
              </button>
              <button
                onClick={() => setActiveCategory('comfort')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
                  activeCategory === 'comfort'
                    ? 'bg-green-500 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                <User className="h-4 w-4 mr-1" />
                {getCategoryLabel('comfort')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {filteredTestimonials.length > 0 ? (
            <div className="grid grid-cols-1 gap-12">
              {filteredTestimonials.map((testimonial) => (
                <TestimonialCarousel
                  key={testimonial.id}
                  testimonials={[testimonial]}
                  autoRotate={false}
                  className="shadow-lg"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No se encontraron testimonios en esta categoría.</p>
            </div>
          )}
        </div>
      </section>

      {/* Share Your Story Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Comparte Tu Historia</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 font-body">
            ¿Has experimentado una transformación en tu vida gracias a nuestras sillas ergonómicas? Nos encantaría escuchar tu historia y compartirla con nuestra comunidad.
          </p>
          <button className="bg-teal hover:bg-teal-dark text-white font-heading font-medium px-6 py-3 rounded-lg transition-colors">
            Enviar Mi Historia
          </button>
        </div>
      </section>
    </motion.div>
  );
};

export default TestimonialsPage;
