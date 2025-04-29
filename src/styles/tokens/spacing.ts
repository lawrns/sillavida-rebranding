/**
 * SillaVida Spacing Tokens
 * 
 * This file defines all spacing tokens used in the application.
 * Based on a 4px/8px grid system for consistency.
 */

export const spacing = {
  // Base spacing units (in rem for better accessibility)
  '0': '0',
  '0.5': '0.125rem',  // 2px
  '1': '0.25rem',     // 4px
  '2': '0.5rem',      // 8px
  '3': '0.75rem',     // 12px
  '4': '1rem',        // 16px
  '5': '1.25rem',     // 20px
  '6': '1.5rem',      // 24px
  '8': '2rem',        // 32px
  '10': '2.5rem',     // 40px
  '12': '3rem',       // 48px
  '16': '4rem',       // 64px
  '20': '5rem',       // 80px
  '24': '6rem',       // 96px
  '32': '8rem',       // 128px
  '40': '10rem',      // 160px
  '48': '12rem',      // 192px
  '56': '14rem',      // 224px
  '64': '16rem',      // 256px
  
  // Named spacing aliases for semantic use
  xs: '0.25rem',      // 4px
  sm: '0.5rem',       // 8px
  md: '1rem',         // 16px
  lg: '1.5rem',       // 24px
  xl: '2rem',         // 32px
  '2xl': '3rem',      // 48px
  '3xl': '4rem',      // 64px
  '4xl': '6rem',      // 96px
  '5xl': '8rem',      // 128px
  
  // Component-specific spacing
  component: {
    // Section spacing
    section: {
      paddingY: {
        default: '3rem',    // 48px
        compact: '1.5rem',  // 24px
        spacious: '5rem',   // 80px
      },
      paddingX: {
        default: '1rem',    // 16px
        narrow: '0.5rem',   // 8px
        wide: '2rem',       // 32px
      },
      marginBottom: {
        default: '3rem',    // 48px
        compact: '1.5rem',  // 24px
        spacious: '5rem',   // 80px
      },
    },
    
    // Card spacing
    card: {
      padding: {
        default: '1.5rem',  // 24px
        compact: '1rem',    // 16px
        spacious: '2rem',   // 32px
      },
      gap: {
        default: '1rem',    // 16px
        compact: '0.5rem',  // 8px
        spacious: '1.5rem', // 24px
      },
      marginBottom: {
        default: '1.5rem',  // 24px
        compact: '1rem',    // 16px
        spacious: '2rem',   // 32px
      },
    },
    
    // Button spacing
    button: {
      paddingY: {
        default: '0.5rem',  // 8px
        sm: '0.25rem',      // 4px
        lg: '0.75rem',      // 12px
      },
      paddingX: {
        default: '1rem',    // 16px
        sm: '0.5rem',       // 8px
        lg: '1.5rem',       // 24px
      },
      gap: '0.5rem',        // 8px (for buttons with icons)
    },
    
    // Form spacing
    form: {
      gap: '1rem',          // 16px
      marginBottom: '1rem', // 16px
      labelGap: '0.25rem',  // 4px
      inputPaddingY: '0.5rem', // 8px
      inputPaddingX: '0.75rem', // 12px
    },
    
    // Navigation spacing
    navigation: {
      paddingY: '1rem',     // 16px
      paddingX: '1.5rem',   // 24px
      itemGap: '1.5rem',    // 24px
      itemPaddingY: '0.5rem', // 8px
      itemPaddingX: '0.75rem', // 12px
    },
    
    // Product spacing
    product: {
      gap: '1.5rem',        // 24px
      imagePadding: '1rem', // 16px
      detailsGap: '1rem',   // 16px
    },
    
    // Footer spacing
    footer: {
      paddingY: '2rem',     // 32px
      paddingX: '1.5rem',   // 24px
      sectionGap: '2rem',   // 32px
      itemGap: '0.75rem',   // 12px
    },
  },
  
  // Layout spacing
  layout: {
    container: {
      paddingX: '1rem',     // 16px
      maxWidth: '1280px',   // Maximum container width
    },
    grid: {
      gap: {
        default: '1.5rem',  // 24px
        compact: '1rem',    // 16px
        spacious: '2rem',   // 32px
      },
    },
    stack: {
      gap: {
        default: '1rem',    // 16px
        compact: '0.5rem',  // 8px
        spacious: '1.5rem', // 24px
      },
    },
  },
};

// Export types for TypeScript support
export type SpacingTokens = typeof spacing;
