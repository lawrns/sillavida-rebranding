---
title: Component Color Palette Update Decisions
type: decision
created: 2025-04-21T18:48:32
updated: 2025-04-21T18:48:32
tags: [color-palette, redesign, UI, components, product-cards, category-cards]
---

# Component Color Palette Update Decisions

## Context
The website is undergoing a redesign with a new color palette focused on natural, wellness-oriented colors. Several components still used hardcoded color values or older color schemes that didn't align with the new design direction. The TestimonialCarousel component was recently updated to match the new color palette, and now other components needed similar updates for visual consistency.

## Decision
We decided to update the following components to match the redesign color palette:

1. **ProductCardSimple Component**
   - Replace hardcoded color values with theme color variables
   - Use `bg-teal` for the background instead of `bg-[#1E5959]`
   - Use `text-beige` for text instead of `text-[#E8DED1]`
   - Use `bg-sage` for buttons instead of `bg-[#7D9D8C]`
   - Improve hover states with `hover:bg-sage-light` instead of opacity changes

2. **ProductCard Component**
   - Change the background from `bg-white` to `bg-beige-light` for a warmer feel
   - Maintain other color elements that were already using theme variables

3. **Category Cards in HomePage**
   - Apply consistent styling across all category cards
   - Use `from-teal-dark/80` for gradient overlays instead of `from-black/70`
   - Use `text-beige` for text instead of `text-white`
   - Use `text-sage-light` for links instead of mixed colors like `text-teal-light` or `text-red-400`

## Rationale
1. **Consistency**: Creating a unified visual language across all components strengthens brand identity and improves user experience.

2. **Maintainability**: Using theme color variables instead of hardcoded values makes future updates easier and reduces the risk of inconsistencies.

3. **Brand Identity**: The new color palette with beige, sage, and teal tones creates a more natural, wellness-focused aesthetic that aligns with the brand's focus on ergonomic chairs and wellness products.

4. **Accessibility**: The new color combinations maintain good contrast while creating a softer, more inviting look.

5. **Visual Hierarchy**: Using consistent colors for specific elements (beige for backgrounds, sage for interactive elements, teal for important text) helps users understand the interface more intuitively.

## Alternatives Considered
1. **Partial Update**: We considered only updating the most visible components, but decided a comprehensive update would provide better consistency.

2. **Different Color Assignments**: We explored using teal for buttons and sage for backgrounds, but the current arrangement provides better visual hierarchy and aligns better with the brand's natural, wellness-focused identity.

3. **Keeping Some Accent Colors**: We considered keeping the red accents for the Gamer category, but decided that consistency across all categories would create a more cohesive look.

## Impact
- **Visual Consistency**: All components now share a consistent color language
- **Brand Reinforcement**: The natural color palette strengthens the wellness-focused brand identity
- **Maintenance**: Future color updates will be easier with theme variables
- **User Experience**: The consistent use of colors for specific elements improves usability

## Related Decisions
- [Testimonial Carousel Color Palette Update Decisions](2025-04-21_18-42-48_testimonial_carousel_color_palette_update_decisions.md)
- [Color Palette Transformation Decisions](2025-04-18_03-51-54_color_palette_transformation_decisions.md)
- [Footer Color Palette Decisions](2025-04-21_18-02-37_footer_color_palette_decisions.md)

## Follow-up Actions
- Monitor user feedback on the new color scheme
- Consider applying similar updates to any remaining components
- Update the design documentation to reflect the new color usage patterns
- Ensure all new components follow the established color guidelines
