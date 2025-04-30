---
title: Update Product Page Layout for Specs and Features
type: task
status: planned
created: 2025-04-30T20:51:22Z
updated: 2025-04-30T20:51:22Z
id: TASK-067
priority: high
memory_types: [procedural, semantic]
dependencies: [TASK-066]
tags: [react, shopify, product-page, redesign, frontend, css, layout]
---

# Update Product Page Layout for Specs and Features

## Description
Modify the styling and structure of the product page's specification and feature sections, implemented within the `ProductDetailSections.jsx` component, to match new layout requirements based on user-provided examples. Specifications (identified by `spec-` image Alt Text prefix) should use a horizontal card layout, and features (identified by `feature-` image Alt Text prefix) should use a larger image/caption layout.

## Objectives
- Implement a horizontal card layout for the specifications section (using `spec-` images), similar to the user-provided "How M18 Chair Helps?" example.
- Implement a larger image/caption layout for the features section (using `feature-` images), similar to the user-provided "Recline, Comfort, and Durability" example.
- Ensure the specifications section appears directly below the main product hero section.
- Ensure the features section appears directly below the specifications section.
- Replace all placeholder inline styles in `ProductDetailSections.jsx` with the project's established CSS styling system (e.g., CSS Modules, Tailwind CSS, Styled Components).
- Ensure both new layouts are fully responsive across desktop, tablet, and mobile viewports.

## Steps
1.  **Review Component:** Examine the updated `ProductDetailSections.jsx` component (provided in the latest deliverable package). Note how it separates `specImages` and `featureImages` and renders them in distinct `<section>` blocks.
2.  **Style Specifications Section:**
    *   Target the CSS classes associated with the specifications section (e.g., `.specifications-detail-section`, `.spec-grid`, `.spec-card`, `.spec-card-image`, `.spec-card-content`, etc.).
    *   Apply CSS rules using the project's styling system to create the horizontal card layout. Focus on:
        *   Grid setup (`.spec-grid`) for responsiveness (e.g., 4 columns on desktop, 2 on tablet, 1 on mobile).
        *   Card appearance (`.spec-card`) including background, border-radius, shadow.
        *   Image styling (`.spec-card-image`) for consistent height and object-fit.
        *   Text styling within the card content.
3.  **Style Features Section:**
    *   Target the CSS classes associated with the features section (e.g., `.features-detail-section`, `.feature-grid`, `.feature-item`, `.feature-item-image`, etc.).
    *   Apply CSS rules using the project's styling system to create the larger image/caption layout. Focus on:
        *   Grid setup (`.feature-grid`) for responsiveness (e.g., 2 columns on desktop, 1 on mobile).
        *   Image styling (`.feature-item-image`) for size, border-radius, shadow.
        *   Caption/text styling below the image.
4.  **Verify Order:** Double-check the main `ProductPage.jsx` component to confirm that the `<ProductDetailSections />` component is rendered immediately after `<ProductHeroShowcase />`.
5.  **Remove Inline Styles:** Carefully remove all `style={{...}}` attributes from the JSX within `ProductDetailSections.jsx`, ensuring the new CSS rules take effect.
6.  **Responsiveness Testing:** Thoroughly test the layout transitions for both the specification and feature sections across various screen widths (e.g., using browser developer tools).
7.  **Content Testing:** Test with actual product data, ensuring images with `spec-` and `feature-` prefixes render in the correct sections with the intended layouts.

## Progress
- `ProductDetailSections.jsx` component updated to separate spec and feature images and apply basic structural JSX for the two layouts.

## Dependencies
- Completion of TASK-066 (initial integration of components).
- Access to the SillaVida React project codebase and its styling system.
- User-provided screenshot examples for layout reference.

## Test Status
- Status: Not Started
- Test Files: Manual testing required as described in Step 6 & 7.

## Notes
- This task focuses purely on the layout and styling of the sections rendered by `ProductDetailSections.jsx`.
- Ensure the applied styles align with the overall SillaVida brand aesthetic (colors, fonts, spacing).

## Next Steps
- Begin Step 1: Review the updated `ProductDetailSections.jsx` component.

