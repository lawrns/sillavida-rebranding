import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { createLazyComponent } from '../common/LazyComponent';

// Lazy load LazyImage component
const LazyImage = createLazyComponent(() => import('../LazyImage'));

interface CategoriesSectionProps {
  collections: any[];
}

/**
 * CategoriesSection - Featured product categories
 * Self-contained with fallback static categories
 */
const CategoriesSection: React.FC<CategoriesSectionProps> = ({ collections }) => {
  // Static fallback categories
  const staticCategories = [
    { title: 'Sillas Ejecutivas', handle: 'sillas-ejecutivas', image: '/images/ejecutiva.png' },
    { title: 'Sillas Ergonómicas', handle: 'sillas-ergonomicas', image: '/images/ergonomica.png' },
    { title: 'Sillas Gamer', handle: 'sillas-gamer', image: '/images/gamer.png' },
    { title: 'Sillas Secretariales', handle: 'sillas-secretariales', image: '/images/secretariales.png' },
    { title: 'Sillas de Visita', handle: 'sillas-de-visita', image: '/images/visita.png' },
    { title: 'Accesorios', handle: 'accesorios', image: '/images/accesorio.png' }
  ];

  const imageMap: Record<string, string> = {
    'Sillas Ejecutivas': '/images/ejecutiva.png',
    'Sillas Ergonómicas': '/images/ergonomica.png',
    'Sillas Gamer': '/images/gamer.png',
    'Sillas Secretariales': '/images/secretariales.png',
    'Sillas de Visita': '/images/visita.png',
    'Accesorios': '/images/accesorio.png'
  };

  const descriptionMap: Record<string, string> = {
    'Sillas Ejecutivas': 'Elegancia y confort para ejecutivos',
    'Sillas Ergonómicas': 'Diseñadas para tu bienestar',
    'Sillas Gamer': 'Para sesiones épicas de juego',
    'Sillas Secretariales': 'Funcionalidad y comodidad',
    'Sillas de Visita': 'Para espacios de recepción',
    'Accesorios': 'Complementos para tu silla'
  };

  const categoriesToShow = collections.length > 0 
    ? collections.filter(collection => collection.title.startsWith('Silla'))
    : staticCategories;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-4 text-black">Encuentra tu silla ideal</h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
          Descubre nuestra colección de sillas ergonómicas diseñadas para mejorar tu postura, productividad y bienestar durante largas jornadas de trabajo.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoriesToShow.map((category, index) => {
            const imageSrc = collections.length > 0 
              ? (category.image?.url || imageMap[category.title] || '/images/placeholder.png')
              : category.image;
            
            const description = collections.length > 0 
              ? (descriptionMap[category.title] || 'Explora nuestra colección')
              : 'Explora nuestra colección';

            return (
              <Link
                key={category.id || index}
                to={`/category/${category.handle}`}
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="w-full h-[300px]">
                  <LazyImage
                    src={imageSrc}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#21303f]/80 to-transparent flex items-end p-6 sm:p-8">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-heading font-bold mb-2 text-[#d8dce5] home-category-heading">
                      {category.title}
                    </h3>
                    <span className="flex items-center text-[#d8dce5] home-category-link">
                      Ver colección <ChevronRight className="ml-2" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;