/**
 * SillaVida Color Tokens
 * 
 * This file defines all color tokens used in the application.
 * Based on the Vida redesign color palette.
 */

// Base color palette
const palette = {
  teal: {
    base: '#1E5959',
    light: '#2A7A7A',
    dark: '#184747',
    extraLight: '#E5EDED',
  },
  beige: {
    base: '#E8DED1',
    light: '#F5F0E8',
    dark: '#D6C9B7',
    extraLight: '#FAF7F3',
  },
  sage: {
    base: '#7D9D8C',
    light: '#9CBCAB',
    dark: '#5E7A6A',
    extraLight: '#EDF3F0',
  },
  terracotta: {
    base: '#C87D55',
    light: '#D69A7A',
    dark: '#A66240',
    extraLight: '#F7EDE7',
  },
  neutral: {
    black: '#212529',
    grayDark: '#495057',
    grayMedium: '#6C757D',
    grayLight: '#ADB5BD',
    grayExtraLight: '#E9ECEF',
    white: '#FFFFFF',
    offWhite: '#F8F9FA',
  },
  status: {
    success: {
      base: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
      extraLight: '#E8F5E9',
    },
    warning: {
      base: '#F9A825',
      light: '#FBC02D',
      dark: '#F57F17',
      extraLight: '#FFF8E1',
    },
    error: {
      base: '#C62828',
      light: '#E53935',
      dark: '#B71C1C',
      extraLight: '#FFEBEE',
    },
    info: {
      base: '#0277BD',
      light: '#039BE5',
      dark: '#01579B',
      extraLight: '#E1F5FE',
    },
  },
};

// Semantic color assignments
export const colors = {
  // Base palette for direct access
  palette,
  
  // Semantic color assignments
  primary: palette.teal.base,
  primaryLight: palette.teal.light,
  primaryDark: palette.teal.dark,
  primaryExtraLight: palette.teal.extraLight,
  
  secondary: palette.sage.base,
  secondaryLight: palette.sage.light,
  secondaryDark: palette.sage.dark,
  secondaryExtraLight: palette.sage.extraLight,
  
  accent: palette.beige.base,
  accentLight: palette.beige.light,
  accentDark: palette.beige.dark,
  accentExtraLight: palette.beige.extraLight,
  
  highlight: palette.terracotta.base,
  highlightLight: palette.terracotta.light,
  highlightDark: palette.terracotta.dark,
  highlightExtraLight: palette.terracotta.extraLight,
  
  // Text colors
  text: {
    primary: palette.neutral.black,
    secondary: palette.neutral.grayDark,
    tertiary: palette.neutral.grayMedium,
    light: palette.neutral.white,
    disabled: palette.neutral.grayLight,
  },
  
  // Background colors
  background: {
    primary: palette.neutral.white,
    secondary: palette.neutral.offWhite,
    tertiary: palette.neutral.grayExtraLight,
    accent: palette.teal.base,
    light: palette.beige.light,
  },
  
  // Border colors
  border: {
    primary: palette.teal.base,
    secondary: palette.sage.base,
    light: palette.neutral.grayLight,
    medium: palette.neutral.grayMedium,
    dark: palette.neutral.grayDark,
    accent: palette.beige.dark,
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
  
  // Component-specific colors
  button: {
    primary: {
      background: palette.teal.base,
      backgroundHover: palette.teal.light,
      backgroundActive: palette.teal.dark,
      text: palette.neutral.white,
      textDisabled: palette.neutral.grayMedium,
      backgroundDisabled: palette.teal.extraLight,
      border: palette.teal.base,
      borderHover: palette.teal.light,
    },
    secondary: {
      background: palette.sage.base,
      backgroundHover: palette.sage.light,
      backgroundActive: palette.sage.dark,
      text: palette.neutral.white,
      textDisabled: palette.neutral.grayMedium,
      backgroundDisabled: palette.sage.extraLight,
      border: palette.sage.base,
      borderHover: palette.sage.light,
    },
    tertiary: {
      background: 'transparent',
      backgroundHover: palette.teal.extraLight,
      backgroundActive: palette.teal.light,
      text: palette.teal.base,
      textActive: palette.neutral.white,
      textDisabled: palette.neutral.grayMedium,
      border: palette.teal.base,
      borderDisabled: palette.neutral.grayLight,
    },
    accent: {
      background: palette.terracotta.base,
      backgroundHover: palette.terracotta.light,
      backgroundActive: palette.terracotta.dark,
      text: palette.neutral.white,
      textDisabled: palette.neutral.grayMedium,
      backgroundDisabled: palette.terracotta.extraLight,
      border: palette.terracotta.base,
      borderHover: palette.terracotta.light,
    },
  },
  
  // Navigation colors
  navigation: {
    background: palette.neutral.white,
    active: palette.teal.base,
    hover: palette.teal.extraLight,
    text: palette.neutral.black,
    textActive: palette.teal.base,
  },
  
  // Card colors
  card: {
    background: palette.neutral.white,
    backgroundAlt: palette.beige.base,
    border: palette.neutral.grayLight,
    borderAlt: palette.beige.dark,
  },
  
  // Form colors
  form: {
    border: palette.neutral.grayLight,
    focus: palette.teal.base,
    background: palette.neutral.white,
    placeholder: palette.neutral.grayMedium,
    error: palette.status.error.base,
  },
};

// Export types for TypeScript support
export type ColorTokens = typeof colors;
