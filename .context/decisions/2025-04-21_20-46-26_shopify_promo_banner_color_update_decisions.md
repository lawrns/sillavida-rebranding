---
title: Shopify Promo Banner Color Update Decisions
type: decision
created: 2025-04-21T20:46:26
updated: 2025-04-21T20:46:26
tags: [update, shopify-promo-banner, color-palette, visual-consistency]
---

# Shopify Promo Banner Color Update Decisions

## Context
The ShopifyPromoBanner component was using a dark teal background (`bg-[#1E5959]`) with beige text (`text-[#E8DED1]`). This component is used in the "Featured Products Banners" section of the HomePage to display the "Oficina X" and "Ergonomica X" products. The current color scheme was inconsistent with the desired visual style for the site.

## Decision
We have decided to:

1. Change the background color of the ShopifyPromoBanner component from `bg-[#1E5959]` (dark teal) to `bg-[#E8DED1]` (beige)
2. Change the title color from `text-[#E8DED1]` (beige) to `text-[#7D9D8C]` (sage)
3. Change the feature list text color from `text-[#E8DED1]` (beige) to `text-[#7D9D8C]` (sage)
4. Change the price text color from `text-[#E8DED1]` (beige) to `text-[#7D9D8C]` (sage)
5. Change the loading and error message text color from `text-[#E8DED1]` (beige) to `text-[#7D9D8C]` (sage)
6. Keep the button color as `bg-[#7D9D8C]` with `text-[#E8DED1]` (already correct)
7. Keep the "Campeón de Ventas" badge with the same colors (already correct)
8. Keep the strikeout price as terracota (already correct)

This decision was made to create a more consistent visual style across the site and to match the design requirements.

## Rationale
1. **Visual Consistency**: Using a consistent color scheme across similar components creates a more cohesive visual identity across the site.

2. **Brand Identity**: The beige and sage colors are part of the site's primary color palette and are used for important elements throughout the site.

3. **Contrast and Readability**: The sage text on beige background provides good contrast for readability while maintaining a softer, more elegant look.

4. **User Experience**: Consistent visual patterns help users understand the site's structure and content more easily, improving the overall user experience.

## Alternatives Considered
1. **Keep the dark teal background**: We could have maintained the existing background color, but this would have been inconsistent with the design requirements.

2. **Use a different color combination**: We could have chosen different colors from the site's palette, but the beige background with sage text was specifically requested.

3. **Apply a gradient or pattern**: We could have added a more complex background treatment, but this would have been inconsistent with the clean, simple design of the product cards.

## Impact
- **Visual Design**: The site now has a more consistent visual style, with product banners using a beige background and sage text.
- **User Experience**: Users will experience a more cohesive design throughout the site.
- **Brand Identity**: The consistent use of the beige and sage colors reinforces the brand identity.

## Related Decisions
- The ProductCardSimple color update (2025-04-21_20-39-43_product_card_color_update_decisions.md)
- The testimonial carousel background update (2025-04-21_20-33-17_testimonial_carousel_background_update_decisions.md)
- The color palette transformation decisions (2025-04-18_03-51-54_color_palette_transformation_decisions.md)

## Follow-up Actions
1. Continue to look for opportunities to improve visual consistency across the site
2. Consider updating other components to use the same color palette
3. Monitor user feedback to ensure the new design is well-received

## Notes
- This change is part of the ongoing effort to create a more cohesive visual identity for the site
- The beige background with sage text provides a softer, more elegant look
- This change complements the other visual updates to the site
