---
title: Fix Hero Slider Data Fetching and Button Link
type: task
status: planned
created: 2025-05-02T20:27:46
updated: 2025-05-02T20:27:46
id: TASK-071
priority: high
memory_types: [procedural, semantic]
dependencies: [TASK-068]
tags: [bugfix, frontend, shopify, metaobjects, hero-slider]
---

# Fix Hero Slider Data Fetching and Button Link

## Description
The hero slider component is currently displaying an error ("No se pudieron cargar los productos destacados") instead of fetching and displaying data from the Shopify "Hero Slide" Metaobjects. This issue arose after attempts to modify the component, particularly changing the button action from "Add to Cart" to linking to the product page. The goal is to restore the slider's functionality to correctly fetch data from the Metaobjects and ensure the button links properly.

## Objectives
- Restore the hero slider's ability to fetch and display data from the "Hero Slide" Shopify Metaobjects.
- Ensure the data (image, title, price, details) is accessed correctly from the Storefront API response.
- Implement the "Ver producto" button to correctly link to the corresponding product page using the product handle.
- Improve loading states and error handling for a better user experience.

## Steps
1.  **Verify GraphQL Query:**
    *   Locate the GraphQL query used by the `HeroSlider` component to fetch data from the Storefront API.
    *   Ensure the query correctly requests all necessary fields from the `metaobjects` (type: `hero_slide`) including:
        *   `id`
        *   `slide_image` (field containing the image reference, e.g., `fields[key="slide_image"].reference.image.url`)
        *   `slide_details` (field containing the text details, e.g., `fields[key="slide_details"].value`)
        *   `product_to_feature` (field linking to the product, e.g., `fields[key="product_to_feature"].reference`)
    *   Within the `product_to_feature` reference, ensure the query fetches:
        *   `handle`
        *   `title`
        *   `variants(first: 1)` -> `edges` -> `node` -> `id`, `price { amount, currencyCode }`
    *   Test the query in Shopify's GraphiQL app or similar tool to confirm it returns the expected data structure.

2.  **Correct Data Access Logic:**
    *   Review the component's code where it processes the fetched data (likely within a `useEffect` hook or data transformation function).
    *   **Crucially, ensure the code uses the exact correct paths to access nested data** from the API response. Pay close attention to:
        *   Accessing the Metaobject fields (e.g., `slide.fields.find(f => f.key === 'slide_image')?.reference?.image?.url`).
        *   Accessing the linked product's data (e.g., `slide.fields.find(f => f.key === 'product_to_feature')?.reference?.handle`).
        *   Accessing the first product variant's price (e.g., `slide.fields.find(f => f.key === 'product_to_feature')?.reference?.variants?.edges?.[0]?.node?.price?.amount`).
    *   Use optional chaining (`?.`) extensively to prevent errors if parts of the data structure are missing or null.
    *   Add console logs to trace the data structure at different points if needed during debugging.

3.  **Implement Button Link:**
    *   Locate the "Ver producto" button within the slider component.
    *   Ensure it uses a `Link` component (e.g., from React Router or Next.js).
    *   Set the `to` or `href` prop of the `Link` component dynamically using the product handle fetched in Step 2. Example: `to={\"/product/" + productHandle}` where `productHandle` is extracted correctly from the data.

4.  **Improve Loading and Error States:**
    *   Implement a clear loading indicator (e.g., a spinner or skeleton screen) that displays while the GraphQL query is fetching data.
    *   Replace the current generic error message with a more user-friendly one if the data fetch fails after retries or timeouts.
    *   Consider if a minimal fallback (perhaps just a static image or message) is desired if data loading fails permanently, instead of showing nothing.

5.  **Testing:**
    *   Test the slider thoroughly with the actual Metaobject data created in Shopify.
    *   Verify that all slides load correctly, displaying the right image, title, price, and details.
    *   Confirm that the "Ver producto" button on each slide links to the correct product page.
    *   Test the loading state and error state handling.

## Progress
- No progress yet

## Dependencies
- TASK-068: Implementation plan for the dynamic hero slider using Metaobjects.
- Access to the SillaVida frontend codebase.
- Shopify Storefront API credentials and understanding of the Metaobject structure created.

## Test Status
- Status: Not Started
- Test Files: None

## Notes
- Refer to the `hero_slider_changes_report.md` for context on previous modifications.
- Pay close attention to the exact structure returned by the Storefront API for Metaobjects and their references, as this is the most likely point of failure.
- Ensure consistency between the GraphQL query structure and the data access paths used in the component code.

## Next Steps
- Locate the `HeroSlider` component and the associated GraphQL query in the codebase.
- Begin verifying the GraphQL query against the expected Metaobject structure and Storefront API response.

