# Developer Guidelines - Monochromatic Color System

**Version**: 2.0  
**Date**: 2025-05-27  
**Target Audience**: Frontend Developers, UI/UX Designers  

## Quick Start

### Using Colors in Components

```typescript
// ✅ Correct - Use design tokens
import { colors } from '../styles/tokens/colors';

const Button = () => (
  <button style={{ backgroundColor: colors.primary, color: colors.text.light }}>
    Click me
  </button>
);
```

```css
/* ✅ Correct - Use CSS variables */
.my-component {
  background-color: var(--color-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-light);
}
```

```typescript
// ❌ Incorrect - Don't use hardcoded colors
const Button = () => (
  <button style={{ backgroundColor: '#000000', color: '#ffffff' }}>
    Click me
  </button>
);
```

## Color Token Usage

### Primary Colors

```typescript
// Use for main actions, primary text, and emphasis
colors.primary           // #000000 - Pure black
colors.primaryLight      // #333333 - Dark gray
colors.primaryDark       // #000000 - Pure black (same as primary)
```

### Text Colors

```typescript
colors.text.primary      // #000000 - Main text
colors.text.secondary    // #333333 - Secondary text
colors.text.tertiary     // #666666 - Muted text
colors.text.light        // #FFFFFF - Light text (on dark backgrounds)
colors.text.disabled     // #999999 - Disabled text
```

### Background Colors

```typescript
colors.background.primary    // #FFFFFF - Main backgrounds
colors.background.secondary  // #FDFDFD - Card backgrounds
colors.background.tertiary   // #FAFAFA - Subtle backgrounds
colors.background.accent     // #000000 - Dark backgrounds
colors.background.light      // #F5F5F5 - Light gray backgrounds
```

### Border Colors

```typescript
colors.border.primary    // #000000 - Strong borders
colors.border.secondary  // #666666 - Medium borders
colors.border.light      // #999999 - Light borders
colors.border.accent     // #E5E5E5 - Subtle borders
```

## Component Patterns

### Button Variants

```css
/* Primary Button */
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-text-light);
  border: 1px solid var(--color-primary);
}

.btn-primary:hover {
  background-color: var(--color-primary-light);
  border-color: var(--color-primary-light);
}

.btn-primary:disabled {
  background-color: var(--color-bg-light);
  color: var(--color-text-disabled);
  border-color: var(--color-border-light);
}

/* Secondary Button */
.btn-secondary {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-secondary);
}

.btn-secondary:hover {
  background-color: var(--color-bg-tertiary);
  border-color: var(--color-primary-light);
}

/* Tertiary Button */
.btn-tertiary {
  background-color: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-light);
}

.btn-tertiary:hover {
  background-color: var(--color-bg-tertiary);
  border-color: var(--color-border-secondary);
}
```

### Form Elements

```css
/* Input Fields */
.form-input {
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  color: var(--color-text-primary);
}

.form-input:focus {
  border-color: var(--color-primary);
  outline: 2px solid var(--color-primary);
  outline-offset: -1px;
}

.form-input::placeholder {
  color: var(--color-text-tertiary);
}

.form-input:disabled {
  background-color: var(--color-bg-light);
  color: var(--color-text-disabled);
  border-color: var(--color-border-light);
}

/* Form Labels */
.form-label {
  color: var(--color-text-secondary);
  font-weight: 500;
}

.form-label.required::after {
  content: '*';
  color: var(--color-error);
  margin-left: 0.25rem;
}
```

### Navigation Elements

```css
/* Navigation Items */
.nav-item {
  color: var(--color-text-primary);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease;
}

.nav-item:hover {
  background-color: var(--color-bg-tertiary);
}

.nav-item.active {
  background-color: var(--color-primary);
  color: var(--color-text-light);
}

.nav-item:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Card Components

```css
/* Card Container */
.card {
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border-accent);
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Card Header */
.card-header {
  border-bottom: 1px solid var(--color-border-accent);
  padding: 1rem;
}

.card-title {
  color: var(--color-text-primary);
  font-weight: 600;
}

/* Card Content */
.card-content {
  padding: 1rem;
  color: var(--color-text-secondary);
}
```

## Responsive Design

### Mobile-First Approach

```css
/* Base styles (mobile) */
.component {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    border: 1px solid var(--color-border-light);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component:hover {
    background-color: var(--color-bg-tertiary);
  }
}
```

## Accessibility Guidelines

### Contrast Requirements

```css
/* ✅ Good contrast - 21:1 ratio */
.high-contrast {
  background-color: var(--color-bg-primary);  /* #FFFFFF */
  color: var(--color-text-primary);           /* #000000 */
}

/* ✅ Good contrast - 12.6:1 ratio */
.medium-contrast {
  background-color: var(--color-bg-primary);  /* #FFFFFF */
  color: var(--color-text-secondary);         /* #333333 */
}

/* ⚠️ Minimum contrast - 7:1 ratio */
.minimum-contrast {
  background-color: var(--color-bg-primary);  /* #FFFFFF */
  color: var(--color-text-tertiary);          /* #666666 */
}
```

### Focus States

```css
/* Always provide clear focus indicators */
.interactive-element:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* For dark backgrounds */
.dark-background .interactive-element:focus {
  outline: 2px solid var(--color-text-light);
  outline-offset: 2px;
}
```

## Performance Best Practices

### CSS Variable Usage

```css
/* ✅ Efficient - Use CSS variables */
.component {
  background-color: var(--color-bg-primary);
  transition: background-color 0.2s ease;
}

.component:hover {
  background-color: var(--color-bg-tertiary);
}

/* ❌ Inefficient - Hardcoded colors */
.component {
  background-color: #FFFFFF;
  transition: background-color 0.2s ease;
}

.component:hover {
  background-color: #FAFAFA;
}
```

### Bundle Optimization

```typescript
// ✅ Import only what you need
import { colors } from '../styles/tokens/colors';
const primaryColor = colors.primary;

// ❌ Don't import entire style objects unnecessarily
import * as allStyles from '../styles/tokens/colors';
```

## Common Patterns

### Loading States

```css
.loading-spinner {
  border: 2px solid var(--color-border-light);
  border-top: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: var(--color-text-tertiary);
}
```

### Error States

```css
.error-message {
  color: var(--color-error);
  background-color: var(--color-error-extra-light);
  border: 1px solid var(--color-error-light);
  border-radius: 0.25rem;
  padding: 0.75rem;
}
```

### Success States

```css
.success-message {
  color: var(--color-success-dark);
  background-color: var(--color-success-extra-light);
  border: 1px solid var(--color-success-light);
  border-radius: 0.25rem;
  padding: 0.75rem;
}
```

## Testing Guidelines

### Visual Testing

1. **Test in different browsers**: Chrome, Firefox, Safari, Edge
2. **Test on different devices**: Mobile, tablet, desktop
3. **Test with different zoom levels**: 100%, 125%, 150%, 200%
4. **Test accessibility**: Use screen readers and keyboard navigation

### Automated Testing

```typescript
// Test color contrast
import { colors } from '../styles/tokens/colors';

describe('Color Accessibility', () => {
  it('should have sufficient contrast for primary text', () => {
    const contrast = calculateContrast(colors.text.primary, colors.background.primary);
    expect(contrast).toBeGreaterThan(7); // WCAG AA Large Text
  });
});
```

## Migration Checklist

When updating existing components:

- [ ] Replace hardcoded colors with CSS variables or design tokens
- [ ] Test all interactive states (hover, focus, active, disabled)
- [ ] Verify accessibility compliance
- [ ] Test on multiple devices and browsers
- [ ] Update component documentation
- [ ] Add visual regression tests if applicable

## Common Mistakes to Avoid

1. **Don't use hardcoded hex colors** - Always use design tokens
2. **Don't skip focus states** - Always provide clear focus indicators
3. **Don't ignore contrast ratios** - Test with accessibility tools
4. **Don't mix color systems** - Use only the monochromatic palette
5. **Don't forget disabled states** - Style all component states
6. **Don't skip mobile testing** - Test responsive behavior

## Resources

- **Color Contrast Checker**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Accessibility Guidelines**: [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- **Design Tokens**: `src/styles/tokens/colors.ts`
- **CSS Variables**: `src/styles/tokens/variables.css`
