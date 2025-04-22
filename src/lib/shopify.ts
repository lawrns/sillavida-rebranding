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
 * Get a list of products with pagination support
 * @param limit Number of products to fetch (default: 10)
 * @param sortKey Field to sort by (default: BEST_SELLING)
 * @param reverse Reverse the sort order (default: false)
 * @param cursor Cursor for pagination (optional)
 * @returns Object containing products array and pagination info
 */
export async function getProducts(
  limit = 10, 
  sortKey = 'BEST_SELLING', 
  reverse = false,
  cursor?: string
): Promise<{ 
  products: ShopifyProduct[]; 
  pageInfo: { 
    hasNextPage: boolean; 
    endCursor: string | null;
  } 
}> {
  const query = `
    query Products($limit: Int!, $sortKey: ProductSortKeys!, $reverse: Boolean!, $cursor: String) {
      products(first: $limit, sortKey: $sortKey, reverse: $reverse, after: $cursor) {
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
            compareAtPriceRange {
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
      variables: { 
        limit,
        sortKey,
        reverse,
        cursor: cursor || null
      }
    },
  });

  const products = response.data.products.edges.map((edge: any) => edge.node);
  const pageInfo = response.data.products.pageInfo;

  return {
    products,
    pageInfo
  };
}

/**
 * Get featured products based on collection or tag
 * @param options Options for fetching featured products
 * @param options.collectionHandle Collection handle to fetch products from (optional)
 * @param options.tag Tag to filter products by (optional)
 * @param options.limit Number of products to fetch (default: 4)
 * @returns Array of featured products
 */
export async function getFeaturedProducts({
  collectionHandle,
  tag,
  limit = 4
}: {
  collectionHandle?: string;
  tag?: string;
  limit?: number;
}): Promise<ShopifyProduct[]> {
  // If a collection handle is provided, get products from that collection
  if (collectionHandle) {
    const result = await getProductsByCollection(collectionHandle, limit);
    return result.products;
  }
  
  // If a tag is provided, get products with that tag
  if (tag) {
    const query = `
      query ProductsByTag($tag: String!, $limit: Int!) {
        products(first: $limit, query: "tag:$tag") {
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
              compareAtPriceRange {
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
        variables: { 
          tag,
          limit
        }
      },
    });

    return response.data.products.edges.map((edge: any) => edge.node);
  }
  
  // If no collection or tag is provided, get best-selling products
  const result = await getProducts(limit, 'BEST_SELLING');
  return result.products;
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
        tags # Added tags
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
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
              compareAtPrice {
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
              compareAtPriceRange {
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
              variants(first: 1) {
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

// Mock cart for demonstration purposes
let mockCart: any = null;

// Add a flag to force using mock variants for testability
const FORCE_MOCK_CART = false; // Set to false to use real Shopify API for cart operations

// Mock product data for our test variants
const mockProducts: Record<string, { title: string, price: number, productTitle: string }> = {
  "mock-variant-123456789": { title: "Ergonomic Chair", price: 2399.99, productTitle: "Ergonomic Chair" },
  "mock-variant-234567890": { title: "Executive Chair", price: 2599.99, productTitle: "Executive Chair" },
  "mock-variant-345678901": { title: "Gamer Chair", price: 2639.91, productTitle: "Gamer Chair Experience" },
  "mock-variant-456789012": { title: "Visitor Chair", price: 1399.99, productTitle: "Visitor Chair" },
  "mock-variant-567890123": { title: "Secretarial Chair", price: 1899.99, productTitle: "Secretarial Chair" },
  "mock-variant-678901234": { title: "Gaming Chair Pro", price: 2899.99, productTitle: "Gaming Chair Pro" },
  "mock-variant-789012345": { title: "Chair Accessory", price: 599.99, productTitle: "Chair Accessory" }
};

// Check if a variant ID is one of our mock variants
function isMockVariant(variantId: string): boolean {
  return variantId.startsWith('mock-variant-');
}

// Generate mock cart line item
function generateMockCartLine(merchandiseId: string, quantity: number) {
  // Generate a random unique ID for the line item
  const lineId = `gid://shopify/CartLine/${Date.now() + Math.floor(Math.random() * 1000000)}`;
  
  // Get the mock product data or use a default
  const mockProduct = mockProducts[merchandiseId] || { 
    title: "Mock Product", 
    price: 1000.00,
    productTitle: "Mock Product" 
  };
  
  return {
    id: lineId,
    quantity,
    merchandise: {
      id: merchandiseId,
      title: mockProduct.title,
      product: {
        title: mockProduct.productTitle
      },
      price: {
        amount: mockProduct.price.toString(),
        currencyCode: "MXN"
      }
    }
  };
}

// Calculate the total cost of a mock cart
function calculateMockCartCost(lines: any[]) {
  const subtotal = lines.reduce((sum, line) => {
    return sum + (parseFloat(line.merchandise.price.amount) * line.quantity);
  }, 0);
  
  return {
    subtotalAmount: {
      amount: subtotal.toString(),
      currencyCode: "MXN"
    },
    totalAmount: {
      amount: subtotal.toString(),  // In a real implementation, this would include taxes and shipping
      currencyCode: "MXN"
    }
  };
}

/**
 * Create a new cart
 * @param lines Optional initial cart lines
 * @returns Cart data
 */
export async function createCart(lines: { merchandiseId: string; quantity: number }[] = []) {
  console.log('[Shopify] Creating cart with lines:', lines);
  
  // Check if all lines are mock variants or if we should force mock implementation
  const allMockVariants = lines.every(line => isMockVariant(line.merchandiseId));
  
  // If lines contain mock variants or if we should force mock implementation, use mock implementation
  if (allMockVariants || FORCE_MOCK_CART) {
    console.log('[Shopify] Using mock cart implementation for demonstration');
    
    try {
      // Generate a mock cart ID
      const cartId = `mock-cart-${Date.now()}`;
      
      // Create mock cart lines
      const cartLines = lines.map(line => 
        generateMockCartLine(line.merchandiseId, line.quantity)
      );
      
      // Calculate mock cart cost
      const cost = calculateMockCartCost(cartLines);
      
      // Create the mock cart structure
      mockCart = {
        id: cartId,
        lines: {
          edges: cartLines.map(line => ({ node: line }))
        },
        cost: cost,
        checkoutUrl: `/checkout?cart=${cartId}`
      };
      
      console.log('[Shopify] Mock cart created:', mockCart);
      
      return mockCart;
    } catch (error) {
      console.error('[Shopify] Error creating mock cart:', error);
      
      throw new ShopifyError(`Unable to create cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // For real variants, use Shopify API
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
                    image {
                      url
                      altText
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
        userErrors {
          field
          message
        }
      }
    }
  `;

  const formattedLines = lines.map(line => ({
    merchandiseId: line.merchandiseId,
    quantity: line.quantity
  }));

  try {
    const response = await shopifyClient.query({
      data: {
        query,
        variables: {
          lines: formattedLines
        },
      },
      cache: false
    });
    
    console.log('[Shopify] Cart creation response:', response);
    
    // Check for user errors
    if (response.data.cartCreate.userErrors && response.data.cartCreate.userErrors.length > 0) {
      console.error('[Shopify] Cart creation user errors:', response.data.cartCreate.userErrors);
      throw new Error(`Cart creation failed: ${response.data.cartCreate.userErrors[0].message}`);
    }
    
    // Check if cart is null
    if (!response.data.cartCreate.cart) {
      console.error('[Shopify] Cart creation failed: cart is null');
      throw new Error('Cart creation failed: cart is null');
    }
    
    return response.data.cartCreate.cart;
  } catch (error) {
    console.error('[Shopify] Error creating cart:', error);
    
    // If we get here and have mock variants, try the mock implementation
    if (lines.some(line => isMockVariant(line.merchandiseId))) {
      console.warn('[Shopify] Falling back to mock cart implementation');
      return createCart(lines.filter(line => isMockVariant(line.merchandiseId)));
    }
    
    // Otherwise throw the error
    if (error instanceof Error) {
      throw new ShopifyError(`Unable to create cart: ${error.message}`);
    } else {
      throw new ShopifyError('Unable to create cart: Unknown error');
    }
  }
}

/**
 * Get cart by ID
 * @param cartId Cart ID
 * @returns Cart data
 */
export async function getCart(cartId: string): Promise<ShopifyCart> {
  // Check if it's a mock cart
  if (cartId.startsWith('mock-cart-') && mockCart && mockCart.id === cartId) {
    console.log('[Shopify] Returning mock cart:', mockCart);
    return mockCart;
  }
  
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
                  image {
                    url
                    altText
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

  try {
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
  } catch (error) {
    console.error('[Shopify] Error getting cart:', error);
    throw new ShopifyError(`Unable to get cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Add items to cart
 * @param cartId Cart ID
 * @param lines Lines to add
 * @returns Updated cart
 */
export async function addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]) {
  console.log('[Shopify] Adding to cart:', { cartId, lines });
  
  // Check if it's a mock cart or if lines contain mock variants or if we should force mock implementation
  const isMockCartId = cartId.startsWith('mock-cart-');
  const containsMockVariants = lines.some(line => isMockVariant(line.merchandiseId));
  
  // If it's a mock cart or contains mock variants or if we should force mock implementation, use mock implementation
  if (isMockCartId || containsMockVariants || FORCE_MOCK_CART) {
    console.log('[Shopify] Using mock cart implementation for demonstration');
    
    try {
      // If we don't have a mock cart yet, create one
      if (!mockCart || mockCart.id !== cartId) {
        // For a real cart ID with mock variants, create a new mock cart
        return await createCart(lines);
      }
      
      // Add lines to existing mock cart
      const newCartLines = lines.map(line => 
        generateMockCartLine(line.merchandiseId, line.quantity)
      );
      
      // Merge with existing cart lines
      const existingLines = mockCart.lines.edges.map((edge: any) => edge.node);
      const allLines = [...existingLines, ...newCartLines];
      
      // Recalculate cost
      const cost = calculateMockCartCost(allLines);
      
      // Update mock cart
      mockCart = {
        ...mockCart,
        lines: {
          edges: allLines.map(line => ({ node: line }))
        },
        cost: cost
      };
      
      console.log('[Shopify] Updated mock cart:', mockCart);
      
      return mockCart;
    } catch (error) {
      console.error('[Shopify] Error adding to mock cart:', error);
      throw new ShopifyError(`Unable to add item to cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // Use real Shopify API for non-mock cart
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
                    image {
                      url
                      altText
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
        userErrors {
          field
          message
        }
      }
    }
  `;

  const formattedLines = lines.map(line => ({
    merchandiseId: line.merchandiseId,
    quantity: line.quantity
  }));

  try {
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
    
    console.log('[Shopify] Add to cart response:', response);
    
    // Check for user errors
    if (response.data.cartLinesAdd.userErrors && response.data.cartLinesAdd.userErrors.length > 0) {
      console.error('[Shopify] Add to cart user errors:', response.data.cartLinesAdd.userErrors);
      throw new Error(`Add to cart failed: ${response.data.cartLinesAdd.userErrors[0].message}`);
    }
    
    // Check if cart is null
    if (!response.data.cartLinesAdd.cart) {
      console.error('[Shopify] Add to cart failed: cart is null');
      throw new Error('Add to cart failed: cart is null');
    }
    
    return response.data.cartLinesAdd.cart;
  } catch (error) {
    console.error('[Shopify] Error adding to cart:', error);
    
    // Throw a more user-friendly error
    if (error instanceof Error) {
      throw new ShopifyError(`Unable to add item to cart: ${error.message}`);
    } else {
      throw new ShopifyError('Unable to add item to cart: Unknown error');
    }
  }
}

/**
 * Update cart lines
 * @param cartId Cart ID
 * @param lines Lines to update
 * @returns Updated cart
 */
export async function updateCartLines(cartId: string, lines: { id: string; quantity: number }[]) {
  // Check if it's a mock cart
  if (cartId.startsWith('mock-cart-') && mockCart) {
    console.log('[Shopify] Updating mock cart lines:', lines);
    
    try {
      // Update the mock cart lines
      const updatedEdges = mockCart.lines.edges.map((edge: any) => {
        const line = lines.find(l => l.id === edge.node.id);
        if (line) {
          return {
            node: {
              ...edge.node,
              quantity: line.quantity
            }
          };
        }
        return edge;
      });
      
      // Calculate the new cost
      const cost = calculateMockCartCost(updatedEdges.map((edge: any) => edge.node));
      
      // Update the mock cart
      mockCart = {
        ...mockCart,
        lines: {
          edges: updatedEdges
        },
        cost: cost
      };
      
      console.log('[Shopify] Mock cart updated:', mockCart);
      
      return mockCart;
    } catch (error) {
      console.error('[Shopify] Error updating mock cart:', error);
      throw new ShopifyError(`Unable to update cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // Use real Shopify API for non-mock cart
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
                    image {
                      url
                      altText
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
  // Check if it's a mock cart
  if (cartId.startsWith('mock-cart-') && mockCart) {
    console.log('[Shopify] Removing items from mock cart:', lineIds);
    
    try {
      // Filter out the lines to remove
      const filteredEdges = mockCart.lines.edges.filter((edge: any) => 
        !lineIds.includes(edge.node.id)
      );
      
      // Calculate the new cost
      const cost = calculateMockCartCost(filteredEdges.map((edge: any) => edge.node));
      
      // Update the mock cart
      mockCart = {
        ...mockCart,
        lines: {
          edges: filteredEdges
        },
        cost: cost
      };
      
      console.log('[Shopify] Mock cart updated after removal:', mockCart);
      
      return mockCart;
    } catch (error) {
      console.error('[Shopify] Error removing from mock cart:', error);
      throw new ShopifyError(`Unable to remove item from cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // Use real Shopify API for non-mock cart
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
                    image {
                      url
                      altText
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
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
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
    
    // Check for user errors
    if (response.data.cartLinesRemove.userErrors && response.data.cartLinesRemove.userErrors.length > 0) {
      console.error('[Shopify] Remove from cart user errors:', response.data.cartLinesRemove.userErrors);
      throw new Error(`Remove from cart failed: ${response.data.cartLinesRemove.userErrors[0].message}`);
    }
    
    return response.data.cartLinesRemove.cart;
  } catch (error) {
    console.error('[Shopify] Error removing from cart:', error);
    
    // Throw a more user-friendly error
    if (error instanceof Error) {
      throw new ShopifyError(`Unable to remove item from cart: ${error.message}`);
    } else {
      throw new ShopifyError('Unable to remove item from cart: Unknown error');
    }
  }
}

/**
 * Get checkout URL for cart
 * @param cartId Cart ID
 * @param isGuestCheckout Whether to use guest checkout
 * @returns Checkout URL
 */
export async function getCheckoutUrl(cartId: string, isGuestCheckout: boolean = false) {
  // Check if it's a mock cart
  if (cartId.startsWith('mock-cart-') && mockCart) {
    console.log('[Shopify] Returning mock checkout URL');
    const guestParam = isGuestCheckout ? '&guest=true' : '';
    return `/checkout?cart=${cartId}${guestParam}`;
  }
  
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

  // Get the base checkout URL
  const baseCheckoutUrl = response.data.cart.checkoutUrl;
  
  // Add guest checkout parameter if requested
  if (isGuestCheckout) {
    // Shopify uses 'checkout[email]' parameter for guest checkout
    // We'll add a placeholder that will be replaced by the user's email
    // We also add 'checkout[remember_me]=0' to disable account creation prompt
    const separator = baseCheckoutUrl.includes('?') ? '&' : '?';
    return `${baseCheckoutUrl}${separator}checkout[remember_me]=0`;
  }
  
  return baseCheckoutUrl;
}
