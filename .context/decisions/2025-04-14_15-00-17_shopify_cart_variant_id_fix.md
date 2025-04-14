---
title: "Shopify Cart Variant ID Fix"
type: decision
created: 2025-04-14T15:00:17-06:00
updated: 2025-04-14T15:00:17-06:00
---

# Context

Users were experiencing issues when trying to add Shopify products to the cart from the category page. When clicking the "Agregar al Carrito" button on product cards, an error occurred: "Unable to add item to cart: Unable to add item to cart: Add to cart failed: La mercancía promocional con identificación gid://shopify/ProductVariant/2762000 no existe. Please try again later."

The issue was in the ShopifyProductCard component, which was using a `generateVariantId` function to create a synthetic variant ID when a real one wasn't found. This function was creating IDs that don't actually exist in Shopify, causing the error when trying to add products to the cart.

# Decision

We decided to make the following changes to fix the issue:

1. **Remove the `generateVariantId` function entirely**
   - This function was generating IDs that don't exist in Shopify, causing errors
   - Instead, we'll use actual variant IDs from the Shopify API

2. **Update the handleAddToCart function to use actual variant IDs**
   - Add validation to ensure we have a valid variant ID before attempting to add to cart
   - Throw an error with a clear message if no variant ID is found

3. **Update the product fetching to include variant information**
   - Modify the GraphQL query in `getProductsByCollection` to include variant information
   - This ensures that we have the necessary variant IDs for all products

4. **Enhance error handling in CartContext**
   - Add specific error handling for invalid variant IDs
   - Improve error messages to provide better feedback to users
   - Throw errors instead of showing alerts for better error propagation

# Alternatives Considered

1. **Fix the `generateVariantId` function**
   - We could have tried to fix the function to generate valid variant IDs
   - However, this would still be a workaround and not a proper solution
   - Using actual variant IDs from the Shopify API is more reliable

2. **Use a default variant ID**
   - We could have used a default variant ID for products without variants
   - However, this would still cause errors if the default variant doesn't exist
   - It's better to validate and provide clear error messages

3. **Fetch variant IDs separately**
   - We could have made a separate API call to get variant IDs
   - However, this would add unnecessary complexity and network requests
   - Including variant information in the initial product fetch is more efficient

# Consequences

## Positive

- Products can now be added to the cart correctly
- The solution works for both existing products and any new products added to Shopify in the future
- Better error handling provides clearer feedback to users
- More efficient data fetching by including variant information in the initial product fetch

## Negative

- Products without variants will now show an error message instead of attempting to add to cart
- This is actually better than the previous behavior, which would attempt to add with an invalid ID and fail with a less clear error

## Neutral

- The GraphQL query is slightly larger due to including variant information
- This is a minor trade-off for ensuring we have the necessary data

# Implementation

The implementation involved the following changes:

1. Removed the `generateVariantId` function from ShopifyProductCard.tsx
2. Updated the handleAddToCart function to use actual variant IDs and add validation
3. Updated the product fetching in shopify.ts to include variant information
4. Enhanced error handling in CartContext.tsx for invalid variant IDs

# Follow-up Actions

1. Test the cart functionality with various Shopify products to ensure the changes work as expected
2. Verify that the MiniCart component correctly displays Shopify products
3. Consider adding a fallback UI for products without variants to prevent confusion
