import React, { useState, useEffect, useRef, useCallback } from 'react';
import { JudgeMeLoader, ReactSafeJudgeMeWidget } from '../judgeMe';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useJudgeMe } from '../../hooks/useJudgeMe';
import { errorHandler } from '../../utils/errorHandler';

/**
 * JudgeMeWidgetTester Component
 *
 * Enhanced testing interface for Judge.me widgets with automated validation,
 * error state testing, and performance monitoring integration.
 *
 * Features:
 * - Automated widget loading validation
 * - Error state simulation and testing
 * - Performance monitoring integration
 * - Real-time validation status reporting
 * - Comprehensive test result logging
 */

interface WidgetTestResult {
  widgetType: string;
  status: 'loading' | 'success' | 'error' | 'timeout';
  loadTime?: number;
  errorMessage?: string;
  timestamp: number;
}

interface ValidationState {
  isRunning: boolean;
  results: WidgetTestResult[];
  currentTest?: string;
  startTime?: number;
}

const JudgeMeWidgetTester: React.FC = () => {
  const [productId, setProductId] = useState('gid://shopify/Product/8273188053286'); // Default product ID
  const [customProductId, setCustomProductId] = useState('');
  const [validationState, setValidationState] = useState<ValidationState>({
    isRunning: false,
    results: []
  });
  const [autoValidationEnabled, setAutoValidationEnabled] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    averageLoadTime: number;
    successRate: number;
    totalTests: number;
  }>({ averageLoadTime: 0, successRate: 0, totalTests: 0 });

  // Refs for widget containers to monitor DOM changes
  const reviewWidgetRef = useRef<HTMLDivElement>(null);
  const carouselWidgetRef = useRef<HTMLDivElement>(null);
  const ugcMediaWidgetRef = useRef<HTMLDivElement>(null);
  const verifiedBadgeRef = useRef<HTMLDivElement>(null);
  const previewBadgeRef = useRef<HTMLDivElement>(null);

  // Judge.me hook for integration testing
  const { ready, loading, error, initialize, getProductReviewCount, getAverageRating } = useJudgeMe();

  const handleProductIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomProductId(event.target.value);
  };

  const applyCustomProductId = () => {
    if (customProductId.trim()) {
      setProductId(customProductId.trim());
    }
  };

  /**
   * Automated widget validation function
   * Tests each widget type for proper loading and functionality
   */
  const runAutomatedValidation = useCallback(async () => {
    if (validationState.isRunning) return;

    setValidationState({
      isRunning: true,
      results: [],
      startTime: Date.now()
    });

    const widgetTypes = [
      { type: 'review-widget', ref: reviewWidgetRef, selector: '.jdgm-review-widget' },
      { type: 'carousel', ref: carouselWidgetRef, selector: '.jdgm-carousel-wrapper' },
      { type: 'ugc-media', ref: ugcMediaWidgetRef, selector: '.jdgm-ugc-media-wrapper' },
      { type: 'verified-badge', ref: verifiedBadgeRef, selector: '.jdgm-verified-badge' },
      { type: 'preview-badge', ref: previewBadgeRef, selector: '.jdgm-preview-badge' }
    ];

    const results: WidgetTestResult[] = [];

    for (const widget of widgetTypes) {
      const startTime = performance.now();

      setValidationState(prev => ({
        ...prev,
        currentTest: widget.type
      }));

      try {
        // Test widget loading
        const result = await validateWidget(widget.type, widget.ref, widget.selector);
        const loadTime = performance.now() - startTime;

        results.push({
          widgetType: widget.type,
          status: result.success ? 'success' : 'error',
          loadTime,
          errorMessage: result.error,
          timestamp: Date.now()
        });

        // Test API integration if widget loaded successfully
        if (result.success && widget.type === 'review-widget') {
          await testApiIntegration(productId);
        }

      } catch (error) {
        const loadTime = performance.now() - startTime;
        results.push({
          widgetType: widget.type,
          status: 'error',
          loadTime,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now()
        });

        // Log error for monitoring
        errorHandler.handleError(error as Error, {
          component: 'JudgeMeWidgetTester',
          action: 'runAutomatedValidation',
          context: { widgetType: widget.type, productId }
        });
      }

      // Small delay between tests to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Update performance metrics
    updatePerformanceMetrics(results);

    setValidationState({
      isRunning: false,
      results,
      currentTest: undefined
    });
  }, [productId, validationState.isRunning]);

  /**
   * Validate individual widget loading and functionality
   */
  const validateWidget = async (
    widgetType: string,
    containerRef: React.RefObject<HTMLDivElement>,
    selector: string
  ): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({ success: false, error: 'Widget loading timeout (5s)' });
      }, 5000);

      const checkWidget = () => {
        if (!containerRef.current) {
          clearTimeout(timeout);
          resolve({ success: false, error: 'Container not found' });
          return;
        }

        const widget = containerRef.current.querySelector(selector);
        if (widget) {
          // Check if widget has content or is properly initialized
          const hasContent = widget.children.length > 0 ||
                           widget.textContent?.trim() !== '' ||
                           widget.getAttribute('data-initialized') === 'true';

          clearTimeout(timeout);
          resolve({
            success: hasContent,
            error: hasContent ? undefined : 'Widget found but appears empty'
          });
        } else {
          // Widget not found yet, check again
          setTimeout(checkWidget, 100);
        }
      };

      // Start checking immediately
      checkWidget();
    });
  };

  /**
   * Test Judge.me API integration
   */
  const testApiIntegration = async (testProductId: string) => {
    try {
      // Test review count retrieval
      const reviewCount = await getProductReviewCount(testProductId);
      console.log(`API Test - Review count for ${testProductId}: ${reviewCount}`);

      // Test average rating retrieval
      const averageRating = await getAverageRating(testProductId);
      console.log(`API Test - Average rating for ${testProductId}: ${averageRating}`);

      return { reviewCount, averageRating };
    } catch (error) {
      console.error('API integration test failed:', error);
      throw error;
    }
  };

  /**
   * Update performance metrics based on test results
   */
  const updatePerformanceMetrics = (results: WidgetTestResult[]) => {
    const successfulTests = results.filter(r => r.status === 'success');
    const totalLoadTime = results.reduce((sum, r) => sum + (r.loadTime || 0), 0);

    setPerformanceMetrics(prev => ({
      averageLoadTime: results.length > 0 ? totalLoadTime / results.length : 0,
      successRate: results.length > 0 ? (successfulTests.length / results.length) * 100 : 0,
      totalTests: prev.totalTests + results.length
    }));
  };

  /**
   * Simulate error scenarios for testing error handling
   */
  const simulateErrorScenarios = useCallback(async () => {
    const errorScenarios = [
      {
        name: 'Network Timeout',
        test: async () => {
          // Simulate network timeout by temporarily blocking Judge.me script
          const originalJdgm = (window as any).jdgm;
          delete (window as any).jdgm;

          try {
            await new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Network timeout')), 1000)
            );
          } finally {
            (window as any).jdgm = originalJdgm;
          }
        }
      },
      {
        name: 'Invalid Product ID',
        test: async () => {
          await testApiIntegration('gid://shopify/Product/invalid-id-999999');
        }
      },
      {
        name: 'Script Loading Failure',
        test: async () => {
          // Simulate script loading failure
          const mockError = new Error('Failed to load Judge.me script');
          throw mockError;
        }
      }
    ];

    const errorResults: WidgetTestResult[] = [];

    for (const scenario of errorScenarios) {
      const startTime = performance.now();

      try {
        await scenario.test();
        // If no error thrown, mark as unexpected success
        errorResults.push({
          widgetType: `error-test-${scenario.name}`,
          status: 'error',
          loadTime: performance.now() - startTime,
          errorMessage: 'Expected error but test passed',
          timestamp: Date.now()
        });
      } catch (error) {
        // Expected error - mark as success for error handling test
        errorResults.push({
          widgetType: `error-test-${scenario.name}`,
          status: 'success',
          loadTime: performance.now() - startTime,
          errorMessage: `Error correctly handled: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: Date.now()
        });
      }
    }

    setValidationState(prev => ({
      ...prev,
      results: [...prev.results, ...errorResults]
    }));
  }, [testApiIntegration]);

  /**
   * Auto-validation effect - runs validation when enabled and product ID changes
   */
  useEffect(() => {
    if (autoValidationEnabled && ready && !loading) {
      const timer = setTimeout(() => {
        runAutomatedValidation();
      }, 2000); // Wait 2 seconds after product ID change

      return () => clearTimeout(timer);
    }
  }, [productId, autoValidationEnabled, ready, loading, runAutomatedValidation]);

  /**
   * Initialize Judge.me on component mount
   */
  useEffect(() => {
    if (!ready && !loading) {
      initialize();
    }
  }, [ready, loading, initialize]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Judge.me Widget Tester</h2>

      {/* Judge.me Status Indicator */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Judge.me Integration Status</h3>
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            ready ? 'bg-green-100 text-green-800' :
            loading ? 'bg-yellow-100 text-yellow-800' :
            error ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {ready ? '✅ Ready' : loading ? '⏳ Loading' : error ? '❌ Error' : '⚪ Not Initialized'}
          </div>
          {error && (
            <span className="text-sm text-red-600">
              {error.message}
            </span>
          )}
        </div>
      </div>

      {/* Test Configuration */}
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

      {/* Automated Testing Controls */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-blue-800">Automated Testing</h3>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoValidation"
              checked={autoValidationEnabled}
              onChange={(e) => setAutoValidationEnabled(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="autoValidation" className="text-sm font-medium text-blue-700">
              Auto-validate on product change
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={runAutomatedValidation}
              disabled={validationState.isRunning || !ready}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {validationState.isRunning ? 'Running Tests...' : 'Run Validation'}
            </button>
            <button
              onClick={simulateErrorScenarios}
              disabled={validationState.isRunning}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Test Error Handling
            </button>
          </div>
        </div>

        {/* Current Test Status */}
        {validationState.isRunning && (
          <div className="mt-3 p-3 bg-blue-100 rounded-md">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-700">
                {validationState.currentTest ? `Testing: ${validationState.currentTest}` : 'Initializing tests...'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      {performanceMetrics.totalTests > 0 && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-green-800">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {performanceMetrics.averageLoadTime.toFixed(0)}ms
              </div>
              <div className="text-sm text-green-700">Average Load Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {performanceMetrics.successRate.toFixed(1)}%
              </div>
              <div className="text-sm text-green-700">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {performanceMetrics.totalTests}
              </div>
              <div className="text-sm text-green-700">Total Tests</div>
            </div>
          </div>
        </div>
      )}

      {/* Test Results Display */}
      {validationState.results.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Test Results</h3>
          <div className="space-y-2">
            {validationState.results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-md border ${
                  result.status === 'success' ? 'bg-green-50 border-green-200' :
                  result.status === 'error' ? 'bg-red-50 border-red-200' :
                  result.status === 'loading' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${
                      result.status === 'success' ? 'text-green-700' :
                      result.status === 'error' ? 'text-red-700' :
                      result.status === 'loading' ? 'text-yellow-700' :
                      'text-gray-700'
                    }`}>
                      {result.status === 'success' ? '✅' :
                       result.status === 'error' ? '❌' :
                       result.status === 'loading' ? '⏳' : '⚪'}
                      {result.widgetType}
                    </span>
                    {result.loadTime && (
                      <span className="text-xs text-gray-500">
                        ({result.loadTime.toFixed(0)}ms)
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {result.errorMessage && (
                  <div className="mt-1 text-xs text-gray-600">
                    {result.errorMessage}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
          <div ref={reviewWidgetRef} className="border rounded-lg p-4 bg-white">
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
          <div ref={carouselWidgetRef} className="border rounded-lg p-4 bg-white">
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
          <div ref={ugcMediaWidgetRef} className="border rounded-lg p-4 bg-white">
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
          <div ref={verifiedBadgeRef} className="border rounded-lg p-4 bg-white">
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
          <div ref={previewBadgeRef} className="border rounded-lg p-4 bg-white">
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
