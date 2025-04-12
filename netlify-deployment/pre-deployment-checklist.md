# Silla Vida - Netlify Deployment Checklist

## Critical Functionality to Test

### Core Pages
- [ ] Home page loads correctly
- [ ] Category pages display products correctly
- [ ] Product detail pages show all product information
- [ ] Cart page displays added items correctly
- [ ] Checkout page functions properly
- [ ] Account pages (login, register, profile) work as expected
- [ ] Order confirmation page displays correctly

### Shopify Integration
- [ ] Products are fetched correctly from Shopify
- [ ] Product images load properly
- [ ] Product variants are displayed correctly
- [ ] Add to cart functionality works from all locations
- [ ] Cart updates correctly when items are added/removed
- [ ] Checkout redirects to Shopify checkout correctly
- [ ] Customer accounts can be created and accessed

### UI Components
- [ ] Navigation bar works correctly on all pages
- [ ] Mobile menu functions properly
- [ ] Product cards display correctly
- [ ] Pagination works on category pages
- [ ] Search functionality returns relevant results
- [ ] Filter functionality works correctly
- [ ] Mini cart shows correct items and totals

### Responsive Design
- [ ] All pages display correctly on desktop
- [ ] All pages display correctly on tablet
- [ ] All pages display correctly on mobile
- [ ] Images are responsive and load correctly
- [ ] Text is readable on all screen sizes
- [ ] Buttons and interactive elements are usable on touch devices

### Performance
- [ ] Pages load within acceptable time (< 3 seconds)
- [ ] Images are optimized for web
- [ ] No console errors in browser developer tools
- [ ] Lighthouse performance score > 80
- [ ] Core Web Vitals pass

## Environment Variables to Configure in Netlify

```
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
```

## Build Settings for Netlify

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18.x (or latest LTS)

## Redirects and Headers

Create a `netlify.toml` file with the following configuration:

```toml
# Redirects for SPA routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self' *.myshopify.com; img-src 'self' data: *.myshopify.com *.shopify.com *.unsplash.com; script-src 'self' 'unsafe-inline' *.myshopify.com; style-src 'self' 'unsafe-inline'; connect-src 'self' *.myshopify.com;"
```

## Post-Deployment Verification

- [ ] Verify all pages load correctly on the deployed site
- [ ] Test all critical functionality again on the live site
- [ ] Verify that environment variables are working correctly
- [ ] Check for any console errors
- [ ] Test the complete user journey from browsing to checkout
- [ ] Verify that analytics are working correctly (if implemented)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
