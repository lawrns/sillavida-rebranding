/**
 * UGCSection Component
 * Main UGC section with filters, grid layout, and responsive design
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Camera, Video, Share2, Grid3X3 } from 'lucide-react';
import UGCCarousel from './UGCCarousel';
import UGCLightbox from './UGCLightbox';
import { ugcContent, getUGCByType, ugcStats, type UGCContent } from '../../data/ugc-content';

type FilterType = 'all' | 'photo' | 'video' | 'social';

const UGCSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedContent, setSelectedContent] = useState<UGCContent | null>(null);

  // Filter content based on active filter - show all for carousel
  const filteredContent = useMemo(() => {
    return getUGCByType(activeFilter);
  }, [activeFilter]);

  const filterOptions = [
    {
      key: 'all' as FilterType,
      label: 'Todo',
      icon: Grid3X3,
      count: ugcStats.totalContent
    },
    {
      key: 'photo' as FilterType,
      label: 'Fotos',
      icon: Camera,
      count: ugcStats.totalPhotos
    },
    {
      key: 'video' as FilterType,
      label: 'Videos',
      icon: Video,
      count: ugcStats.totalVideos
    },
    {
      key: 'social' as FilterType,
      label: 'Social',
      icon: Share2,
      count: ugcStats.totalSocialPosts
    }
  ];

  const handleContentClick = (content: UGCContent) => {
    setSelectedContent(content);
  };

  const handleCloseLightbox = () => {
    setSelectedContent(null);
  };

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-8">
            Nuestros Clientes en Acción
          </h2>
        </motion.div>

        {/* Content Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          {filterOptions.map((option) => {
            const Icon = option.icon;
            const isActive = activeFilter === option.key;
            
            return (
              <button
                key={option.key}
                onClick={() => setActiveFilter(option.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-200 ${
                  isActive
                    ? 'bg-black text-white border-black shadow-lg'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:text-black hover:shadow-md'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{option.label}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  isActive ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {option.count}
                </span>
              </button>
            );
          })}
        </motion.div>

      </div>

      {/* UGC Carousel - Full-width like ProductCarousel */}
      <div className="relative mb-8">
        <UGCCarousel 
          content={filteredContent}
          onContentClick={handleContentClick}
          autoScroll={false}
          autoScrollInterval={10000}
        />
      </div>

      {/* Lightbox Modal */}
      <UGCLightbox
        content={selectedContent}
        isOpen={!!selectedContent}
        onClose={handleCloseLightbox}
      />
    </section>
  );
};

export default UGCSection;