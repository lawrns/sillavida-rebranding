# Hbada Design System Tokens

## Color Palette

### Primary Colors
- **Black (Primary)**: `#222429` (HSL: 240° 10% 15%)
- **Black - Dark**: `#000000` (HSL: 0° 0% 0%)
- **Gray - Medium**: `#4A4A4A` (HSL: 0° 0% 29%)
- **White**: `#FFFFFF` (HSL: 0° 0% 100%)

### Accent Colors
- **Red (Brand Accent)**: `#d71920` (HSL: 356° 75% 45%)
- **Light Red**: `#FF5A5F` (HSL: 358° 100% 68%)
- **Dark Red**: `#B71419` (HSL: 356° 80% 40%)

### Neutral Colors
- **White**: `#FFFFFF` (HSL: 0° 0% 100%)
- **Off-White/Light Gray**: `#F4F4F5` (HSL: 240° 4% 96%)
- **Light Gray**: `#E6E6E6` (HSL: 0° 0% 90%)
- **Medium Gray**: `#9A9A9A` (HSL: 0° 0% 60%)
- **Dark Gray**: `#4A4A4A` (HSL: 0° 0% 29%)
- **Darker Gray**: `#222429` (HSL: 240° 10% 15%)
- **Black**: `#000000` (HSL: 0° 0% 0%)

## Typography

### Font Families
- **Headings**: 'Inter', system-ui, sans-serif
- **Body**: 'Inter', system-ui, sans-serif

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Font Sizes
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)
- **5xl**: 3rem (48px)

### Line Heights
- **tight**: 1.2
- **normal**: 1.5
- **relaxed**: 1.75

## Spacing

### Base Spacing Units
- **3xs**: 0.25rem (4px)
- **2xs**: 0.5rem (8px)
- **xs**: 0.75rem (12px)
- **sm**: 1rem (16px)
- **md**: 1.5rem (24px)
- **lg**: 2rem (32px)
- **xl**: 3rem (48px)
- **2xl**: 4rem (64px)

## Borders & Radii

### Border Widths
- **hairline**: 1px
- **thin**: 2px
- **thick**: 4px

### Border Radii
- **none**: 0
- **sm**: 0.125rem (2px)
- **md**: 0.25rem (4px)
- **lg**: 0.5rem (8px)
- **xl**: 1rem (16px)
- **full**: 9999px

## Shadows

### Elevation Shadows
- **xs**: `0 1px 2px rgba(0, 0, 0, 0.05)`
- **sm**: `0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)`
- **md**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- **lg**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
- **xl**: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
- **2xl**: `0 25px 50px -12px rgba(0, 0, 0, 0.25)`

## Transitions & Animations

### Duration
- **fast**: 150ms
- **normal**: 300ms
- **slow**: 500ms

### Easing
- **default**: cubic-bezier(0.4, 0, 0.2, 1)
- **in**: cubic-bezier(0.4, 0, 1, 1)
- **out**: cubic-bezier(0, 0, 0.2, 1)
- **in-out**: cubic-bezier(0.4, 0, 0.2, 1)

## Layout

### Container Widths
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Z-Index Scale
- **0**: 0
- **10**: 10 (Base elements)
- **20**: 20 (Elevated elements)
- **30**: 30 (Overlays)
- **40**: 40 (Modals/Dialogs)
- **50**: 50 (Toasts/Notifications)
- **auto**: auto

## Usage Guidelines

### Color Usage
- **Primary Black**: Use for primary actions, main text, headers, footers
- **Accent Red**: Use for highlights, call-to-actions, accents, and branding elements
- **White**: Use for backgrounds, cards, containers
- **Grays**: Use for borders, dividers, muted backgrounds, disabled states

### Typography Usage
- Use Inter for all text (both headings and body)
- Use weight variations to create hierarchy rather than many different fonts
- Maintain consistent line heights within content sections

### Spacing Guidelines
- Use consistent spacing throughout the interface
- Prefer the defined spacing tokens rather than custom values
- Maintain consistent component padding and margins

### Component Styling
- Buttons: Black for primary, white for secondary, red for accent/tertiary
- Cards: White with subtle shadows (xs or sm)
- Inputs: Minimal styling with red accent for focus states
- Product cards: Clean white backgrounds with minimal borders
