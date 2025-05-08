# Judge.me Integration Planning for SillaVida

## Technical Architecture

### Frontend Framework & Stack
- **Framework**: React 18.3.1 with TypeScript
- **Build System**: Vite
- **Routing**: React Router DOM (v6.22.3)
- **Animation**: Framer Motion
- **CSS Framework**: Tailwind CSS (based on file structure and imports)
- **State Management**: Context API (CartContext observed)

### Component Organization
- Well-structured component hierarchy with dedicated directories:
  - `/src/components/` - Reusable UI components
  - `/src/pages/` - Page-level components
  - `/src/context/` - Context providers (CartContext)
  - `/src/hooks/` - Custom React hooks
  - `/src/lib/` - Core functionality (Shopify integration)
  - `/src/services/` - Service integrations
  - `/src/utils/` - Utility functions
  - `/src/styles/` - CSS and styling

### Routing Approach
- React Router DOM with BrowserRouter
- Route definitions centralized in App.tsx
- AnimatePresence from Framer Motion for route transitions
- Clean URL structure (e.g., `/product/:handle`, `/category/:handle`)

### Global Scripts/Assets Management
- Main entry point in main.tsx
- Service worker registration for offline capabilities
- Design system initialization via setupDesignSystem()
- Global CSS imports in main.tsx

## Current Integration Points

### Shopify Connection
- Using `@shopify/hydrogen-react` for Storefront API integration
- Custom shopifyClient implementation in `/src/lib/shopify.ts`
- Comprehensive API with caching, retry logic, and error handling
- Functions for products, collections, cart operations, and checkout

### Third-Party Script Integration
- No dedicated service for third-party script management observed
- Service worker registration in place
- Main.tsx and App.tsx would be logical places to add global scripts

### Layout Structure
- App.tsx contains the main layout structure
- Components like Navbar, ShippingPromoBanner, Footer are included at the app level
- WhatsAppButton component included globally

## Deployment and Building

### Build System
- Vite (modern, fast build tool)
- NPM scripts for various build and test operations
- Performance auditing capabilities

### Rendering Approach
- Client-side rendered React application
- No evidence of SSR or SSG in the codebase
- Service worker for improved performance and offline capabilities

### Environment Variables
- Using Vite's import.meta.env approach
- VITE_SHOPIFY_STORE_DOMAIN observed in shopify.ts

## Current Product Review Implementation

- No existing review system implementation observed in the codebase
- ProductPage component would be the primary target for product reviews
- HomePage contains sections that could host review widgets (testimonials)

## Performance and Technical Considerations

### Performance Features
- Service worker for caching and offline support
- Image optimization script available (scripts/generate-responsive-images.js)
- Performance audit script available (scripts/performance-audit.js)

### Testing Infrastructure
- Jest for unit testing
- Cypress for E2E testing
- Accessibility testing with axe-core

### Browser Compatibility
- Modern browser focus (React 18, Vite)
- No specific polyfills or legacy browser support observed

## Recommendations for Judge.me Integration

### Integration Points
1. **Product Reviews**: Integrate on ProductPage.tsx
2. **Review Carousel**: Could replace or enhance TestimonialsPage.tsx
3. **Floating Badge**: Add to global layout in App.tsx

### Implementation Approach
1. Create a dedicated service for Judge.me in `/src/services/judgeMe.ts`
2. Add script loading utility in this service
3. Create React components that wrap Judge.me widgets
4. Integrate with existing product data flow

### Technical Considerations
1. Ensure Judge.me scripts don't block rendering
2. Consider lazy-loading widgets for performance
3. Implement proper error handling for script loading
4. Add TypeScript interfaces for Judge.me data

### Next Steps
1. Obtain Judge.me shop domain and API keys
2. Create proof-of-concept integration with a single widget
3. Test performance impact
4. Expand to full widget suite

## Questions for Further Clarification

1. Do you have specific Judge.me widgets in mind beyond product reviews?
2. Are there any custom styling requirements to match your Hbada design system?
3. Do you need review data to be available offline via the service worker?
4. Are there any specific performance concerns with third-party scripts?
5. Will you need to fetch review data server-side for SEO purposes?
