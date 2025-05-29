import React from 'react';
import ShopifyTest from '../components/ShopifyTest';

const TestPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopify API Test Page</h1>
      <div className="bg-white rounded-lg shadow-md">
        <ShopifyTest />
      </div>
    </div>
  );
};

export default TestPage;
