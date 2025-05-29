import React, { useState } from 'react';
import {
  testShopifyConnection,
  testGetProducts,
  testGetCollections,
  testGetProductsByCollection,
  testGetProduct,
  testCartOperations,
  testErrorHandling,
  runAllTests
} from '../tests/shopify.test';

/**
 * ShopifyApiTester component
 * 
 * This component provides a UI for running Shopify API tests.
 * It allows running individual tests or all tests at once.
 */
const ShopifyApiTester: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Override console.log and console.error to capture logs
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  const captureConsole = () => {
    console.log = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      setLogs(prev => [...prev, message]);
      originalLog(...args);
    };

    console.error = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      setLogs(prev => [...prev, `ERROR: ${message}`]);
      originalError(...args);
    };

    console.warn = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      setLogs(prev => [...prev, `WARNING: ${message}`]);
      originalWarn(...args);
    };
  };

  const restoreConsole = () => {
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
  };

  const runTest = async (testFn: Function, ...args: any[]) => {
    setIsRunning(true);
    setLogs([]);
    captureConsole();
    
    try {
      await testFn(...args);
    } catch (error) {
      console.error('Test execution error:', error);
    } finally {
      restoreConsole();
      setIsRunning(false);
    }
  };

  const tests = [
    { name: 'Test Connection', fn: testShopifyConnection },
    { name: 'Test Get Products', fn: testGetProducts },
    { name: 'Test Get Collections', fn: testGetCollections },
    { name: 'Test Get Products by Collection', fn: () => testGetProductsByCollection('frontpage') },
    { name: 'Test Get Product', fn: () => testGetProduct('example-product') },
    { name: 'Test Cart Operations', fn: testCartOperations },
    { name: 'Test Error Handling', fn: testErrorHandling },
    { name: 'Run All Tests', fn: runAllTests }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shopify API Tester</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Available Tests</h2>
        <div className="grid grid-cols-2 gap-4">
          {tests.map((test, index) => (
            <button
              key={index}
              onClick={() => runTest(test.fn)}
              disabled={isRunning}
              className={`p-3 rounded ${
                isRunning 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {test.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Test Logs</h2>
        <div className="bg-gray-100 p-4 rounded h-96 overflow-y-auto font-mono text-sm">
          {logs.length === 0 ? (
            <p className="text-gray-500">Run a test to see logs...</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className={`mb-1 ${
                log.startsWith('ERROR:') 
                  ? 'text-red-600' 
                  : log.startsWith('WARNING:') 
                    ? 'text-yellow-600'
                    : log.includes('✅') 
                      ? 'text-green-600' 
                      : log.includes('❌') 
                        ? 'text-red-600'
                        : ''
              }`}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>Note: These tests interact with the Shopify API and may create test carts. No actual orders will be placed.</p>
      </div>
    </div>
  );
};

export default ShopifyApiTester;
