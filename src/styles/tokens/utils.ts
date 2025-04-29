/**
 * SillaVida Design Token Utilities
 * 
 * This file provides utility functions for accessing design tokens.
 * It helps ensure type safety and provides helpful error messages.
 */

import { tokens } from './index';
import type { DesignTokens } from './index';

/**
 * Gets a nested property from an object using a dot-notation path
 * @param obj The object to get the property from
 * @param path The path to the property (e.g. 'colors.primary')
 * @param fallback Optional fallback value if the property doesn't exist
 */
export function getNestedProperty<T>(
  obj: Record<string, any>,
  path: string,
  fallback?: T
): T {
  const parts = path.split('.');
  let result = obj;
  
  for (const part of parts) {
    if (result === undefined || result === null || typeof result !== 'object') {
      console.warn(`Path "${path}" not found in object`);
      return fallback as T;
    }
    result = result[part];
  }
  
  if (result === undefined) {
    console.warn(`Path "${path}" not found in object`);
    return fallback as T;
  }
  
  return result as T;
}

/**
 * Gets a color token by path
 * @param path Path to the color token (e.g. 'primary', 'button.primary.background')
 * @param fallback Optional fallback color if the token doesn't exist
 */
export function getColor(path: string, fallback: string = '#000000'): string {
  return getNestedProperty<string>(tokens.colors, path, fallback);
}

/**
 * Gets a typography token by path
 * @param path Path to the typography token (e.g. 'fontSize.base', 'heading.h1.fontSize')
 * @param fallback Optional fallback value if the token doesn't exist
 */
export function getTypography<T>(path: string, fallback?: T): T {
  return getNestedProperty<T>(tokens.typography, path, fallback);
}

/**
 * Gets a spacing token
 * @param size Spacing size key (e.g. '4', 'md', 'component.card.padding.default')
 * @param fallback Optional fallback spacing if the token doesn't exist
 */
export function getSpacing(size: string, fallback: string = '1rem'): string {
  return getNestedProperty<string>(tokens.spacing, size, fallback);
}

/**
 * Gets a shadow token
 * @param size Shadow size key (e.g. 'md', 'component.card.default')
 * @param fallback Optional fallback shadow if the token doesn't exist
 */
export function getShadow(size: string, fallback: string = 'none'): string {
  return getNestedProperty<string>(tokens.shadows, size, fallback);
}

/**
 * Gets a border radius token
 * @param size Border radius size key (e.g. 'md', 'component.card.radius')
 * @param fallback Optional fallback radius if the token doesn't exist
 */
export function getBorderRadius(size: string, fallback: string = '0'): string {
  return getNestedProperty<string>(tokens.borders.radius, size, fallback);
}

/**
 * Gets an animation duration token
 * @param speed Animation speed key (e.g. 'fast', 'medium')
 * @param fallback Optional fallback duration if the token doesn't exist
 */
export function getAnimationDuration(speed: string, fallback: string = '300ms'): string {
  return getNestedProperty<string>(tokens.animations.duration, speed, fallback);
}

/**
 * Gets an animation easing token
 * @param ease Easing function key (e.g. 'easeInOut', 'bounce')
 * @param fallback Optional fallback easing if the token doesn't exist
 */
export function getAnimationEasing(ease: string, fallback: string = 'cubic-bezier(0.4, 0, 0.2, 1)'): string {
  return getNestedProperty<string>(tokens.animations.easing, ease, fallback);
}

/**
 * Gets a transition preset
 * @param preset Transition preset key (e.g. 'default', 'fast')
 * @param fallback Optional fallback transition if the token doesn't exist
 */
export function getTransition(preset: string, fallback: string = 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)'): string {
  return getNestedProperty<string>(tokens.animations.transition, preset, fallback);
}

/**
 * Gets a Framer Motion transition preset
 * @param preset Transition preset key (e.g. 'default', 'spring')
 */
export function getFramerTransition(preset: string): any {
  return getNestedProperty<any>(tokens.animations.transition.framer, preset, {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  });
}

/**
 * Gets animation keyframes
 * @param animation Animation name (e.g. 'fadeIn', 'slideUp')
 */
export function getKeyframes(animation: string): any {
  return getNestedProperty<any>(tokens.animations.keyframes, animation, {
    from: { opacity: 0 },
    to: { opacity: 1 },
  });
}

/**
 * Creates a CSS variable reference
 * @param name CSS variable name without the -- prefix
 */
export function cssVar(name: string): string {
  return `var(--${name})`;
}

/**
 * Converts design tokens to CSS variables
 * @returns CSS string with all variables
 */
export function tokensToCssVariables(): string {
  // This is a simplified implementation
  // A complete implementation would recursively convert all tokens
  let css = ':root {\n';
  
  // Colors
  Object.entries(tokens.colors.palette).forEach(([colorName, colorObj]) => {
    Object.entries(colorObj as Record<string, string>).forEach(([shade, value]) => {
      css += `  --color-${colorName}-${shade}: ${value};\n`;
    });
  });
  
  // Add more token conversions here...
  
  css += '}';
  return css;
}

/**
 * Type-safe token getter
 * Provides a type-safe way to access tokens with TypeScript
 */
export const token = {
  color: getColor,
  typography: getTypography,
  spacing: getSpacing,
  shadow: getShadow,
  borderRadius: getBorderRadius,
  animationDuration: getAnimationDuration,
  animationEasing: getAnimationEasing,
  transition: getTransition,
  framerTransition: getFramerTransition,
  keyframes: getKeyframes,
};
