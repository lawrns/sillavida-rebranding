import React, { useEffect, useState } from 'react';
import { getCollections, getProductsByCollection, shopifyClient } from '../lib/shopify';

const ShopifyTest: React.FC = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiDetails, setApiDetails] = useState<{
    storeDomain: string | null;
    hasToken: boolean;
  }>({
    storeDomain: null,
    hasToken: false
  });

  useEffect(() => {
    // Check environment variables
    const storeDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
    const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    
    setApiDetails({
      storeDomain: storeDomain || null,
      hasToken: !!token
    });
    
    console.log('Environment variables check:');
    console.log('Store Domain:', storeDomain ? storeDomain : 'Not set');
    console.log('Has Access Token:', !!token);

    const testShopifyAPI = async () => {
      try {
        // Test direct GraphQL query first
        console.log('Testing direct GraphQL query...');
        const testQuery = `
          query {
            shop {
              name
            }
          }
        `;
        
        try {
          const testResponse = await shopifyClient.query({
            data: { query: testQuery },
            cache: false
          });
          console.log('Shop query response:', testResponse);
        } catch (testErr) {
          console.error('Error with test query:', testErr);
        }
        
        // Continue with collections
        console.log('Fetching collections...');
        const collectionsData = await getCollections();
        console.log('Collections:', collectionsData);
        setCollections(collectionsData);

        if (collectionsData && collectionsData.length > 0) {
          const firstCollection = collectionsData[0];
          console.log(`Fetching products for collection: ${firstCollection.handle}`);
          const result = await getProductsByCollection(firstCollection.handle);
          console.log('Products:', result.products);
          console.log('Pagination info:', result.pageInfo);
          setProducts(result.products);
        } else {
          console.log('No collections found or collections data is invalid');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error testing Shopify API:', err);
        let errorMessage = 'Unknown error';
        
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === 'object' && err !== null) {
          errorMessage = JSON.stringify(err);
        }
        
        setError(errorMessage);
        setLoading(false);
      }
    };

    testShopifyAPI();
  }, []);

  // API configuration details section
  const ApiConfigSection = () => (
    <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h2 className="text-lg font-bold mb-2">API Configuration</h2>
      <div className="grid grid-cols-2 gap-2">
        <div className="font-medium">Store Domain:</div>
        <div className={apiDetails.storeDomain ? "text-green-600" : "text-red-600"}>
          {apiDetails.storeDomain || "Not set"}
        </div>
        
        <div className="font-medium">Access Token:</div>
        <div className={apiDetails.hasToken ? "text-green-600" : "text-red-600"}>
          {apiDetails.hasToken ? "✓ Set" : "✗ Not set"}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Shopify API Test</h1>
        <ApiConfigSection />
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading Shopify data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Shopify API Test</h1>
        <ApiConfigSection />
        <div className="mb-8">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Testing Shopify API</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">{error}</pre>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Possible solutions:
              </p>
              <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                <li>Verify the Shopify store domain is correct</li>
                <li>Check if the Storefront API access token is valid</li>
                <li>Ensure the Shopify store has collections and products</li>
                <li>Check if the Shopify store allows API access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Shopify API Test</h1>
      <ApiConfigSection />
      
      <div className="mb-8 p-4 bg-white rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Collections ({collections.length})</h2>
        {collections.length === 0 ? (
          <p className="text-gray-600">No collections found.</p>
        ) : (
          <ul className="list-disc pl-6">
            {collections.map((collection) => (
              <li key={collection.id} className="mb-2">
                <strong>{collection.title}</strong> (handle: {collection.handle})
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Products from First Collection ({products.length})</h2>
        {products.length === 0 ? (
          <p className="text-gray-600">No products found in the first collection.</p>
        ) : (
          <ul className="list-disc pl-6">
            {products.map((product) => (
              <li key={product.id} className="mb-2">
                <strong>{product.title}</strong> - {parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString('en-US', {
                  style: 'currency',
                  currency: product.priceRange.minVariantPrice.currencyCode
                })}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ShopifyTest;
