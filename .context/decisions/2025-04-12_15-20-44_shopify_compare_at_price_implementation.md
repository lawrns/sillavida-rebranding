---
title: Shopify Compare-at Price Implementation Decisions
type: decision
created: 2025-04-12T15:20:44-06:00
updated: 2025-04-12T15:20:44-06:00
tags: [shopify, compare-at-price, product-display, discount, ui-design]
---

# Shopify Compare-at Price Implementation Decisions

## Context
The e-commerce site needs to display Shopify's "Compare-at price" information in product cards, showing the original price as a striked-out amount alongside the current price. This is a standard e-commerce pattern that helps customers understand the value they're getting with discounted products.

## Decision Drivers
- Need to clearly show price savings to customers
- Maintain consistent UI design across the application
- Ensure proper data fetching from Shopify API
- Handle cases where products don't have compare-at prices
- Follow e-commerce best practices for displaying discounts

## Decisions

### 1. Data Model Updates
- Added `compareAtPriceRange` field to the `ShopifyProduct` interface
- Added `compareAtPrice` field to the product variant nodes
- Made these fields optional with `?` operator since not all products will have compare-at prices

### 2. GraphQL Query Updates
- Updated all product-related GraphQL queries to fetch compare-at price information:
  - `getProducts`
  - `getProductsByCollection`
  - `getProductsByTag`
  - `getProduct` (including variant-level compare-at prices)
- Used the same structure for compare-at price as regular price for consistency

### 3. UI Implementation
- Display compare-at price in a smaller, gray, striked-out font next to the current price
- Only show compare-at price if it exists and is higher than the current price
- Calculate and display discount percentage when a valid compare-at price exists
- Use green color for discount percentage to highlight savings
- Maintain the existing price display style for consistency

### 4. Technical Implementation
- Used optional chaining and nullish checks to handle products without compare-at prices
- Added helper variables in the component to:
  - Check if a product has a valid compare-at price
  - Parse and format the compare-at price
  - Calculate the discount percentage
- Used the minVariantPrice from compareAtPriceRange to match how the current price is displayed

## Alternatives Considered

### Alternative UI Approaches
- **Badge-based approach**: Using a "Sale" or "X% Off" badge instead of showing the original price
  - *Rejected* because showing the actual price comparison provides more transparency
- **Separate line for prices**: Showing the compare-at price on a separate line above the current price
  - *Rejected* for space efficiency, especially in grid layouts

### Alternative Data Approaches
- **Calculating discounts on the server**: Having the API return pre-calculated discount percentages
  - *Rejected* because client-side calculation provides more flexibility and reduces API complexity
- **Using variant-level prices only**: Only showing compare-at prices at the variant level
  - *Rejected* because we need to show compare-at prices in product listings before variant selection

## Consequences

### Positive
- Customers can clearly see the value they're getting with discounted products
- Consistent implementation across all product displays
- Robust handling of products with and without compare-at prices
- Follows e-commerce best practices for price display

### Negative
- Slightly increased data transfer due to additional fields in API responses
- More complex UI logic to handle conditional display
- Need to ensure all product queries include the compare-at price fields

## Follow-up Actions
- Test the compare-at price display with actual discounted products from Shopify
- Consider adding a visual indicator (like a badge) for products with significant discounts
- Implement the compare-at price display in other components that show product information
- Update the ProductPage component to also display the compare-at price information
