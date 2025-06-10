/**
 * UGCCard Component
 * Clean full-bleed media cards with overlay controls, inspired by modern social media
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import LazyMedia from './LazyMedia';
import type { UGCContent } from '../../data/ugc-content';

interface UGCCardProps {
  content: UGCContent;
  onImageClick: (content: UGCContent) => void;
  index: number;
}

const UGCCard: React.FC<UGCCardProps> = ({ content, onImageClick, index }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideo = content.type === 'video';

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.error('Error playing video:', error);
          setIsPlaying(false);
        });
      }
    } else {
      console.warn('Video ref not available');
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleCardClick = () => {
    onImageClick(content);
  };


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="flex-shrink-0 w-80"
      onClick={handleCardClick}
    >
      <div className="group cursor-pointer relative">
      {/* Media Container - Full bleed with aspect ratio matching product cards */}
      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <LazyMedia
          src={content.mediaUrl}
          poster={isVideo ? undefined : undefined}
          alt={content.title}
          type={isVideo ? 'video' : 'image'}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          onLoad={() => setMediaLoaded(true)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          muted={isMuted}
          loop={true}
          playsInline={true}
          videoRef={isVideo ? videoRef : undefined}
        />

        {/* Video Controls Overlay */}
        {isVideo && (
          <>
            {/* Background gradient - only on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            {/* Play/Pause Button - Always visible for videos */}
            <button
              onClick={handlePlayToggle}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="bg-white/90 hover:bg-white rounded-full p-4 transition-all duration-200 hover:scale-110 shadow-lg">
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-black" />
                ) : (
                  <Play className="w-6 h-6 text-black ml-1" />
                )}
              </div>
            </button>

            {/* Mute/Unmute Button - Bottom Right - Only on hover */}
            <button
              onClick={handleMuteToggle}
              className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-colors opacity-0 group-hover:opacity-100 z-10"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </button>
          </>
        )}


        {/* Product Badge - Top Right */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-black/70 text-white capitalize">
            {content.productAssociated}
          </span>
        </div>

        {/* Gradient overlay for better text visibility */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      </div>

      {/* Simple Text Below - Clean and minimal */}
      <div className="mt-4 text-center">
        <h3 className="text-sm font-semibold text-black mb-1 line-clamp-1">
          {content.title}
        </h3>
        <p className="text-xs text-gray-600 line-clamp-1">
          por {content.customerName}
        </p>
      </div>
      </div>
    </motion.div>
  );
};

export default UGCCard;