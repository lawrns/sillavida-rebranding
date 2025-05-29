/**
 * SillaVida Shadow Tokens - Monochromatic System
 *
 * This file defines all shadow tokens used in the application.
 * Based on the monochromatic white/black/grey design system.
 *
 * Migration: Updated from color-based shadows to monochromatic system
 * Date: 2025-05-27T13:56:00
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

// Shadow color values - Monochromatic System
const shadowColors = {
  neutral: 'rgba(0, 0, 0, 0.1)',        // Pure black with low opacity
  primary: 'rgba(0, 0, 0, 0.15)',       // Pure black with medium opacity
  secondary: 'rgba(102, 102, 102, 0.15)', // Medium gray with medium opacity
  accent: 'rgba(51, 51, 51, 0.15)',     // Dark gray with medium opacity
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

  // Focus rings - Monochromatic System
  focus: {
    primary: `0 0 0 3px ${colors.palette.gray.background}`,     // Light gray focus ring
    secondary: `0 0 0 3px ${colors.palette.gray.subtle}`,      // Subtle gray focus ring
    accent: `0 0 0 3px ${colors.palette.black.light}`,         // Light gray focus ring
    error: `0 0 0 3px ${colors.palette.status.error.extraLight}`, // Error status color maintained
  },
};

// Export types for TypeScript support
export type ShadowTokens = typeof shadows;
