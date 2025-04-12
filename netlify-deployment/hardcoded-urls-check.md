# Checking for Hardcoded URLs and Paths

When deploying a React application to Netlify, it's important to ensure that there are no hardcoded URLs or paths that might break in production. This document provides guidance on what to check and how to fix any issues.

## Common Issues to Check

### 1. Absolute URLs to Local Resources

**Problem:** Hardcoded absolute URLs to local resources will break in production.

**Example:**
```jsx
// Incorrect
<img src="http://localhost:5173/images/logo.png" alt="Logo" />

// Correct
<img src="/images/logo.png" alt="Logo" />
```

**Where to look:**
- Component files with image imports
- CSS files with background images
- Any file that references local assets

### 2. API Endpoints

**Problem:** Hardcoded API endpoints that point to development servers.

**Example:**
```jsx
// Incorrect
fetch('http://localhost:3000/api/products')

// Correct
fetch(`${import.meta.env.VITE_API_URL}/api/products`)
```

**Where to look:**
- API service files
- Components that make direct API calls
- Context providers that fetch data

### 3. Environment Variables

**Problem:** Missing environment variables in production.

**Solution:** Ensure all required environment variables are set in Netlify.

**Required variables for this project:**
- `VITE_SHOPIFY_STORE_DOMAIN`
- `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`

### 4. Routing Issues

**Problem:** Hardcoded routes that don't work with Netlify's SPA routing.

**Example:**
```jsx
// Incorrect (if using window.location directly)
window.location.href = '/products'

// Correct (using React Router)
navigate('/products')
```

**Where to look:**
- Navigation components
- Redirect logic
- Link components

### 5. Base Path Issues

**Problem:** Assuming the application is served from the root path.

**Solution:** Use relative paths or environment variables for base paths.

**Example:**
```jsx
// Incorrect
const basePath = '/api'

// Correct
const basePath = import.meta.env.VITE_BASE_PATH || '/api'
```

## Files to Check in This Project

Based on the project structure, these files should be checked for hardcoded URLs:

1. `src/lib/shopify.ts` - Check for hardcoded Shopify API endpoints
2. `src/components/Navbar.tsx` - Check for hardcoded navigation links
3. `src/components/ProductCard.tsx` - Check for hardcoded image paths
4. `src/components/ShopifyProductCard.tsx` - Check for hardcoded Shopify URLs
5. `src/pages/*.tsx` - Check all page components for hardcoded URLs
6. `src/context/CartContext.tsx` - Check for hardcoded API calls
7. `src/services/customerAuth.ts` - Check for hardcoded authentication endpoints

## Automated Check

You can use the following command to search for potential hardcoded URLs:

```bash
grep -r "http://" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" src/
grep -r "https://" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" src/
grep -r "localhost" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" src/
```

## Fixing Issues

1. Replace hardcoded URLs with environment variables
2. Use relative paths for local resources
3. Use React Router's navigation instead of direct window.location changes
4. Ensure all API endpoints are configurable via environment variables

## Testing After Fixes

After fixing any hardcoded URLs, test the application with:

```bash
# Build the application
npm run build

# Serve the built application locally
npm run preview
```

This will simulate a production environment and help catch any remaining issues before deploying to Netlify.
