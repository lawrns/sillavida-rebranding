/**
 * SillaVida Color Tokens - Monochromatic System
 *
 * This file defines all color tokens used in the application.
 * Based on the monochromatic white/black/grey design system.
 *
 * Migration: Transformed from dual color system (4-palette + blue) to monochromatic
 * Date: 2025-05-27T13:10:30
 */

// Monochromatic color palette
const palette = {
  // Primary monochromatic scale
  black: {
    pure: '#000000',        // Pure black - primary text, buttons
    dark: '#333333',        // Dark gray - secondary elements
    medium: '#666666',      // Medium gray - muted text, borders
    light: '#999999',       // Light gray - disabled states
  },
  gray: {
    border: '#E5E5E5',     // Border gray - dividers, borders
    background: '#F5F5F5',  // Background gray - light backgrounds
    subtle: '#FAFAFA',      // Subtle gray - very light backgrounds
  },
  white: {
    pure: '#FFFFFF',        // Pure white - primary backgrounds
    off: '#FDFDFD',         // Off white - card backgrounds
  },

  status: {
    success: {
      base: '#000000',      // Monochromatic - black for success
      light: '#333333',
      dark: '#000000',
      extraLight: '#F5F5F5',
    },
    warning: {
      base: '#666666',      // Monochromatic - medium gray for warning
      light: '#999999',
      dark: '#333333',
      extraLight: '#F5F5F5',
    },
    error: {
      base: '#000000',      // Monochromatic - black for error
      light: '#333333',
      dark: '#000000',
      extraLight: '#F5F5F5',
    },
    info: {
      base: '#666666',      // Monochromatic - medium gray for info
      light: '#999999',
      dark: '#333333',
      extraLight: '#F5F5F5',
    },
  },
};

// Semantic color assignments - Monochromatic System
export const colors = {
  // Base palette for direct access
  palette,

  // Primary semantic assignments (monochromatic)
  primary: palette.black.pure,           // Pure black for primary elements
  primaryLight: palette.black.dark,      // Dark gray for secondary elements
  primaryDark: palette.black.pure,       // Pure black for emphasis
  primaryExtraLight: palette.gray.background, // Light gray for backgrounds

  secondary: palette.black.medium,       // Medium gray for secondary elements
  secondaryLight: palette.black.light,   // Light gray for muted elements
  secondaryDark: palette.black.dark,     // Dark gray for contrast
  secondaryExtraLight: palette.gray.subtle, // Subtle gray for light backgrounds

  accent: palette.gray.background,       // Light gray for accent areas
  accentLight: palette.gray.subtle,      // Subtle gray for light accents
  accentDark: palette.black.medium,      // Medium gray for dark accents
  accentExtraLight: palette.white.off,   // Off white for very light accents

  highlight: palette.black.medium,       // Medium gray for highlights
  highlightLight: palette.black.light,   // Light gray for subtle highlights
  highlightDark: palette.black.dark,     // Dark gray for strong highlights
  highlightExtraLight: palette.gray.background, // Light gray for background highlights

  // Text colors
  text: {
    primary: palette.black.pure,
    secondary: palette.black.dark,
    tertiary: palette.black.medium,
    light: palette.white.pure,
    disabled: palette.black.light,
  },

  // Background colors
  background: {
    primary: palette.white.pure,
    secondary: palette.white.off,
    tertiary: palette.gray.subtle,
    accent: palette.black.pure,
    light: palette.gray.background,
  },

  // Border colors
  border: {
    primary: palette.black.pure,
    secondary: palette.black.medium,
    light: palette.black.light,
    medium: palette.black.medium,
    dark: palette.black.dark,
    accent: palette.gray.border,
  },

  // Status colors
  status: {
    success: palette.status.success.base,
    successLight: palette.status.success.light,
    successDark: palette.status.success.dark,
    successExtraLight: palette.status.success.extraLight,

    warning: palette.status.warning.base,
    warningLight: palette.status.warning.light,
    warningDark: palette.status.warning.dark,
    warningExtraLight: palette.status.warning.extraLight,

    error: palette.status.error.base,
    errorLight: palette.status.error.light,
    errorDark: palette.status.error.dark,
    errorExtraLight: palette.status.error.extraLight,

    info: palette.status.info.base,
    infoLight: palette.status.info.light,
    infoDark: palette.status.info.dark,
    infoExtraLight: palette.status.info.extraLight,
  },

  // Component-specific colors - Monochromatic System
  button: {
    primary: {
      background: palette.black.pure,
      backgroundHover: palette.black.dark,
      backgroundActive: palette.black.pure,
      text: palette.white.pure,
      textDisabled: palette.black.light,
      backgroundDisabled: palette.gray.background,
      border: palette.black.pure,
      borderHover: palette.black.dark,
    },
    secondary: {
      background: palette.white.pure,
      backgroundHover: palette.gray.subtle,
      backgroundActive: palette.gray.background,
      text: palette.black.pure,
      textDisabled: palette.black.light,
      backgroundDisabled: palette.gray.background,
      border: palette.black.medium,
      borderHover: palette.black.dark,
    },
    tertiary: {
      background: 'transparent',
      backgroundHover: palette.gray.subtle,
      backgroundActive: palette.gray.background,
      text: palette.black.pure,
      textActive: palette.white.pure,
      textDisabled: palette.black.light,
      border: palette.black.pure,
      borderDisabled: palette.black.light,
    },
    accent: {
      background: palette.black.medium,
      backgroundHover: palette.black.dark,
      backgroundActive: palette.black.pure,
      text: palette.white.pure,
      textDisabled: palette.black.light,
      backgroundDisabled: palette.gray.background,
      border: palette.black.medium,
      borderHover: palette.black.dark,
    },
  },

  // Navigation colors
  navigation: {
    background: palette.white.pure,
    active: palette.black.pure,
    hover: palette.gray.subtle,
    text: palette.black.pure,
    textActive: palette.black.pure,
  },

  // Card colors
  card: {
    background: palette.white.pure,
    backgroundAlt: palette.gray.background,
    border: palette.black.light,
    borderAlt: palette.gray.border,
  },

  // Form colors
  form: {
    border: palette.black.light,
    focus: palette.black.pure,
    background: palette.white.pure,
    placeholder: palette.black.medium,
    error: palette.status.error.base,
  },
};

// Export types for TypeScript support
export type ColorTokens = typeof colors;
