/**
 * TrustIndicators Component
 * Displays overall rating, review count, star distribution, and verification stats
 */

import React from 'react';
import { Star, Users, Shield, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import type { TrustMetrics } from '../../data/enhanced-reviews';

interface TrustIndicatorsProps {
  metrics: TrustMetrics;
}

const TrustIndicators: React.FC<TrustIndicatorsProps> = ({ metrics }) => {
  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const sizeClasses = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${sizeClasses} ${
          index < Math.floor(rating) 
            ? 'text-yellow-500 fill-current' 
            : index < rating 
            ? 'text-yellow-300 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStarPercentage = (starCount: number, total: number) => {
    return Math.round((starCount / total) * 100);
  };

  return (
    <div className="bg-white rounded-xl p-4 lg:p-5 shadow-md border border-gray-100 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        
        {/* Overall Rating */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center lg:text-left"
        >
          <div className="flex items-center justify-center lg:justify-start space-x-2 mb-1">
            <TrendingUp className="w-4 h-4 text-black" />
            <span className="text-xs font-medium text-gray-700">Calificación General</span>
          </div>
          <div className="flex items-center justify-center lg:justify-start space-x-2 mb-1">
            <span className="text-2xl font-bold text-black">{metrics.averageRating}</span>
            <div className="flex items-center space-x-1">
              {renderStars(metrics.averageRating, 'sm')}
            </div>
          </div>
          <p className="text-xs text-gray-600">de 5 estrellas</p>
        </motion.div>

        {/* Total Reviews */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-center lg:text-left"
        >
          <div className="flex items-center justify-center lg:justify-start space-x-2 mb-1">
            <Users className="w-4 h-4 text-black" />
            <span className="text-xs font-medium text-gray-700">Total de Reseñas</span>
          </div>
          <div className="mb-1">
            <span className="text-2xl font-bold text-black">{metrics.totalReviews}</span>
          </div>
          <p className="text-xs text-gray-600">opiniones verificadas</p>
        </motion.div>

        {/* Verification Rate */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center lg:text-left"
        >
          <div className="flex items-center justify-center lg:justify-start space-x-2 mb-1">
            <Shield className="w-4 h-4 text-black" />
            <span className="text-xs font-medium text-gray-700">Verificación</span>
          </div>
          <div className="mb-1">
            <span className="text-2xl font-bold text-green-600">{metrics.verificationRate}%</span>
          </div>
          <p className="text-xs text-gray-600">compras verificadas</p>
        </motion.div>

        {/* Star Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-4 h-4 text-black" />
            <span className="text-xs font-medium text-gray-700">Distribución</span>
          </div>
          
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = metrics.starDistribution[stars as keyof typeof metrics.starDistribution];
            const percentage = getStarPercentage(count, metrics.totalReviews);
            
            return (
              <div key={stars} className="flex items-center space-x-1.5 text-xs mb-1">
                <span className="w-2 text-gray-600 text-center text-xs">{stars}</span>
                <Star className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + (5 - stars) * 0.1 }}
                    viewport={{ once: true }}
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                  />
                </div>
                <span className="w-6 text-xs text-gray-600 text-right">{count}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default TrustIndicators;