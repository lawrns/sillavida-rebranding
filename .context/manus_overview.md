# SillaVida Live Site React Codebase Overview

_Last updated: 2025-05-05T16:41:14-06:00_

## 1. Global Styling

- **Global CSS File(s):**
  - `src/index.css` — Main global CSS entry point.
- **Tailwind CSS Configuration:**
  - `tailwind.config.js` (project root) — Tailwind CSS configuration file.
- **Styling Methodology:**
  - Tailwind CSS utility classes are used directly in React components for primary styling.
  - No CSS Modules are present.
  - Some components may import additional CSS files for specific features (e.g., galleries).

## 2. Key Component Identification

- **Main Site Header (Navigation):**
  - `src/components/Navbar.tsx`
  - `src/components/VidaNavbar.tsx`
- **Main Site Footer:**
  - `src/components/Footer.tsx`
- **Homepage Hero Slider/Showcase:**
  - `src/components/HeroSlider.tsx`
- **Product Card Component:**
  - `src/components/ProductCard.tsx`
  - `src/components/ProductCardSimple.tsx`
  - `src/components/ShopifyProductCard.tsx`
- **Product Listing/Grid Component:**
  - Likely in `src/pages/CategoryPage.tsx` (renders a grid/list of products using card components)
- **Product Detail Page: Main Image Gallery:**
  - `src/components/product/ProductGallery.tsx`
- **Product Detail Page: Product Information:**
  - Likely handled in `src/pages/ProductPage.tsx` (main product page)
- **Product Detail Page: Features/Specifications/Details:**
  - `src/components/ProductFeatures.tsx`
  - `src/components/ChairFeaturesComponent.tsx`

## 3. Routing

- **Primary Routing Library:**
  - `react-router-dom` is used for client-side routing.
  - See usage in `src/App.tsx` and throughout page/component files.

---

## Additional Information for Manus

### Shopify Integration & Data Flow
- Product and collection data are fetched from Shopify using custom hooks and utilities in `src/lib/` and `src/hooks/`.
- Product cards expect Shopify product objects as props—do not change the data shape.
- Cart logic is managed via React context in `src/context/CartContext.tsx`.
- Some homepage/promotional content (e.g., hero slider) uses Shopify Metaobjects.

### Component Organization & Conventions
- Components are in `src/components/`, with subfolders for product-specific elements.
- Main route views are in `src/pages/` and compose multiple components.
- Tests are in `src/components/__tests__/` and `src/hooks/__tests__/`.

### Styling & Theming
- All visual changes should be made in `tailwind.config.js` and reflected via utility classes in JSX.
- Any base styles or resets are in `src/index.css`.
- Some components use additional CSS files for complex layouts.

### Routing & Navigation
- Dynamic route parameters are used for product/category pages (e.g., `/product/:handle`).
- Both `Navbar.tsx` and `VidaNavbar.tsx` may appear on different pages.

### Accessibility & Responsiveness
- Semantic HTML and ARIA attributes are used—maintain or improve accessibility.
- Tailwind’s responsive utilities are used throughout—test on all breakpoints.

### Deployment & Build
- Vite is used for bundling and development (`npm run dev`).
- Ensure new dependencies are compatible with Vite.

---

## Recommendations for Task Creation

- Reference specific file paths and component names in each task.
- For visual changes, specify which Tailwind classes or config entries to update.
- For layout changes, note affected parent/child component relationships.
- Coordinate any Shopify data structure changes with backend/admin.
- Include regression testing and accessibility checks in acceptance criteria.
- Document assumptions or required follow-up with the SillaVida team.

---

If you need code samples, architectural diagrams, or a deep-dive into a specific integration or component, just ask!
