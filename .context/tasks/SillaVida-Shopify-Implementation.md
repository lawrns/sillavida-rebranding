---
title: SillaVida Shopify Implementation
type: documentation
status: completed
created: 2025-05-15
updated: 2025-05-27
id: SHOPIFY-IMPL-DOC
priority: reference
tags: [shopify, e-commerce, integration, headless]
---

# SillaVida Shopify Implementation

This document provides a comprehensive overview of the Shopify integration in the SillaVida project, including architecture, setup steps, implementation details, and best practices.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Setup Process](#setup-process)
4. [API Integration](#api-integration)
5. [Data Flow](#data-flow)
6. [Cart Functionality](#cart-functionality)
7. [Checkout Process](#checkout-process)
8. [Environment Configuration](#environment-configuration)
9. [Testing](#testing)
10. [Deployment](#deployment)

## Overview

The SillaVida project uses a headless Shopify implementation, which means it leverages Shopify as the backend e-commerce platform while maintaining full control over the frontend user experience. This approach allows for:

- Custom UI/UX design that matches the SillaVida brand
- Improved performance through optimized frontend code
- Greater flexibility in the development process
- Seamless integration with other systems and services

## Architecture

### High-Level Architecture

The SillaVida Shopify integration follows a headless architecture with these key components:

- **Frontend**: React + Vite application
- **Backend**: Shopify (products, inventory, orders, payments)
- **API Layer**: Shopify Storefront API (GraphQL)
- **State Management**: React Context API for cart and checkout

### Key Components

1. **Shopify Client**: `src/lib/shopify.ts` - Handles all API calls to Shopify
2. **Cart Context**: `src/context/CartContext.tsx` - Manages cart state and operations
3. **Product Types**: `src/types/shopify.ts` - TypeScript interfaces for Shopify data
4. **API Cache**: `src/services/apiCache.ts` - Caching mechanism for API responses

## Setup Process

1. **Shopify Store Setup**
   - Create a Shopify account at shopify.com
   - Choose a plan with Storefront API access
   - Configure products, collections, variants, shipping, taxes, and payment methods

2. **API Access Configuration**
   - Create a private app in Shopify admin
   - Generate Storefront API access token
   - Set appropriate permissions for the API token

3. **Environment Configuration**
   - Create `.env` file with required variables:
     ```
     VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
     VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-access-token
     ```

4. **Project Setup**
   - Clone the repository
   - Install dependencies with `npm install`
   - Configure environment variables
   - Start development server with `npm run dev`

## API Integration

### Shopify Client

The Shopify client (`src/lib/shopify.ts`) provides a wrapper around the Shopify Storefront API with enhanced functionality:

- Error handling with custom error classes
- Retry logic for failed requests
- Caching mechanism for improved performance
- Timeout handling for API requests

```typescript
// Example of the Shopify client configuration
const storefrontConfig: StorefrontClientProps = {
  storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN,
  publicStorefrontToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  apiVersion: '2024-01',
};

const client = createStorefrontClient(storefrontConfig);
```

### Key API Functions

1. **Product Functions**
   - `getProduct(handle)`: Fetches a single product by handle
   - `getProducts(first, after)`: Fetches multiple products with pagination
   - `getProductsByCollection(collectionHandle, first, after)`: Fetches products in a collection

2. **Collection Functions**
   - `getCollections(first, after)`: Fetches collections with pagination
   - `getCollection(handle)`: Fetches a single collection by handle

3. **Cart Functions**
   - `createCart(lines)`: Creates a new cart, optionally with initial items
   - `getCart(cartId)`: Fetches a cart by ID
   - `addToCart(cartId, lines)`: Adds items to an existing cart
   - `updateCartLines(cartId, lines)`: Updates quantities of items in a cart
   - `removeFromCart(cartId, lineIds)`: Removes items from a cart
   - `getCheckoutUrl(cartId, isGuestCheckout)`: Gets the checkout URL for a cart

## Data Flow

### Product Data Flow

1. User navigates to a product page
2. Component calls `getProduct(handle)` from `shopify.ts`
3. API request is made to Shopify Storefront API
4. Response is cached and returned to the component
5. Component renders product data

Example:
```typescript
// Usage in ProductPage
useEffect(() => {
  getProduct(handle).then(setProduct);
}, [handle]);
```

### Cart Data Flow

1. User adds a product to cart
2. Component calls `addItem` from `CartContext`
3. `CartContext` calls `addToCart` from `shopify.ts`
4. API request is made to Shopify Storefront API
5. Cart state is updated in `CartContext`
6. UI components re-render with updated cart data

Example:
```typescript
// Usage in a component
const { addItem } = useCart();

async function handleAddToCart(variantId: string) {
  await addItem(variantId, 1);
}
```

## Cart Functionality

### Cart Context

The `CartContext` (`src/context/CartContext.tsx`) provides a central place for managing cart state and operations:

- Cart state (items, total, count)
- Cart operations (add, update, remove, clear)
- Cart UI state (open/close)
- Checkout functionality

### Cart Persistence

Cart data is persisted using:
- Shopify's cart API for server-side persistence
- localStorage for client-side persistence of the cart ID

### Mock Cart Fallback

The implementation includes a mock cart fallback mechanism that creates a mock cart when the Shopify API fails, ensuring the user experience is not disrupted by API issues.

## Checkout Process

The checkout process follows these steps:

1. User reviews cart and clicks "Checkout"
2. Application navigates to `/checkout` route
3. `CheckoutRedirect` component is rendered
4. User chooses between guest checkout or account checkout
5. `getCheckout` function from `CartContext` is called
6. `getCheckoutUrl` function from `shopify.ts` is called
7. User is redirected to Shopify's checkout page
8. After checkout completion, user is redirected back to the application

## Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SHOPIFY_STORE_DOMAIN` | Shopify store domain | `your-store.myshopify.com` |
| `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API token | `shpat_1234567890abcdef` |

### Deployment Environment Variables

For Netlify deployment, environment variables are set in the Netlify dashboard or using the Netlify CLI.

## Testing

### Test Plan

The Shopify integration includes a comprehensive test plan covering:

1. **Unit Tests**: Testing individual API functions
2. **Integration Tests**: Testing the interaction between components
3. **End-to-End Tests**: Testing the complete user journey

### Test Environments

1. **Development**: Local environment for initial testing
2. **Staging**: Pre-production environment for final testing
3. **Production**: Live environment for monitoring and validation

## Deployment

### Netlify Deployment

The SillaVida application is deployed to Netlify with the following configuration:

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Environment Variables**: Set in Netlify dashboard
4. **Redirects**: Configured in `netlify.toml` for SPA routing

### Deployment Checklist

- Verify all environment variables are set
- Run tests to ensure functionality
- Build the application locally to check for errors
- Deploy to staging environment for final testing
- Deploy to production environment
- Verify functionality in production
