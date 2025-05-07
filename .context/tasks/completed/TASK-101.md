---
title: Implement Hbada Design Tokens & Tailwind Theme
type: task
status: completed
created: 2025-05-06T14:03:22-06:00
updated: 2025-05-06T14:41:59-06:00
id: TASK-101
priority: high
memory_types: [procedural, semantic]
dependencies: []
tags: [design, theme, tailwind]
---

# Implement Hbada Design Tokens & Tailwind Theme

## Description
Extract and establish a single source of truth for the Hbada design system from reference screenshots (C:\Users\oscar\Desktop\screenshots hbada). Define the colour palette, typography scale, spacing rhythm, border-radius values, and shadow tokens. Integrate these tokens into Tailwind's configuration and global CSS variables, removing all legacy teal/beige/terracotta references.

## Objectives
- Analyze Hbada reference screenshots to extract exact design values.
- Create Tailwind theme extension with Hbada tokens.
- Register tokens as CSS variables via `@layer base`.
- Replace hard-coded legacy colours, font families, and spacing with token references.
- Document token usage in the project README.
- Perform targeted research via context7 MCP to confirm best Tailwind/React patterns for implementing extracted tokens.

## Steps
1. Visit live Hbada links (landing, product page, collection) and observe colour values and component behaviour.
2. Review all Hbada reference screenshots in C:\Users\oscar\Desktop\screenshots hbada.
3. Use color picker and measurement tools to extract exact hex codes, font sizes, spacing values, and other design elements.
4. Run context7 MCP search for Tailwind configuration examples matching required tokens (e.g., extending theme with CSS variables).
5. Document findings in a design tokens document.
6. Audit `tailwind.config.js` and global CSS for legacy palette values.
7. Define Hbada colour palette, typography scale, spacing, radii, shadows in Tailwind theme.
8. Extend Tailwind theme and regenerate styles.
9. Add sample component/page to validate tokens compile correctly.
10. Grep codebase for legacy palette tokens and replace with Hbada tokens.
11. Commit changes and open PR for review.

## Progress
- ✅ Created comprehensive design tokens document at `.context/specs/hbada-design-tokens.md`
- ✅ Analyzed Hbada screenshots and reference site to extract exact colors, typography, spacing and other design values
- ✅ Updated Tailwind configuration in `tailwind.config.js` with Hbada color palette:
  - Primary: #d71920 (red)
  - Secondary: #222429 (dark gray/black)
  - Neutrals: white, grays, black
- ✅ Extended Tailwind with spacing, shadows, and typography from Hbada design system
- ✅ Updated CSS variables in `src/index.css` with the new Hbada design system tokens
- ✅ Added Inter font from Google Fonts CDN to replace Montserrat/Roboto to match Hbada's typography
- ✅ Created HbadaStylesDemo component to showcase and test all design tokens
- ✅ Added route to view design system at `/design-system`
- ✅ All legacy teal/beige/terracotta colors are now replaced with Hbada's red/black/white palette

## Dependencies
- None

## Test Status
- Status: Completed
- Validation: HbadaStylesDemo component demonstrates all tokens working correctly

## Notes
Token names should mirror Figma design system for traceability. Use a consistent method to measure and extract values from screenshots.

## Next Steps
- Move TASK-102 from planned to active to begin applying these tokens to all components
- Reference `.context/specs/hbada-design-tokens.md` when styling components
