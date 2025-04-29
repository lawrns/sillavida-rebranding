/**
 * SillaVida Typography Tokens
 * 
 * This file defines all typography tokens used in the application.
 * Based on the Vida redesign typography system.
 */

export const typography = {
  // Font families
  fontFamily: {
    heading: '"Montserrat", Arial, Helvetica, sans-serif',
    body: '"Open Sans", Arial, Helvetica, sans-serif',
    special: '"Playfair Display", Georgia, "Times New Roman", serif',
  },
  
  // Font sizes (in rem for better accessibility)
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  
  // Font weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
  
  // Component-specific typography
  heading: {
    h1: {
      fontSize: '2.25rem', // 4xl
      fontWeight: 700,     // bold
      lineHeight: 1.2,     // tight
      letterSpacing: '-0.025em', // tight
    },
    h2: {
      fontSize: '1.875rem', // 3xl
      fontWeight: 600,      // semibold
      lineHeight: 1.2,      // tight
      letterSpacing: '-0.025em', // tight
    },
    h3: {
      fontSize: '1.5rem',  // 2xl
      fontWeight: 600,     // semibold
      lineHeight: 1.2,     // tight
      letterSpacing: '0',  // normal
    },
    h4: {
      fontSize: '1.25rem', // xl
      fontWeight: 500,     // medium
      lineHeight: 1.2,     // tight
      letterSpacing: '0',  // normal
    },
    h5: {
      fontSize: '1.125rem', // lg
      fontWeight: 500,      // medium
      lineHeight: 1.2,      // tight
      letterSpacing: '0',   // normal
    },
    h6: {
      fontSize: '1rem',    // base
      fontWeight: 500,     // medium
      lineHeight: 1.2,     // tight
      letterSpacing: '0',  // normal
    },
  },
  
  // Body text styles
  body: {
    primary: {
      fontSize: '1rem',    // base
      fontWeight: 400,     // regular
      lineHeight: 1.5,     // normal
      letterSpacing: '0',  // normal
    },
    secondary: {
      fontSize: '0.875rem', // sm
      fontWeight: 400,      // regular
      lineHeight: 1.5,      // normal
      letterSpacing: '0',   // normal
    },
    large: {
      fontSize: '1.125rem', // lg
      fontWeight: 400,      // regular
      lineHeight: 1.5,      // normal
      letterSpacing: '0',   // normal
    },
    small: {
      fontSize: '0.75rem',  // xs
      fontWeight: 400,      // regular
      lineHeight: 1.5,      // normal
      letterSpacing: '0',   // normal
    },
  },
  
  // Special text styles
  special: {
    testimonial: {
      fontSize: '1.25rem',  // xl
      fontWeight: 400,      // regular
      lineHeight: 1.75,     // relaxed
      letterSpacing: '0',   // normal
    },
    quote: {
      fontSize: '1.5rem',   // 2xl
      fontWeight: 400,      // regular
      lineHeight: 1.75,     // relaxed
      letterSpacing: '0',   // normal
    },
  },
  
  // Button text styles
  button: {
    primary: {
      fontSize: '1rem',     // base
      fontWeight: 600,      // semibold
      letterSpacing: '0.025em', // wide
    },
    secondary: {
      fontSize: '1rem',     // base
      fontWeight: 500,      // medium
      letterSpacing: '0.025em', // wide
    },
  },
  
  // Navigation text styles
  navigation: {
    item: {
      fontSize: '0.875rem', // sm
      fontWeight: 500,      // medium
      letterSpacing: '0',   // normal
    },
    breadcrumb: {
      fontSize: '0.75rem',  // xs
      fontWeight: 400,      // regular
      letterSpacing: '0',   // normal
    },
  },
  
  // Product text styles
  product: {
    title: {
      fontSize: '1.25rem',  // xl
      fontWeight: 600,      // semibold
      lineHeight: 1.2,      // tight
    },
    price: {
      fontSize: '1.125rem', // lg
      fontWeight: 700,      // bold
      lineHeight: 1.2,      // tight
    },
    description: {
      fontSize: '1rem',     // base
      fontWeight: 400,      // regular
      lineHeight: 1.5,      // normal
    },
  },
  
  // Form text styles
  form: {
    label: {
      fontSize: '0.875rem', // sm
      fontWeight: 500,      // medium
      lineHeight: 1.5,      // normal
    },
    input: {
      fontSize: '1rem',     // base
      fontWeight: 400,      // regular
      lineHeight: 1.5,      // normal
    },
  },
  
  // Footer text styles
  footer: {
    text: {
      fontSize: '0.875rem', // sm
      fontWeight: 400,      // regular
      lineHeight: 1.5,      // normal
    },
  },
};

// Export types for TypeScript support
export type TypographyTokens = typeof typography;
