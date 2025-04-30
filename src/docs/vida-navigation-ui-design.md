# Vida Navigation UI Design

This document outlines the design approach for the new life-aspect based navigation UI that reinforces the "Vida" concept.

## Design Principles

1. **Life-Centered**: Focus on how products enhance different aspects of life rather than product specifications
2. **Visually Distinct**: Each life aspect has a unique visual identity while maintaining brand cohesion
3. **Intuitive**: Clear visual hierarchy and organization that guides users naturally
4. **Responsive**: Adapts seamlessly across all device sizes
5. **Animated**: Subtle animations that enhance the experience without distracting

## Navigation Structure

### Desktop Navigation

```
+----------------------------------------------------------------------+
|                                                                      |
| [Logo] [Vida Profesional] [Vida Activa] [Vida Saludable] [More ▼]   |
|                                                                      |
+----------------------------------------------------------------------+
```

#### Primary Navigation (Always Visible)
- **Logo**: SillaVida with animated "Vida" component
- **Vida Profesional**: With briefcase icon
- **Vida Activa**: With energy/movement icon
- **Vida Saludable**: With wellness icon
- **More**: Dropdown with additional life aspects

#### More Dropdown
```
+-------------------+
| Vida Productiva   |
| Vida Social       |
| Complementos      |
+-------------------+
```

#### Secondary Navigation (Below Primary)
```
+----------------------------------------------------------------------+
|                                                                      |
| [Promociones] [Más Vendidos] [Ergonomía]                            |
|                                                                      |
+----------------------------------------------------------------------+
```

#### Utility Navigation (Right Side)
```
+----------------------------------------------------------------------+
|                                                                      |
|                                         [Search] [Account] [Cart]    |
|                                                                      |
+----------------------------------------------------------------------+
```

### Mobile Navigation

#### Collapsed State
```
+----------------------------------------------------------------------+
|                                                                      |
| [Menu] [Logo]                                    [Search] [Cart]     |
|                                                                      |
+----------------------------------------------------------------------+
```

#### Expanded State
```
+----------------------------------------------------------------------+
| [Close]                                                              |
+----------------------------------------------------------------------+
| [Vida Profesional]                                                   |
| [Vida Activa]                                                        |
| [Vida Saludable]                                                     |
| [Vida Productiva]                                                    |
| [Vida Social]                                                        |
| [Complementos]                                                       |
+----------------------------------------------------------------------+
| [Promociones]                                                        |
| [Más Vendidos]                                                       |
| [Ergonomía]                                                          |
+----------------------------------------------------------------------+
| [Account]                                                            |
+----------------------------------------------------------------------+
```

## Visual Design Elements

### Color Coding

Each life aspect will have a distinct color from the SillaVida color palette:

1. **Vida Profesional**: Deep teal (#1E5959)
   - Conveys professionalism, stability, and authority
   - Used for icons, accents, and hover states

2. **Vida Activa**: Energetic orange (#C87D55)
   - Conveys energy, movement, and dynamism
   - Used for icons, accents, and hover states

3. **Vida Saludable**: Healing green (#7D9D8C)
   - Conveys wellness, health, and balance
   - Used for icons, accents, and hover states

4. **Vida Productiva**: Focused blue (#4A6FA5)
   - Conveys efficiency, focus, and clarity
   - Used for icons, accents, and hover states

5. **Vida Social**: Warm gold (#E8DED1)
   - Conveys warmth, connection, and collaboration
   - Used for icons, accents, and hover states

6. **Complementos**: Versatile gray (#6B7280)
   - Conveys adaptability, enhancement, and support
   - Used for icons, accents, and hover states

### Typography

- **Navigation Labels**: Font-family: 'Montserrat', sans-serif; Font-weight: 500
- **Dropdown Headers**: Font-family: 'Montserrat', sans-serif; Font-weight: 600
- **Dropdown Items**: Font-family: 'Montserrat', sans-serif; Font-weight: 400

### Icons

Each life aspect will have a unique icon that visually represents its concept:

1. **Vida Profesional**: 
   ```
   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M20 7H16V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7ZM10 5H14V7H10V5ZM20 19H4V9H20V19Z" fill="currentColor"/>
   </svg>
   ```

2. **Vida Activa**:
   ```
   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M11 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H11V21ZM13 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H13V3Z" fill="currentColor"/>
   </svg>
   ```

3. **Vida Saludable**:
   ```
   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor"/>
   </svg>
   ```

4. **Vida Productiva**:
   ```
   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
   </svg>
   ```

5. **Vida Social**:
   ```
   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/>
   </svg>
   ```

6. **Complementos**:
   ```
   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
   </svg>
   ```

### Animation Effects

1. **Hover Effects**:
   - Subtle scale increase (transform: scale(1.05))
   - Color transition to life-aspect color
   - Small vertical shift (transform: translateY(-2px))

2. **Active/Selected State**:
   - Bottom border in life-aspect color
   - Slightly bolder text weight
   - Icon color change to life-aspect color

3. **Dropdown Animation**:
   - Fade in and slide down (opacity + transform: translateY())
   - Staggered animation for dropdown items
   - Spring physics for natural motion

4. **Mobile Menu Animation**:
   - Slide in from left
   - Fade in for menu items
   - Hamburger to X icon transformation

## Implementation Details

### CSS Variables

```css
:root {
  /* Life-aspect colors */
  --vida-profesional-color: #1E5959;
  --vida-activa-color: #C87D55;
  --vida-saludable-color: #7D9D8C;
  --vida-productiva-color: #4A6FA5;
  --vida-social-color: #E8DED1;
  --vida-complementos-color: #6B7280;
  
  /* Animation timings */
  --nav-hover-transition: 0.2s ease-out;
  --dropdown-animation: 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --mobile-menu-animation: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Framer Motion Variants

```jsx
// Dropdown animation variants
const dropdownVariants = {
  hidden: { opacity: 0, y: -10, height: 0 },
  visible: { 
    opacity: 1, 
    y: 0, 
    height: 'auto', 
    transition: { 
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    } 
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    height: 0, 
    transition: { 
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94]
    } 
  }
};

// Mobile menu animation variants
const mobileMenuVariants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { 
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.05
    } 
  },
  exit: { 
    x: "-100%", 
    opacity: 0, 
    transition: { 
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1]
    } 
  }
};

// Mobile menu item variants
const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    } 
  }
};
```

## Responsive Behavior

### Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Responsive Adjustments

1. **Mobile**:
   - Hamburger menu with full-screen overlay
   - All life-aspect categories visible in expanded menu
   - Simplified utility navigation (search and cart only)

2. **Tablet**:
   - Primary navigation with "More" dropdown
   - Condensed secondary navigation
   - Full utility navigation

3. **Desktop**:
   - Full primary navigation with all life aspects
   - Full secondary navigation
   - Full utility navigation with labels

## Accessibility Considerations

1. **Keyboard Navigation**:
   - All navigation items accessible via keyboard
   - Proper focus states for all interactive elements
   - Logical tab order

2. **Screen Readers**:
   - Proper ARIA labels for all navigation items
   - ARIA expanded/collapsed states for dropdowns
   - Meaningful alt text for icons

3. **Reduced Motion**:
   - Respect prefers-reduced-motion media query
   - Simplified animations for users who prefer reduced motion

## Next Steps

1. Create HTML/CSS prototype of the navigation
2. Implement the navigation in React with Framer Motion
3. Test across devices and browsers
4. Gather feedback and refine
