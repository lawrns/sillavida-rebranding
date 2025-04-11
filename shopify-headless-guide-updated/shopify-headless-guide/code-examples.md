# Code Examples for Integrating Shopify with Your Existing Landing Page

This document provides practical code examples for integrating Shopify with your existing landing page using Next.js and the Shopify Storefront API.

## 1. Setting Up Shopify API Utilities

Create a utility file to handle Shopify API calls (`lib/shopify.js`):

```javascript
// lib/shopify.js
import { GraphQLClient } from 'graphql-request';

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const endpoint = `https://${domain}/api/2023-10/graphql.json`;

export const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    'Content-Type': 'application/json',
  },
});

// Fetch featured products for your landing page links
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

// Fetch a single product by handle (slug)
export async function getProductByHandle(handle) {
  const query = `
    query ProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `;

  const variables = { handle };
  const data = await shopifyClient.request(query, variables);
  return data.productByHandle;
}

// Create a cart
export async function createCart() {
  const mutation = `
    mutation CreateCart {
      cartCreate {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `;

  const data = await shopifyClient.request(mutation);
  return data.cartCreate.cart;
}

// Add items to cart
export async function addToCart(cartId, variantId, quantity = 1) {
  const mutation = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                    }
                  }
                }
              }
            }
          }
          estimatedCost {
            totalAmount {
              amount
              currencyCode
            }
          }
          checkoutUrl
        }
      }
    }
  `;

  const variables = {
    cartId,
    lines: [
      {
        merchandiseId: variantId,
        quantity,
      },
    ],
  };

  const data = await shopifyClient.request(mutation, variables);
  return data.cartLinesAdd.cart;
}
```

## 2. Creating Product Links on Your Landing Page

Here's how to fetch and display product links on your existing landing page:

```jsx
// pages/index.js (your landing page)
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedProducts } from '../lib/shopify';

export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        const products = await getFeaturedProducts(4);
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Your existing landing page content */}
      <section className="featured-products">
        <h2>Featured Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <Link href={`/products/${product.handle}`} key={product.id}>
                <div className="product-card">
                  {product.featuredImage && (
                    <Image
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText || product.title}
                      width={300}
                      height={300}
                      objectFit="cover"
                    />
                  )}
                  <h3>{product.title}</h3>
                  <p className="price">
                    ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                    {' '}
                    {product.priceRange.minVariantPrice.currencyCode}
                  </p>
                  <span className="view-product">View Product</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      {/* More of your existing landing page content */}
    </div>
  );
}
```

## 3. Creating Dynamic Product Pages

Create dynamic product pages that fetch data from Shopify:

```jsx
// pages/products/[handle].js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { getProductByHandle, addToCart, createCart } from '../../lib/shopify';

export default function ProductPage({ product }) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.edges[0]?.node || null
  );
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // If the page is not yet generated, show loading
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // If product not found
  if (!product) {
    return <div>Product not found</div>;
  }

  async function handleAddToCart() {
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

  return (
    <div className="product-page">
      <div className="product-images">
        {product.images.edges.map(({ node }) => (
          <Image
            key={node.url}
            src={node.url}
            alt={node.altText || product.title}
            width={600}
            height={600}
            objectFit="contain"
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

export async function getStaticProps({ params }) {
  try {
    const product = await getProductByHandle(params.handle);
    return {
      props: {
        product,
      },
      // Revalidate every hour
      revalidate: 3600,
    };
  } catch (error) {
    console.error(`Error fetching product with handle ${params.handle}:`, error);
    return {
      notFound: true,
    };
  }
}

export async function getStaticPaths() {
  // For production, you might want to pre-render your most popular products
  // For this example, we'll just render paths on-demand
  return {
    paths: [],
    fallback: true,
  };
}
```

## 4. Creating a Simple Cart Component

Create a cart component to display the current cart:

```jsx
// components/Cart.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { shopifyClient } from '../lib/shopify';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCart() {
      const cartId = localStorage.getItem('shopifyCartId');
      if (!cartId) {
        setLoading(false);
        return;
      }

      try {
        const query = `
          query GetCart($cartId: ID!) {
            cart(id: $cartId) {
              id
              lines(first: 100) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                        title
                        image {
                          url
                          altText
                        }
                        price {
                          amount
                          currencyCode
                        }
                        product {
                          title
                          handle
                        }
                      }
                    }
                  }
                }
              }
              estimatedCost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
              checkoutUrl
            }
          }
        `;

        const variables = { cartId };
        const data = await shopifyClient.request(query, variables);
        setCart(data.cart);
      } catch (error) {
        console.error('Error fetching cart:', error);
        // If there's an error, the cart might be expired or invalid
        localStorage.removeItem('shopifyCartId');
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (!cart || cart.lines.edges.length === 0) {
    return <div>Your cart is empty</div>;
  }

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.lines.edges.map(({ node }) => {
          const { merchandise } = node;
          return (
            <div key={node.id} className="cart-item">
              {merchandise.image && (
                <Image
                  src={merchandise.image.url}
                  alt={merchandise.image.altText || merchandise.product.title}
                  width={80}
                  height={80}
                  objectFit="cover"
                />
              )}
              <div className="cart-item-details">
                <h3>
                  <Link href={`/products/${merchandise.product.handle}`}>
                    {merchandise.product.title}
                  </Link>
                </h3>
                <p>Variant: {merchandise.title}</p>
                <p>Quantity: {node.quantity}</p>
                <p>
                  ${parseFloat(merchandise.price.amount).toFixed(2)}
                  {' '}
                  {merchandise.price.currencyCode}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="cart-footer">
        <div className="cart-total">
          <p>Total:</p>
          <p>
            ${parseFloat(cart.estimatedCost.totalAmount.amount).toFixed(2)}
            {' '}
            {cart.estimatedCost.totalAmount.currencyCode}
          </p>
        </div>
        <a href={cart.checkoutUrl} className="checkout-button">
          Proceed to Checkout
        </a>
      </div>
    </div>
  );
}
```

## 5. API Route for Client-Side Shopify Interactions

Create an API route to securely interact with Shopify from the client side:

```javascript
// pages/api/shopify/products.js
import { getFeaturedProducts } from '../../../lib/shopify';

export default async function handler(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const products = await getFeaturedProducts(limit);
    res.status(200).json(products);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}
```

## 6. Using the Anthropic API with Claude to Generate Product Descriptions

If you want to use Claude to help with product descriptions or other content:

```javascript
// pages/api/generate-description.js
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { productInfo } = req.body;

  if (!productInfo) {
    return res.status(400).json({ error: 'Product information is required' });
  }

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const completion = await anthropic.completions.create({
      model: 'claude-2',
      prompt: `\n\nHuman: Generate a compelling product description for an e-commerce website based on the following product information:
      
      Product Name: ${productInfo.name}
      Category: ${productInfo.category}
      Key Features: ${productInfo.features}
      Target Audience: ${productInfo.audience}
      
      The description should be engaging, highlight the product's benefits, and be optimized for conversion. Keep it between 100-150 words.
      
      \n\nAssistant:`,
      max_tokens_to_sample: 500,
      temperature: 0.7,
    });

    res.status(200).json({ description: completion.completion });
  } catch (error) {
    console.error('Error generating description:', error);
    res.status(500).json({ error: 'Failed to generate description' });
  }
}
```

These code examples provide a foundation for integrating Shopify with your existing landing page. You can customize them based on your specific needs and design preferences.
