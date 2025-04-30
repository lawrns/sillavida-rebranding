# SillaVida Task Implementation Guide for Claude AI

This document provides specific instructions for Claude AI to implement the SillaVida redesign tasks. Each task follows the Aegis framework and contains detailed implementation steps with code examples.

## Implementation Approach

When implementing these tasks, Claude AI should:

1. **Follow the Aegis framework structure** in each task
2. **Implement code exactly as specified** in the task files
3. **Maintain the SillaVida brand identity** with the specified color palette and typography
4. **Ensure responsive design** across all device sizes
5. **Preserve Shopify integration** for product information
6. **Remove the Vida Score component** as specified in the updated plan

## Task Sequence and Dependencies

The tasks should be implemented in the following order to respect dependencies:

1. **TASK-058**: Implement Site-Wide Color Scheme with Reversibility
2. **TASK-063**: Refine Visual Design System
3. **TASK-055**: Implement Enhanced Product Pages with Shopify Integration
4. **TASK-056**: Integrate Sternify Reviews Component
5. **TASK-061**: Enhance Product Page Interactivity (without Vida Score)
6. **TASK-060**: Fix Customer Account Authentication Issues
7. **TASK-062**: Optimize Website Performance
8. **TASK-064**: Implement Analytics and Testing

## Implementation Notes for Claude AI

- **CSS Variables**: Use the SillaVida color palette variables consistently
  ```css
  :root {
    --color-teal: #1E5959;
    --color-beige: #E8DED1;
    --color-sage: #7D9D8C;
    --color-terracotta: #C87D55;
  }
  ```

- **Typography**: Use Montserrat for headings and Open Sans for body text
  ```css
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Montserrat', sans-serif;
  }
  
  body {
    font-family: 'Open Sans', sans-serif;
  }
  ```

- **Component Structure**: Follow the vertical layout style for product pages
- **Responsive Design**: Implement mobile-first approach with appropriate breakpoints
- **Performance**: Implement lazy loading for images and components
- **Accessibility**: Ensure all components meet WCAG 2.1 AA standards

## Task-Specific Instructions

### TASK-058: Implement Site-Wide Color Scheme with Reversibility
- Implement the theme switching mechanism exactly as specified
- Ensure all color variables are properly defined and used consistently
- Test the theme toggle functionality thoroughly

### TASK-063: Refine Visual Design System
- Create the component library as specified
- Implement the typography system with proper hierarchy
- Ensure spacing and layout follow the design guidelines

### TASK-055: Implement Enhanced Product Pages with Shopify Integration
- Follow the vertical layout style as specified
- Preserve Shopify integration for product information
- Implement the chair features component with interactive elements
- Remove the tabbed interface and "Historias de vida" slider

### TASK-056: Integrate Sternify Reviews Component
- Rename the reviews section to "Experiencias Vida"
- Implement custom fields to collect "Vida" impact information
- Style the component to match the SillaVida design system
- Implement lazy loading for performance optimization

### TASK-061: Enhance Product Page Interactivity
- Implement the interactive 360° view
- Create the sticky "Add to Cart" button
- Develop product comparison functionality
- Implement enhanced image zoom
- Create smooth section navigation
- DO NOT implement the Vida Score component

### TASK-060: Fix Customer Account Authentication Issues
- Implement proper error handling for Customer Account API
- Add fallback mechanisms when authentication fails
- Create configuration toggle for Customer Account features
- Update redirectUrl handling for various scenarios

### TASK-062: Optimize Website Performance
- Implement comprehensive lazy loading
- Add proper caching strategies
- Optimize bundle size through code splitting
- Implement service worker functionality

### TASK-064: Implement Analytics and Testing
- Set up enhanced e-commerce tracking
- Implement unit and integration tests
- Create end-to-end tests for the checkout flow
- Conduct accessibility audits

## Final Deliverables

For each task, Claude AI should provide:
1. Complete implementation code
2. Documentation of any changes or adaptations made
3. Testing results and verification
4. Recommendations for future improvements

All implementations should maintain the premium "Vida" theme and "investing in yourself" concept that's central to the SillaVida brand.
