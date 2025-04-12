---
title: Implement Shopify Compare-at Price Display
type: task
status: completed
created: 2025-04-12T15:21:18-06:00
updated: 2025-04-12T15:22:00-06:00
id: TASK-017
priority: medium
memory_types: [procedural, semantic]
dependencies: [TASK-004, TASK-005, TASK-007]
tags: [shopify, compare-at-price, product-display, discount, ui]
---

# Implement Shopify Compare-at Price Display

## Description
Implement the display of Shopify's "Compare-at price" information in product cards, showing the original price as a striked-out amount alongside the current price. This is a standard e-commerce pattern that helps customers understand the value they're getting with discounted products.

## Objectives
- Update the data model to include compare-at price information
- Modify GraphQL queries to fetch compare-at price data from Shopify
- Enhance the product card UI to display compare-at prices when available
- Calculate and show discount percentages for products with compare-at prices
- Ensure graceful handling of products without compare-at prices

## Steps
1. Update the ShopifyProduct type to include compareAtPriceRange and compareAtPrice fields
2. Modify the GraphQL queries in the Shopify API implementation to fetch compare-at price data:
   - Update getProducts query
   - Update getProductsByCollection query
   - Update getProductsByTag query
   - Update getProduct query to include compareAtPrice for variants
3. Enhance the ShopifyProductCard component to:
   - Check if a product has a compare-at price
   - Parse and format the compare-at price
   - Calculate the discount percentage
   - Display the compare-at price as a striked-out amount next to the current price
   - Show the discount percentage when applicable
4. Test the implementation with products that have and don't have compare-at prices
5. Document the changes in a session save and decision document

## Progress
- [x] Updated ShopifyProduct type with compareAtPriceRange and compareAtPrice fields
- [x] Modified GraphQL queries to fetch compare-at price data
- [x] Enhanced ShopifyProductCard component to display compare-at prices
- [x] Added discount percentage calculation and display
- [x] Documented changes in session save and decision document

## Dependencies
- TASK-004: API & Authentication Setup for Headless Shopify
- TASK-005: Implement Product Catalog Pages
- TASK-007: Shopify Product Card Component

## Notes
- The compare-at price should only be displayed if it exists and is higher than the current price
- The discount percentage is calculated as (1 - (currentPrice / compareAtPrice)) * 100
- The compare-at price should be formatted with the same currency as the current price
- This implementation enhances the shopping experience by clearly showing the savings customers get

## Next Steps
- Test the compare-at price display with actual discounted products from Shopify
- Consider adding a visual indicator (like a badge) for products with significant discounts
- Implement the compare-at price display in other components that show product information
- Update the ProductPage component to also display the compare-at price information
