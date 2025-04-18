# SillaVida Technical Architecture Analysis

## Overview
This document analyzes the current technical architecture and development workflow of the SillaVida website to inform the redesign implementation plan. Understanding the existing architecture is crucial for creating tasks that align with both the technical foundation and ongoing improvement efforts.

## Technical Stack

### Frontend Framework
- **React with Vite**: The application uses React with Vite as the build tool, which affects how components are structured and how environment variables are handled.
- **TypeScript**: The codebase uses TypeScript for type safety, with custom type definitions for Shopify products and other entities.

### E-commerce Integration
- **Shopify Headless**: The site is transitioning from a hybrid approach to a full headless Shopify implementation using the Storefront API.
- **Customer Account API**: Authentication and user account management are implemented using Shopify's Customer Account API.

### Component Architecture
- **Hybrid Component Approach**: The project uses a mix of components:
  - Original components using static data (from `chairs.ts`)
  - New Shopify-specific components (e.g., `ShopifyProductCard`, `ShopifyPromoBanner`)
  - This dual approach allows for incremental implementation without disrupting existing functionality

### State Management
- **React Hooks**: The application primarily uses React hooks for state management.
- **Context API**: Used for cart state and potentially other global states.

### Styling
- **CSS Modules**: Component-specific styles are managed using CSS modules.
- **Custom Properties**: CSS variables are used for theming (e.g., brand colors).
- **Responsive Design**: The site implements responsive design for different device sizes.

### Routing
- **React Router**: The application uses React Router for navigation.
- **Route Patterns**:
  - `/`: Homepage
  - `/category/:handle`: Category pages
  - `/product/:handle`: Product detail pages
  - `/account`: Account management
  - `/cart`: Shopping cart

## Key Components

### Navigation
- **Navbar.tsx**: Recently redesigned to improve UX and match branding.
- **MiniCart**: Displays cart contents and provides checkout access.
- **AccountButton**: Shows different options based on login status.

### Product Display
- **ProductCard.tsx**: Original component using static data.
- **ShopifyProductCard.tsx**: New component for Shopify product data.
- **ProductPage.tsx**: Product detail page using Shopify data.
- **CategoryPage.tsx**: Displays products from a specific category/collection.

### Homepage
- **HomePage.tsx**: Uses a hybrid approach with both static content and Shopify data.
- **PromoBanner**: Displays featured products using static data.
- **ShopifyPromoBanner**: New component for Shopify featured products.

### User Account
- **AccountPage**: For viewing and editing personal information.
- **OrdersPage**: For viewing order history.
- **LoginPage** and **RegisterPage**: For authentication.

## Development Workflow

### Aegis Framework
- **Task Management**: The project uses the Aegis framework for task management, with tasks organized into active, planned, hold, and completed categories.
- **Task Structure**: Each task has front matter with metadata, followed by sections for Description, Objectives, Steps, Progress, Dependencies, Test Status, Notes, and Next Steps.
- **Decision Records**: Important decisions are documented in decision records.

### Implementation Approach
- **Incremental Development**: The project favors incremental implementation to minimize disruption.
- **Component Reusability**: Components are designed to be reusable across different parts of the application.
- **Type Safety**: Strong typing is maintained throughout the implementation.

### Testing
- **Test-Driven Development**: Tasks include a Test Status section to track testing progress.
- **Test Categories**: Tests are categorized as Not Started, Failing, Passing, or Not Applicable.

## Ongoing Improvements

### Shopify Integration
- **Phase 1: Foundation**: API utilities, authentication, and session management.
- **Phase 2: Product Catalog**: Product catalog pages using Shopify data.
- **Phase 3: Cart & Checkout**: Shopping cart functionality and checkout flow.
- **Phase 4: Integration & Optimization**: Landing page integration and performance optimization.

### UI/UX Improvements
- **Navigation and Search**: Improving navigation structure and enhancing mobile navigation.
- **Product Content**: Enhancing product descriptions, specifications, and terminology.
- **Mobile Experience**: Optimizing for mobile devices with appropriate touch targets and navigation.
- **Conversion Optimization**: Adding trust elements and improving the purchase journey.

### Additional Planned Improvements
- **Enhanced Product Page**: Dynamic image gallery, interactive specifications, visual swatches.
- **Enhanced Category Pages**: Advanced filtering, interactive product cards, quick view.
- **Enhanced Homepage**: More compelling narrative, featured collections, improved visual flow.
- **Microinteractions**: Purposeful animations, smooth transitions, subtle effects.
- **Mobile Experience Polish**: Optimized touch targets, improved navigation, performance optimization.

## Technical Constraints and Considerations

### Performance
- **Image Optimization**: Images need to be optimized for performance.
- **Lazy Loading**: Implemented for images below the fold.
- **Code Splitting**: May be needed for larger components.

### Responsive Design
- **Mobile-First Approach**: The site should be designed with mobile users in mind.
- **Touch Targets**: Need to be at least 44x44px for mobile usability.
- **Content Hierarchy**: Should be optimized to reduce excessive scrolling on mobile.

### Accessibility
- **ARIA Landmarks**: Need to be added for better accessibility.
- **Keyboard Navigation**: Should work properly for all interactive elements.
- **Color Contrast**: Must meet WCAG 2.1 AA standards.

### SEO
- **Metadata**: Product pages need proper metadata for SEO.
- **Structured Data**: May be needed for rich snippets in search results.
- **URL Structure**: Should be SEO-friendly and consistent.

## Implications for Redesign Implementation

1. **Component Adaptation Strategy**: The redesign should adapt both original components and Shopify-specific components to maintain the dual approach.

2. **CSS Variables for Theming**: The redesign should leverage CSS variables for theming to ensure consistency across components.

3. **Incremental Implementation**: The redesign should be implemented incrementally to minimize disruption, following the pattern established in the project.

4. **Alignment with Ongoing Improvements**: The redesign tasks should align with and complement the ongoing UI/UX improvements and Shopify integration efforts.

5. **Mobile Considerations**: The redesign should prioritize mobile experience, addressing the issues identified in the UI/UX analysis.

6. **Performance Awareness**: The redesign should consider performance implications, especially for animations and visual enhancements.

7. **Accessibility Requirements**: The redesign should maintain or improve accessibility, following WCAG 2.1 AA standards.

8. **Task Structure Alignment**: The redesign tasks should follow the Aegis framework structure for consistency and integration with the project workflow.

## Conclusion

The SillaVida website has a complex technical architecture with a mix of static and dynamic components, ongoing Shopify integration, and planned UI/UX improvements. The redesign implementation plan should respect this architecture and align with the established development workflow to ensure a smooth transition to the new visual identity and messaging while maintaining functionality and performance.

The redesign tasks should be structured according to the Aegis framework, with clear objectives, steps, and dependencies. They should be prioritized based on impact, complexity, and alignment with ongoing improvements, with a focus on incremental implementation to minimize disruption.
