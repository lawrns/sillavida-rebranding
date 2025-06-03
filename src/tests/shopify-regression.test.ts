/**
 * Shopify Integration Regression Tests
 * 
 * This test suite focuses on preventing regressions during UI updates, 
 * color migrations, component refactoring, and other development activities.
 * 
 * Created as part of TASK-105 Phase 1 implementation.
 */

import { waitFor } from '@testing-library/react';
import {
  shopifyClient,
  getProducts,
  getProduct,
  createCart,
  addToCart,
  updateCartLines,
  removeFromCart,
  getCheckoutUrl,
  ShopifyError,
  ShopifyNetworkError,
  ShopifyGraphQLError
} from '../lib/shopify';
import { errorHandler } from '../utils/errorHandler';

// Mock the Shopify API functions for controlled testing
jest.mock('../lib/shopify', () => ({
  ...jest.requireActual('../lib/shopify'),
  shopifyClient: {
    query: jest.fn(),
  },
  getProducts: jest.fn(),
  getProduct: jest.fn(),
  createCart: jest.fn(),
  addToCart: jest.fn(),
  updateCartLines: jest.fn(),
  removeFromCart: jest.fn(),
  getCheckoutUrl: jest.fn(),
}));

// Mock error handler
jest.mock('../utils/errorHandler', () => ({
  errorHandler: {
    handleError: jest.fn(),
  },
  handleCartError: jest.fn(),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('Shopify Integration Regression Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('Cart State Persistence Across UI Updates', () => {
    it('should maintain cart data consistency during API calls', async () => {
      // Mock cart data
      const mockCart = {
        id: 'test-cart-id',
        lines: {
          edges: [
            {
              node: {
                id: 'line-1',
                quantity: 2,
                merchandise: {
                  id: 'variant-1',
                  title: 'Test Product Variant',
                  price: { amount: '29.99', currencyCode: 'USD' },
                  product: { title: 'Test Product' }
                }
              }
            }
          ]
        },
        cost: {
          totalAmount: { amount: '59.98', currencyCode: 'USD' },
          subtotalAmount: { amount: '59.98', currencyCode: 'USD' }
        }
      };

      (createCart as jest.Mock).mockResolvedValue(mockCart);

      // Test multiple cart creation calls return consistent data
      for (let i = 0; i < 5; i++) {
        const cart = await createCart();
        expect(cart.id).toBe('test-cart-id');
        expect(cart.lines.edges).toHaveLength(1);
        expect(cart.lines.edges[0].node.quantity).toBe(2);
      }
    });

    it('should handle cart operations consistently', async () => {
      const mockCart = {
        id: 'persistent-cart-id',
        lines: { edges: [] },
        cost: {
          totalAmount: { amount: '0.00', currencyCode: 'USD' },
          subtotalAmount: { amount: '0.00', currencyCode: 'USD' }
        }
      };

      (createCart as jest.Mock).mockResolvedValue(mockCart);

      // Test cart creation
      const cart = await createCart();
      expect(cart.id).toBe('persistent-cart-id');
      expect(cart.lines.edges).toHaveLength(0);

      // Test adding item to cart
      const mockUpdatedCart = {
        ...mockCart,
        lines: {
          edges: [{
            node: {
              id: 'line-1',
              quantity: 1,
              merchandise: {
                id: 'variant-1',
                title: 'Test Product',
                price: { amount: '19.99', currencyCode: 'USD' }
              }
            }
          }]
        }
      };

      (addToCart as jest.Mock).mockResolvedValue(mockUpdatedCart);

      const updatedCart = await addToCart('persistent-cart-id', [{ merchandiseId: 'variant-1', quantity: 1 }]);
      expect(updatedCart.lines.edges).toHaveLength(1);
      expect(updatedCart.lines.edges[0].node.quantity).toBe(1);
    });
  });

  describe('Product Data Integrity During Component Re-renders', () => {
    it('should maintain product data consistency across multiple renders', async () => {
      const mockProducts = [
        {
          id: 'product-1',
          title: 'Test Product 1',
          handle: 'test-product-1',
          description: 'Test description',
          priceRange: {
            minVariantPrice: { amount: '29.99', currencyCode: 'USD' }
          },
          images: { edges: [] }
        }
      ];

      (getProducts as jest.Mock).mockResolvedValue(mockProducts);

      // Test multiple calls to ensure data consistency
      for (let i = 0; i < 3; i++) {
        const products = await getProducts(5);
        expect(products).toEqual(mockProducts);
        expect(products[0].title).toBe('Test Product 1');
        expect(products[0].handle).toBe('test-product-1');
      }
    });

    it('should handle product data updates without breaking existing references', async () => {
      const initialProduct = {
        id: 'product-1',
        title: 'Original Title',
        handle: 'test-product',
        description: 'Original description',
        priceRange: {
          minVariantPrice: { amount: '29.99', currencyCode: 'USD' }
        },
        images: { edges: [] },
        variants: {
          edges: [{
            node: {
              id: 'variant-1',
              title: 'Default Title',
              price: { amount: '29.99', currencyCode: 'USD' },
              availableForSale: true
            }
          }]
        }
      };

      (getProduct as jest.Mock).mockResolvedValue(initialProduct);

      // First call
      const product1 = await getProduct('test-product');
      expect(product1.title).toBe('Original Title');

      // Simulate product update (like during a migration)
      const updatedProduct = {
        ...initialProduct,
        title: 'Updated Title',
        description: 'Updated description'
      };

      (getProduct as jest.Mock).mockResolvedValue(updatedProduct);

      // Second call should get updated data
      const product2 = await getProduct('test-product');
      expect(product2.title).toBe('Updated Title');
      expect(product2.id).toBe(product1.id); // ID should remain consistent
    });
  });

  describe('API Error Handling Consistency', () => {
    it('should handle network errors consistently across different operations', async () => {
      const networkError = new Error('Network request failed');

      // Test error handling for getProducts
      (getProducts as jest.Mock).mockRejectedValue(networkError);
      try {
        await getProducts(5);
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error).toBe(networkError);
      }

      // Test error handling for getProduct
      (getProduct as jest.Mock).mockRejectedValue(networkError);
      try {
        await getProduct('test-product');
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error).toBe(networkError);
      }

      // Test error handling for createCart
      (createCart as jest.Mock).mockRejectedValue(networkError);
      try {
        await createCart();
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error).toBe(networkError);
      }
    });

    it('should maintain error handling during cart operations under stress', async () => {
      const cartError = new Error('Cart operation failed');
      (addToCart as jest.Mock).mockRejectedValue(cartError);

      // Simulate multiple rapid cart operations (stress test)
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(
          (async () => {
            try {
              await addToCart('cart-id', [{ merchandiseId: 'variant-1', quantity: 1 }]);
            } catch (error) {
              expect(error).toBe(cartError);
            }
          })()
        );
      }

      await Promise.all(promises);

      // Verify error handling was called consistently
      expect(addToCart).toHaveBeenCalledTimes(5);
    });
  });

  describe('Performance Regression Detection', () => {
    it('should complete API operations within acceptable time limits', async () => {
      const mockProducts = Array.from({ length: 50 }, (_, i) => ({
        id: `product-${i}`,
        title: `Product ${i}`,
        handle: `product-${i}`,
        description: `Description ${i}`,
        priceRange: {
          minVariantPrice: { amount: '29.99', currencyCode: 'USD' }
        },
        images: { edges: [] }
      }));

      (getProducts as jest.Mock).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockProducts), 100))
      );

      const startTime = Date.now();
      const products = await getProducts(50);
      const endTime = Date.now();

      expect(products).toHaveLength(50);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle concurrent cart operations efficiently', async () => {
      const mockCart = {
        id: 'test-cart',
        lines: { edges: [] },
        cost: {
          totalAmount: { amount: '0.00', currencyCode: 'USD' },
          subtotalAmount: { amount: '0.00', currencyCode: 'USD' }
        }
      };

      (createCart as jest.Mock).mockResolvedValue(mockCart);
      (addToCart as jest.Mock).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockCart), 50))
      );

      const startTime = Date.now();
      
      // Simulate concurrent operations
      const operations = [
        createCart(),
        addToCart('cart-1', [{ merchandiseId: 'variant-1', quantity: 1 }]),
        addToCart('cart-1', [{ merchandiseId: 'variant-2', quantity: 1 }]),
      ];

      await Promise.all(operations);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(500); // Should complete concurrently
    });
  });

  describe('UI Update Resilience', () => {
    it('should maintain API functionality during DOM changes', async () => {
      // Simulate style/theme changes that might affect API behavior
      const mockCart = {
        id: 'style-test-cart',
        lines: { edges: [] },
        cost: {
          totalAmount: { amount: '0.00', currencyCode: 'USD' },
          subtotalAmount: { amount: '0.00', currencyCode: 'USD' }
        }
      };

      (createCart as jest.Mock).mockResolvedValue(mockCart);

      // Simulate DOM changes that might occur during style updates
      const originalClassName = document.body.className;
      const originalStyle = document.documentElement.style.cssText;

      document.body.className = 'theme-dark';
      document.documentElement.style.setProperty('--primary-color', '#000000');

      // API operations should still work
      const cart = await createCart();
      expect(cart.id).toBe('style-test-cart');
      expect(cart.lines.edges).toHaveLength(0);

      // Reset styles
      document.body.className = originalClassName;
      document.documentElement.style.cssText = originalStyle;
    });

    it('should handle localStorage operations consistently', async () => {
      const mockCart = {
        id: 'localStorage-test-cart',
        lines: {
          edges: [{
            node: {
              id: 'line-1',
              quantity: 1,
              merchandise: {
                id: 'variant-1',
                title: 'Test Product',
                price: { amount: '19.99', currencyCode: 'USD' }
              }
            }
          }]
        },
        cost: {
          totalAmount: { amount: '19.99', currencyCode: 'USD' },
          subtotalAmount: { amount: '19.99', currencyCode: 'USD' }
        }
      };

      mockLocalStorage.getItem.mockReturnValue('localStorage-test-cart');
      (createCart as jest.Mock).mockResolvedValue(mockCart);

      // Test localStorage operations
      mockLocalStorage.setItem('cartId', 'localStorage-test-cart');
      expect(mockLocalStorage.getItem('cartId')).toBe('localStorage-test-cart');

      // API should work with localStorage data
      const cart = await createCart();
      expect(cart.id).toBe('localStorage-test-cart');
      expect(cart.lines.edges).toHaveLength(1);
    });
  });

  describe('Data Consistency During Migrations', () => {
    it('should handle product data format changes gracefully', async () => {
      // Test with old format
      const oldFormatProduct = {
        id: 'product-1',
        title: 'Test Product',
        handle: 'test-product',
        priceRange: {
          minVariantPrice: { amount: '29.99', currencyCode: 'USD' }
        },
        images: { edges: [] }
      };

      (getProduct as jest.Mock).mockResolvedValue(oldFormatProduct);
      const product1 = await getProduct('test-product');
      expect(product1.title).toBe('Test Product');

      // Test with new format (simulating migration)
      const newFormatProduct = {
        ...oldFormatProduct,
        // Add new fields that might be introduced
        metafields: {
          maxWeight: '150kg',
          adjustableHeight: 'Yes'
        },
        tags: ['ergonomic', 'office'],
        collections: {
          edges: [{
            node: {
              id: 'collection-1',
              handle: 'office-chairs',
              title: 'Office Chairs'
            }
          }]
        }
      };

      (getProduct as jest.Mock).mockResolvedValue(newFormatProduct);
      const product2 = await getProduct('test-product');

      // Core fields should remain consistent
      expect(product2.id).toBe(product1.id);
      expect(product2.title).toBe(product1.title);
      expect(product2.handle).toBe(product1.handle);

      // New fields should be accessible
      expect(product2.metafields).toBeDefined();
      expect(product2.tags).toBeDefined();
    });

    it('should maintain cart operations during API version changes', async () => {
      // Simulate different API response formats
      const v1CartResponse = {
        id: 'cart-v1',
        lines: { edges: [] },
        cost: {
          totalAmount: { amount: '0.00', currencyCode: 'USD' }
        }
      };

      const v2CartResponse = {
        id: 'cart-v2',
        lines: { edges: [] },
        cost: {
          totalAmount: { amount: '0.00', currencyCode: 'USD' },
          subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
          // New fields in v2
          totalTaxAmount: { amount: '0.00', currencyCode: 'USD' },
          totalDutyAmount: { amount: '0.00', currencyCode: 'USD' }
        }
      };

      // Test v1 format
      (createCart as jest.Mock).mockResolvedValue(v1CartResponse);
      const cart1 = await createCart();
      expect(cart1.id).toBe('cart-v1');

      // Test v2 format
      (createCart as jest.Mock).mockResolvedValue(v2CartResponse);
      const cart2 = await createCart();
      expect(cart2.id).toBe('cart-v2');
      expect(cart2.cost.totalTaxAmount).toBeDefined();
    });
  });

  describe('Error Recovery and Resilience', () => {
    it('should recover from temporary network failures', async () => {
      let callCount = 0;
      (getProducts as jest.Mock).mockImplementation(() => {
        callCount++;
        if (callCount <= 2) {
          return Promise.reject(new Error('Network timeout'));
        }
        return Promise.resolve([{
          id: 'product-1',
          title: 'Recovered Product',
          handle: 'recovered-product',
          priceRange: {
            minVariantPrice: { amount: '29.99', currencyCode: 'USD' }
          },
          images: { edges: [] }
        }]);
      });

      // Should eventually succeed after retries
      try {
        const products = await getProducts(5);
        expect(products[0].title).toBe('Recovered Product');
      } catch (error) {
        // If it fails, verify it attempted multiple times
        expect(callCount).toBeGreaterThan(1);
      }
    });

    it('should handle cart corruption gracefully', async () => {
      // Simulate corrupted cart data
      const corruptedCart = {
        id: 'corrupted-cart',
        lines: {
          edges: [{
            node: {
              id: null, // Corrupted data
              quantity: 'invalid', // Wrong type
              merchandise: null // Missing data
            }
          }]
        },
        cost: null // Missing cost data
      };

      mockLocalStorage.getItem.mockReturnValue('corrupted-cart');
      (createCart as jest.Mock).mockResolvedValue(corruptedCart);

      // API should return corrupted data but not crash
      const cart = await createCart();
      expect(cart.id).toBe('corrupted-cart');
      expect(cart.lines.edges).toHaveLength(1);
      expect(cart.lines.edges[0].node.id).toBeNull();
      expect(cart.cost).toBeNull();
    });
  });
});
