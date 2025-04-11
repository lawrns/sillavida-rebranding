# Vite-Specific Implementation Guide for Headless Shopify

This guide provides specific instructions and code examples for implementing a headless Shopify integration with a Vite-powered frontend. Vite offers a faster development experience with features like instant server start and hot module replacement, but requires different approaches compared to Next.js.

## Vite Project Structure for Headless Shopify

A typical Vite project structure for headless Shopify integration:

```
my-vite-shopify-app/
├── public/
│   ├── favicon.ico
│   └── assets/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ProductCard.jsx
│   │   ├── ProductList.jsx
│   │   └── Cart.jsx
│   ├── pages/
│   │   ├── Home.jsx (your landing page)
│   │   ├── Product.jsx
│   │   └── Collection.jsx
│   ├── services/
│   │   └── shopify.js (API utilities)
│   ├── App.jsx
│   ├── main.jsx
│   └── router.jsx
├── .env
├── index.html
├── package.json
└── vite.config.js
```

## Setting Up a Vite Project

If you haven't already set up your Vite project:

```bash
# Create a new Vite project with React
npm create vite@latest my-vite-shopify-app -- --template react

# Navigate to the project directory
cd my-vite-shopify-app

# Install dependencies
npm install
```

## Environment Variables in Vite

Vite handles environment variables differently than Next.js. Create a `.env` file in your project root:

```
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_api_token
```

To access these variables in your code:

```javascript
const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
```

Note: Only variables prefixed with `VITE_` are exposed to your client-side code.

## Setting Up Routing

Unlike Next.js, Vite doesn't include a built-in router. Install React Router:

```bash
npm install react-router-dom
```

Set up your router (`src/router.jsx`):

```jsx
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Product from './pages/Product';
import Collection from './pages/Collection';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'products/:handle',
        element: <Product />,
      },
      {
        path: 'collections/:handle',
        element: <Collection />,
      },
    ],
  },
]);

export default router;
```

Update your main entry point (`src/main.jsx`):

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

Create your App component (`src/App.jsx`):

```jsx
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
```

## API Handling in Vite

Since Vite doesn't have built-in API routes like Next.js, you have several options:

### Option 1: Client-Side API Calls

Create a Shopify service file (`src/services/shopify.js`):

```javascript
import { GraphQLClient } from 'graphql-request';

const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const endpoint = `https://${domain}/api/2023-10/graphql.json`;

export const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    'Content-Type': 'application/json',
  },
});

// Fetch featured products
export async function getFeaturedProducts(limit = 4) {
  const query = `
    query FeaturedProducts($limit: Int!) {
      products(first: $limit) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            featuredImage {
              url
              altText
            }
          }
        }
      }
    }
  `;

  const variables = { limit };
  const data = await shopifyClient.request(query, variables);
  return data.products.edges.map(({ node }) => node);
}

// Other Shopify API functions...
```

### Option 2: Development Proxy

Configure a proxy in your `vite.config.js` for development:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/shopify': {
        target: `https://${process.env.VITE_SHOPIFY_STORE_DOMAIN}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/shopify/, '/api/2023-10'),
      },
    },
  },
});
```

### Option 3: Separate Backend Service

For production, consider creating a separate backend service (e.g., with Express.js) to handle Shopify API calls securely.

## Implementing Your Landing Page

Your landing page component (`src/pages/Home.jsx`):

```jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../services/shopify';
import ProductCard from '../components/ProductCard';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const products = await getFeaturedProducts(4);
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <div className="landing-page">
      {/* Your existing landing page content */}
      
      <section className="featured-products">
        <h2>Featured Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <Link to={`/products/${product.handle}`} key={product.id}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        )}
      </section>
      
      {/* More of your existing landing page content */}
    </div>
  );
}

export default Home;
```

## Product Card Component

Create a reusable product card component (`src/components/ProductCard.jsx`):

```jsx
function ProductCard({ product }) {
  return (
    <div className="product-card">
      {product.featuredImage && (
        <img
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          className="product-image"
        />
      )}
      <h3 className="product-title">{product.title}</h3>
      <p className="product-price">
        ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
        {' '}
        {product.priceRange.minVariantPrice.currencyCode}
      </p>
      <span className="view-product">View Product</span>
    </div>
  );
}

export default ProductCard;
```

## Product Detail Page

Create a product detail page (`src/pages/Product.jsx`):

```jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductByHandle, createCart, addToCart } from '../services/shopify';

function Product() {
  const { handle } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const productData = await getProductByHandle(handle);
        setProduct(productData);
        // Set the first variant as selected by default
        if (productData?.variants?.edges?.length > 0) {
          setSelectedVariant(productData.variants.edges[0].node);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [handle]);

  async function handleAddToCart() {
    if (!selectedVariant) return;
    
    setIsAddingToCart(true);
    try {
      // Get cart from localStorage or create a new one
      let cartId = localStorage.getItem('shopifyCartId');
      if (!cartId) {
        const cart = await createCart();
        cartId = cart.id;
        localStorage.setItem('shopifyCartId', cartId);
      }

      // Add item to cart
      const updatedCart = await addToCart(
        cartId,
        selectedVariant.id,
        quantity
      );

      // Optionally redirect to cart page or show success message
      alert('Product added to cart!');
      
      // Or redirect to Shopify checkout
      // window.location.href = updatedCart.checkoutUrl;
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    } finally {
      setIsAddingToCart(false);
    }
  }

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="product-page">
      <div className="product-images">
        {product.images.edges.map(({ node }) => (
          <img
            key={node.url}
            src={node.url}
            alt={node.altText || product.title}
            className="product-image"
          />
        ))}
      </div>

      <div className="product-details">
        <h1>{product.title}</h1>
        <div
          className="product-description"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />

        {/* Variant selector */}
        {product.variants.edges.length > 1 && (
          <div className="variant-selector">
            <label htmlFor="variant">Options:</label>
            <select
              id="variant"
              value={selectedVariant.id}
              onChange={(e) => {
                const variantId = e.target.value;
                const newVariant = product.variants.edges.find(
                  ({ node }) => node.id === variantId
                ).node;
                setSelectedVariant(newVariant);
              }}
            >
              {product.variants.edges.map(({ node }) => (
                <option key={node.id} value={node.id}>
                  {node.title} - ${parseFloat(node.price.amount).toFixed(2)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quantity selector */}
        <div className="quantity-selector">
          <label htmlFor="quantity">Quantity:</label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>

        <div className="product-price">
          <p>
            ${parseFloat(selectedVariant.price.amount).toFixed(2)}
            {' '}
            {selectedVariant.price.currencyCode}
          </p>
        </div>

        <button
          className="add-to-cart-button"
          onClick={handleAddToCart}
          disabled={isAddingToCart || !selectedVariant.availableForSale}
        >
          {isAddingToCart
            ? 'Adding...'
            : selectedVariant.availableForSale
            ? 'Add to Cart'
            : 'Sold Out'}
        </button>
      </div>
    </div>
  );
}

export default Product;
```

## Using Anthropic Claude API with Vite

If you want to use Claude for generating product descriptions or other content:

```jsx
// src/services/claude.js
import axios from 'axios';

export async function generateProductDescription(productInfo) {
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/complete',
      {
        prompt: `\n\nHuman: Generate a compelling product description for an e-commerce website based on the following product information:
        
        Product Name: ${productInfo.name}
        Category: ${productInfo.category}
        Key Features: ${productInfo.features}
        Target Audience: ${productInfo.audience}
        
        The description should be engaging, highlight the product's benefits, and be optimized for conversion. Keep it between 100-150 words.
        
        \n\nAssistant:`,
        model: 'claude-2',
        max_tokens_to_sample: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
        },
      }
    );
    
    return response.data.completion;
  } catch (error) {
    console.error('Error generating description:', error);
    throw error;
  }
}
```

## Building and Deploying

To build your Vite application:

```bash
npm run build
```

This will create a `dist` directory with your built application. You can deploy this to any static hosting service like Netlify, Vercel, or GitHub Pages.

## Vite-Specific Optimizations

### 1. Import Aliases

Configure import aliases in `vite.config.js` for cleaner imports:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
    },
  },
});
```

### 2. CSS Modules

Vite supports CSS Modules out of the box. Create a file like `ProductCard.module.css`:

```css
.card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.price {
  color: #e63946;
  font-weight: 600;
}
```

Then import and use it in your component:

```jsx
import styles from './ProductCard.module.css';

function ProductCard({ product }) {
  return (
    <div className={styles.card}>
      <img src={product.featuredImage.url} alt={product.title} />
      <h3 className={styles.title}>{product.title}</h3>
      <p className={styles.price}>
        ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
      </p>
    </div>
  );
}
```

### 3. Lazy Loading

Implement lazy loading for better performance:

```jsx
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';

const Product = lazy(() => import('./pages/Product'));
const Collection = lazy(() => import('./pages/Collection'));
const Cart = lazy(() => import('./pages/Cart'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'products/:handle',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Product />
          </Suspense>
        ),
      },
      {
        path: 'collections/:handle',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Collection />
          </Suspense>
        ),
      },
      {
        path: 'cart',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Cart />
          </Suspense>
        ),
      },
    ],
  },
]);
```

## Key Differences from Next.js Approach

1. **No Server-Side Rendering**: Vite builds single-page applications without built-in SSR. This means all data fetching happens client-side by default.

2. **Manual Routing Setup**: You need to set up routing manually with React Router or another routing library.

3. **API Handling**: You'll need to handle API calls differently, either through client-side requests, a development proxy, or a separate backend service.

4. **Environment Variables**: Use the `import.meta.env.VITE_*` syntax to access environment variables.

5. **Build Output**: The build process and output structure are different from Next.js.

## Conclusion

Integrating Shopify as a headless commerce solution with a Vite-powered frontend gives you the benefits of Vite's fast development experience while maintaining full control over your landing page. By following this guide, you can create a seamless integration between your existing Vite landing page and Shopify's powerful e-commerce capabilities.

Remember to secure your API calls appropriately, especially in production environments, and consider implementing a separate backend service for handling sensitive operations if needed.
