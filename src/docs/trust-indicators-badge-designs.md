# Trust Indicators Badge Designs

This document outlines the design specifications for the trust indicator badges that will be used across the SillaVida website. These badges are designed to visually communicate the wellness-focused trust messaging defined in the trust messaging framework.

## Design Principles

1. **Wellness-Focused**: Each badge should visually communicate wellness and wellbeing
2. **Consistent with Vida Theme**: Badges should incorporate elements of the "Vida" theme
3. **Clear and Recognizable**: Badges should be immediately recognizable as trust indicators
4. **Emotionally Resonant**: Designs should evoke positive emotions related to trust and wellbeing
5. **Accessible**: Designs should meet accessibility standards for color contrast and readability

## Color Palette

The badges will use colors from the SillaVida color palette:

- **Primary**: Teal (`#0D9488`) - For primary trust elements and icons
- **Secondary**: Sage (`#7D9D8C`) - For secondary elements and backgrounds
- **Accent**: Warm Terracotta (`#E07A5F`) - For highlighting key elements
- **Background**: Soft Cream (`#F8F5F2`) - For badge backgrounds
- **Text**: Dark Gray (`#333333`) - For primary text
- **Text Secondary**: Medium Gray (`#666666`) - For secondary text

## Typography

- **Headings**: Font-heading, Medium (500) weight, 16px
- **Body Text**: Font-body, Regular (400) weight, 14px
- **Badge Labels**: Font-heading, Medium (500) weight, 12px

## Badge Designs

### 1. Garantía de Bienestar (Wellbeing Guarantee)

**Base Icon**: Shield
**Wellness Element**: Leaf integrated into the shield design

**Design Specifications**:
- Shield shape with rounded corners (8px radius)
- Teal outline (2px)
- Soft cream background
- Small leaf element integrated into the top of the shield
- "Garantía de Bienestar" text in font-heading, medium weight
- "Respaldamos tu inversión en bienestar" text in font-body, regular weight

**Hover State**:
- Subtle scale increase (1.05)
- Soft shadow (0 4px 6px rgba(0, 0, 0, 0.1))
- Slight brightness increase on the teal elements

**Variations**:
- **Large**: For product pages (48px height)
- **Medium**: For cart page (40px height)
- **Small**: For mini cart and mobile (32px height)

### 2. Envío Consciente (Mindful Shipping)

**Base Icon**: Truck
**Wellness Element**: Flowing path/journey line with small leaf

**Design Specifications**:
- Rounded rectangle shape (8px radius)
- Teal outline (2px)
- Soft cream background
- Truck icon with a flowing path/journey line extending behind it
- Small leaf element at the end of the path
- "Envío Consciente" text in font-heading, medium weight
- "Tu camino hacia el bienestar comienza ahora" text in font-body, regular weight

**Hover State**:
- Subtle scale increase (1.05)
- Soft shadow (0 4px 6px rgba(0, 0, 0, 0.1))
- Slight animation of the flowing path (subtle wave effect)

**Variations**:
- **Large**: For product pages (48px height)
- **Medium**: For cart page (40px height)
- **Small**: For mini cart and mobile (32px height)

### 3. Pago Sereno (Serene Payment)

**Base Icon**: Credit Card
**Wellness Element**: Gentle wave pattern representing serenity

**Design Specifications**:
- Rounded rectangle shape (8px radius)
- Teal outline (2px)
- Soft cream background
- Credit card icon with gentle wave pattern overlay
- "Pago Sereno" text in font-heading, medium weight
- "Invierte en ti mismo con total tranquilidad" text in font-body, regular weight

**Hover State**:
- Subtle scale increase (1.05)
- Soft shadow (0 4px 6px rgba(0, 0, 0, 0.1))
- Slight animation of the wave pattern (subtle pulse effect)

**Variations**:
- **Large**: For product pages (48px height)
- **Medium**: For cart page (40px height)
- **Small**: For mini cart and mobile (32px height)

### 4. Compromiso Vida (Life Commitment)

**Base Icon**: Heart or Handshake
**Wellness Element**: Circular "Vida" pattern surrounding the icon

**Design Specifications**:
- Circular shape
- Teal outline (2px)
- Soft cream background
- Heart or handshake icon in the center
- Circular pattern of small leaf elements surrounding the icon
- "Compromiso Vida" text in font-heading, medium weight
- "Más que una compra, una inversión en tu calidad de vida" text in font-body, regular weight

**Hover State**:
- Subtle scale increase (1.05)
- Soft shadow (0 4px 6px rgba(0, 0, 0, 0.1))
- Slight rotation of the circular pattern (subtle spin effect)

**Variations**:
- **Large**: For product pages (48px height)
- **Medium**: For cart page (40px height)
- **Small**: For mini cart and mobile (32px height)

## Badge Layout

### Product Page Layout

```
[Icon] Heading
     Description
```

Example:
```jsx
<div className="flex items-center gap-3">
  <div className="relative">
    <Shield className="h-6 w-6 text-teal" />
    <div className="absolute top-0 right-0 w-3 h-3">
      <LeafIcon className="w-full h-full text-sage" />
    </div>
  </div>
  <div>
    <h4 className="font-heading font-medium">Garantía de Bienestar</h4>
    <p className="text-sm text-gray-600 font-body">Respaldamos tu inversión en bienestar por 12 meses</p>
  </div>
</div>
```

### Cart Page Layout

```
[Icon with Wellness Element]
     Heading
     Description
```

Example:
```jsx
<motion.div 
  className="p-4 border border-gray-200 rounded-lg bg-soft-cream"
  whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
  transition={{ duration: 0.2 }}
>
  <div className="flex flex-col items-center text-center gap-2">
    <div className="relative">
      <Shield className="h-8 w-8 text-teal" />
      <div className="absolute top-0 right-0 w-4 h-4">
        <LeafIcon className="w-full h-full text-sage" />
      </div>
    </div>
    <h4 className="font-heading font-medium">Garantía de Bienestar</h4>
    <p className="text-sm text-gray-600 font-body">Respaldamos tu inversión en bienestar por 12 meses</p>
  </div>
</motion.div>
```

### Checkout Page Layout

```
[Icon with Wellness Element]
     Label
```

Example:
```jsx
<motion.div 
  className="flex flex-col items-center px-4 py-2 bg-soft-cream rounded-lg"
  whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
  transition={{ type: "spring", stiffness: 300, damping: 15 }}
>
  <div className="relative">
    <Shield className="h-6 w-6 text-teal mb-1" aria-label="Garantía de Bienestar" />
    <div className="absolute top-0 right-0 w-3 h-3">
      <LeafIcon className="w-full h-full text-sage" />
    </div>
  </div>
  <span className="text-xs font-medium text-gray-700 font-heading">Garantía de Bienestar</span>
</motion.div>
```

### MiniCart Layout

```
[Small Icon] Label
```

Example:
```jsx
<div className="flex items-center gap-1 mt-2 justify-center">
  <div className="relative">
    <Shield className="h-4 w-4 text-teal" />
    <div className="absolute top-0 right-0 w-2 h-2">
      <LeafIcon className="w-full h-full text-sage" />
    </div>
  </div>
  <span className="text-xs text-gray-600 font-heading">Garantía de Bienestar</span>
</div>
```

## Implementation Notes

1. **SVG Icons**: Create custom SVG icons for each trust category that incorporate the wellness elements
2. **CSS Classes**: Use consistent CSS classes for badge elements to ensure visual consistency
3. **Responsive Design**: Ensure badges adapt appropriately to different screen sizes
4. **Animation**: Use subtle animations on hover to enhance engagement
5. **Accessibility**: Ensure all badges have appropriate aria labels and meet contrast requirements

## Next Steps

1. Create SVG assets for each badge design
2. Implement CSS classes for badge styles
3. Create reusable React components for each badge type
4. Integrate badges into the Product Page component
5. Integrate badges into the Cart Page component
6. Integrate badges into the Checkout Redirect component
7. Add a badge to the MiniCart component
