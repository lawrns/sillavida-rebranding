---
title: Typography Refresh Implementation Decisions
type: decision
created: 2025-04-18T12:50:10-06:00
updated: 2025-04-18T12:50:10-06:00
---

# Typography Refresh Implementation Decisions

## Context

As part of the SillaVida redesign to align with the new "investing in yourself" theme and "Vida" concept, we needed to refresh the typography across the website. This involved replacing the current Arial font with a more sophisticated and modern font combination.

## Key Decisions

### 1. Font Family Selection

**Decision:** Use Montserrat for headings, Open Sans for body text, and Playfair Display for special elements.

**Rationale:**
- Montserrat provides a modern, geometric look that conveys professionalism and clarity for headings
- Open Sans offers excellent readability for body text with a clean, neutral appearance
- Playfair Display adds a touch of elegance and sophistication for special elements, particularly for the "Vida" concept
- This combination creates a clear typographic hierarchy while maintaining visual harmony

**Alternatives Considered:**
- Roboto + Lato: Too common and lacks distinctiveness
- Poppins + Source Sans Pro: Good alternative but Montserrat better aligns with the brand's geometric aesthetic
- Merriweather + Open Sans: Merriweather was too traditional for the modern direction

### 2. Typography Scale

**Decision:** Implement a modular scale with a ratio of 1.2 (minor third) for font sizes, ranging from 0.75rem (12px) to 3.75rem (60px).

**Rationale:**
- A modular scale creates mathematical harmony in the typography
- The minor third ratio (1.2) provides enough distinction between sizes without dramatic jumps
- The range from 0.75rem to 3.75rem covers all necessary use cases from small labels to large headlines
- Using rem units ensures scalability and accessibility

**Alternatives Considered:**
- Major third ratio (1.25): Too dramatic for the professional aesthetic
- Perfect fourth ratio (1.33): Too large of a jump between sizes
- Fixed pixel values: Less accessible and adaptable

### 3. Implementation Approach

**Decision:** Create a comprehensive CSS variables system with utility classes.

**Rationale:**
- CSS variables provide a centralized way to manage typography values
- Utility classes make it easy to apply consistent typography across components
- This approach makes future updates easier and more consistent
- Follows the same pattern used for the color palette transformation

**Alternatives Considered:**
- Tailwind configuration: Would require more setup and potential conflicts
- Inline styles: Would lead to inconsistency and maintenance issues
- SCSS mixins: Would add complexity without significant benefits

### 4. Component-Specific Typography

**Decision:** Create specialized typography variables and classes for specific components and elements.

**Rationale:**
- Different components have different typography needs
- Component-specific variables ensure consistency within component types
- Specialized classes like `product-title` and `product-price` make the code more semantic
- This approach balances consistency with flexibility

**Alternatives Considered:**
- Generic classes only: Would not address component-specific needs
- Completely custom typography per component: Would lead to inconsistency

### 5. Responsive Typography

**Decision:** Implement responsive typography adjustments using media queries.

**Rationale:**
- Typography needs to be readable on all devices
- Smaller screens need proportionally adjusted typography
- Using media queries allows for targeted adjustments at specific breakpoints
- This approach ensures optimal reading experience across devices

**Alternatives Considered:**
- Fluid typography with viewport units: Too unpredictable across different devices
- No responsive adjustments: Would lead to poor readability on mobile devices

## Impact

These decisions have resulted in a more sophisticated and cohesive typography system that:

1. Enhances the visual identity of the SillaVida brand
2. Improves readability and user experience
3. Creates a clear typographic hierarchy
4. Aligns with the new "investing in yourself" theme and "Vida" concept
5. Provides a flexible and maintainable foundation for future design work

## Next Steps

1. Complete the implementation across all remaining pages
2. Test the typography across different browsers and devices
3. Verify readability and accessibility
4. Create a typography verification document
5. Consider creating a centralized design system document that combines color and typography

## Related Documents

- [Typography System Document](../../src/styles/typography-system.md)
- [Typography CSS File](../../src/styles/typography.css)
- [Color Palette Transformation Decisions](./2025-04-18_03-51-54_color_palette_transformation_decisions.md)
