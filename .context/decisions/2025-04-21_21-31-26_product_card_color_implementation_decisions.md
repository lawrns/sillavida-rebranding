---
title: Product Card Color Implementation Decisions
type: decision
created: 2025-04-21T21:31:26
updated: 2025-04-21T21:31:26
---

# Product Card Color Implementation Decisions

## Context

During the implementation of the updated color palette for the SillaVida website, we encountered issues with the Tailwind CSS custom color classes not rendering correctly in the ProductCardSimple component. Specifically, the "Campeón de Ventas" badge and "Ver Producto" button were still displaying with beige text instead of the intended terracotta color.

## Decision Details

1. **Direct Hex Value Implementation**
   - We decided to use direct hex color values (`text-[#C87D55]`) instead of Tailwind custom color classes (`text-terracotta`)
   - This approach ensures consistent rendering across different browsers and environments
   - The hex value #C87D55 corresponds to the terracotta color defined in our color system

2. **Background Color Consistency**
   - Maintained the sage background color for both elements to preserve design consistency
   - This creates a visually appealing contrast between the background and text

3. **Component-Specific Approach**
   - Applied this solution specifically to the ProductCardSimple component
   - This targeted approach allows us to address the immediate issue without disrupting other components

## Rationale

- **Reliability**: Direct hex values provide more reliable rendering than custom Tailwind classes when there might be configuration issues
- **Consistency**: Ensures visual consistency with the design system's color palette
- **Maintainability**: While inline styles are generally less maintainable, in this case, the direct hex approach provides a clear and explicit color reference that won't be affected by potential Tailwind configuration issues

## Implications

- **Short-term**: Immediate fix for the color rendering issue in the ProductCardSimple component
- **Medium-term**: May need to review other components for similar issues and apply consistent solutions
- **Long-term**: Should evaluate if the Tailwind configuration needs updates to properly recognize custom color classes

## Related Decisions

- Color palette transformation decisions (2025-04-18)
- Component color palette update decisions (2025-04-21)

## Status

Implemented and verified through browser testing.
