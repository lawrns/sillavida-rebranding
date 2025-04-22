---
title: Footer Image Fix Decisions
type: decision
created: 2025-04-21T17:59:45
updated: 2025-04-21T17:59:45
tags: [bugfix, ui, images, footer]
---

# Footer Image Fix Decisions

## Context
Several images in the footer section of the HomePage component were not displaying correctly because the image files were missing. The broken images were in the SEGURIDAD, FORMAS DE PAGO, and ENVÍO sections.

## Decision
We decided to replace the missing image references with styled divs and Lucide React icons instead of creating new image files. This approach provides several benefits:

1. **Maintainability**: The solution doesn't rely on external image files that could be lost or corrupted.
2. **Performance**: Using CSS and SVG icons reduces HTTP requests and improves page load time.
3. **Consistency**: Lucide React icons are already being used throughout the application, maintaining design consistency.
4. **Accessibility**: Text labels with appropriate colors provide better accessibility than image-only solutions.

## Implementation Details

### SEGURIDAD Section
- Replaced Google and Procon logo images with styled divs containing Star and Shield icons
- Used appropriate brand colors (yellow for Google star, blue for Procon shield)
- Added text labels to ensure users understand what each icon represents

### FORMAS DE PAGO Section
- Replaced payment method logo images with styled text divs
- Used appropriate brand colors for each payment method (blue for Visa, red for Mastercard, etc.)
- Used text labels instead of complex SVG logos for simplicity and clarity

### ENVÍO Section
- Replaced the transportadora logo image with a styled div containing a Truck icon
- Used a clean, simple design that matches the aesthetic of the rest of the footer

## Alternatives Considered
1. **Creating new image files**: This would have required design work and would have added more files to the project.
2. **Using external CDN for payment logos**: This would have added external dependencies and potential security/privacy concerns.
3. **Using complex SVG logos**: This would have increased code complexity without significant visual benefits.

## Impact
- Improved visual consistency in the footer section
- Eliminated broken image references
- Enhanced maintainability of the codebase
- Slightly improved performance by reducing HTTP requests

## Follow-up Actions
- Consider creating a dedicated PaymentMethodIcon component if payment icons are used in multiple places
- Document the approach for future reference
