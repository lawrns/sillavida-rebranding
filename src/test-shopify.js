// Simple script to test Shopify API
import { getCollections, getProductsByCollection } from './lib/shopify.ts';

async function testShopifyAPI() {
  try {
    console.log('Fetching collections...');
    const collections = await getCollections();
    console.log('Collections:', collections);

    if (collections.length > 0) {
      const firstCollection = collections[0];
      console.log(`Fetching products for collection: ${firstCollection.handle}`);
      const products = await getProductsByCollection(firstCollection.handle);
      console.log('Products:', products);
    }
  } catch (error) {
    console.error('Error testing Shopify API:', error);
  }
}

testShopifyAPI();
