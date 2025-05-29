import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { createLazyComponent } from '../common/LazyComponent';

// Lazy load LazyImage component
const LazyImage = createLazyComponent(() => import('../LazyImage'));

interface CategoriesSectionProps {
  collections: any[];
}

/**
 * CategoriesSection - Enhanced category display with improved template-inspired design
 * Maintains product category images while adding modern styling and animations
 */
const CategoriesSection: React.FC<CategoriesSectionProps> = ({ collections }) => {
  // Static fallback categories - Updated to current SillaVida naming
  const staticCategories = [
    { title: 'SillaVida Esencial', handle: 'sillavida-esencial', image: '/images/ejecutiva.png' },
    { title: 'SillaVida Confort', handle: 'sillavida-confort', image: '/images/ergonomica.png' },
    { title: 'SillaVida Zen', handle: 'sillavida-zen', image: '/images/gamer.png' }
  ];

  const imageMap: Record<string, string> = {
    'SillaVida Esencial': '/images/ejecutiva.png',
    'SillaVida Confort': '/images/ergonomica.png',
    'SillaVida Zen': '/images/gamer.png'
  };

  const descriptionMap: Record<string, string> = {
    'SillaVida Esencial': 'Elegancia y confort para ejecutivos',
    'SillaVida Confort': 'Diseñadas para tu bienestar y productividad',
    'SillaVida Zen': 'Para sesiones largas de concentración'
  };

  const categoriesToShow = collections.length > 0 
    ? collections.filter(collection => collection.title.startsWith('SillaVida'))
    : staticCategories;

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
            Encuentra Tu Silla Ideal
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre nuestra colección completa de sillas ergonómicas diseñadas para 
            mejorar tu postura, productividad y bienestar durante largas jornadas de trabajo.
          </p>
        </div>
        
        {/* Enhanced Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {categoriesToShow.map((category, index) => {
            const imageSrc = collections.length > 0 
              ? (category.image?.url || imageMap[category.title] || '/images/placeholder.png')
              : category.image;
            
            const description = collections.length > 0 
              ? (descriptionMap[category.title] || 'Explora nuestra colección')
              : 'Explora nuestra colección';

            return (
              <motion.div
                key={category.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/category/${category.handle}`}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 block"
                >
                  <div className="w-full h-[320px] lg:h-[350px]">
                    <LazyImage
                      src={imageSrc}
                      alt={category.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Enhanced Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Enhanced Content */}
                  <div className="absolute inset-0 flex items-end p-6 lg:p-8">
                    <div className="w-full">
                      <h3 className="text-2xl lg:text-3xl font-bold mb-2 text-white group-hover:text-gray-100 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-gray-200 text-sm lg:text-base mb-4 opacity-90">
                        {description}
                      </p>
                      <span className="inline-flex items-center text-white font-semibold text-sm lg:text-base group-hover:translate-x-1 transition-transform duration-200">
                        Ver colección 
                        <ChevronRight className="ml-2 w-5 h-5" />
                      </span>
                    </div>
                  </div>
                  
                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-2xl transition-colors duration-300"></div>
                </Link>
              </motion.div>
            );
          })}
        </div>
        
        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            ¿No estás seguro cuál es la mejor opción para ti? Nuestros especialistas en ergonomía 
            te ayudan a encontrar la silla perfecta para tus necesidades.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 border border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition-colors duration-200"
          >
            Consulta Gratuita con Especialista
          </Link>
        </motion.div>
        
      </div>
    </section>
  );
};

export default CategoriesSection;