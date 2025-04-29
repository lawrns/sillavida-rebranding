/**
 * SillaVida Border Tokens
 * 
 * This file defines all border tokens used in the application.
 * Based on the Vida redesign border system.
 */

import { colors } from './colors';

export const borders = {
  // Border widths
  width: {
    none: '0',
    thin: '1px',
    medium: '2px',
    thick: '4px',
  },
  
  // Border styles
  style: {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
  },
  
  // Border radii
  radius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    full: '9999px',   // Fully rounded (for pills, circles)
  },
  
  // Border colors (referencing color tokens)
  color: {
    primary: colors.border.primary,
    secondary: colors.border.secondary,
    light: colors.border.light,
    medium: colors.border.medium,
    dark: colors.border.dark,
    accent: colors.border.accent,
  },
  
  // Component-specific borders
  component: {
    // Button borders
    button: {
      primary: {
        width: '1px',
        style: 'solid',
        color: colors.button.primary.border,
        radius: '0.375rem', // 6px
      },
      secondary: {
        width: '1px',
        style: 'solid',
        color: colors.button.secondary.border,
        radius: '0.375rem', // 6px
      },
      tertiary: {
        width: '1px',
        style: 'solid',
        color: colors.button.tertiary.border,
        radius: '0.375rem', // 6px
      },
    },
    
    // Card borders
    card: {
      width: '1px',
      style: 'solid',
      color: colors.card.border,
      radius: '0.5rem', // 8px
    },
    
    // Form input borders
    input: {
      default: {
        width: '1px',
        style: 'solid',
        color: colors.form.border,
        radius: '0.375rem', // 6px
      },
      focus: {
        width: '1px',
        style: 'solid',
        color: colors.form.focus,
        radius: '0.375rem', // 6px
      },
      error: {
        width: '1px',
        style: 'solid',
        color: colors.form.error,
        radius: '0.375rem', // 6px
      },
    },
    
    // Table borders
    table: {
      outer: {
        width: '1px',
        style: 'solid',
        color: colors.border.light,
      },
      inner: {
        width: '1px',
        style: 'solid',
        color: colors.border.light,
      },
      header: {
        width: '2px',
        style: 'solid',
        color: colors.border.medium,
      },
    },
    
    // Divider borders
    divider: {
      width: '1px',
      style: 'solid',
      color: colors.border.light,
    },
  },
  
  // Compound border shorthand generators
  shorthand: {
    // Generate full border shorthand (width style color)
    all: (width: string, style: string, color: string) => 
      `${width} ${style} ${color}`,
    
    // Generate border with default solid style
    solid: (width: string, color: string) => 
      `${width} solid ${color}`,
  },
};

// Export types for TypeScript support
export type BorderTokens = typeof borders;
