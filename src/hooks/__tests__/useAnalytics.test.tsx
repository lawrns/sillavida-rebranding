/**
 * useAnalytics Hook Tests
 * 
 * This file contains tests for the useAnalytics hook, which provides
 * analytics tracking functionality to React components.
 */

import React from 'react';
import { renderHook } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import useAnalytics from '../useAnalytics';
import { initGA4, pageView, trackEvent, ecommerce } from '../../utils/analytics';
import analyticsConfig, { ANALYTICS_CONFIG } from '../../config/analytics';

// Mock the analytics utilities
jest.mock('../../utils/analytics', () => ({
  initGA4: jest.fn(),
  pageView: jest.fn(),
  trackEvent: jest.fn(),
  ecommerce: {
    viewItemList: jest.fn(),
    selectItem: jest.fn(),
    viewItem: jest.fn(),
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    beginCheckout: jest.fn(),
    addShippingInfo: jest.fn(),
    addPaymentInfo: jest.fn(),
    purchase: jest.fn(),
  },
}));

// Mock the analytics config
jest.mock('../../config/analytics', () => ({
  __esModule: true,
  default: {
    measurementId: 'G-TEST123456',
    config: {
      enabled: true,
      ecommerceEnabled: true,
      debug: false,
    },
  },
  ANALYTICS_CONFIG: {
    enabled: true,
    ecommerceEnabled: true,
    debug: false,
  },
}));

// Create a wrapper component for the hook
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('useAnalytics Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/test-path',
        search: '?test=true',
      },
      writable: true,
    });
  });
  
  it('initializes analytics on mount', () => {
    renderHook(() => useAnalytics(), { wrapper });
    
    // Check if initGA4 was called with the correct measurement ID
    expect(initGA4).toHaveBeenCalledWith('G-TEST123456');
  });
  
  it('tracks page views when location changes', () => {
    renderHook(() => useAnalytics(), { wrapper });
    
    // Check if pageView was called with the correct path
    expect(pageView).toHaveBeenCalledWith('/test-path?test=true');
  });
  
  it('provides a trackEvent function that calls the analytics utility', () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper });
    
    // Call the trackEvent function
    result.current.trackEvent('test_event', { test: 'data' });
    
    // Check if trackEvent was called with the correct parameters
    expect(trackEvent).toHaveBeenCalledWith('test_event', { test: 'data' });
  });
  
  it('provides e-commerce tracking functions', () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper });
    
    // Test viewItemList
    const viewItemListParams = {
      items: [{ item_id: '123', item_name: 'Test Chair', price: 99.99 }],
      item_list_name: 'Test List',
    };
    result.current.ecommerce.viewItemList(viewItemListParams);
    expect(ecommerce.viewItemList).toHaveBeenCalledWith(viewItemListParams);
    
    // Test addToCart
    const addToCartParams = {
      items: [{ item_id: '123', item_name: 'Test Chair', price: 99.99, quantity: 1 }],
      currency: 'USD',
    };
    result.current.ecommerce.addToCart(addToCartParams);
    expect(ecommerce.addToCart).toHaveBeenCalledWith(addToCartParams);
    
    // Test purchase
    const purchaseParams = {
      transaction_id: 'T12345',
      items: [{ item_id: '123', item_name: 'Test Chair', price: 99.99, quantity: 1 }],
      currency: 'USD',
      value: 99.99,
    };
    result.current.ecommerce.purchase(purchaseParams);
    expect(ecommerce.purchase).toHaveBeenCalledWith(purchaseParams);
  });
  
  it('does not track events when analytics is disabled', () => {
    // Mock analytics as disabled
    jest.spyOn(ANALYTICS_CONFIG, 'enabled', 'get').mockReturnValue(false);
    
    const { result } = renderHook(() => useAnalytics(), { wrapper });
    
    // Call the trackEvent function
    result.current.trackEvent('test_event', { test: 'data' });
    
    // Check if trackEvent was not called
    expect(trackEvent).not.toHaveBeenCalled();
    
    // Call an e-commerce tracking function
    result.current.ecommerce.viewItemList({
      items: [{ item_id: '123', item_name: 'Test Chair', price: 99.99 }],
      item_list_name: 'Test List',
    });
    
    // Check if the e-commerce function was not called
    expect(ecommerce.viewItemList).not.toHaveBeenCalled();
  });
});
