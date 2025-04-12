import React from 'react';
import ShopifyApiTester from '../components/ShopifyApiTester';

/**
 * ShopifyTestPage
 * 
 * This page displays the ShopifyApiTester component, which allows
 * running tests against the Shopify API to validate the integration.
 */
const ShopifyTestPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center">Shopify API Testing</h1>
        <p className="text-center text-gray-600 mt-2">
          Use this page to test and validate the Shopify API integration
        </p>
      </div>
      
      <ShopifyApiTester />
    </div>
  );
};

export default ShopifyTestPage;
