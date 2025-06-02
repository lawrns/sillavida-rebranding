# SillaVida Judge.me Reviews Integration Documentation

## Overview
This document provides detailed information about the integration of Judge.me product reviews into the SillaVida website. The integration follows the "Vida" theme branding, renaming the reviews section to "Experiencias Vida" to align with the brand messaging.

## Components Structure

### JudgeMeReviews Component
- **File**: `src/components/JudgeMeReviews.tsx`
- **Purpose**: Main component for displaying Judge.me reviews on product pages.
- **Key Features**:
  - Dynamic loading of Judge.me script
  - Customized review display with SillaVida branding
  - Support for multiple languages (Spanish and English)
  - Configurable through central configuration file

### Configuration
- **File**: `src/config/judgeme.config.ts`
- **Purpose**: Central configuration for Judge.me integration.
- **Key Settings**:
  - Shop domain
  - Widget settings (reviews and review form)
  - Translations for multilingual support
  - Custom text for all UI elements

## Styling

### Custom CSS
- **File**: `src/components/JudgeMeReviews.css`
- **Purpose**: Custom styling for Judge.me widgets to match SillaVida design system.
- **Key Features**:
  - Consistent use of SillaVida color palette
  - Responsive design for all device sizes
  - Custom styling for reviews, stars, and form elements
  - Loading and empty state styling

## Integration with Product Pages

The JudgeMeReviews component is integrated into the ProductPage component:
- **File**: `src/pages/ProductPage.tsx`
- **Location**: Between the "Beneficios Vida" and "Productos Relacionados" sections
- **Implementation**: 
  ```tsx
  <section className="product-section mb-8">
    <div className="section-header">
      <h2>Experiencias Vida</h2>
    </div>
    <div className="section-content">
      <JudgeMeReviews 
        productId={product.id}
        language="es"
      />
    </div>
  </section>
  ```

## Technical Implementation

### Script Loading
The Judge.me script is loaded dynamically when the component mounts:
```typescript
const script = document.createElement('script');
script.src = `${JudgeMeConfig.cdnUrl}/widget_preloader.js`;
script.async = true;
script.setAttribute('data-shop-domain', shopDomain);
document.head.appendChild(script);
```

### Widget Initialization
Widgets are initialized once the script is loaded:
```typescript
script.onload = () => {
  if (window.jdgm && typeof window.jdgm.initializeWidgets === 'function') {
    window.jdgm.initializeWidgets();
  }
};
```

### Data Attributes
The Judge.me widgets use data attributes for configuration:
```typescript
<div 
  className="jdgm-widget jdgm-reviews-widget"
  data-id={productId}
  data-auto-install={reviews.autoInstall.toString()}
  data-per-page={reviews.perPage.toString()}
  data-rating-text={reviews.ratingText}
  data-no-reviews-text={reviews.noReviewsText}
  data-write-review-text={reviews.writeReviewText}
  data-verified-buyer-text={reviews.verifiedBuyerText}
></div>
```

## Shopify Integration

### Judge.me App Installation
The Judge.me app must be installed in the Shopify store:
1. Go to Shopify Admin > Apps
2. Click "Add apps"
3. Search for "Judge.me Product Reviews"
4. Click "Add app"
5. Follow the installation instructions

### Theme Integration
Enable Judge.me app embed in the Shopify theme:
1. From Shopify admin, go to Online Store > Themes
2. Find the theme you want and click "Customize"
3. Go to "App embeds" and enable "Judge.me"
4. Click "Save"

## Configuration Options

### Widget Settings
The following settings can be configured in `judgeme.config.ts`:
- **Reviews Widget**:
  - `perPage`: Number of reviews per page
  - `autoInstall`: Whether to auto-install the widget
  - Custom text for ratings, no reviews, write review, etc.

- **Review Form**:
  - `autoInstall`: Whether to auto-install the form
  - Custom text for form title, submit button, field labels, etc.

### Translations
The component supports multiple languages:
```typescript
translations: {
  es: {
    reviewsTitle: 'Experiencias Vida',
    reviewsSubtitle: 'Descubre lo que nuestros clientes dicen...'
  },
  en: {
    reviewsTitle: 'Vida Experiences',
    reviewsSubtitle: 'Discover what our customers are saying...'
  }
}
```

## Styling Customization

### Color Palette
The styling uses the SillaVida color palette:
- Primary: `var(--sv-color-primary)` (#1E5959)
- Secondary: `var(--sv-color-secondary)` (#E8DED1)
- Accent: `var(--sv-color-accent)` (#7D9D8C)
- Highlight: `var(--sv-color-highlight)` (#C87D55)

### Typography
- Headings: Montserrat
- Body text: Open Sans

### Responsive Design
The component is fully responsive with specific styles for different screen sizes:
```css
@media (max-width: 768px) {
  .jdgm-rev-widg {
    padding: 1rem;
  }
  
  .experiencias-vida-header h2 {
    font-size: 1.5rem;
  }
}
```

## Testing

### Manual Testing Checklist
- [ ] Verify Judge.me script loads correctly
- [ ] Check that reviews display properly
- [ ] Test review form submission
- [ ] Verify star ratings display correctly
- [ ] Test pagination functionality
- [ ] Check responsive design on different screen sizes
- [ ] Verify empty state displays correctly
- [ ] Test with different product IDs

## Troubleshooting

### Common Issues
1. **Reviews not displaying**: Ensure the product ID is correct and the Judge.me app is properly installed in Shopify.
2. **Script loading errors**: Check the browser console for errors related to the Judge.me script.
3. **Styling issues**: Verify that the CSS variables are properly defined in your global CSS.

### Debug Tips
- Check the browser console for errors
- Verify that the Judge.me script is loaded in the network tab
- Inspect the DOM to ensure data attributes are correctly set

## Future Enhancements
- Add review filtering by rating
- Implement review sorting options
- Add review highlights on the homepage
- Create a dedicated reviews page
- Implement review analytics tracking

## References
- [Judge.me Documentation](https://judge.me/api)
- [Shopify App Integration Guide](https://help.shopify.com/en/manual/apps)
- SillaVida Design System
