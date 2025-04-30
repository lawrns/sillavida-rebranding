# SillaVida Design System

This design system provides a centralized set of design tokens and utilities for maintaining consistent styling across the SillaVida application.

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Design Tokens](#design-tokens)
4. [Usage](#usage)
5. [Utilities](#utilities)
6. [Reverting Changes](#reverting-changes)

## Overview

The SillaVida Design System is built on a token-based approach, where all design values (colors, typography, spacing, etc.) are defined in a single source of truth. This ensures consistency across the application and makes it easy to update the design in the future.

Key features:
- Centralized design tokens
- TypeScript support with type safety
- CSS variables for use in stylesheets
- Utility functions for accessing tokens in JavaScript/TypeScript
- Toggle system for testing and reverting changes

## Getting Started

The design system is automatically initialized when the application loads. By default, it preserves the original styles to avoid breaking changes.

To enable or disable the design system:

1. Navigate to the Admin Panel (`/admin`)
2. Click on the "Sistema de Diseño" tab
3. Use the toggle to enable or disable the design system

## Design Tokens

The design system includes the following token categories:

- **Colors**: Primary, secondary, accent, and semantic colors
- **Typography**: Font families, sizes, weights, and line heights
- **Spacing**: Consistent spacing scale based on 4px/8px grid
- **Shadows**: Shadow values for different elevations
- **Borders**: Border widths, styles, and radii
- **Animations**: Duration, easing, and transition presets

## Usage

### In CSS

Use CSS variables in your stylesheets:

```css
.my-component {
  color: var(--color-primary);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);
  transition: var(--transition-default);
}
```

### In JavaScript/TypeScript

Import the tokens and utilities:

```typescript
import { tokens } from '../../styles/tokens';
import { getColor, getSpacing } from '../../styles/tokens/utils';

// Direct access
const primaryColor = tokens.colors.primary;

// Using utility functions
const primaryColor = getColor('primary');
const spacing = getSpacing('md');
```

### With Framer Motion

For animations with Framer Motion:

```tsx
import { motion } from 'framer-motion';
import { tokens } from '../../styles/tokens';

const MyComponent = () => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        boxShadow: tokens.shadows.lg
      }}
      transition={{ 
        duration: tokens.animations.duration.fastSec,
        ease: tokens.animations.easing.framerEaseOut
      }}
    >
      Hover me
    </motion.div>
  );
};
```

## Utilities

The design system includes several utility functions:

- `getColor(path)`: Get a color token by path
- `getTypography(path)`: Get a typography token by path
- `getSpacing(size)`: Get a spacing token
- `getShadow(size)`: Get a shadow token
- `getBorderRadius(size)`: Get a border radius token
- `getAnimationDuration(speed)`: Get an animation duration token
- `getAnimationEasing(ease)`: Get an animation easing token
- `getTransition(preset)`: Get a transition preset
- `getFramerTransition(preset)`: Get a Framer Motion transition preset
- `getKeyframes(animation)`: Get animation keyframes

## Reverting Changes

If you need to revert to the original styles:

1. Navigate to the Admin Panel (`/admin`)
2. Click on the "Sistema de Diseño" tab
3. Click the "Revert All Changes" button

This will disable the design system and restore the original styles.

Alternatively, you can programmatically revert the changes:

```typescript
import { revertDesignSystem } from '../../styles/tokens/implementation';

// Revert to original styles
revertDesignSystem();
```
