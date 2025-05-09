import React, { useState } from 'react';
import { JudgeMeLoader, ReactSafeJudgeMeWidget } from '../judgeMe';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

/**
 * JudgeMeWidgetTester Component
 * 
 * This component provides a testing interface for Judge.me widgets.
 * It allows administrators to view and test all available Judge.me widgets
 * to ensure they are functioning correctly on the website.
 */
const JudgeMeWidgetTester: React.FC = () => {
  const [productId, setProductId] = useState('gid://shopify/Product/8273188053286'); // Default product ID
  const [customProductId, setCustomProductId] = useState('');

  const handleProductIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomProductId(event.target.value);
  };

  const applyCustomProductId = () => {
    if (customProductId.trim()) {
      setProductId(customProductId.trim());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Judge.me Widget Tester</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Test Configuration</h3>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-grow">
            <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
              Product ID
            </label>
            <input
              type="text"
              id="productId"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={customProductId}
              onChange={handleProductIdChange}
              placeholder="gid://shopify/Product/PRODUCT_ID"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter a Shopify product ID to test widgets with specific product data
            </p>
          </div>
          <div className="mt-4 md:mt-6">
            <button
              onClick={applyCustomProductId}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            Current Product ID: <code className="bg-gray-100 px-1 py-0.5 rounded">{productId}</code>
          </p>
        </div>
      </div>

      <Tabs defaultValue="review-widget" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="review-widget">Review Widget</TabsTrigger>
          <TabsTrigger value="carousel">Reviews Carousel</TabsTrigger>
          <TabsTrigger value="ugc-media">UGC Media Grid</TabsTrigger>
          <TabsTrigger value="verified-badge">Verified Badge</TabsTrigger>
          <TabsTrigger value="preview-badge">Preview Badge</TabsTrigger>
        </TabsList>

        <TabsContent value="review-widget" className="border p-4 rounded-md">
          <h3 className="text-xl font-semibold mb-4">Review Widget</h3>
          <p className="mb-4 text-gray-600">
            The primary widget for displaying product reviews on product pages.
          </p>
          <div className="border rounded-lg p-4 bg-white">
            <JudgeMeLoader productId={productId}>
              <div className="jdgm-widget jdgm-review-widget">
                <div className="jdgm-review-widget--inline-badge">
                  <span className="jdgm-inline-badge" data-id={productId}></span>
                </div>
                <div className="jdgm-review-widget--reviews">
                  <div 
                    className="jdgm-reviews-widget" 
                    data-id={productId} 
                    data-per-page="4" 
                    data-locale="es"
                  ></div>
                </div>
              </div>
            </JudgeMeLoader>
          </div>
        </TabsContent>

        <TabsContent value="carousel" className="border p-4 rounded-md">
          <h3 className="text-xl font-semibold mb-4">Reviews Carousel</h3>
          <p className="mb-4 text-gray-600">
            A carousel of featured reviews for display on the homepage or other landing pages.
          </p>
          <div className="border rounded-lg p-4 bg-white">
            <JudgeMeLoader>
              <div className="jdgm-carousel-wrapper" data-number-of-reviews="8" data-auto-rotate="5000"> 
                <h2 className="jdgm-carousel-title">Opiniones de clientes verificados</h2> 
                <a href="/reviews" className="jdgm-all-reviews-rating-wrapper"> 
                  <div data-score="" className="jdgm-all-reviews-rating"></div> 
                  <span className="jdgm-text-español">Ver todas las <span className="jdgm-all-reviews-count"></span> opiniones</span>
                </a>
              </div>
            </JudgeMeLoader>
          </div>
        </TabsContent>

        <TabsContent value="ugc-media" className="border p-4 rounded-md">
          <h3 className="text-xl font-semibold mb-4">UGC Media Grid</h3>
          <p className="mb-4 text-gray-600">
            Displays user-generated content (photos) from reviews in a grid layout.
          </p>
          <div className="border rounded-lg p-4 bg-white">
            <JudgeMeLoader productId={productId}>
              <div 
                className="jdgm-ugc-media-wrapper" 
                data-product-id={productId} 
                data-rows-mobile="2" 
                data-rows-desktop="2"
              >
                <div className="jdgm-ugc-media__title">Opiniones con fotos</div>
              </div>
            </JudgeMeLoader>
          </div>
        </TabsContent>

        <TabsContent value="verified-badge" className="border p-4 rounded-md">
          <h3 className="text-xl font-semibold mb-4">Verified Badge</h3>
          <p className="mb-4 text-gray-600">
            A trust badge showing overall store rating and verification status.
          </p>
          <div className="border rounded-lg p-4 bg-white">
            <JudgeMeLoader>
              <div className="jdgm-verified-badge-wrapper">
                <a href="/reviews" className="jdgm-verified-badge" target="_blank" rel="nofollow">
                  <div data-score="" className="jdgm-all-reviews-rating"></div>
                  <span className="jdgm-text-español">Cliente verificado</span>
                </a>
              </div>
            </JudgeMeLoader>
          </div>
        </TabsContent>

        <TabsContent value="preview-badge" className="border p-4 rounded-md">
          <h3 className="text-xl font-semibold mb-4">Preview Badge</h3>
          <p className="mb-4 text-gray-600">
            A compact badge showing the number of reviews for a specific product.
          </p>
          <div className="border rounded-lg p-4 bg-white">
            <JudgeMeLoader productId={productId}>
              <div className="jdgm-preview-badge" data-id={productId}></div>
            </JudgeMeLoader>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">Widget Test Results</h3>
        <p className="text-sm text-blue-700">
          Review these widgets to ensure they're displaying correctly with the current Judge.me configuration.
          If widgets aren't displaying properly, check the browser console for errors and verify the Judge.me
          configuration in the Shopify admin.
        </p>
        <div className="mt-3">
          <p className="text-sm text-blue-700">
            Reference: See <code className="bg-blue-100 px-1 py-0.5 rounded">REFERENCE_WIDGETS.md</code> for
            detailed implementation guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JudgeMeWidgetTester;
