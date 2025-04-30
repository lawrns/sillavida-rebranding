---
title: Integrate Redesigned Product Page Components
type: task
status: planned
created: 2025-04-30T19:15:18Z
updated: 2025-04-30T19:15:18Z
id: TASK-066
priority: high
memory_types: [procedural, semantic]
dependencies: []
tags: [react, shopify, product-page, redesign, frontend, integration]
---

# Integrate Redesigned Product Page Components

## Description
Integrate the newly created React components for the redesigned SillaVida product page into the main project codebase. This task involves replacing the existing product page structure with the new components (`ProductPage.jsx`, `ProductHeroShowcase.jsx`, `ProductDetailSections.jsx`), connecting them to the live Shopify data hooks (`useShopify`, `useCart`), replacing mock data and inline styles with project-specific implementations, and ensuring full functionality and responsiveness.

## Objectives
- Successfully replace the current product page implementation with the new component structure.
- Connect components to the actual `useShopify` and `useCart` hooks available in the SillaVida project.
- Ensure product data (title, price, variants, description, images) is correctly fetched and displayed via the `useShopify` hook.
- Implement fetching and display of feature/specification images from the Shopify product media gallery based on Alt Text prefixes (`feature-`, `spec-`) as handled by `ProductDetailSections.jsx`.
- Verify that the `ProductHeroShowcase.jsx` thumbnail gallery correctly excludes images intended for the feature/specification sections.
- Remove all temporary inline styles from the components.
- Apply the SillaVida project's established CSS styling system (e.g., CSS Modules, Tailwind CSS, Styled Components) to match the brand guidelines (teal, beige, sage palette) and the desired modern aesthetic.
- Ensure the redesigned product page is fully responsive across desktop, tablet, and mobile viewports.
- Confirm that the "Add to Cart" functionality works correctly using the project's `useCart` hook.

## Steps
1.  **Locate & Backup:** Identify the current product page component file(s) within the SillaVida project structure and create backups.
2.  **Copy Components:** Place the new component files (`ProductPage.jsx`, `ProductHeroShowcase.jsx`, `ProductDetailSections.jsx`) into the appropriate directory (e.g., `src/components/product/` or similar).
3.  **Update Routing:** Modify the application's router configuration to render the new `ProductPage` component for product detail routes.
4.  **Connect Hooks:** Edit `ProductPage.jsx` to remove the mock hooks and import/use the actual `useShopify` and `useCart` hooks provided by the project.
5.  **Verify Data Fetching:** Test that `getProductByHandle` within the real `useShopify` hook successfully fetches product data, including the `images` array with `altText`.
6.  **Test Detail Sections:** In `ProductDetailSections.jsx`, ensure the image filtering and Alt Text parsing logic works correctly with the live data structure. Adjust if necessary.
7.  **Test Hero Gallery:** Confirm that `ProductHeroShowcase.jsx` correctly filters out `feature-` and `spec-` images from its thumbnail gallery.
8.  **Remove Inline Styles:** Systematically remove all `style={{...}}` attributes from the JSX in all three components.
9.  **Apply Project Styles:** Create corresponding CSS files (e.g., `ProductPage.module.css`) or use the project's styling conventions to implement the visual design. Refer to SillaVida brand guidelines and the reference websites (Sihoo, Hbada) for the aesthetic.
10. **Implement Responsiveness:** Add media queries or use responsive utility classes (if applicable) to ensure the layout adapts correctly to different screen sizes.
11. **Functional Testing:** Thoroughly test the page on a development server:
    *   Load different products.
    *   Select variants and check price/availability updates.
    *   Change quantity.
    *   Add products to the cart.
    *   Verify feature/specification sections display correctly based on Alt Text (use `alt_text_guide.md` for reference).
12. **Cross-Browser/Device Testing:** Test the final styled page on major browsers and different device emulators/physical devices.

## Progress
- Components (`ProductPage.jsx`, `ProductHeroShowcase.jsx`, `ProductDetailSections.jsx`) created with mock hooks and inline styles.
- Alt Text guide (`alt_text_guide.md`) created.

## Dependencies
- Access to the SillaVida React project codebase.
- Availability of the project's actual `useShopify` and `useCart` hooks.
- Access to a development/staging Shopify store with products configured with feature/specification images using the specified Alt Text format.
- SillaVida brand guidelines and project styling conventions.

## Test Status
- Status: Not Started
- Test Files: Manual testing required as described in Step 11 & 12.

## Notes
- The provided components use basic inline styles as placeholders; these **must** be replaced with the project's standard styling approach.
- The Alt Text parsing logic in `ProductDetailSections.jsx` assumes the format `prefix-Title:Description`. Ensure this matches the actual Alt Text being used.
- Pay close attention to responsive design implementation.

## Next Steps
- Begin Step 1: Locate and back up existing product page files in the SillaVida project.

