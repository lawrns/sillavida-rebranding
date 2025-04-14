---
title: Remove Mock Cart Fallback and Improve Error Handling
type: decision
created: 2025-04-14T13:52:38-06:00
updated: 2025-04-14T13:52:38-06:00
tags: [cart, shopify, error-handling]
---

# Remove Mock Cart Fallback and Improve Error Handling

## Context
Previously, we implemented a mock cart fallback mechanism in the Shopify API integration to handle cases where the Shopify API fails. This was useful for development and testing, but now we want to ensure that we only use actual Shopify products and provide better error feedback to users when the API fails.

## Decision
We have decided to:

1. Remove the mock cart fallback from the Shopify API integration
2. Improve error handling to provide better user feedback when the Shopify API fails
3. Ensure that errors are properly propagated to the UI

## Rationale
- Using mock data can mask real issues with the Shopify API integration
- Users should be informed when operations fail, rather than silently falling back to mock data
- Better error handling will help us identify and fix issues more quickly
- This approach will provide a more accurate representation of the production environment

## Implementation Details

### 1. Removed Mock Cart Fallback
We removed the mock cart fallback from the `createCart` and `addToCart` functions in `src/lib/shopify.ts`. Instead of creating a mock cart when the Shopify API fails, we now throw a more user-friendly error.

```typescript
// Before
catch (error) {
  console.error('[Shopify] Error creating cart:', error);
  
  // Create a mock cart for development/testing
  console.warn('[Shopify] Creating mock cart for development');
  return {
    id: 'mock-cart-id',
    lines: {
      edges: lines.map((line, index) => ({
        node: {
          id: `mock-line-${index}`,
          quantity: line.quantity,
          merchandise: {
            id: line.merchandiseId,
            title: `Mock Product Variant ${index}`,
            product: {
              title: `Mock Product ${index}`
            },
            price: {
              amount: '100.00',
              currencyCode: 'MXN'
            }
          }
        }
      }))
    },
    cost: {
      subtotalAmount: {
        amount: '100.00',
        currencyCode: 'MXN'
      },
      totalAmount: {
        amount: '100.00',
        currencyCode: 'MXN'
      }
    }
  };
}

// After
catch (error) {
  console.error('[Shopify] Error creating cart:', error);
  
  // Throw a more user-friendly error
  if (error instanceof Error) {
    throw new ShopifyError(`Unable to create cart: ${error.message}`);
  } else {
    throw new ShopifyError('Unable to create cart: Unknown error');
  }
}
```

### 2. Improved Error Handling in CartContext
We updated the error handling in the `CartContext` to show user-friendly error messages when operations fail. We now use `alert()` to display error messages to the user.

```typescript
// Before
if (retryCount > maxRetries) {
  console.error(`[CartContext] Failed to add item after ${maxRetries} retries`);
  throw error; // Rethrow the error after max retries
}

// After
if (retryCount > maxRetries && lastError) {
  const errorMessage = lastError.message || 'Unknown error';
  alert(`Unable to add item to cart: ${errorMessage}. Please try again later.`);
  return;
}
```

### 3. Updated All Cart Operations
We applied similar error handling improvements to all cart operations:
- `addItem`
- `updateItem`
- `removeItem`
- `getCheckout`

## Consequences
- Users will now see error messages when cart operations fail
- We will no longer silently fall back to mock data
- This will help us identify and fix issues with the Shopify API integration more quickly
- The application will be more robust and provide a better user experience

## Alternatives Considered
- **Keep the mock cart fallback but make it configurable**: We could have kept the mock cart fallback but made it configurable via an environment variable. This would allow us to disable it in production but keep it for development and testing. However, we decided that it's better to handle errors consistently across all environments.
- **Use a more sophisticated error handling mechanism**: We could have implemented a more sophisticated error handling mechanism, such as a toast notification system or a dedicated error modal. However, we decided to start with simple `alert()` messages for now, as they are sufficient for the current needs.

## Related Decisions
- [Cart Functionality Fix Implementation](/.context/decisions/2025-04-14_13-31-45_cart_functionality_fix.md)
