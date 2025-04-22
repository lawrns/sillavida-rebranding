# SillaVida Typography System

## Font Families

### Primary Fonts

- **Headings**: Montserrat
  - A modern, geometric sans-serif with clean lines
  - Professional appearance with good readability
  - Multiple weights available for hierarchy

- **Body Text**: Open Sans
  - Highly readable at various sizes
  - Neutral character that works well with Montserrat
  - Excellent cross-platform compatibility

- **Special Elements**: Playfair Display
  - Elegant serif for testimonials, quotes, and "Vida" elements
  - Creates contrast with the sans-serif fonts
  - Adds sophistication and premium feel

### Fallback Fonts

- **Sans-serif fallbacks**: Arial, Helvetica, sans-serif
- **Serif fallbacks**: Georgia, 'Times New Roman', serif

## Typography Scale

We'll use a modular scale with a ratio of 1.2 (minor third) for a professional, readable hierarchy:

| Level | Size (rem) | Use Case |
|-------|------------|----------|
| xs    | 0.75rem    | Small print, footnotes, legal text |
| sm    | 0.875rem   | Secondary text, captions |
| base  | 1rem       | Body text, form elements |
| lg    | 1.125rem   | Large body text, important information |
| xl    | 1.25rem    | Subheadings, section titles |
| 2xl   | 1.5rem     | H3 headings, card titles |
| 3xl   | 1.875rem   | H2 headings, section headers |
| 4xl   | 2.25rem    | H1 headings, page titles |
| 5xl   | 3rem       | Hero titles, major headings |
| 6xl   | 3.75rem    | Display headings, landing page heroes |

## Font Weights

| Weight | Value | Use Case |
|--------|-------|----------|
| Light  | 300   | Large headings, decorative text |
| Regular| 400   | Body text, general content |
| Medium | 500   | Emphasis, subheadings |
| SemiBold | 600 | Important headings, buttons |
| Bold   | 700   | Strong emphasis, primary headings |
| ExtraBold | 800 | Hero titles, very strong emphasis |

## Line Heights

| Type | Value | Use Case |
|------|-------|----------|
| Tight | 1.2  | Headings, display text |
| Normal | 1.5 | Body text, general content |
| Relaxed | 1.75 | Long-form content, blog posts |
| Loose | 2.0 | Emphasized paragraphs, quotes |

## Letter Spacing

| Type | Value | Use Case |
|------|-------|----------|
| Tighter | -0.05em | Large headings |
| Tight | -0.025em | Headings |
| Normal | 0 | Body text, general content |
| Wide | 0.025em | All caps text, buttons |
| Wider | 0.05em | Small caps, labels |

## Usage Guidelines

### Headings

- **H1 (Page Titles)**: Montserrat, 2.25rem (4xl), Bold (700), tight line-height (1.2)
- **H2 (Section Headers)**: Montserrat, 1.875rem (3xl), SemiBold (600), tight line-height (1.2)
- **H3 (Subsections)**: Montserrat, 1.5rem (2xl), SemiBold (600), tight line-height (1.2)
- **H4 (Card Titles)**: Montserrat, 1.25rem (xl), Medium (500), tight line-height (1.2)
- **H5 (Small Sections)**: Montserrat, 1.125rem (lg), Medium (500), tight line-height (1.2)
- **H6 (Minor Titles)**: Montserrat, 1rem (base), Medium (500), tight line-height (1.2)

### Body Text

- **Primary Body**: Open Sans, 1rem (base), Regular (400), normal line-height (1.5)
- **Secondary Body**: Open Sans, 0.875rem (sm), Regular (400), normal line-height (1.5)
- **Large Body**: Open Sans, 1.125rem (lg), Regular (400), normal line-height (1.5)
- **Small Print**: Open Sans, 0.75rem (xs), Regular (400), normal line-height (1.5)

### Special Elements

- **Testimonials**: Playfair Display, 1.25rem (xl), Regular (400), relaxed line-height (1.75)
- **Quotes**: Playfair Display, 1.5rem (2xl), Regular (400), relaxed line-height (1.75)
- **"Vida" Elements**: Playfair Display, varies by context, Italic, normal line-height (1.5)

### Buttons & Navigation

- **Primary Buttons**: Montserrat, 1rem (base), SemiBold (600), wide letter-spacing (0.025em)
- **Secondary Buttons**: Montserrat, 1rem (base), Medium (500), wide letter-spacing (0.025em)
- **Navigation Items**: Montserrat, 0.875rem (sm), Medium (500), normal letter-spacing (0)
- **Breadcrumbs**: Open Sans, 0.75rem (xs), Regular (400), normal letter-spacing (0)

### Component-Specific Typography

- **Product Titles**: Montserrat, 1.25rem (xl), SemiBold (600), tight line-height (1.2)
- **Product Prices**: Montserrat, 1.125rem (lg), Bold (700), tight line-height (1.2)
- **Product Descriptions**: Open Sans, 1rem (base), Regular (400), normal line-height (1.5)
- **Form Labels**: Montserrat, 0.875rem (sm), Medium (500), normal line-height (1.5)
- **Form Inputs**: Open Sans, 1rem (base), Regular (400), normal line-height (1.5)
- **Footer Text**: Open Sans, 0.875rem (sm), Regular (400), normal line-height (1.5)

## Responsive Adjustments

### Mobile (< 640px)

- Reduce heading sizes by one step (e.g., 4xl → 3xl)
- Body text remains at 1rem for readability
- Increase line-height slightly for better readability on small screens

### Tablet (640px - 1024px)

- Reduce largest heading sizes by one step (5xl and 6xl only)
- All other typography remains the same as desktop

### Desktop (> 1024px)

- Use the full typography scale as defined

## Accessibility Considerations

- Ensure sufficient color contrast (minimum 4.5:1 for normal text, 3:1 for large text)
- Maintain a minimum body text size of 16px (1rem)
- Avoid using font weight below 400 for body text
- Ensure line heights are sufficient for readability
- Use relative units (rem) for scalability
- Test with screen readers to ensure proper heading hierarchy

## Implementation Notes

- Use CSS variables for all typography values
- Implement responsive typography using media queries
- Consider using the `clamp()` function for fluid typography
- Optimize font loading with appropriate font-display settings
- Consider using font subsets for faster loading
- Test typography across different browsers and devices
