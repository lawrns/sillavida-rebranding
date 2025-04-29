/**
 * SillaVida Shadow Tokens
 * 
 * This file defines all shadow tokens used in the application.
 * Based on the Vida redesign shadow system.
 */

import { colors } from './colors';

// Helper function to create shadow with specific color
const createShadow = (color: string, values: string) => {
  return values.replace(/rgba\([^)]+\)/g, color);
};

// Shadow base values
const shadowBase = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
  md: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.1)',
  lg: '0 4px 6px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08)',
  xl: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  '2xl': '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
};

// Shadow color values
const shadowColors = {
  neutral: 'rgba(33, 37, 41, 0.1)',
  primary: 'rgba(30, 89, 89, 0.15)',
  secondary: 'rgba(125, 157, 140, 0.15)',
  accent: 'rgba(200, 125, 85, 0.15)',
};

export const shadows = {
  // Base shadow values
  base: shadowBase,
  
  // Shadow colors
  colors: shadowColors,
  
  // Default shadows (using neutral color)
  sm: shadowBase.sm,
  md: shadowBase.md,
  lg: shadowBase.lg,
  xl: shadowBase.xl,
  '2xl': shadowBase['2xl'],
  
  // Primary color shadows (teal)
  primary: {
    sm: createShadow(shadowColors.primary, shadowBase.sm),
    md: createShadow(shadowColors.primary, shadowBase.md),
    lg: createShadow(shadowColors.primary, shadowBase.lg),
    xl: createShadow(shadowColors.primary, shadowBase.xl),
    '2xl': createShadow(shadowColors.primary, shadowBase['2xl']),
  },
  
  // Secondary color shadows (sage)
  secondary: {
    sm: createShadow(shadowColors.secondary, shadowBase.sm),
    md: createShadow(shadowColors.secondary, shadowBase.md),
    lg: createShadow(shadowColors.secondary, shadowBase.lg),
    xl: createShadow(shadowColors.secondary, shadowBase.xl),
    '2xl': createShadow(shadowColors.secondary, shadowBase['2xl']),
  },
  
  // Accent color shadows (terracotta)
  accent: {
    sm: createShadow(shadowColors.accent, shadowBase.sm),
    md: createShadow(shadowColors.accent, shadowBase.md),
    lg: createShadow(shadowColors.accent, shadowBase.lg),
    xl: createShadow(shadowColors.accent, shadowBase.xl),
    '2xl': createShadow(shadowColors.accent, shadowBase['2xl']),
  },
  
  // Component-specific shadows
  component: {
    // Card shadows
    card: {
      default: shadowBase.md,
      hover: shadowBase.lg,
    },
    
    // Button shadows
    button: {
      default: '0 2px 4px rgba(0, 0, 0, 0.1)',
      hover: '0 4px 8px rgba(0, 0, 0, 0.15)',
      active: '0 1px 2px rgba(0, 0, 0, 0.1)',
    },
    
    // Dropdown shadows
    dropdown: {
      default: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    },
    
    // Modal shadows
    modal: {
      default: '0 10px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.05)',
    },
    
    // Navigation shadows
    navigation: {
      default: '0 2px 4px rgba(0, 0, 0, 0.08)',
      sticky: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
  },
  
  // Focus rings
  focus: {
    primary: `0 0 0 3px ${colors.palette.teal.extraLight}`,
    secondary: `0 0 0 3px ${colors.palette.sage.extraLight}`,
    accent: `0 0 0 3px ${colors.palette.terracotta.extraLight}`,
    error: `0 0 0 3px ${colors.palette.status.error.extraLight}`,
  },
};

// Export types for TypeScript support
export type ShadowTokens = typeof shadows;
