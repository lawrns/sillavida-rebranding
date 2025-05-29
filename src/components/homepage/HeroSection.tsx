import React from 'react';
import { createLazyComponent } from '../common/LazyComponent';

// Lazy load the HeroSlider component
const LazyHeroSlider = createLazyComponent(() => import('../HeroSlider'));

/**
 * HeroSection - Encapsulates the hero area of the homepage
 * Provides lazy loading for performance optimization
 */
const HeroSection: React.FC = () => {
  return <LazyHeroSlider />;
};

export default HeroSection;