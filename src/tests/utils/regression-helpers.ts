/**
 * Regression Test Utilities
 * 
 * Helper functions and utilities for regression testing of Shopify integration.
 * Created as part of TASK-105 Phase 1 implementation.
 */

import { ShopifyProduct, ShopifyCart } from '../../types/shopify';

/**
 * Mock data generators for consistent testing
 */
export const mockDataGenerators = {
  /**
   * Generate a mock Shopify product with realistic data
   */
  createMockProduct(overrides: Partial<ShopifyProduct> = {}): ShopifyProduct {
    return {
      id: 'gid://shopify/Product/123456789',
      title: 'Test Ergonomic Office Chair',
      handle: 'test-ergonomic-office-chair',
      description: 'A comfortable and ergonomic office chair perfect for long work sessions.',
      priceRange: {
        minVariantPrice: {
          amount: '299.99',
          currencyCode: 'USD'
        }
      },
      compareAtPriceRange: {
        minVariantPrice: {
          amount: '399.99',
          currencyCode: 'USD'
        }
      },
      images: {
        edges: [
          {
            node: {
              url: 'https://cdn.shopify.com/test-chair-1.jpg',
              altText: 'Test Ergonomic Office Chair - Front View'
            }
          },
          {
            node: {
              url: 'https://cdn.shopify.com/test-chair-2.jpg',
              altText: 'Test Ergonomic Office Chair - Side View'
            }
          }
        ]
      },
      variants: {
        edges: [
          {
            node: {
              id: 'gid://shopify/ProductVariant/987654321',
              title: 'Black / Standard',
              price: {
                amount: '299.99',
                currencyCode: 'USD'
              },
              compareAtPrice: {
                amount: '399.99',
                currencyCode: 'USD'
              },
              availableForSale: true
            }
          },
          {
            node: {
              id: 'gid://shopify/ProductVariant/987654322',
              title: 'White / Standard',
              price: {
                amount: '299.99',
                currencyCode: 'USD'
              },
              availableForSale: true
            }
          }
        ]
      },
      tags: ['ergonomic', 'office', 'chair', 'professional'],
      collections: {
        edges: [
          {
            node: {
              id: 'gid://shopify/Collection/111111111',
              handle: 'office-chairs',
              title: 'Office Chairs'
            }
          }
        ]
      },
      totalInventory: 50,
      metafields: {
        maxWeight: '150kg',
        adjustableHeight: 'Yes',
        seatMaterial: 'Premium Mesh',
        frameMaterial: 'Aluminum',
        height: '120-130cm',
        seatWidth: '50cm',
        seatDepth: '48cm',
        backrestHeight: '65cm'
      },
      ...overrides
    };
  },

  /**
   * Generate a mock Shopify cart with realistic data
   */
  createMockCart(overrides: Partial<ShopifyCart> = {}): ShopifyCart {
    return {
      id: 'gid://shopify/Cart/c1-test-cart-id',
      lines: {
        edges: [
          {
            node: {
              id: 'gid://shopify/CartLine/line-1',
              quantity: 1,
              merchandise: {
                id: 'gid://shopify/ProductVariant/987654321',
                title: 'Black / Standard',
                product: {
                  title: 'Test Ergonomic Office Chair'
                },
                price: {
                  amount: '299.99',
                  currencyCode: 'USD'
                }
              }
            }
          }
        ]
      },
      cost: {
        subtotalAmount: {
          amount: '299.99',
          currencyCode: 'USD'
        },
        totalAmount: {
          amount: '299.99',
          currencyCode: 'USD'
        }
      },
      ...overrides
    };
  },

  /**
   * Generate multiple mock products for list testing
   */
  createMockProductList(count: number): ShopifyProduct[] {
    return Array.from({ length: count }, (_, index) => 
      this.createMockProduct({
        id: `gid://shopify/Product/${123456789 + index}`,
        title: `Test Product ${index + 1}`,
        handle: `test-product-${index + 1}`,
        priceRange: {
          minVariantPrice: {
            amount: `${(index + 1) * 50}.99`,
            currencyCode: 'USD'
          }
        }
      })
    );
  }
};

/**
 * Performance testing utilities
 */
export const performanceHelpers = {
  /**
   * Measure execution time of an async function
   */
  async measureExecutionTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const startTime = performance.now();
    const result = await fn();
    const endTime = performance.now();
    return {
      result,
      duration: endTime - startTime
    };
  },

  /**
   * Run a function multiple times and get average execution time
   */
  async measureAverageExecutionTime<T>(
    fn: () => Promise<T>, 
    iterations: number = 5
  ): Promise<{ results: T[]; averageDuration: number; minDuration: number; maxDuration: number }> {
    const measurements: { result: T; duration: number }[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const measurement = await this.measureExecutionTime(fn);
      measurements.push(measurement);
    }

    const durations = measurements.map(m => m.duration);
    const averageDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);

    return {
      results: measurements.map(m => m.result),
      averageDuration,
      minDuration,
      maxDuration
    };
  },

  /**
   * Assert that a function completes within a time limit
   */
  async assertExecutionTime<T>(
    fn: () => Promise<T>, 
    maxDuration: number, 
    errorMessage?: string
  ): Promise<T> {
    const { result, duration } = await this.measureExecutionTime(fn);
    
    if (duration > maxDuration) {
      throw new Error(
        errorMessage || 
        `Function took ${duration.toFixed(2)}ms, expected less than ${maxDuration}ms`
      );
    }
    
    return result;
  }
};

/**
 * Error simulation utilities for testing error handling
 */
export const errorSimulators = {
  /**
   * Create network error scenarios
   */
  networkErrors: {
    timeout: () => new Error('Request timeout'),
    connectionRefused: () => new Error('Connection refused'),
    networkUnavailable: () => new Error('Network unavailable'),
    serverError: (status: number = 500) => new Error(`Server error: ${status}`)
  },

  /**
   * Create Shopify-specific error scenarios
   */
  shopifyErrors: {
    invalidProduct: () => new Error('Product not found'),
    invalidVariant: () => new Error('Product variant not found'),
    cartNotFound: () => new Error('Cart not found'),
    insufficientInventory: () => new Error('Insufficient inventory'),
    invalidGraphQL: () => new Error('GraphQL syntax error')
  },

  /**
   * Create data corruption scenarios
   */
  dataCorruption: {
    nullProduct: () => null,
    invalidProductStructure: () => ({ id: null, title: undefined }),
    corruptedCart: () => ({
      id: 'corrupted',
      lines: { edges: [{ node: null }] },
      cost: null
    }),
    malformedJSON: () => '{"invalid": json}'
  }
};

/**
 * Test state management utilities
 */
export const stateHelpers = {
  /**
   * Create a clean localStorage mock
   */
  createMockLocalStorage() {
    const store: Record<string, string> = {};
    
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach(key => delete store[key]);
      }),
      get store() {
        return { ...store };
      }
    };
  },

  /**
   * Simulate component re-renders
   */
  async simulateReRenders(renderFn: () => void, count: number = 5, delay: number = 10) {
    for (let i = 0; i < count; i++) {
      renderFn();
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  },

  /**
   * Simulate DOM changes that might occur during style updates
   */
  simulateStyleChanges() {
    const originalClassName = document.body.className;
    const originalStyles = document.documentElement.style.cssText;

    // Apply style changes
    document.body.className = 'theme-dark regression-test';
    document.documentElement.style.setProperty('--primary-color', '#000000');
    document.documentElement.style.setProperty('--background-color', '#ffffff');

    // Return cleanup function
    return () => {
      document.body.className = originalClassName;
      document.documentElement.style.cssText = originalStyles;
    };
  }
};

/**
 * Assertion helpers for regression testing
 */
export const assertionHelpers = {
  /**
   * Assert that cart state is consistent
   */
  assertCartConsistency(cart: any, expectedCount: number, expectedTotal?: string) {
    expect(cart.cartCount).toBe(expectedCount);
    expect(cart.cartItems).toHaveLength(expectedCount);
    
    if (expectedTotal) {
      expect(cart.cartTotal).toBe(expectedTotal);
    }
    
    // Verify cart items are valid
    cart.cartItems.forEach((item: any) => {
      expect(item.id).toBeDefined();
      expect(item.merchandiseId).toBeDefined();
      expect(item.quantity).toBeGreaterThan(0);
      expect(item.title).toBeDefined();
      expect(item.price).toBeDefined();
    });
  },

  /**
   * Assert that product data is valid and consistent
   */
  assertProductConsistency(product: ShopifyProduct) {
    expect(product.id).toBeDefined();
    expect(product.title).toBeDefined();
    expect(product.handle).toBeDefined();
    expect(product.priceRange).toBeDefined();
    expect(product.priceRange.minVariantPrice.amount).toBeDefined();
    expect(product.priceRange.minVariantPrice.currencyCode).toBeDefined();
    
    // Verify images structure
    expect(product.images).toBeDefined();
    expect(product.images.edges).toBeInstanceOf(Array);
    
    // Verify variants if present
    if (product.variants) {
      expect(product.variants.edges).toBeInstanceOf(Array);
      product.variants.edges.forEach(edge => {
        expect(edge.node.id).toBeDefined();
        expect(edge.node.price).toBeDefined();
      });
    }
  }
};
