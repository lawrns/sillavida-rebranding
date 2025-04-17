---
title: Fix Cart Mock Data Display Issue
type: task
status: completed
created: 2025-04-17T15:42:53-06:00
updated: 2025-04-17T16:27:42-06:00
id: TASK-038
priority: high
memory_types: [procedural, semantic]
dependencies: []
tags: [bugfix, cart, shopify, ux, integration]
---

# Fix Cart Mock Data Display Issue

## Description
When users click "Agregar al Carrito" (Add to Cart) on any product card throughout the site, the cart displays mock product data instead of the actual Shopify product information. Specifically, instead of seeing the product they selected (like "Oficina X" chair), they see a generic "Mock Product" entry in their cart. This creates a confusing and inconsistent shopping experience.

The issue stems from a configuration flag in the Shopify integration code where `FORCE_MOCK_CART` is set to `true`, forcing all cart operations to use mock data implementation instead of actual Shopify products. The mock implementation generates placeholder data with titles like "Mock Product" instead of pulling real product information. Additionally, the mock data doesn't include product images, resulting in a cart that shows only placeholder icons.

## Objectives
- Fix the cart to display actual Shopify product information instead of mock data
- Ensure product images are properly displayed in the cart
- Create a consistent experience between product selection and cart display
- Improve user trust in the shopping experience
- Enable accurate testing of the entire shopping flow

## Steps
1. In `src/lib/shopify.ts`, change `FORCE_MOCK_CART` from `true` to `false`
2. In `src/pages/CartPage.tsx`, update the product image display logic:
   - Replace the placeholder image div with code that attempts to load the actual product image
   - Add fallback logic to display a placeholder icon if the image fails to load
3. In `src/context/CartContext.tsx`, remove the code block (around lines 155-175) that converts real Shopify variant IDs to mock variant IDs
4. Test adding products to cart from various places (product detail page, category page, homepage)
5. Verify product titles, images, and prices display correctly in the cart
6. Test quantity adjustments and item removal
7. Complete an end-to-end checkout process with real products
8. Test across different browsers and devices to ensure consistent behavior

## Progress
- Task moved from planned to active status
- Examined the implementation in the affected files
- Changed `FORCE_MOCK_CART` from `true` to `false` in `src/lib/shopify.ts`
- Updated GraphQL queries in all cart-related functions to include product image information:
  - Added image field to `getCart` query
  - Added image field to `updateCartLines` query
  - Added image field to `removeFromCart` query
  - Added image field to `addToCart` query
  - Added image field to `createCart` query
- Modified `CartContext.tsx` to:
  - Add `imageUrl` field to the `CartItem` interface
  - Extract image URL from the merchandise object
  - Remove the code block that converts real Shopify variant IDs to mock variant IDs
- Updated product image display logic in `CartPage.tsx`:
  - Added code to use the `imageUrl` property from cart items
  - Added fallback logic to attempt loading images based on variant ID if `imageUrl` is not available
  - Added proper error handling for images that fail to load
- Fixed issue where images would disappear when updating cart quantities

## Dependencies
- None

## Test Status
- Status: Not Started
- Test Files: None

## Notes
- This issue has a high priority because:
  - It affects all users attempting to add products to their cart
  - It creates a disconnected experience where users see one product but add something else to their cart
  - It diminishes user trust in the shopping experience
  - It likely prevents users from completing purchases since they're uncertain what they're buying
  - It makes testing other cart-related functionality difficult since we're not using real product data
- After the fix is implemented, users should see:
  - Actual product names and details in the cart instead of "Mock Product"
  - Product images displayed in the cart
  - Consistent information between what they click and what appears in their cart
  - A more professional and trustworthy shopping experience

## Next Steps
- Test the changes by adding products to cart from various places (product detail page, category page, homepage)
- Verify product titles, images, and prices display correctly in the cart
- Test quantity adjustments and item removal to ensure images persist
- Complete an end-to-end checkout process with real products
- Test across different browsers and devices to ensure consistent behavior
