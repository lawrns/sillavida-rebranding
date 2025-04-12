# Shopify API Integration Documentation

This document provides comprehensive documentation for the Shopify API integration in the Silla Vida e-commerce project. It covers the available API functions, error handling, caching mechanisms, and testing utilities.

## Table of Contents

1. [Configuration](#configuration)
2. [API Client](#api-client)
3. [Error Handling](#error-handling)
4. [Caching](#caching)
5. [Product Functions](#product-functions)
6. [Collection Functions](#collection-functions)
7. [Cart Functions](#cart-functions)
8. [Testing](#testing)

## Configuration

The Shopify API integration requires the following environment variables to be set in the `.env` file:

```
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
```

These variables are used to configure the Shopify Storefront API client.

## API Client

The Shopify API client is implemented in `src/lib/shopify.ts` and provides a wrapper around the Shopify Storefront API with enhanced functionality:

```typescript
import { shopifyClient } from '../lib/shopify';

// Example usage
const response = await shopifyClient.query({
  data: {
    query: `
      query {
        shop {
          name
        }
      }
    `
  }
});
```

### Client Options

The `query` method accepts the following options:

- `data`: The GraphQL query and variables to send to the API
- `cache`: Whether to use caching (default: true)
- `retries`: Number of retries for failed requests (default: 3)

Example with all options:

```typescript
const response = await shopifyClient.query({
  data: {
    query: `
      query Products($limit: Int!) {
        products(first: $limit) {
          edges {
            node {
              id
              title
            }
          }
        }
      }
    `,
    variables: {
      limit: 10
    }
  },
  cache: true,
  retries: 3
});
```

### Cache Management

The client provides methods to manage the cache:

```typescript
// Clear the entire cache
shopifyClient.clearCache();

// Clear a specific cache entry
shopifyClient.clearCache(cacheKey);

// Set the cache TTL (time to live)
shopifyClient.setCacheTTL(60000); // 60 seconds
```

## Error Handling

The API client includes custom error classes for different types of errors:

- `ShopifyError`: Base error class for all Shopify-related errors
- `ShopifyNetworkError`: For HTTP errors (includes status code)
- `ShopifyGraphQLError`: For GraphQL errors (includes GraphQL error details)
- `ShopifyTimeoutError`: For request timeouts

Example error handling:

```typescript
try {
  const products = await getProducts();
  // Process products
} catch (error) {
  if (error instanceof ShopifyGraphQLError) {
    console.error('GraphQL error:', error.errors);
  } else if (error instanceof ShopifyNetworkError) {
    console.error('Network error:', error.status, error.message);
  } else if (error instanceof ShopifyTimeoutError) {
    console.error('Request timed out');
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Caching

The API client includes a caching mechanism to improve performance:

- Default cache TTL: 5 minutes
- Cache is stored in memory
- Cache is automatically invalidated after TTL expires
- Cache can be manually cleared

## Product Functions

### getProducts

Fetches a list of products from the Shopify store.

```typescript
import { getProducts } from '../lib/shopify';

// Get 10 products (default)
const products = await getProducts();

// Get a specific number of products
const products = await getProducts(20);
```

### getProduct

Fetches a single product by handle.

```typescript
import { getProduct } from '../lib/shopify';

// Get a product by handle
const product = await getProduct('example-product');
```

## Collection Functions

### getCollections

Fetches a list of collections from the Shopify store.

```typescript
import { getCollections } from '../lib/shopify';

// Get 10 collections (default)
const collections = await getCollections();

// Get a specific number of collections
const collections = await getCollections(20);
```

### getProductsByCollection

Fetches products from a specific collection with pagination support.

```typescript
import { getProductsByCollection } from '../lib/shopify';

// Get first 10 products from a collection (default)
const result = await getProductsByCollection('collection-handle');

// Get a specific number of products
const result = await getProductsByCollection('collection-handle', 20);

// Get products with pagination
const result = await getProductsByCollection('collection-handle', 10, cursor);

// Access products and pagination info
const { products, pageInfo } = result;
const { hasNextPage, endCursor } = pageInfo;

// Load next page
if (hasNextPage) {
  const nextPage = await getProductsByCollection('collection-handle', 10, endCursor);
}
```

## Cart Functions

### createCart

Creates a new cart, optionally with initial items.

```typescript
import { createCart } from '../lib/shopify';

// Create an empty cart
const cart = await createCart();

// Create a cart with initial items
const cart = await createCart([
  { merchandiseId: 'variant-id', quantity: 1 }
]);
```

### getCart

Fetches a cart by ID.

```typescript
import { getCart } from '../lib/shopify';

// Get a cart by ID
const cart = await getCart('cart-id');
```

### addToCart

Adds items to an existing cart.

```typescript
import { addToCart } from '../lib/shopify';

// Add items to a cart
const updatedCart = await addToCart('cart-id', [
  { merchandiseId: 'variant-id', quantity: 1 }
]);
```

### updateCartLines

Updates the quantity of items in a cart.

```typescript
import { updateCartLines } from '../lib/shopify';

// Update item quantities
const updatedCart = await updateCartLines('cart-id', [
  { id: 'line-id', quantity: 2 }
]);
```

### removeFromCart

Removes items from a cart.

```typescript
import { removeFromCart } from '../lib/shopify';

// Remove items from a cart
const updatedCart = await removeFromCart('cart-id', ['line-id']);
```

### getCheckoutUrl

Gets the checkout URL for a cart.

```typescript
import { getCheckoutUrl } from '../lib/shopify';

// Get checkout URL
const checkoutUrl = await getCheckoutUrl('cart-id');

// Redirect to checkout
window.location.href = checkoutUrl;
```

## Testing

The Shopify API integration includes comprehensive testing utilities:

### Test Suite

The test suite is implemented in `src/tests/shopify.test.ts` and includes tests for all API functions.

```typescript
import { runAllTests } from '../tests/shopify.test';

// Run all tests
runAllTests().then(success => {
  console.log('All tests completed with status:', success ? 'SUCCESS' : 'FAILURE');
});
```

### Interactive Test UI

The interactive test UI is implemented in `src/components/ShopifyApiTester.tsx` and provides a user interface for running tests.

To access the test UI, navigate to `/shopify-test` in the browser.

The test UI allows you to:

- Run individual tests
- Run all tests at once
- View detailed test logs
- Test specific API functions

### Individual Test Functions

You can also run individual test functions:

```typescript
import {
  testShopifyConnection,
  testGetProducts,
  testGetCollections,
  testGetProductsByCollection,
  testGetProduct,
  testCartOperations,
  testErrorHandling
} from '../tests/shopify.test';

// Test the Shopify API connection
testShopifyConnection();

// Test getting products
testGetProducts();

// Test getting collections
testGetCollections();

// Test getting products by collection
testGetProductsByCollection('collection-handle');

// Test getting a product
testGetProduct('product-handle');

// Test cart operations
testCartOperations();

// Test error handling
testErrorHandling();
```

## Best Practices

1. **Error Handling**: Always handle errors properly using the provided error classes.
2. **Caching**: Use caching for read operations to improve performance, but disable caching for write operations.
3. **Pagination**: Use pagination for large collections of products to improve performance and user experience.
4. **Testing**: Run tests regularly to ensure the API integration is working correctly.
5. **Environment Variables**: Keep API credentials in environment variables and never commit them to version control.
