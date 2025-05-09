# Judge.me Official Widget Formats

This file contains the official widget formats provided by Judge.me for the platform-independent implementation.

## Single Product Star Ratings

```html
<div class="jdgm-widget jdgm-preview-badge" data-id="add-your-product-id"></div>
```

## Review Widget

```html
<div class="jdgm-widget jdgm-review-widget jdgm-outside-widget" data-id="add-your-product-id" data-product-title="add-your-product-title"></div>
```

## Reviews Carousel

```html
<div class="jdgm-carousel-wrapper"> 
  <h2 class="jdgm-carousel-title">Featured reviews</h2> 
  <a href="/reviews" class="jdgm-all-reviews-rating-wrapper"> 
    <div data-score="" class="jdgm-all-reviews-rating"></div> 
    from <span class="jdgm-all-reviews-count"></span> reviews 
  </a>
</div>
```

## Floating Reviews Tab

```html
<section class="jdgm-widget jdgm-revs-tab"> 
  <div class="jdgm-revs-tab-btn btn" position="bottom">Reviews</div> 
  <div class="jdgm-revs-tab__header"> 
    <a class="jdgm-close-ico"></a> 
    <h3 class="jdgm-revs-tab__title">Product Reviews</h3> 
    <a href="/pages/reviews"> 
      <div class="jdgm-all-reviews-rating"></div> 
      <span class="jdgm-all-reviews-count"></span> reviews 
    </a> 
  </div>
</section>
```

## All Reviews Widget

```html
<div class="jdgm-widget jdgm-all-reviews-widget"> 
  <div class="jdgm-all-reviews__body"></div>
</div>
```

## Verified Reviews Counter

```html
<div class="jdgm-verified-badge-wrapper"></div>
```

## Judge.me Medals

```html
<div class="jdgm-medals-wrapper"></div>
```

## UGC Media Grid

```html
<div class="jdgm-ugc-media-wrapper"></div>
```

## All Reviews Counter

```html
<div class="jdgm-all-reviews-text"></div>
```

## Implementation Notes

1. Replace `add-your-product-id` with the actual Shopify product ID
2. Replace `add-your-product-title` with the actual product title where needed
3. For UGC Media Grid, you need to add the product ID as `data-product-id` attribute
4. Make sure the Judge.me global initialization script is placed in the <head> section of the index.html file

## Troubleshooting

If widgets are not displaying correctly:

1. Ensure the Judge.me initialization script is loaded before any widgets
2. Verify the product IDs being used are correct
3. Check browser console for any errors
4. Make sure data attributes are correctly applied to each widget
5. Verify the shop domain and public token in the initialization script are correct
