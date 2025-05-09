# Judge.me Widget Reference

This document provides a reference for the proper implementation of Judge.me widgets in the SillaVida headless Shopify store.

## Widget Components

### 1. JudgeMeScriptTag

This component loads the Judge.me script in the correct way for a headless Shopify implementation.

```tsx
<JudgeMeScriptTag 
  shopDomain="your-shop-domain.myshopify.com"
  platformIndependent={true}
  debug={true}
/>
```

### 2. JudgeMeLoader

This component ensures the Judge.me widgets are properly rendered after React mounts the components. It should wrap all Judge.me widget components.

```tsx
<JudgeMeLoader productId={productId}>
  <YourJudgeMeWidgetComponent />
</JudgeMeLoader>
```

### 3. ReactSafeJudgeMeWidget

This component initializes Judge.me widgets in a way that avoids React Strict Mode warnings.

```tsx
<ReactSafeJudgeMeWidget 
  productId={productId}
  productTitle={productTitle}
/>
```

## Widget Implementations

### 1. Reviews Widget (Product Page)

```html
<div className="jdgm-widget jdgm-review-widget">
  <div className="jdgm-review-widget--inline-badge">
    <span className="jdgm-inline-badge" data-id={productId}></span>
  </div>
  <div className="jdgm-review-widget--reviews">
    <div className="jdgm-reviews-widget" data-id={productId} data-per-page="4" data-locale="es"></div>
  </div>
</div>
```

### 2. Reviews Carousel (Home Page)

```html
<div className="jdgm-carousel-wrapper" data-number-of-reviews="8" data-auto-rotate="5000"> 
  <h2 className="jdgm-carousel-title">Opiniones de clientes verificados</h2> 
  <a href="/reviews" className="jdgm-all-reviews-rating-wrapper"> 
    <div data-score="" className="jdgm-all-reviews-rating"></div> 
    <span className="jdgm-text-español">Ver todas las <span className="jdgm-all-reviews-count"></span> opiniones</span>
  </a>
</div>
```

### 3. UGC Media Grid (Product Page)

```html
<div className="jdgm-ugc-media-wrapper" data-product-id={productId} data-rows-mobile="2" data-rows-desktop="2">
  <div className="jdgm-ugc-media__title">Opiniones con fotos</div>
</div>
```

## Localization Settings

All text elements in the Judge.me widgets are set to Spanish for the Mexican market:

1. Use the `data-locale="es"` attribute where applicable
2. Replace English text with Spanish equivalents (e.g., "See all reviews" → "Ver todas las opiniones")
3. Use "verified" instead of "from reviews" in badge text (e.g., "Cliente verificado" instead of "from reviews")

## Troubleshooting

If widgets are not rendering correctly:

1. Check that the Judge.me script is loaded properly
2. Verify that the global `window.jdgm` object is available
3. Ensure the correct product ID is being passed to the widgets
4. Try manually triggering the `window.jdgm.renderWidgets()` function after component mount
5. Look for console errors related to Judge.me
