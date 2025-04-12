import {
  createStorefrontClient,
  type StorefrontClientProps,
} from '@shopify/hydrogen-react';
import type { ShopifyProduct, ShopifyCart } from '../types/shopify';

/**
 * Custom error classes for better error handling
 */
export class ShopifyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ShopifyError';
  }
}

export class ShopifyNetworkError extends ShopifyError {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ShopifyNetworkError';
    this.status = status;
  }
}

export class ShopifyGraphQLError extends ShopifyError {
  errors: any[];
  
  constructor(message: string, errors: any[]) {
    super(message);
    this.name = 'ShopifyGraphQLError';
    this.errors = errors;
  }
}

export class ShopifyTimeoutError extends ShopifyError {
  constructor(message: string) {
    super(message);
    this.name = 'ShopifyTimeoutError';
  }
}

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const cache: Record<string, { data: any; timestamp: number }> = {};

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Shopify client configuration
const storefrontConfig: StorefrontClientProps = {
  storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN,
  publicStorefrontToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  apiVersion: '2024-01',
};

const client = createStorefrontClient(storefrontConfig);

/**
 * Sleep utility for retry delay
 * @param ms Milliseconds to sleep
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Enhanced Shopify client with caching, retry logic, and improved error handling
 */
export const shopifyClient = {
  /**
   * Execute a GraphQL query against the Shopify Storefront API
   * @param options Query options
   * @param options.data Query data including GraphQL query and variables
   * @param options.cache Whether to use cache (default: true)
   * @param options.retries Number of retries for failed requests (default: MAX_RETRIES)
   * @returns Query response
   */
  async query({ 
    data, 
    cache: useCache = true,
    retries = MAX_RETRIES
  }: { 
    data: { query: string; variables?: any };
    cache?: boolean;
    retries?: number;
  }) {
    const cacheKey = JSON.stringify(data);
    
    // Return cached data if available and not expired
    if (useCache && cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
      return cache[cacheKey].data;
    }
    
    let lastError: Error | null = null;
    
    // Retry loop
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Add timeout to fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(
          client.getStorefrontApiUrl(),
          {
            method: 'POST',
            headers: client.getPublicTokenHeaders(),
            body: JSON.stringify(data),
            signal: controller.signal
          }
        );
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new ShopifyNetworkError(
            `HTTP error! status: ${response.status}, message: ${errorText}`,
            response.status
          );
        }
        
        const json = await response.json();
        
        if (json.errors) {
          throw new ShopifyGraphQLError(
            `GraphQL error: ${json.errors.map((e: any) => e.message).join('; ')}`,
            json.errors
          );
        }
        
        // Cache the response
        if (useCache) {
          cache[cacheKey] = {
            data: json,
            timestamp: Date.now()
          };
        }
        
        return json;
      } catch (error: any) {
        lastError = error;
        
        // Don't retry if it's a GraphQL error (those won't be resolved by retrying)
        if (error instanceof ShopifyGraphQLError) {
          break;
        }
        
        // Don't retry if it's the last attempt
        if (attempt === retries) {
          break;
        }
        
        // If it's an abort error (timeout), convert it to our custom error type
        if (error.name === 'AbortError') {
          lastError = new ShopifyTimeoutError('Request timed out');
        }
        
        // Exponential backoff
        const delay = RETRY_DELAY * Math.pow(2, attempt);
        console.warn(`Shopify API request failed, retrying in ${delay}ms (attempt ${attempt + 1}/${retries})`, error);
        await sleep(delay);
      }
    }
    
    // If we got here, all retries failed
    console.error('Shopify query error after retries:', lastError);
    throw lastError;
  },
  
  /**
   * Clear the cache or a specific cache entry
   * @param key Optional specific cache key to clear
   */
  clearCache(key?: string) {
    if (key) {
      delete cache[key];
    } else {
      Object.keys(cache).forEach(k => delete cache[k]);
    }
  },
  
  /**
   * Set the cache TTL (time to live)
   * @param ttl Time to live in milliseconds
   */
  setCacheTTL(ttl: number) {
    if (ttl < 0) {
      throw new Error('Cache TTL must be a positive number');
    }
    // This is a global setting that affects all cached items
    Object.defineProperty(this, 'CACHE_TTL', { value: ttl });
  }
};

/**
 * Get a list of products
 * @param limit Number of products to fetch (default: 10)
 * @returns Array of products
 */
export async function getProducts(limit = 10): Promise<ShopifyProduct[]> {
  const query = `
    query Products($limit: Int!) {
      products(first: $limit) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyClient.query({
    data: { 
      query,
      variables: { limit }
    },
  });

  return response.data.products.edges.map((edge: any) => edge.node);
}

/**
 * Get a product by handle
 * @param handle Product handle
 * @returns Product data
 */
export async function getProduct(handle: string): Promise<ShopifyProduct> {
  const query = `
    query Product($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
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
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
      }
    }
  `;

  const response = await shopifyClient.query({
    data: {
      query,
      variables: {
        handle,
      },
    },
  });

  return response.data.product;
}

/**
 * Get products by collection handle with pagination support
 * @param collectionHandle Collection handle
 * @param limit Number of products to fetch per page (default: 10)
 * @param cursor Cursor for pagination (optional)
 * @returns Object containing products array and pagination info
 */
export async function getProductsByCollection(
  collectionHandle: string, 
  limit = 10, 
  cursor?: string
): Promise<{ 
  products: ShopifyProduct[]; 
  pageInfo: { 
    hasNextPage: boolean; 
    endCursor: string | null;
  } 
}> {
  const query = `
    query CollectionProducts($handle: String!, $limit: Int!, $cursor: String) {
      collection(handle: $handle) {
        products(first: $limit, after: $cursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyClient.query({
    data: {
      query,
      variables: {
        handle: collectionHandle,
        limit,
        cursor: cursor || null
      },
    },
  });

  const products = response.data.collection.products.edges.map((edge: any) => edge.node);
  const pageInfo = response.data.collection.products.pageInfo;

  return {
    products,
    pageInfo
  };
}

/**
 * Get all collections
 * @param limit Number of collections to fetch (default: 10)
 * @returns Array of collections
 */
export async function getCollections(limit = 10) {
  const query = `
    query Collections($limit: Int!) {
      collections(first: $limit) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
              altText
            }
          }
        }
      }
    }
  `;

  const response = await shopifyClient.query({
    data: {
      query,
      variables: {
        limit
      },
    },
  });

  return response.data.collections.edges.map((edge: any) => edge.node);
}

// Cart Operations

/**
 * Create a new cart
 * @param lines Optional initial cart lines
 * @returns Cart data
 */
export async function createCart(lines: { merchandiseId: string; quantity: number }[] = []) {
  const query = `
    mutation CartCreate($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          lines(first: 10) {
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
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const formattedLines = lines.map(line => ({
    merchandiseId: line.merchandiseId,
    quantity: line.quantity
  }));

  const response = await shopifyClient.query({
    data: {
      query,
      variables: {
        lines: formattedLines
      },
    },
    cache: false
  });

  return response.data.cartCreate.cart;
}

/**
 * Get cart by ID
 * @param cartId Cart ID
 * @returns Cart data
 */
export async function getCart(cartId: string): Promise<ShopifyCart> {
  const query = `
    query Cart($cartId: ID!) {
      cart(id: $cartId) {
        id
        lines(first: 10) {
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
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `;

  const response = await shopifyClient.query({
    data: {
      query,
      variables: {
        cartId
      },
    },
    cache: false
  });

  return response.data.cart;
}

/**
 * Add items to cart
 * @param cartId Cart ID
 * @param lines Lines to add
 * @returns Updated cart
 */
export async function addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
  const query = `
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 10) {
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
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const formattedLines = lines.map(line => ({
    merchandiseId: line.merchandiseId,
    quantity: line.quantity
  }));

  const response = await shopifyClient.query({
    data: {
      query,
      variables: {
        cartId,
        lines: formattedLines
      },
    },
    cache: false
  });

  return response.data.cartLinesAdd.cart;
}

/**
 * Update cart lines
 * @param cartId Cart ID
 * @param lines Lines to update
 * @returns Updated cart
 */
export async function updateCartLines(cartId: string, lines: { id: string; quantity: number }[]) {
  const query = `
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 10) {
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
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const formattedLines = lines.map(line => ({
    id: line.id,
    quantity: line.quantity
  }));

  const response = await shopifyClient.query({
    data: {
      query,
      variables: {
        cartId,
        lines: formattedLines
      },
    },
    cache: false
  });

  return response.data.cartLinesUpdate.cart;
}

/**
 * Remove lines from cart
 * @param cartId Cart ID
 * @param lineIds Line IDs to remove
 * @returns Updated cart
 */
export async function removeFromCart(cartId: string, lineIds: string[]) {
  const query = `
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          lines(first: 10) {
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
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const response = await shopifyClient.query({
    data: {
      query,
      variables: {
        cartId,
        lineIds
      },
    },
    cache: false
  });

  return response.data.cartLinesRemove.cart;
}

/**
 * Get checkout URL for cart
 * @param cartId Cart ID
 * @returns Checkout URL
 */
export async function getCheckoutUrl(cartId: string) {
  const query = `
    query CartCheckoutUrl($cartId: ID!) {
      cart(id: $cartId) {
        checkoutUrl
      }
    }
  `;

  const response = await shopifyClient.query({
    data: {
      query,
      variables: {
        cartId
      },
    },
    cache: false
  });

  return response.data.cart.checkoutUrl;
}
