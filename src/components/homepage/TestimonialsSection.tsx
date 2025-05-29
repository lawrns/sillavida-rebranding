import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Users } from 'lucide-react';
import { createLazyComponent } from '../common/LazyComponent';
import { getFeaturedTestimonials } from '../../data/testimonials';

// Lazy load TestimonialCarousel
const LazyTestimonialCarousel = createLazyComponent(() => import('../TestimonialCarousel'));

/**
 * TestimonialsSection - Customer stories and testimonials
 * Self-contained component with lazy loading
 */
const TestimonialsSection: React.FC = () => {
  const testimonials = getFeaturedTestimonials();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-black mb-4">Historias de Vida</h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-body">
            Descubre cómo nuestras sillas han transformado la vida de nuestros clientes, mejorando su salud, productividad y bienestar.
          </p>
        </div>
        
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2 px-4 py-2 bg-[#21303f]/10 rounded-full">
            <Users className="h-5 w-5 text-[#21303f]" />
            <span className="text-sm font-medium text-[#21303f]">Experiencias reales de nuestros clientes</span>
          </div>
        </div>
        
        <LazyTestimonialCarousel testimonials={testimonials} />
        
        <div className="text-center mt-8">
          <Link
            to="/testimonios"
            className="inline-flex items-center text-[#333333] hover:text-[#000000] transition-colors"
          >
            Ver más historias <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;