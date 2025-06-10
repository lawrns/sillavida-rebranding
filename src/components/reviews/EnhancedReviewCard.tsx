/**
 * EnhancedReviewCard Component
 * Displays individual review with customer photo, verification, and product info
 */

import React, { useState } from 'react';
import { Star, ShoppingBag, Calendar, Shield, MessageCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';
import type { EnhancedReview } from '../../data/enhanced-reviews';
import { getProfileIcon, getProfileLabel } from '../../data/enhanced-reviews';
import DefaultAvatar from '../common/DefaultAvatar';

interface EnhancedReviewCardProps {
  review: EnhancedReview;
  index: number;
}

const EnhancedReviewCard: React.FC<EnhancedReviewCardProps> = ({ review, index }) => {
  const [showReply, setShowReply] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const ProfileIcon = getProfileIcon(review.customerProfile);
  
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


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 min-w-[350px] max-w-[400px] flex-shrink-0 flex flex-col"
    >
      {/* Customer Header */}
      <div className="flex items-start space-x-4 mb-4">
        {/* Customer Avatar */}
        <div className="relative">
          {!imageError ? (
            <img
              src={review.avatar}
              alt={`${review.customerName} avatar`}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <DefaultAvatar 
              name={review.customerName} 
              size="md" 
              className="border-2 border-gray-200"
            />
          )}
          {review.verified && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <Shield className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Customer Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-semibold text-black text-sm truncate">{review.customerName}</h4>
            <div className="flex items-center space-x-1">
              <ProfileIcon className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">{getProfileLabel(review.customerProfile)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <ShoppingBag className="w-3 h-3" />
            <span>Comprò: {review.productDisplayName}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(review.reviewDate)}</span>
            {review.usageDuration && (
              <>
                <span>•</span>
                <span>{review.usageDuration}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="flex items-center space-x-1">
          {renderStars(review.rating)}
        </div>
        <span className="text-sm font-medium text-gray-700">{review.rating}/5</span>
      </div>

      {/* Review Title */}
      <h3 className="font-semibold text-black text-base mb-3 leading-tight">
        {review.title}
      </h3>

      {/* Review Content */}
      <div className="mb-4 flex-grow">
        <p className="text-gray-700 leading-relaxed text-sm">
          "{review.body}"
        </p>
      </div>


      {/* Footer Section - Always at bottom */}
      <div className="mt-auto space-y-3">
        {/* Verification Badge */}
        {review.verified && (
          <div className="flex items-center space-x-2 text-green-600 text-xs">
            <Shield className="w-4 h-4" />
            <span className="font-medium">Compra Verificada</span>
          </div>
        )}

        {/* Company Reply */}
        {review.companyReply && (
          <div>
            <button
              onClick={() => setShowReply(!showReply)}
              className="flex items-center space-x-2 text-black text-xs font-medium hover:underline focus:outline-none"
            >
              <MessageCircle className="w-3 h-3" />
              <span>{showReply ? 'Ocultar' : 'Ver'} respuesta de SillaVida</span>
            </button>
            
            {showReply && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 bg-blue-50 rounded-lg p-3 border-l-3 border-blue-400"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">SV</span>
                  </div>
                  <span className="text-xs font-medium text-black">SillaVida</span>
                  <span className="text-xs text-gray-500">
                    {formatDate(review.companyReply.replyDate)}
                  </span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {review.companyReply.message}
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EnhancedReviewCard;