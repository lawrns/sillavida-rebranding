---
title: Shopify Promo Banner Color Update
type: session
created: 2025-04-21T20:45:58
updated: 2025-04-21T20:45:58
tags: [update, shopify-promo-banner, color-palette, visual-consistency]
---

# Shopify Promo Banner Color Update

## Focus
- Updating the background color and text colors of the ShopifyPromoBanner component
- Changing the background from dark teal to beige
- Changing the text color from beige to sage

## Context
- The ShopifyPromoBanner component was using a dark teal background (`bg-[#1E5959]`) with beige text (`text-[#E8DED1]`)
- This component is used in the "Featured Products Banners" section of the HomePage to display the "Oficina X" and "Ergonomica X" products
- The request was to change the color scheme to:
  1. Change the background from dark teal to beige
  2. Change the title and text color from beige to sage
  3. Keep the button color as sage (already correct)

## Progress
- Updated the ShopifyPromoBanner.tsx file to:
  - Change the background color from `bg-[#1E5959]` to `bg-[#E8DED1]`
  - Change the title color from `text-[#E8DED1]` to `text-[#7D9D8C]`
  - Change the feature list text color from `text-[#E8DED1]` to `text-[#7D9D8C]`
  - Change the price text color from `text-[#E8DED1]` to `text-[#7D9D8C]`
  - Change the loading and error message text color from `text-[#E8DED1]` to `text-[#7D9D8C]`
  - Kept the button color as `bg-[#7D9D8C]` with `text-[#E8DED1]` (already correct)

## Decisions
- Used the existing color values from the design system
- Maintained the same layout and structure of the component
- Kept the same background patterns (vida-bg-pattern-leaf and vida-bg-pattern-breathing)
- Kept the "Campeón de Ventas" badge with the same colors (already correct)
- Kept the strikeout price as terracota (already correct)

## Self-Improvement
- This update demonstrates the importance of:
  - Visual consistency across components
  - Following design requirements precisely
  - Making targeted changes to specific elements
  - Maintaining the same structure while updating colors

## Dependencies
- No dependencies were affected by this update
- The change is purely visual and does not affect functionality

## Next Steps
- Test the updated component to ensure it looks good in all contexts
- Consider updating other components to use the same color scheme for consistency

## Notes
- The beige background with sage text provides a softer, more elegant look
- This change complements the other visual updates to the site
- The terracota strikeout price now stands out more against the beige background
