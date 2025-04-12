---
title: Route Pattern Standardization
type: decision
created: 2025-04-12T15:37:00-06:00
updated: 2025-04-12T15:37:00-06:00
tags: [routing, shopify, frontend]
---

# Route Pattern Standardization

## Context
- The application uses React Router for navigation
- CategoryPage component is set up to handle Shopify collections using the route `/category/:handle` as defined in App.tsx
- In HomePage.tsx, links were using `/collections/:handle`, which doesn't match the route defined in App.tsx
- This inconsistency would cause navigation issues when users click on category links

## Decision
We will standardize all category links in the application to use the `/category/:handle` route pattern to match the route defined in App.tsx. This includes:

1. All dynamic collection links in the Featured Categories section
2. All static fallback category links
3. The "Ver Todos" link in the Best Sellers section

## Rationale
- Consistency in route patterns is essential for proper navigation throughout the application
- The CategoryPage component is already set up to handle the `/category/:handle` route pattern
- Changing the route in App.tsx would require more extensive changes across the application
- Standardizing on `/category/:handle` aligns with the existing route structure

## Alternatives Considered
1. **Change the route in App.tsx to `/collections/:handle`**: This would require updating the route definition in App.tsx and potentially other components that rely on this route pattern.
2. **Create a redirect from `/collections/:handle` to `/category/:handle`**: This would add complexity to the routing configuration and could impact performance.

## Implementation Details
- Update all instances of `/collections/` to `/category/` in HomePage.tsx
- No changes needed to App.tsx or CategoryPage.tsx as they already use the correct route pattern

## Consequences
- **Positive**: Consistent navigation throughout the application
- **Positive**: Users will be directed to the correct page when clicking on category links
- **Negative**: None identified

## Follow-up Actions
- Test the navigation to ensure all category links work correctly
- Consider adding a unit test to verify route consistency in the future
