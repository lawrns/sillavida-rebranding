---
title: Hero Slider Cart Functionality
type: decision
status: approved
created: 2025-04-12T16:18:39-06:00
updated: 2025-04-12T16:18:39-06:00
tags: [cart, ui, functionality]
---

# Hero Slider Cart Functionality

## Context
The "COMPRAR AHORA" (Buy Now) button in the HeroSlider component was not functional. When users clicked on it, nothing happened, and products were not added to the cart. This was inconsistent with the behavior of the "Agregar al Carrito" (Add to Cart) buttons in the ProductCard components, which correctly added items to the cart.

## Decision
1. Add cart functionality to the HeroSlider component:
   - Import the useCart hook from the CartContext
   - Add state variables for loading and success states
   - Create a handleAddToCart function to add the current slide's product to the cart
   - Add mock Shopify variant IDs for the slider products
   - Update the "COMPRAR AHORA" button to call the handleAddToCart function when clicked
   - Add visual feedback for loading and success states

## Alternatives Considered
1. **Link to product page**: Instead of adding directly to cart, we could have made the button link to the product detail page where users could then add to cart. This would provide more information before purchase but adds an extra step.
2. **Quick view modal**: We could have implemented a quick view modal that shows more product details and then allows adding to cart. This would provide more information without leaving the page but adds complexity.
3. **No change**: We could have left the button as a visual element without functionality, but this would be confusing to users who expect the button to work.

## Rationale
- The "COMPRAR AHORA" button should have the same core functionality as the "Agregar al Carrito" buttons elsewhere in the application
- Direct add-to-cart from the hero slider provides a streamlined shopping experience for featured products
- Visual feedback (loading and success states) helps users understand that their action was successful
- Consistent behavior across the application improves user experience and reduces confusion
- This implementation follows the same pattern as the ProductCard component, making the code more maintainable

## Implications
- Positive: Users can now add featured products to their cart directly from the hero slider
- Positive: The shopping experience is more streamlined for featured products
- Positive: The application behavior is more consistent
- Negative: Users might add products to cart without seeing all details, potentially leading to cart adjustments later

## Related Decisions
- This decision is related to the overall cart implementation in the application

## Status
Approved and implemented

## Follow-up Actions
1. Consider adding analytics tracking for hero slider cart additions
2. Consider adding a quick view option for users who want more information before adding to cart
3. Add this component to the UI testing plan in TASK-020
