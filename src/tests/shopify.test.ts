/**
 * Shopify API Tests
 * 
 * This file contains tests for the Shopify API utility functions.
 * Run these tests to validate that the API integration is working correctly.
 */

import {
  shopifyClient,
  getProducts,
  getProduct,
  getProductsByCollection,
  getCollections,
  createCart,
  getCart,
  addToCart,
  updateCartLines,
  removeFromCart,
  getCheckoutUrl,
  ShopifyError,
  ShopifyNetworkError,
  ShopifyGraphQLError,
  ShopifyTimeoutError
} from '../lib/shopify';

/**
 * Test the Shopify API connection
 * This test validates that the API credentials are correct and the connection is working
 */
export async function testShopifyConnection() {
  console.log('Testing Shopify API connection...');
  try {
    // Simple query to test the connection
    const response = await shopifyClient.query({
      data: {
        query: `
          query {
            shop {
              name
              primaryDomain {
                url
              }
            }
          }
        `
      }
    });
    
    console.log('✅ Shopify API connection successful');
    console.log(`Shop name: ${response.data.shop.name}`);
    console.log(`Shop URL: ${response.data.shop.primaryDomain.url}`);
    return true;
  } catch (error) {
    console.error('❌ Shopify API connection failed:', error);
    return false;
  }
}

/**
 * Test fetching products
 * This test validates that the getProducts function works correctly
 */
export async function testGetProducts() {
  console.log('Testing getProducts function...');
  try {
    const products = await getProducts(5);
    console.log(`✅ Successfully fetched ${products.length} products`);
    if (products.length > 0) {
      console.log('First product:', {
        id: products[0].id,
        title: products[0].title,
        handle: products[0].handle
      });
    } else {
      console.log('No products found in the store');
    }
    return true;
  } catch (error) {
    console.error('❌ getProducts failed:', error);
    return false;
  }
}

/**
 * Test fetching a product by handle
 * This test validates that the getProduct function works correctly
 * @param handle Product handle to test with
 */
export async function testGetProduct(handle: string) {
  console.log(`Testing getProduct function with handle: ${handle}...`);
  try {
    const product = await getProduct(handle);
    console.log('✅ Successfully fetched product:', {
      id: product.id,
      title: product.title,
      handle: product.handle
    });
    return true;
  } catch (error) {
    console.error('❌ getProduct failed:', error);
    return false;
  }
}

/**
 * Test fetching collections
 * This test validates that the getCollections function works correctly
 */
export async function testGetCollections() {
  console.log('Testing getCollections function...');
  try {
    const collections = await getCollections();
    console.log(`✅ Successfully fetched ${collections.length} collections`);
    if (collections.length > 0) {
      console.log('Collections:', collections.map((c: any) => ({
        id: c.id,
        title: c.title,
        handle: c.handle
      })));
    } else {
      console.log('No collections found in the store');
    }
    return true;
  } catch (error) {
    console.error('❌ getCollections failed:', error);
    return false;
  }
}

/**
 * Test fetching products by collection
 * This test validates that the getProductsByCollection function works correctly
 * @param collectionHandle Collection handle to test with
 */
export async function testGetProductsByCollection(collectionHandle: string) {
  console.log(`Testing getProductsByCollection function with handle: ${collectionHandle}...`);
  try {
    const result = await getProductsByCollection(collectionHandle, 5);
    console.log(`✅ Successfully fetched ${result.products.length} products from collection`);
    console.log('Pagination info:', result.pageInfo);
    return true;
  } catch (error) {
    console.error('❌ getProductsByCollection failed:', error);
    return false;
  }
}

/**
 * Test cart operations
 * This test validates that the cart functions work correctly
 */
export async function testCartOperations() {
  console.log('Testing cart operations...');
  try {
    // Step 1: Create a new cart
    console.log('Creating a new cart...');
    const cart = await createCart();
    console.log('✅ Successfully created cart:', cart.id);
    
    // Step 2: Get products to add to cart
    console.log('Fetching products to add to cart...');
    const products = await getProducts(5);
    if (products.length === 0) {
      console.log('No products available to test cart operations');
      return true;
    }
    
    // Get the first product's first variant
    const product = await getProduct(products[0].handle);
    if (!product.variants || product.variants.edges.length === 0) {
      console.log('No variants available for the product');
      return true;
    }
    
    const variantId = product.variants.edges[0].node.id;
    
    // Step 3: Add item to cart
    console.log(`Adding product variant ${variantId} to cart...`);
    const updatedCart = await addToCart(cart.id, [
      { merchandiseId: variantId, quantity: 1 }
    ]);
    console.log('✅ Successfully added item to cart');
    console.log('Cart now has', updatedCart.lines.edges.length, 'items');
    
    // Step 4: Update cart item quantity
    if (updatedCart.lines.edges.length > 0) {
      const lineId = updatedCart.lines.edges[0].node.id;
      console.log(`Updating quantity of line item ${lineId}...`);
      const updatedCart2 = await updateCartLines(cart.id, [
        { id: lineId, quantity: 2 }
      ]);
      console.log('✅ Successfully updated cart item quantity');
      console.log('New quantity:', updatedCart2.lines.edges[0].node.quantity);
      
      // Step 5: Remove item from cart
      console.log(`Removing line item ${lineId} from cart...`);
      const updatedCart3 = await removeFromCart(cart.id, [lineId]);
      console.log('✅ Successfully removed item from cart');
      console.log('Cart now has', updatedCart3.lines.edges.length, 'items');
    }
    
    // Step 6: Get checkout URL
    console.log('Getting checkout URL...');
    const checkoutUrl = await getCheckoutUrl(cart.id);
    console.log('✅ Successfully got checkout URL:', checkoutUrl);
    
    return true;
  } catch (error) {
    console.error('❌ Cart operations failed:', error);
    return false;
  }
}

/**
 * Test error handling
 * This test validates that the error handling works correctly
 */
export async function testErrorHandling() {
  console.log('Testing error handling...');
  
  // Test invalid GraphQL query
  try {
    await shopifyClient.query({
      data: {
        query: `
          query {
            invalidField {
              name
            }
          }
        `
      }
    });
    console.log('❌ Expected GraphQL error but got success');
    return false;
  } catch (error) {
    if (error instanceof ShopifyGraphQLError) {
      console.log('✅ Successfully caught GraphQL error:', error.message);
    } else {
      console.error('❌ Expected ShopifyGraphQLError but got:', error);
      return false;
    }
  }
  
  // Test invalid product handle
  try {
    await getProduct('non-existent-product-handle-12345');
    console.log('❌ Expected error for non-existent product but got success');
    return false;
  } catch (error) {
    if (error instanceof Error) {
      console.log('✅ Successfully caught error for non-existent product:', error.message);
    } else {
      console.log('✅ Successfully caught error for non-existent product:', error);
    }
  }
  
  return true;
}

/**
 * Run all tests
 * This function runs all the tests and reports the results
 */
export async function runAllTests() {
  console.log('=== Starting Shopify API Tests ===');
  
  const results = [];
  
  // Test connection
  results.push({
    name: 'API Connection',
    passed: await testShopifyConnection()
  });
  
  // Test product functions
  results.push({
    name: 'Get Products',
    passed: await testGetProducts()
  });
  
  // Test collections
  results.push({
    name: 'Get Collections',
    passed: await testGetCollections()
  });
  
  // Get a collection handle for testing if available
  let collectionHandle = 'frontpage'; // Default fallback
  try {
    const collections = await getCollections();
    if (collections.length > 0) {
      collectionHandle = collections[0].handle;
    }
  } catch (error) {
    console.warn('Could not fetch collections for testing:', error);
  }
  
  // Test products by collection
  results.push({
    name: 'Get Products by Collection',
    passed: await testGetProductsByCollection(collectionHandle)
  });
  
  // Get a product handle for testing if available
  let productHandle = 'example-product'; // Default fallback
  try {
    const products = await getProducts(1);
    if (products.length > 0) {
      productHandle = products[0].handle;
    }
  } catch (error) {
    console.warn('Could not fetch product for testing:', error);
  }
  
  // Test get product
  results.push({
    name: 'Get Product',
    passed: await testGetProduct(productHandle)
  });
  
  // Test cart operations
  results.push({
    name: 'Cart Operations',
    passed: await testCartOperations()
  });
  
  // Test error handling
  results.push({
    name: 'Error Handling',
    passed: await testErrorHandling()
  });
  
  // Report results
  console.log('\n=== Test Results ===');
  let passedCount = 0;
  for (const result of results) {
    if (result.passed) {
      console.log(`✅ ${result.name}: PASSED`);
      passedCount++;
    } else {
      console.log(`❌ ${result.name}: FAILED`);
    }
  }
  
  console.log(`\n${passedCount} of ${results.length} tests passed`);
  console.log('=== End of Shopify API Tests ===');
  
  return passedCount === results.length;
}

// Uncomment to run tests directly
// runAllTests().then(success => {
//   console.log('All tests completed with status:', success ? 'SUCCESS' : 'FAILURE');
// });
