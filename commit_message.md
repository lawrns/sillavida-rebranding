feat: implement Shopify integration, prepare Netlify deployment and fix UI issues

- Implemented Shopify API integration
  - Created Shopify API client and type definitions (src/lib/shopify.ts, src/types/shopify.ts)
  - Implemented product catalog functionality (src/components/ShopifyProductCard.tsx)
  - Added cart functionality with Shopify integration (src/context/CartContext.tsx)
  - Implemented checkout flow (src/pages/CheckoutPage.tsx, src/components/CheckoutRedirect.tsx)
  - Added customer authentication (src/services/customerAuth.ts)
  - Created test components and documentation (src/components/ShopifyApiTester.tsx, src/docs/shopify-api.md)

- Prepared comprehensive Netlify deployment configuration and documentation
  - Created pre-deployment checklist (netlify-deployment/pre-deployment-checklist.md)
  - Added Netlify configuration file (netlify.toml)
  - Created environment variables guide (netlify-deployment/environment-variables-guide.md)
  - Documented hardcoded URL handling (netlify-deployment/hardcoded-urls-check.md)

- Fixed hero slider images display issues
  - Resolved encoding problems with special characters in image paths
  - Restored original image paths in HeroSlider.tsx
  - Verified all slider images display correctly in development environment
  - Documented decision to maintain original image paths

- Improved project task management
  - Updated task statuses and dependencies
  - Added detailed progress tracking
  - Created comprehensive session documentation
  - Made and documented key decisions about deployment strategy

This commit completes the Shopify integration for the Silla Vida e-commerce application, prepares it for Netlify deployment, and ensures all UI components display correctly, particularly focusing on maintaining compatibility with existing image assets that contain special characters in filenames.
