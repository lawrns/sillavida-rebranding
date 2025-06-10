/**
 * Font Optimization Utilities
 * 
 * Implements font loading optimizations for better performance
 */

interface FontConfig {
  family: string;
  weight?: string;
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  preload?: boolean;
}

const CRITICAL_FONTS: FontConfig[] = [
  {
    family: 'Inter',
    weight: '400,600,700',
    display: 'swap',
    preload: true
  }
];

/**
 * Preload critical fonts
 */
export const preloadCriticalFonts = (): void => {
  CRITICAL_FONTS.forEach(font => {
    if (font.preload) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = `/fonts/${font.family.toLowerCase()}-var.woff2`;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  });
};

/**
 * Optimize font loading with font-display
 */
export const optimizeFontDisplay = (): void => {
  const style = document.createElement('style');
  style.textContent = `
    /* Font optimization */
    @font-face {
      font-family: 'Inter';
      font-display: swap;
      src: url('/fonts/inter-var.woff2') format('woff2-variations');
      font-weight: 100 900;
      font-style: normal;
    }
    
    /* System font fallbacks */
    body {
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
  `;
  document.head.appendChild(style);
};

/**
 * Initialize font optimizations
 */
export const initFontOptimization = (): void => {
  // Preload critical fonts
  preloadCriticalFonts();
  
  // Optimize font display
  optimizeFontDisplay();
  
  console.log('[Font Optimization] Initialized');
};

// Auto-initialize
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFontOptimization);
  } else {
    initFontOptimization();
  }
}