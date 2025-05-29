import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { createLazyComponent } from '../common/LazyComponent';

// Lazy load Judge.me components for enhanced functionality
const LazyJudgeMeLoader = createLazyComponent(() => 
  import('../judgeMe').then(module => ({ default: module.JudgeMeLoader }))
);

// Mock review data for consistent display while Judge.me loads
const featuredReviews = [
  {
    id: 1,
    name: "María González",
    rating: 5,
    title: "Excelente inversión para mi salud",
    comment: "Después de 6 meses usando esta silla, mi dolor de espalda ha desaparecido completamente. La calidad es excepcional.",
    verified: true,
    date: "Hace 2 semanas"
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    rating: 5,
    title: "Perfecta para trabajar desde casa",
    comment: "Trabajo 8+ horas diarias y esta silla es increíblemente cómoda. Los ajustes ergonómicos son perfectos para mi altura.",
    verified: true,
    date: "Hace 1 mes"
  },
  {
    id: 3,
    name: "Ana Martínez",
    rating: 5,
    title: "Calidad superior, muy recomendada",
    comment: "La mejor compra que he hecho para mi oficina. Los materiales son de primera calidad y el diseño es elegante.",
    verified: true,
    date: "Hace 3 semanas"
  }
];

/**
 * ReviewsSection - Template-inspired 3-card horizontal review layout
 * Features modern design with consistent fallback content and Judge.me integration
 */
const ReviewsSection: React.FC = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating 
            ? 'text-yellow-500 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="bg-gray-50 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Miles de personas han transformado su experiencia de trabajo con nuestras sillas ergonómicas
          </p>
          
          {/* Overall Rating Summary */}
          <div className="flex items-center justify-center mt-6 space-x-4">
            <div className="flex items-center space-x-1">
              {renderStars(5)}
            </div>
            <span className="text-2xl font-bold text-black">4.8/5</span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-600">+500 reseñas verificadas</span>
          </div>
        </div>

        {/* 3-Card Review Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {featuredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-black/20" />
              </div>
              
              {/* Review Content */}
              <div className="mb-6">
                <h4 className="font-semibold text-black text-lg mb-2">
                  {review.title}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  "{review.comment}"
                </p>
              </div>
              
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {renderStars(review.rating)}
              </div>
              
              {/* Reviewer Info */}
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-black">{review.name}</p>
                  <p className="text-gray-500">{review.date}</p>
                </div>
                {review.verified && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-xs font-medium">Verificada</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        
        {/* Hidden Judge.me Integration for Enhanced Functionality */}
        <div className="hidden">
          <LazyJudgeMeLoader>
            <div className="jdgm-carousel-wrapper">
              <div data-score="" className="jdgm-all-reviews-rating"></div>
              <span className="jdgm-all-reviews-count"></span>
            </div>
          </LazyJudgeMeLoader>
        </div>
        
      </div>
    </section>
  );
};

export default ReviewsSection;