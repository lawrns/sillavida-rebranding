# Component Gap Analysis & Color Standardization

## Updated Color Palette

### Primary Colors
- **Dark Blue-Gray (Primary Dark)**: `#111827` (RGB: 17, 24, 39)
  - Use for: Footer backgrounds, section backgrounds, banners, headers, headings
- **Blue (Primary Accent)**: `#4b7cae` (RGB: 75, 124, 174)
  - Use for: Buttons, links, highlights, interactive elements
- **Light Blue**: `#6b9cce` (RGB: 107, 156, 206)
  - Use for: Hover states, secondary accents
- **Dark Blue**: `#3b6188` (RGB: 59, 97, 136)
  - Use for: Active states, text emphasis
- **Very Light Blue**: `#e6f0f9` (RGB: 230, 240, 249)
  - Use for: Background accents, hover backgrounds

### Neutral Colors
- **White**: `#FFFFFF` (RGB: 255, 255, 255)
  - Use for: Backgrounds, cards, text on dark backgrounds
- **Off-White/Light Gray**: `#F4F4F5` (RGB: 244, 244, 245)
  - Use for: Background colors, disabled states
- **Light Gray**: `#E6E6E6` (RGB: 230, 230, 230)
  - Use for: Borders, dividers
- **Medium Gray**: `#9A9A9A` (RGB: 154, 154, 154)
  - Use for: Secondary text, disabled text
- **Dark Gray**: `#4A4A4A` (RGB: 74, 74, 74)
  - Use for: Secondary text, borders

## Component-Specific Color Usage

### Dark Background Elements (Standardized to #111827)
- **Footer**: Update from current to `#111827`
- **ShippingPromoBanner**: Update from `#1a2b3c` to `#111827`
- **Dark Sections**: Maintain `#111827`
- **Navbar**: Keep white background with dark text

### Text Elements
- **Headers/Headings**: Maintain `#111827`
- **Testimonial Text**: Maintain `#111827`
- **Body Text**: Use `#111827` for better readability

### Accent Elements
- **Buttons/Links**: Maintain `#4b7cae` (Blue)
- **Indicators/Highlights**: Maintain `#4b7cae` (Blue) or `#111827` (Dark Blue-Gray)

## Required Component Updates

### ShippingPromoBanner
- Update background color from `#1a2b3c` to `#111827`
- Maintain blue accent color for links and highlights

### Other Sections
- Ensure all section backgrounds that should be dark are consistently using `#111827`
- Check for any instances of `#222429` or other dark colors and standardize to `#111827`

## CSS Variables Update Needed

```css
:root {
  /* Primary Colors - Updated to use #111827 */
  --color-primary: #111827; /* Dark Blue-Gray as primary */
  --color-primary-light: #4A4A4A; /* Medium Gray */
  --color-primary-dark: #000000; /* Darker Black */
  --color-primary-extralight: #F4F4F5; /* Very Light Gray */

  /* Accent Color - Blue */
  --color-accent: #4b7cae; /* Blue */
  --color-accent-light: #6b9cce; /* Lighter Blue */
  --color-accent-dark: #3b6188; /* Darker Blue */
  --color-accent-extralight: #e6f0f9; /* Very Light Blue */
}
```

## Implementation Notes
- When updating components, ensure text contrast remains accessible
- Maintain blue accent color for interactive elements
- Use `#111827` consistently for all major dark backgrounds
- Update any instances of `#1a2b3c` or `#222429` to `#111827` for consistency
