---
title: Implement SillaVida Typography Refresh
type: task
status: active
created: 2025-04-17T23:18:30
updated: 2025-04-18T12:27:13-06:00
id: TASK-041
priority: high
memory_types: [procedural, semantic]
dependencies: []
tags: [redesign, visual-identity, typography, fonts, branding]
---

# Implement SillaVida Typography Refresh

## Description
This task involves refreshing the typography across the SillaVida website to align with the new "investing in yourself" theme and "Vida" concept. The current typography uses Arial to match the logo, but the redesign calls for a more sophisticated and modern font combination that evokes wellness, professionalism, and quality. This typography refresh will complement the color palette transformation and serve as a key component of the visual identity update.

## Objectives
- Replace the current font (Arial) with Montserrat for headings
- Implement Open Sans for body text to improve readability
- Add Playfair Display for testimonials, quotes, and special "Vida" elements
- Create a comprehensive typography system with appropriate sizes, weights, and line heights
- Implement the new typography through CSS variables for consistency
- Ensure all components adapt to the new typography
- Maintain readability and accessibility across all device sizes
- Optimize font loading for performance

## Steps
1. Create a typography system document defining all fonts, sizes, weights, and usage contexts
2. Add the new font imports to the project (Google Fonts or self-hosted)
3. Update the global CSS variables to define the new typography settings
4. Create a typography scale with appropriate sizes for different heading levels
5. Define line heights, letter spacing, and font weights for different contexts
6. Update the Navbar component to use Montserrat for navigation items
7. Modify heading styles throughout the site to use Montserrat
8. Update body text styles to use Open Sans
9. Implement Playfair Display for testimonials and special elements
10. Adjust spacing and layout to accommodate the new typography
11. Create special typography treatments for the "Vida" portion of text elements
12. Optimize font loading with appropriate font-display settings
13. Consider adding font subsets to improve loading performance
14. Test typography across different browsers and devices
15. Verify readability and accessibility on mobile devices

## Progress
- Task created based on the SillaVida redesign implementation plan
- Task moved from planned to active status
- TASK-040 (Color Palette Transformation) completed successfully

## Dependencies
- TASK-040 (Color Palette Transformation) - Completed

## Test Status
- Status: Not Started
- Test Files: None yet

## Notes
- The current typography uses Arial to match the logo
- The new typography should evoke wellness, professionalism, and quality
- All components must be updated to use the new typography
- CSS variables should be used for easy maintenance and consistency
- The typography should work with both existing components and new Shopify components
- Special attention should be paid to maintaining readability on mobile devices
- Consider font performance implications (loading times, FOUT/FOIT)
- The typography refresh should be implemented in a way that doesn't disrupt the ongoing Shopify integration
- This task is part of Phase 1 (Foundation) of the SillaVida redesign implementation plan

## Next Steps
- Create the typography system document
- Add the new font imports to the project
- Update the global CSS variables
- Begin implementing the new typography in key components
