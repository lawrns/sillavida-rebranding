---
title: Product Card Cart Functionality
type: decision
status: approved
created: 2025-04-12T16:22:31-06:00
updated: 2025-04-12T16:37:14-06:00
tags: [cart, ui, functionality]
---

# Product Card Cart Functionality

## Context
The "Add to Cart" buttons on the product cards in the category page are not working correctly. When users click on the "Add to Cart" button, the button shows the "¡Agregado!" (Added) state, but the items are not actually being added to the cart. The cart count in the navbar does not increase, and the cart remains empty.

## Decision
1. Remove mock variant IDs and replace with dynamic generation:
   - The current implementation uses mock variant IDs that may not match the ones expected by the Shopify API
   - Create a `generateVariantId` function that creates a deterministic ID from the product/chair ID
   - Ensure that the variant IDs are properly formatted as Shopify Global IDs (gid://shopify/ProductVariant/...)

2. Improve error handling in the addItem function in the CartContext:
   - Add more detailed error logging to help diagnose issues with adding items to the cart
   - Add a retry mechanism for failed cart operations
   - Provide better feedback to users when cart operations fail

3. Add console logging to track the cart state:
   - Log the cart state before and after adding items to help diagnose issues
   - Log any errors that occur during cart operations
   - This will help identify where the issue is occurring

## Alternatives Considered
1. **Use real Shopify variant IDs**: Instead of generating variant IDs, we could fetch the real variant IDs from the Shopify API. This would ensure that the variant IDs are correct, but it would require additional API calls.
2. **Implement a fallback mechanism**: We could implement a fallback mechanism that uses local storage to store cart items when the Shopify API fails. This would ensure that users can still add items to their cart, but it would require additional code to synchronize the local cart with the Shopify cart.
3. **Disable the "Add to Cart" button for products without valid variant IDs**: We could disable the "Add to Cart" button for products that don't have valid variant IDs. This would prevent users from trying to add items that can't be added, but it would limit the functionality of the site.

## Rationale
- The issue is likely related to the mock variant IDs not matching the ones expected by the Shopify API
- By generating variant IDs deterministically from product IDs, we ensure consistency and avoid hardcoded values
- Adding more detailed error logging will help diagnose any remaining issues
- The retry mechanism will help handle temporary network issues
- Better feedback to users will improve the user experience

## Implications
- Positive: Users will be able to add items to their cart from the product cards
- Positive: The cart functionality will be more reliable
- Positive: Better error handling will help diagnose and fix issues more quickly
- Positive: No need to maintain a list of mock variant IDs that could get out of sync
- Negative: The generated variant IDs may not match the actual Shopify variant IDs

## Related Decisions
- This decision is related to the overall cart implementation in the application

## Status
Implemented

## Implementation Details
1. **Removed mock variant IDs and replaced with dynamic generation**:
   - Created a `generateVariantId` function that creates a deterministic ID from the product/chair ID
   - Ensured all variant IDs use the correct Shopify Global ID format
   - Added detailed comments explaining the approach

2. **Improved error handling in CartContext**:
   - Added retry logic for failed cart operations (up to 2 retries)
   - Added exponential backoff between retries
   - Added specific error handling for "cart not found" errors
   - Added detailed error logging with attempt counts

3. **Added console logging to track the cart state**:
   - Added logging before and after cart operations
   - Added logging for cart state (cartId, itemCount)
   - Added detailed logging for success and failure cases
   - Added logging for retry attempts

4. **Updated ShopifyProductCard component**:
   - Removed mock IDs and used the actual product ID to generate variant IDs when needed
   - Added the same retry logic as in the CartContext
   - Added detailed console logging
   - Added user feedback for errors (alert messages)

5. **Updated ProductPage component**:
   - Added the same retry logic as in the ProductCard and ShopifyProductCard components
   - Added detailed console logging
   - Added user feedback for errors (alert messages)
   - Added exponential backoff for retries

## Follow-up Actions
1. Test the cart functionality with different products to ensure it works correctly
2. Consider implementing a mechanism to fetch real variant IDs from the Shopify API in the future
3. Add automated tests for the cart functionality
4. Monitor cart operations for any remaining issues
