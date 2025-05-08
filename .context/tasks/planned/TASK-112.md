---
title: Create Judge.me Integration Documentation
type: task
status: planned
created: 2025-05-07T15:46:13-06:00
updated: 2025-05-07T15:46:13-06:00
id: TASK-112
priority: low
memory_types: [procedural, semantic]
dependencies: [TASK-107, TASK-108, TASK-109, TASK-110, TASK-111]
tags: [judge.me, integration, documentation]
---

# Create Judge.me Integration Documentation

## Description
Create comprehensive documentation for the Judge.me integration to ensure maintainability and facilitate future widget implementations. The documentation will cover the integration architecture, component usage, and common issues for future developers.

## Objectives
- Document the Judge.me integration architecture and design decisions
- Provide usage examples for all Judge.me components
- Create troubleshooting guide for common integration issues
- Document future integration possibilities and enhancements

## Steps
1. Create a documentation file in the project specs directory:
   ```
   .context/specs/judge_me_integration.md
   ```

2. Document the integration architecture:
   ```markdown
   # Judge.me Integration Documentation

   ## Architecture Overview

   The Judge.me integration follows a modular, service-oriented approach that separates concerns between script loading, state management, and UI components.

   ### Key Components

   1. **JudgeMeService**
      - Located in `src/services/judgeMe/`
      - Responsible for script loading and Judge.me API interactions
      - Provides methods for widget refreshing and data retrieval

   2. **useJudgeMe Hook**
      - Located in `src/hooks/useJudgeMe.ts`
      - Provides React components with access to Judge.me functionality
      - Manages loading and error states

   3. **JudgeMeContext**
      - Located in `src/context/JudgeMeContext.tsx`
      - Provides global Judge.me state to the entire application
      - Handles global script initialization

   4. **Judge.me UI Components**
      - Located in `src/components/judgeMe/`
      - Reusable, styled component wrappers for Judge.me widgets
      - Handle loading, error states, and integration with our design system

   ### Integration Flow

   1. The Judge.me script is initialized in `main.tsx` (or via `initializeThirdParty.ts`)
   2. The JudgeMeContext provides global loading state to the application
   3. Components use the useJudgeMe hook to access Judge.me functionality
   4. UI components provide a React interface to Judge.me widgets

   ## Configuration

   Judge.me is configured with the following parameters:

   - **Shop Domain**: `sbz5wk-e9.myshopify.com`
   - **Platform**: `shopify`
   - **Public Token**: `CmgUOrdFZ2WZCDoTpirgmdavI4c`

   These values are centralized in the JudgeMeService for easy updates.
   ```

3. Document usage examples for the components:
   ```markdown
   ## Component Usage

   ### ReviewStars Component

   Used to display the star rating for a product.

   ```tsx
   import { ReviewStars } from '../components/judgeMe';

   const ProductInfo = ({ product }) => {
     return (
       <div className="product-info">
         <h1>{product.title}</h1>
         <ReviewStars
           productId={product.id}
           className="mb-4"
           size="medium"
           showEmpty={false}
         />
         <p className="price">${product.price}</p>
       </div>
     );
   };
   ```

   #### Props

   | Prop | Type | Default | Description |
   |------|------|---------|-------------|
   | productId | string | required | Shopify product ID |
   | className | string | '' | Additional CSS classes |
   | size | 'small' \| 'medium' \| 'large' | 'medium' | Size of the stars |
   | showEmpty | boolean | true | Whether to show when no reviews exist |
   | autoLoad | boolean | true | Auto-load Judge.me script |

   ### ReviewsWidget Component

   Used to display the full reviews widget for a product.

   ```tsx
   import { ReviewsWidget } from '../components/judgeMe';

   const ProductReviews = ({ product }) => {
     return (
       <div className="product-reviews">
         <h2>Customer Reviews</h2>
         <ReviewsWidget
           productId={product.id}
           productHandle={product.handle}
           className="mt-4"
         />
       </div>
     );
   };
   ```

   #### Props

   | Prop | Type | Default | Description |
   |------|------|---------|-------------|
   | productId | string | required | Shopify product ID |
   | productHandle | string | undefined | Shopify product handle |
   | shopDomain | string | undefined | Shop domain (if different from default) |
   | className | string | '' | Additional CSS classes |
   | autoLoad | boolean | true | Auto-load Judge.me script |

   ### ReviewsBadge Component

   Used to display the store's overall review badge.

   ```tsx
   import { ReviewsBadge } from '../components/judgeMe';

   const Footer = () => {
     return (
       <footer>
         <div className="trust-indicators">
           <ReviewsBadge className="mx-auto" />
         </div>
       </footer>
     );
   };
   ```

   #### Props

   | Prop | Type | Default | Description |
   |------|------|---------|-------------|
   | className | string | '' | Additional CSS classes |
   | autoLoad | boolean | true | Auto-load Judge.me script |
   ```

4. Create a troubleshooting guide:
   ```markdown
   ## Troubleshooting

   ### Common Issues

   #### Judge.me Script Fails to Load

   **Symptoms:**
   - JudgeMeContainer shows error state
   - Console errors related to Judge.me

   **Possible Causes:**
   - Network issues
   - Invalid shop domain or token
   - Content blockers or CSP issues

   **Solutions:**
   - Check browser console for specific errors
   - Verify shop domain and token in the JudgeMeService
   - Ensure network connectivity
   - Check for Content Security Policy issues

   #### Widgets Don't Appear

   **Symptoms:**
   - Judge.me script loads successfully but widgets are empty

   **Possible Causes:**
   - Incorrect product ID or handle
   - Judge.me cache issues
   - Missing or invalid data attributes

   **Solutions:**
   - Verify product IDs match Shopify IDs
   - Check for any JavaScript errors in console
   - Try refreshing widgets manually via the API
   - Ensure product has reviews in Judge.me dashboard

   #### Performance Issues

   **Symptoms:**
   - Page loading slows down significantly
   - UI freezes when Judge.me loads

   **Solutions:**
   - Use lazy loading for reviews (only load when scrolled into view)
   - Optimize Judge.me widget rendering
   - Consider using SSR for initial product data including review counts
   ```

5. Document future enhancements:
   ```markdown
   ## Future Enhancements

   ### Additional Widget Integration

   The following Judge.me widgets could be integrated in the future:

   1. **Verified Reviews Carousel**
      - Can be added to the homepage
      - Showcases recent reviews across all products

   2. **All Reviews Page**
      - Dedicated page showing all store reviews
      - Filterable by product, rating, etc.

   3. **Question & Answer Widget**
      - Community Q&A functionality for products
      - Requires additional configuration in Judge.me

   ### Performance Optimizations

   1. **Server-Side Integration**
      - Fetch review data during SSR for improved SEO
      - Avoid layout shifts during page load

   2. **Review Data Caching**
      - Cache review data in localStorage for returning visitors
      - Implement a smart refresh strategy

   3. **Lazy Loading**
      - Only load full review content when scrolled into view
      - Use IntersectionObserver for efficient detection

   ### UI/UX Improvements

   1. **Custom Review Form**
      - Replace default Judge.me form with custom styled version
      - Better integration with our design system

   2. **Interactive Review Filters**
      - Add custom filtering UI for reviews
      - Allow sorting by recent, highest/lowest rating, etc.
   ```

## Progress
- [ ] Create documentation file structure
- [ ] Document integration architecture
- [ ] Provide component usage examples with prop tables
- [ ] Create troubleshooting guide
- [ ] Document future enhancement possibilities

## Dependencies
- TASK-107 (Create Judge.me Script Manager Service)
- TASK-108 (Create useJudgeMe React Hook)
- TASK-109 (Implement Global Judge.me Script Initialization)
- TASK-110 (Create Judge.me UI Components)
- TASK-111 (Integrate Judge.me Components in Product Page)

## Test Status
- Status: Not Applicable
- Test Files: None

## Notes
- Comprehensive documentation is crucial for maintainability of third-party integrations
- The documentation should be written for future developers who may not be familiar with Judge.me
- Consider including screenshots of the integration in the documentation
- Keep the documentation updated as the integration evolves

## Next Steps
- Add more Judge.me widgets as needed for the store
