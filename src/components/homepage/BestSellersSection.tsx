import React from 'react';
import { createLazyComponent } from '../common/LazyComponent';
import type { ShopifyProduct } from '../../types/shopify';
import { chairs } from '../../data/chairs';

// Lazy load product card components
const LazyShopifyProductCard = createLazyComponent(() => import('../ShopifyProductCard'));
const LazyProductCard = createLazyComponent(() => import('../ProductCard'));

interface BestSellersSectionProps {
  bestSellers: ShopifyProduct[];
  isLoading: boolean;
  dataFetched: boolean;
}

/**
 * BestSellersSection - Displays best selling products
 * Uses composition pattern with lazy-loaded product cards
 */
const BestSellersSection: React.FC<BestSellersSectionProps> = ({
  bestSellers,
  isLoading,
  dataFetched
}) => {
  const staticBestSellers = chairs.slice(0, 8);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-8">
          <div className="w-full text-center mb-4">
            <h2 className="text-3xl font-heading font-bold text-black mb-4">Nuestros Más Vendidos</h2>
            <p className="text-gray-600 mb-6 font-body max-w-2xl mx-auto">
              Descubre por qué nuestros clientes eligen estas sillas. Combinan ergonomía, calidad y estilo para mejorar tu experiencia de trabajo o juego.
            </p>
          </div>
          
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading && !dataFetched ? (
              // Loading skeleton
              Array(6).fill(0).map((_, index) => (
                <div key={`skeleton-${index}`} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded w-full"></div>
                  </div>
                </div>
              ))
            ) : bestSellers.length > 0 ? (
              // Shopify products
              bestSellers.slice(0, 6).map((product) => (
                <LazyShopifyProductCard 
                  key={`shopify-${product.id}`} 
                  product={product} 
                  hideDescription={true} 
                />
              ))
            ) : (
              // Fallback to static data
              staticBestSellers.slice(0, 6).map((chair) => (
                <LazyProductCard key={`static-${chair.id}`} chair={chair} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellersSection;