---
title: Category Cards Color Update Decisions
type: decision
created: 2025-04-21T18:52:57
updated: 2025-04-21T18:52:57
tags: [color-palette, redesign, UI, components, category-cards]
---

# Category Cards Color Update Decisions

## Context
The website is undergoing a redesign with a new color palette focused on natural, wellness-oriented colors. While the category cards in the HomePage component had already been updated to use the new color palette for some elements, additional color changes were needed to fully align with the design direction. The user specifically requested changes to the text colors within the category cards.

## Decision
We decided to update the following elements in the category cards:

1. **Main Section Title "Nuestras Categorías"**
   - Changed from default black text to dark teal (`text-teal-dark`)
   - This creates a stronger visual hierarchy and aligns with other section titles

2. **Category Descriptions**
   - Changed from default black text to terracota (`text-terracota`)
   - Applied to all six category descriptions in both dynamic and static cards
   - Examples: "Elegancia y confort para ejecutivos", "Diseñadas para tu bienestar", etc.

3. **Category Titles**
   - Changed from default black text to beige (`text-beige`)
   - Applied to all six category titles in both dynamic and static cards
   - Examples: "Sillas Ejecutivas", "Sillas Ergonómicas", "Sillas Gamer", etc.

4. **Maintained Existing Colors**
   - Kept "Ver colección" links in sage-light (`text-sage-light`) for consistency with other interactive elements

## Rationale
1. **Visual Hierarchy**: The dark teal section title creates a clear hierarchy, helping users scan and navigate the page more effectively.

2. **Color Harmony**: The terracota descriptions complement the beige titles and create a warm, inviting feel that aligns with the brand's wellness focus.

3. **Consistency**: Using the same colors for similar elements across the site (dark teal for section titles, terracota for descriptive text, beige for prominent text on dark backgrounds, sage for interactive elements) creates a cohesive visual language.

4. **Accessibility**: The chosen colors maintain good contrast ratios while creating a softer, more natural aesthetic.

5. **Brand Identity**: The natural color palette with teal, beige, sage, and terracota tones reinforces the brand's focus on wellness and ergonomics.

## Alternatives Considered
1. **Using Sage for Descriptions**: We considered using sage for the descriptions, but terracota provides better contrast and adds a warm accent that draws attention to the descriptive text.

2. **Using Beige for Section Title**: We considered using beige for the main section title, but dark teal provides better contrast against the white background and creates a stronger visual hierarchy.

3. **Using Terracota for Category Titles**: We considered using terracota for the category titles, but beige provides better contrast against the teal-dark gradient background.

## Impact
- **Visual Consistency**: All category cards now share a consistent color language with the rest of the site
- **Brand Reinforcement**: The natural color palette strengthens the wellness-focused brand identity
- **User Experience**: The consistent use of colors for specific elements improves usability and creates a more intuitive interface
- **Aesthetic Appeal**: The warm terracota accents add visual interest and create a more inviting feel

## Related Decisions
- [Component Color Palette Update Decisions](2025-04-21_18-48-32_component_color_palette_update_decisions.md)
- [Testimonial Carousel Color Palette Update Decisions](2025-04-21_18-42-48_testimonial_carousel_color_palette_update_decisions.md)
- [Color Palette Transformation Decisions](2025-04-18_03-51-54_color_palette_transformation_decisions.md)

## Follow-up Actions
- Monitor user feedback on the new color scheme
- Consider applying similar color updates to any remaining components
- Update the design documentation to reflect the new color usage patterns
- Ensure all new components follow the established color guidelines
