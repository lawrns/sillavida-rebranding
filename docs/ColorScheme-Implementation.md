# SillaVida Color Scheme Implementation

## Overview

This document outlines the implementation of the site-wide color scheme with reversibility for the SillaVida website. The implementation uses CSS variables and a theme-switching mechanism that allows for easy rollback or adjustments if needed.

## Features

- Enhanced color scheme applied across all website pages
- Reversible implementation using CSS variables and theme switching
- Improved visual hierarchy and contrast throughout the site
- Consistent branding across all pages
- Responsive and accessible design
- Easy mechanism to revert changes if needed

## Implementation Details

### File Structure

The color scheme implementation consists of the following files:

- `src/styles/sillavida-enhanced-theme.css` - Enhanced color scheme variables and overrides
- `src/styles/sillavida-original-theme.css` - Original color scheme variables for reversibility
- `src/styles/theme-switcher.css` - Styles for the theme toggle button and preview page
- `src/utils/theme-switcher.js` - JavaScript utility for theme switching functionality
- `src/pages/ThemePreviewPage.tsx` - Preview page for stakeholders to visualize theme differences

### CSS Variables

The implementation uses CSS variables to define colors and apply them consistently across the site. The variables are defined in the root element and can be accessed from any component.

#### Enhanced Theme Variables

```css
:root.enhanced-theme {
  /* Primary Colors */
  --color-teal: #1E5959;
  --color-teal-light: #2a7a7a;
  --color-teal-dark: #184747;
  /* ... more color variables ... */
}
```

#### Original Theme Variables

```css
:root.original-theme {
  /* Primary Colors */
  --color-teal: #1E5959;
  --color-teal-light: #2A7A7A;
  --color-teal-dark: #184747;
  /* ... more color variables ... */
}
```

### Theme Switching Mechanism

The theme switching is implemented using JavaScript and CSS classes. The theme-switcher.js utility provides the following functionality:

- Initialize theme based on saved preference
- Set theme by adding/removing CSS classes
- Toggle between themes
- Create theme toggle button in admin panel or footer
- Save theme preference to localStorage

```javascript
// Set theme
setTheme(theme) {
  this.currentTheme = theme;
  
  if (theme === 'original') {
    document.documentElement.classList.remove('enhanced-theme');
    document.documentElement.classList.add('original-theme');
  } else {
    document.documentElement.classList.remove('original-theme');
    document.documentElement.classList.add('enhanced-theme');
  }
  
  // Save preference
  localStorage.setItem('sillavida-theme', theme);
}
```

### Theme Preview Page

A theme preview page is available at `/theme-preview` to help stakeholders visualize the differences between the original and enhanced themes. The page includes:

- Color swatches for all theme colors
- Component previews with current theme styles
- Theme comparison section
- Theme toggle button

## Usage

### Accessing Theme Variables

To use the theme colors in your components, access the CSS variables:

```css
.my-component {
  background-color: var(--color-teal);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
}
```

### Switching Themes Programmatically

To switch themes programmatically, use the theme-switcher utility:

```javascript
import themeSwitcher from '../utils/theme-switcher';

// Set theme to original
themeSwitcher.setTheme('original');

// Set theme to enhanced
themeSwitcher.setTheme('enhanced');

// Toggle between themes
themeSwitcher.toggleTheme();
```

### Theme-Specific Styles

To apply theme-specific styles, use the theme classes:

```css
.enhanced-theme .my-component {
  /* Enhanced theme specific styles */
}

.original-theme .my-component {
  /* Original theme specific styles */
}
```

## Maintenance

### Adding New Colors

To add new colors to the theme:

1. Add the color variables to both theme files:
   - `src/styles/sillavida-enhanced-theme.css`
   - `src/styles/sillavida-original-theme.css`

2. Use the variables in your components

### Modifying Existing Colors

To modify existing colors:

1. Update the color values in the appropriate theme file
2. Test the changes using the theme preview page

### Adding Theme Support to New Components

To add theme support to new components:

1. Use CSS variables for all colors
2. Test the component with both themes
3. Add theme-specific overrides if needed

## Testing

To test the theme implementation:

1. Visit the theme preview page at `/theme-preview`
2. Toggle between themes to ensure all components render correctly
3. Test on different devices to ensure responsive design
4. Check for accessibility issues with both themes

## Troubleshooting

### Common Issues

- **Theme not applying**: Ensure the theme class is added to the root element
- **Colors not updating**: Check if the component is using CSS variables
- **Theme preference not saving**: Check localStorage access

### Debug Tools

- Use browser developer tools to inspect CSS variables
- Check localStorage for saved theme preference
- Use the theme preview page to visualize theme differences

## Conclusion

The site-wide color scheme implementation provides a flexible and reversible way to apply consistent branding across the SillaVida website. The use of CSS variables and theme switching allows for easy maintenance and updates to the color scheme.
