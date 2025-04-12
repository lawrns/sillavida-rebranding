---
title: Landing Page Shopify Integration Approach
type: decision
created: 2025-04-11T22:06:07-06:00
updated: 2025-04-11T22:06:07-06:00
tags: [shopify, landing-page, frontend, headless, ui]
---

# Landing Page Shopify Integration Approach

## Context

As part of TASK-009, we need to integrate Shopify product data into the existing landing page while maintaining full control over the design and layout. The goal is to dynamically display featured products, collections, and promotions from Shopify on the landing page without compromising the current design and branding of the Silla Vida website.

## Current State

The current landing page (`HomePage.tsx`) uses static data from the `chairs.ts` file to display:

1. Featured product banners (using the `PromoBanner` component)
2. Best sellers section (using the `ProductCard` component)
3. Category sections with static images and links

The `ProductCard` component already has some integration with Shopify through mock variant IDs, but it's not using real Shopify data. There's also a `ShopifyProductCard` component that's designed to work with Shopify product data, but it's not currently used on the landing page.

## Decision

We will implement a hybrid approach to integrate Shopify product data into the landing page:

1. **Featured Products Banners**: Replace the static featured products with dynamic data from Shopify
   - Create a new `ShopifyPromoBanner` component based on the existing `PromoBanner` component
   - Fetch featured products from Shopify using the `getProducts` function with appropriate filters
   - Display the featured products using the new component

2. **Best Sellers Section**: Replace the static best sellers with dynamic data from Shopify
   - Fetch best-selling products from Shopify using the `getProducts` function with appropriate sorting
   - Use the existing `ShopifyProductCard` component to display the products
   - Maintain the same layout and design as the current best sellers section

3. **Category Sections**: Keep the static category sections for now
   - The category sections are primarily navigational and don't need to display dynamic product data
   - We'll keep the existing static images and links for these sections

4. **Performance Optimization**:
   - Implement server-side rendering or static generation for the landing page to improve performance
   - Use caching for Shopify API calls to reduce load times
   - Implement lazy loading for images to improve initial page load time

## Implementation Details

### ShopifyPromoBanner Component

We'll create a new `ShopifyPromoBanner` component that accepts a Shopify product instead of a Chair:

```typescript
interface ShopifyPromoBannerProps {
  product: ShopifyProduct;
  dark?: boolean;
}
```

The component will adapt the Shopify product data to match the format expected by the UI:

- `product.title` will be used for the name
- `product.description` will be used for the description
- `product.priceRange.minVariantPrice` will be used for the price
- `product.images.edges[0].node.url` will be used for the image
- We'll need to extract features from product tags or metafields

### Fetching Featured Products

We'll fetch featured products from Shopify using the `getProducts` function with appropriate filters:

```typescript
// In HomePage.tsx
const [featuredOfficeChair, setFeaturedOfficeChair] = useState<ShopifyProduct | null>(null);
const [featuredGamingChair, setFeaturedGamingChair] = useState<ShopifyProduct | null>(null);

useEffect(() => {
  const fetchFeaturedProducts = async () => {
    try {
      // Fetch office chairs
      const officeChairs = await getProductsByCollection('office-chairs', 1);
      if (officeChairs.products.length > 0) {
        setFeaturedOfficeChair(officeChairs.products[0]);
      }
      
      // Fetch gaming chairs
      const gamingChairs = await getProductsByCollection('gaming-chairs', 1);
      if (gamingChairs.products.length > 0) {
        setFeaturedGamingChair(gamingChairs.products[0]);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };
  
  fetchFeaturedProducts();
}, []);
```

### Fetching Best Sellers

We'll fetch best-selling products from Shopify using the `getProducts` function with appropriate sorting:

```typescript
// In HomePage.tsx
const [bestSellers, setBestSellers] = useState<ShopifyProduct[]>([]);

useEffect(() => {
  const fetchBestSellers = async () => {
    try {
      const products = await getProducts(6);
      setBestSellers(products);
    } catch (error) {
      console.error('Error fetching best sellers:', error);
    }
  };
  
  fetchBestSellers();
}, []);
```

### Fallback to Static Data

To ensure the landing page always displays something, even if the Shopify API is unavailable, we'll implement fallbacks to the static data:

```typescript
// In HomePage.tsx
const staticBestSellers = chairs.slice(0, 8);
const staticFeaturedOfficeChair = chairs.find(chair => chair.id === 'ergopro-elite')!;
const staticFeaturedGamingChair = chairs.find(chair => chair.id === 'xgamer-pro')!;

// Use static data as fallback
const displayedBestSellers = bestSellers.length > 0 ? bestSellers : staticBestSellers;
const displayedFeaturedOfficeChair = featuredOfficeChair || staticFeaturedOfficeChair;
const displayedFeaturedGamingChair = featuredGamingChair || staticFeaturedGamingChair;
```

## Alternatives Considered

1. **Full Shopify Integration**: Replace all static content with dynamic Shopify data
   - Pros: Fully dynamic content, single source of truth
   - Cons: More complex, potential performance issues, less control over design

2. **Minimal Shopify Integration**: Only integrate product data where absolutely necessary
   - Pros: Simpler implementation, better performance
   - Cons: Less dynamic content, potential inconsistencies between static and dynamic data

3. **Custom CMS Integration**: Use a custom CMS for the landing page content
   - Pros: More control over content structure, better performance
   - Cons: Additional complexity, need to maintain another system

## Conclusion

The hybrid approach provides a good balance between dynamic content and performance. By integrating Shopify product data into the featured products and best sellers sections, we can provide up-to-date product information while maintaining the design and layout of the landing page. The static category sections provide a stable navigation structure that doesn't need to be dynamic.

This approach also allows for a gradual transition to a more fully integrated Shopify experience in the future, if desired.

## Next Steps

1. Create the `ShopifyPromoBanner` component
2. Update the `HomePage` component to fetch and display Shopify product data
3. Implement fallbacks to static data
4. Test the integration with the Shopify API
5. Optimize performance with caching and lazy loading
