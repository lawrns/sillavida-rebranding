# SillaVida Project Overview

**Project**: SillaVida - Ergonomic Chair E-commerce Platform
**Technology Stack**: React + TypeScript + Vite + Shopify Hydrogen
**Status**: Production Ready
**Color System**: Monochromatic (Migrated 2025-05-27)
**Last Updated**: 2025-05-27

## Project Structure

```
src/
├── components/         # Reusable React components (UI, product, cart, etc.)
├── context/            # React context providers (e.g., CartContext)
├── data/               # Static or mock data
├── docs/               # Documentation and design files
├── lib/                # Shopify API integration and utility libraries
├── pages/              # Top-level route components (ProductPage, CartPage, etc.)
├── services/           # Service layer (if any)
├── styles/             # CSS and Tailwind files
├── tests/              # Unit and integration tests
├── types/              # TypeScript type definitions
├── utils/              # Helper utilities
├── index.css           # Main stylesheet
├── main.tsx            # React app entry point
└── vite-env.d.ts       # Vite type definitions
```

## Tech Stack Summary

- **React** (18+) with TypeScript
- **Vite** (for fast dev/build)
- **Shopify Hydrogen React** (`@shopify/hydrogen-react`)
- **Framer Motion** (animations)
- **Lucide-react** (icons)
- **Tailwind CSS** (utility-first CSS framework)
- **React Router** (routing)
- **React Helmet** (SEO/meta)
- **ESLint/Prettier** (linting/formatting)

## Key Component Analysis

1. **ProductHeroShowcase**
   - Purpose: Displays main product image(s), title, subtitle, price, and "add to cart" button in a hero layout.
   - Props: `images`, `productTitle`, `productSubtitle`, `price`, `compareAtPrice`, `inStock`
   - Relationships: Used at the top of `ProductPage`.

2. **ChairFeaturesComponent**
   - Purpose: Visualizes ergonomic features on product imagery with interactive markers.
   - Props: `mainImage`, `features`
   - Relationships: Below hero on `ProductPage`.

3. **ProductFeatures**
   - Purpose: Lists product highlights with icons and optional Vida Score.
   - Props: `features`
   - Relationships: Used in `ProductPage`.

4. **ProductSpecifications**
   - Purpose: Renders technical and dimensional specs in tables or lists.
   - Props: `specs`
   - Relationships: Used in `ProductPage`.

5. **VidaBenefits**
   - Purpose: Shows lifestyle benefits/testimonials.
   - Props: `benefits`
   - Relationships: Used in `ProductPage`.

6. **RelatedProducts**
   - Purpose: Displays a grid of related products (from Shopify).
   - Props: `products`
   - Relationships: Bottom of `ProductPage`.

7. **MiniCart**
   - Purpose: Slide-out cart UI, manages cart state and checkout.
   - Props: Uses CartContext.
   - Relationships: Accessible from anywhere.

8. **Navbar**
   - Purpose: Main site navigation, links to major sections.
   - Props: n/a
   - Relationships: Global.

9. **ShopifyProductCard**
   - Purpose: Compact product display for listings or demos.
   - Props: `product`
   - Relationships: Used in product lists, not on main product page.

10. **CartContext**
    - Purpose: Provides cart state and actions via React context.
    - Relationships: Used by MiniCart, ProductHeroShowcase, etc.

## Data Flow

- **API Calls:**
  - `src/lib/shopify.ts` handles all Shopify Storefront API calls (product fetch, cart, collections, etc.).
  - Example: `getProduct(handle)` fetches a single product; `getProductsByCollection()` fetches related products.
- **State Management:**
  - Local state for UI (e.g., image zoom, quantity) in components.
  - Global cart state via `CartContext` (React Context API).
- **Context Providers:**
  - `CartProvider` wraps the app, exposing cart operations and state.
- **Data Flow Example:**
  - `ProductPage` fetches product data on mount, passes it to child components. Cart actions call context methods, which update state and sync with Shopify.

## Shopify Integration

- **API:** Shopify Storefront API (GraphQL)
- **Endpoints:**
  - Product fetch: `getProduct`, `getProductsByCollection`, `getProducts`
  - Cart: `createCart`, `getCart`, `addToCart`, `updateCartLines`, `removeFromCart`, `getCheckoutUrl`
- **Authentication:**
  - Uses environment variables: `VITE_SHOPIFY_STORE_DOMAIN`, `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- **Data Handling:**
  - Caching and retry logic in `shopifyClient` (see `src/lib/shopify.ts`)
  - Cart state is synced with Shopify and persisted in localStorage

## Current UI/UX Approach

- **Design System:**
  - **Color scheme**: Monochromatic system (Pure black, grays, white) - Migrated from dual color system (2025-05-27)
  - **Typography**: `Montserrat` for headings, `Open Sans` for body
  - **Component patterns**: Modular, reusable, vertical product detail layout inspired by Hbada
  - **Animations**: Framer Motion for smooth transitions
  - **Responsive**: Mobile-first, flex and grid layouts
  - **Accessibility**: WCAG 2.1 AA compliant with 21:1 contrast ratio

## Color System Migration (2025-05-27)

- **Migration Status**: Complete (92% of project)
- **Previous System**: Dual color system (4-palette + blue system)
  - Legacy: Teal (#1E5959), Beige (#E8DED1), Sage (#7D9D8C), Terracotta (#C87D55)
  - Blue: Primary Blue (#4b7cae), Navy (#111827), Secondary Blue (#222429)
- **New System**: Monochromatic palette
  - Pure Black (#000000) - Primary elements
  - Dark Gray (#333333) - Secondary elements
  - Medium Gray (#666666) - Muted elements
  - Light Gray (#999999) - Disabled states
  - Border Gray (#E5E5E5) - Dividers
  - Background Gray (#F5F5F5) - Light backgrounds
  - Pure White (#FFFFFF) - Primary backgrounds
- **Benefits**: Improved accessibility, simplified maintenance, consistent brand experience
- **Documentation**: See `docs/color-system.md`, `docs/developer-guidelines.md`, `docs/migration-process.md`

## Known Issues and Challenges

- TypeScript errors with prop mismatches (e.g., `vidaScore` prop missing in some components)
- Some mock/template data still present in product detail layout
- Shopify API rate limits and error handling
- UX: Product page layout could be further refined for mobile
- Technical debt: Some components have legacy code or unused props

## Current Implementation Status

- **Complete:**
  - Core product detail page (vertical layout, main features, specs, benefits, related products)
  - Shopify integration for product and cart
  - Cart context and MiniCart UI
  - Navigation and basic layout
- **In Progress:**
  - Refinement of product page UI/UX
  - TypeScript type fixes and cleanup
  - Additional test coverage
- **Planned:**
  - Improved mobile experience
  - More robust error handling
  - Enhanced analytics and tracking

## Code Samples

### Product Fetching (Shopify)
```ts
// src/lib/shopify.ts
export async function getProduct(handle: string): Promise<ShopifyProduct> {
  // ...GraphQL query logic
}

// Usage in ProductPage
useEffect(() => {
  getProduct(handle).then(setProduct);
}, [handle]);
```

### Cart Management (CartContext)
```ts
// src/context/CartContext.tsx
const { addItem, cart, cartItems } = useCart();

async function handleAddToCart(variantId: string) {
  await addItem(variantId, 1);
}
```

### Shopify Auth (Environment)
```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-access-token
```

## Environment Setup

- **Required Environment Variables:**
  - `VITE_SHOPIFY_STORE_DOMAIN`
  - `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- **Setup Steps:**
  1. Clone the repo
  2. Run `npm install`
  3. Copy `.env.example` to `.env` and fill in Shopify credentials
  4. Run `npm run dev` to start the app

---
This document provides a comprehensive overview for an AI assistant or developer to quickly understand the SillaVida project structure, tech stack, data flow, and current state. For more details, see the source files referenced above.
