# SillaVida Styling Patterns Guide

## Current Styling Approaches

This document outlines the three styling approaches currently used in the SillaVida codebase and provides guidelines for when to use each one.

### 1. CSS Modules Pattern

**When to Use:**
- Complex component-specific styles that need scoping
- Components with multiple style variants
- Styles that benefit from CSS preprocessing features

**Pattern:**
```typescript
import './ComponentName.css';

const Component = () => (
  <div className="component-container">
    <h1 className="component-title">Title</h1>
  </div>
);
```

**Examples:**
- `LazyComponent.css`
- `ErgonomicEducationalSection.css`
- `JudgeMe.css`
- `ProductHeroShowcase.css`
- `ProductComparison.css`

**Benefits:**
- True CSS scoping
- Full CSS feature support
- Easy to maintain complex styles
- Good for component libraries

### 2. Tailwind-Only Pattern

**When to Use:**
- Simple layouts and utilities
- Rapid prototyping
- Standard spacing, colors, and responsive behavior
- Components that don't need complex custom styles

**Pattern:**
```typescript
const Component = () => (
  <div className="relative overflow-hidden rounded-md border border-neutral-100 shadow-sm hover:shadow-md transition-shadow bg-white">
    <h1 className="text-2xl font-heading font-bold mb-6 text-black">Title</h1>
  </div>
);
```

**Examples:**
- Most product cards
- Layout components
- Simple UI elements
- Navigation components

**Benefits:**
- Fast development
- Consistent design system
- Small bundle size (with purging)
- No additional CSS files needed

### 3. Mixed CSS + Tailwind Pattern

**When to Use:**
- Components with both simple utilities and complex custom styles
- Migrating from CSS modules to Tailwind gradually
- Third-party integration components (like Judge.me)

**Pattern:**
```typescript
import './ComponentName.css'; // For complex styles
const Component = () => (
  <div className="bg-white rounded-lg shadow-lg"> {/* Tailwind for utilities */}
    <div className="custom-complex-style"> {/* CSS modules for complex styles */}
      Content
    </div>
  </div>
);
```

**Examples:**
- Judge.me integration components
- Product detail components
- Dashboard components

**Benefits:**
- Flexibility during migration
- Best of both worlds
- Gradual adoption of Tailwind

## Standardization Guidelines

### For New Components

1. **Start with Tailwind-Only**
   - Use Tailwind classes for 90% of styling needs
   - Only add CSS modules if Tailwind cannot achieve the desired result

2. **Use CSS Modules for:**
   - Complex animations that require keyframes
   - Hover states that affect multiple elements
   - Component-specific CSS that can't be achieved with Tailwind
   - Third-party library style overrides

3. **Avoid Mixed Patterns Unless:**
   - Migrating existing components gradually
   - Integrating with third-party libraries that require custom CSS

### Component Migration Strategy

#### Phase 1: Audit Current Components
- [x] Identify all components using CSS modules
- [x] Assess complexity of each CSS file
- [x] Determine migration feasibility

#### Phase 2: Migrate Simple CSS Modules
Components that can be fully converted to Tailwind:
- Simple layout components
- Card components with basic styling
- Utility components

#### Phase 3: Optimize Mixed Pattern Components
Components that benefit from both approaches:
- Keep CSS modules for complex styles
- Convert simple utilities to Tailwind
- Document the reasoning for mixed approach

#### Phase 4: Document Patterns
- [x] Create this style guide
- [ ] Add ESLint rules for consistency
- [ ] Update component creation templates

## Current Component Categorization

### Pure Tailwind (Recommended for new components)
- `ProductCard.tsx`
- `ShopifyProductCard.tsx`
- `Navbar.tsx`
- `Footer.tsx`
- Most layout components

### CSS Modules (Keep for complex styling)
- `LazyComponent.tsx` - Complex loading animations
- `ErgonomicEducationalSection.tsx` - Custom animations and layouts
- `JudgeMe.tsx` - Third-party integration overrides
- `ProductHeroShowcase.tsx` - Complex product display layouts

### Mixed (Evaluate for migration)
- Judge.me components (keep mixed due to third-party requirements)
- Dashboard components (migrate utilities to Tailwind)
- Product detail components (assess case-by-case)

## ESLint Rules (Future Implementation)

```javascript
// Future ESLint rule to enforce patterns
{
  "rules": {
    "sillavida/consistent-styling": [
      "warn",
      {
        "preferTailwind": true,
        "allowCssModules": [
          "animations",
          "complex-layouts",
          "third-party-overrides"
        ]
      }
    ]
  }
}
```

## Best Practices

### DO:
- Use Tailwind for spacing, colors, typography, and simple layouts
- Use CSS modules for complex animations and component-specific styles
- Keep CSS files small and focused
- Use meaningful class names in CSS modules
- Comment complex CSS rules

### DON'T:
- Mix Tailwind and CSS modules for the same style property
- Create CSS modules for styles that can be achieved with Tailwind
- Use inline styles (except for dynamic values)
- Import unused CSS files

### File Naming Conventions:
- CSS Modules: `ComponentName.css` (matches component file name)
- Shared styles: `src/styles/utility-name.css`
- Component-specific: `src/components/ComponentName/ComponentName.css`

## Migration Checklist for Existing Components

When converting a component from CSS modules to Tailwind:

1. [ ] Identify all CSS rules in the module
2. [ ] Check if each rule can be replicated with Tailwind utilities
3. [ ] Convert simple rules (margin, padding, colors, typography)
4. [ ] Keep complex rules (animations, complex selectors) in CSS modules
5. [ ] Update imports to remove unused CSS files
6. [ ] Test the component to ensure visual consistency
7. [ ] Update any related tests

## Performance Considerations

### Tailwind Advantages:
- Smaller bundle size with proper purging
- No CSS scope resolution overhead
- Faster development iteration

### CSS Modules Advantages:
- True CSS scoping prevents conflicts
- Full CSS feature support
- Better for complex component libraries

### Recommendations:
- Use PostCSS to optimize both approaches
- Enable Tailwind purging in production
- Keep CSS modules files small and focused
- Monitor bundle size impact of new CSS files

---

*This guide will be updated as the codebase evolves and patterns are refined.*