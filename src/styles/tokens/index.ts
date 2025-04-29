/**
 * SillaVida Design Token System
 * 
 * This file exports all design tokens from the system.
 * It serves as the single entry point for accessing design tokens.
 */

import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';
import { borders } from './borders';
import { animations } from './animations';

export const tokens = {
  colors,
  typography,
  spacing,
  shadows,
  borders,
  animations
};

export type DesignTokens = typeof tokens;
