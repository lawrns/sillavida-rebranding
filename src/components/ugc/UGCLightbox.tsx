/**
 * UGCLightbox Component
 * Modal for displaying UGC content in full view
 */

import React, { useEffect } from 'react';
import { X, Heart, Share2, ExternalLink, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { UGCContent } from '../../data/ugc-content';

interface UGCLightboxProps {
  content: UGCContent | null;
  isOpen: boolean;
  onClose: () => void;
}

const UGCLightbox: React.FC<UGCLightboxProps> = ({ content, isOpen, onClose }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Close on Escape key and handle video autoplay
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      // Autoplay video if content is video type
      if (content?.type === 'video' && videoRef.current) {
        const playVideo = async () => {
          try {
            await videoRef.current?.play();
          } catch (error) {
            console.log('Autoplay prevented:', error);
          }
        };
        
        // Delay to ensure video element is ready
        setTimeout(playVideo, 300);
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      
      // Pause video when closing
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [isOpen, onClose, content]);

  if (!content) return null;

  const getSocialIcon = () => {
    switch (content.socialPlatform) {
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'facebook':
        return <Facebook className="w-5 h-5" />;
      case 'twitter':
        return <Twitter className="w-5 h-5" />;
      default:
        return <ExternalLink className="w-5 h-5" />;
    }
  };

  const getProfileBadgeColor = () => {
    const colors = {
      'executive': 'bg-blue-500',
      'gamer': 'bg-purple-500',
      'student': 'bg-green-500',
      'remote-worker': 'bg-orange-500',
      'creative': 'bg-pink-500',
      'healthcare': 'bg-red-500'
    };
    return colors[content.customerProfile] || 'bg-gray-500';
  };

  const getProfileLabel = () => {
    const labels = {
      'executive': 'Ejecutivo',
      'gamer': 'Gamer',
      'student': 'Estudiante',
      'remote-worker': 'Trabajo Remoto',
      'creative': 'Creativo',
      'healthcare': 'Salud'
    };
    return labels[content.customerProfile] || 'Usuario';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-4">
                <img
                  src={content.customerAvatar}
                  alt={content.customerName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">
                      {content.customerName}
                    </h3>
                    {content.isVerified && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    {content.socialPlatform && (
                      <div className={`p-1 rounded-full text-white ${
                        content.socialPlatform === 'instagram' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                        content.socialPlatform === 'facebook' ? 'bg-blue-600' :
                        'bg-gray-800'
                      }`}>
                        {getSocialIcon()}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 mt-1">
                    {content.location && (
                      <div className="flex items-center space-x-1 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{content.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              <div className="grid md:grid-cols-2 min-h-0">
                {/* Media */}
                <div className="relative bg-gray-100 flex items-center justify-center min-h-[400px]">
                  {content.type === 'video' ? (
                    <video
                      ref={videoRef}
                      controls
                      className="w-full h-full object-contain"
                      poster={content.thumbnailUrl}
                      preload="auto"
                    >
                      <source src={content.mediaUrl} type="video/mp4" />
                      Tu navegador no soporta el elemento video.
                    </video>
                  ) : (
                    <img
                      src={content.mediaUrl}
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                  )}

                </div>

                {/* Details */}
                <div className="p-6 flex flex-col">
                  <div className="flex-1">
                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {content.title}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {content.description}
                    </p>

                    {/* Product Association */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Producto Asociado</h4>
                      <Link 
                        to={`/product/${content.productAssociated}`}
                        className="block hover:bg-gray-100 rounded-lg p-2 -m-2 transition-colors"
                        onClick={onClose}
                      >
                        <p className="font-medium text-gray-900 capitalize">
                          Silla {content.productAssociated}
                        </p>
                      </Link>
                    </div>

                    {/* Hashtags */}
                    {content.hashtags && content.hashtags.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Hashtags</h4>
                        <div className="flex flex-wrap gap-2">
                          {content.hashtags.map((hashtag, index) => (
                            <span
                              key={index}
                              className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
                            >
                              {hashtag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4 fill-current text-red-500" />
                            <span>{content.likes || 0} likes</span>
                          </div>
                          <span>
                            {new Date(content.datePosted).toLocaleDateString('es-MX', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3 pt-6 border-t">
                    <Link 
                      to={`/product/${content.productAssociated}`} 
                      className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center"
                      onClick={onClose}
                    >
                      Ver Producto
                    </Link>
                    <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UGCLightbox;