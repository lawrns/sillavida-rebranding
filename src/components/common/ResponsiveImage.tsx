import React from 'react';
import LazyImage from './LazyImage';
import './ResponsiveImage.css';

interface ImageSource {
  src: string;
  width: number;
  format?: 'webp' | 'jpg' | 'png' | 'avif';
}

interface ResponsiveImageProps {
  sources: {
    small?: ImageSource[];
    medium?: ImageSource[];
    large?: ImageSource[];
  };
  fallbackSrc: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  sizes?: string;
  onLoad?: () => void;
}

/**
 * ResponsiveImage - A component that renders responsive images with next-gen formats
 * 
 * This component uses the <picture> element to provide different image sources
 * based on screen size and browser support for image formats.
 */
const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  sources,
  fallbackSrc,
  alt,
  className = '',
  aspectRatio = 'auto',
  sizes = '100vw',
  onLoad,
}) => {
  // Generate srcset for a specific breakpoint
  const generateSrcSet = (sources: ImageSource[] = []) => {
    return sources.map(source => `${source.src} ${source.width}w`).join(', ');
  };

  // Generate source elements for a specific format
  const generateSourcesForFormat = (format: 'webp' | 'jpg' | 'png' | 'avif') => {
    const formatSources = {
      small: sources.small?.filter(s => s.format === format || !s.format),
      medium: sources.medium?.filter(s => s.format === format || !s.format),
      large: sources.large?.filter(s => s.format === format || !s.format),
    };

    // Only create source element if we have sources for this format
    if (!formatSources.small?.length && !formatSources.medium?.length && !formatSources.large?.length) {
      return null;
    }

    const type = `image/${format}`;
    
    return (
      <source
        type={type}
        sizes={sizes}
        srcSet={[
          formatSources.small && formatSources.small.length > 0 ? 
            `${generateSrcSet(formatSources.small)}` : '',
          formatSources.medium && formatSources.medium.length > 0 ? 
            `${generateSrcSet(formatSources.medium)}` : '',
          formatSources.large && formatSources.large.length > 0 ? 
            `${generateSrcSet(formatSources.large)}` : '',
        ].filter(Boolean).join(', ')}
      />
    );
  };

  return (
    <div className={`responsive-image-container ${className}`} style={{ aspectRatio }}>
      <picture>
        {/* Next-gen formats first for browsers that support them */}
        {generateSourcesForFormat('avif')}
        {generateSourcesForFormat('webp')}
        {generateSourcesForFormat('png')}
        {generateSourcesForFormat('jpg')}
        
        {/* Fallback image using LazyImage for lazy loading */}
        <LazyImage
          src={fallbackSrc}
          alt={alt}
          className="responsive-image"
          aspectRatio={aspectRatio}
          onLoad={onLoad}
        />
      </picture>
    </div>
  );
};

export default ResponsiveImage;
