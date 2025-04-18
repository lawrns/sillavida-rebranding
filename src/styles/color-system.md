# SillaVida Color System

## Overview

This document defines the new color palette for the SillaVida website redesign, aligning with the "investing in yourself" theme and "Vida" concept. The new palette evokes wellness, comfort, and quality, replacing the previous bold red with a more sophisticated and harmonious color scheme.

## Primary Colors

### Deep Teal (#1E5959)
- **Primary Brand Color**: Replaces the previous red (#B30000)
- **Usage**: 
  - Primary buttons
  - Navigation active states
  - Headers
  - Primary accents
  - Links
- **Variations**:
  - Light: #2A7A7A (hover states)
  - Dark: #184747 (active/pressed states)
  - Extra Light: #E5EDED (backgrounds, disabled states)

### Warm Beige (#E8DED1)
- **Secondary Brand Color**
- **Usage**:
  - Backgrounds
  - Secondary elements
  - Cards
  - Containers
- **Variations**:
  - Light: #F5F0E8 (hover states, lighter backgrounds)
  - Dark: #D6C9B7 (borders, dividers)
  - Extra Light: #FAF7F3 (subtle backgrounds)

## Accent Colors

### Sage Green (#7D9D8C)
- **Primary Accent Color**
- **Usage**:
  - Secondary buttons
  - Success states
  - Accent elements
  - Category indicators
- **Variations**:
  - Light: #9CBCAB (hover states)
  - Dark: #5E7A6A (active/pressed states)
  - Extra Light: #EDF3F0 (backgrounds, disabled states)

### Muted Terracotta (#C87D55)
- **Secondary Accent Color**
- **Usage**:
  - Highlight elements
  - Special features
  - "Vida" concept elements
  - Call-to-action accents
- **Variations**:
  - Light: #D69A7A (hover states)
  - Dark: #A66240 (active/pressed states)
  - Extra Light: #F7EDE7 (backgrounds, subtle accents)

## Neutral Colors

### Black (#212529)
- **Usage**:
  - Text
  - Icons
  - Borders
- **Variations**:
  - Dark Gray: #495057 (secondary text)
  - Medium Gray: #6C757D (tertiary text, disabled text)
  - Light Gray: #ADB5BD (borders, dividers)
  - Extra Light Gray: #E9ECEF (backgrounds, disabled elements)

### White (#FFFFFF)
- **Usage**:
  - Backgrounds
  - Text on dark backgrounds
  - Cards
- **Variations**:
  - Off-White: #F8F9FA (alternative backgrounds)

## Functional Colors

### Success (#2E7D32)
- **Usage**:
  - Success messages
  - Confirmation indicators
- **Variations**:
  - Light: #4CAF50 (hover states)
  - Dark: #1B5E20 (active/pressed states)
  - Extra Light: #E8F5E9 (backgrounds)

### Warning (#F9A825)
- **Usage**:
  - Warning messages
  - Attention indicators
- **Variations**:
  - Light: #FBC02D (hover states)
  - Dark: #F57F17 (active/pressed states)
  - Extra Light: #FFF8E1 (backgrounds)

### Error (#C62828)
- **Usage**:
  - Error messages
  - Critical indicators
- **Variations**:
  - Light: #E53935 (hover states)
  - Dark: #B71C1C (active/pressed states)
  - Extra Light: #FFEBEE (backgrounds)

### Info (#0277BD)
- **Usage**:
  - Information messages
  - Help indicators
- **Variations**:
  - Light: #039BE5 (hover states)
  - Dark: #01579B (active/pressed states)
  - Extra Light: #E1F5FE (backgrounds)

## Color Combinations

### Primary Button
- Background: Deep Teal (#1E5959)
- Text: White (#FFFFFF)
- Hover: Light Deep Teal (#2A7A7A)
- Active/Pressed: Dark Deep Teal (#184747)
- Disabled: Extra Light Deep Teal (#E5EDED) with Medium Gray (#6C757D) text

### Secondary Button
- Background: Sage Green (#7D9D8C)
- Text: White (#FFFFFF)
- Hover: Light Sage Green (#9CBCAB)
- Active/Pressed: Dark Sage Green (#5E7A6A)
- Disabled: Extra Light Sage Green (#EDF3F0) with Medium Gray (#6C757D) text

### Tertiary Button
- Background: Transparent
- Border: Deep Teal (#1E5959)
- Text: Deep Teal (#1E5959)
- Hover: Extra Light Deep Teal (#E5EDED)
- Active/Pressed: Light Deep Teal (#2A7A7A) with White (#FFFFFF) text
- Disabled: Light Gray (#ADB5BD) border and text

### Cards
- Background: White (#FFFFFF) or Warm Beige (#E8DED1)
- Border: Light Gray (#ADB5BD) or Dark Warm Beige (#D6C9B7)
- Shadow: rgba(33, 37, 41, 0.1)

### Navigation
- Background: White (#FFFFFF)
- Active Item: Deep Teal (#1E5959)
- Hover: Extra Light Deep Teal (#E5EDED)
- Text: Black (#212529)
- Active Text: Deep Teal (#1E5959)

### Form Elements
- Border: Light Gray (#ADB5BD)
- Focus: Deep Teal (#1E5959)
- Background: White (#FFFFFF)
- Placeholder: Medium Gray (#6C757D)
- Error: Error (#C62828)

## Accessibility Considerations

All color combinations must meet WCAG 2.1 AA standards for contrast:
- Text and background combinations must have a contrast ratio of at least 4.5:1
- Large text (18pt or 14pt bold) must have a contrast ratio of at least 3:1
- UI components and graphical objects must have a contrast ratio of at least 3:1

## Implementation Notes

- All colors should be implemented using CSS variables for consistency
- Use the defined variations for different states (hover, active, disabled)
- Maintain the color hierarchy to ensure visual consistency
- Consider color blindness and other visual impairments when implementing the color system
- Test all color combinations for sufficient contrast
