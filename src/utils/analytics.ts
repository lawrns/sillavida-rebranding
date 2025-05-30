/**
 * SillaVida Analytics Module
 * 
 * This module provides functions for tracking user interactions and e-commerce events
 * using Google Analytics 4. It implements enhanced e-commerce tracking for product
 * impressions, clicks, detail views, add to cart, checkout, and purchase events.
 */

import { transformShopifyProduct, transformProductForAnalytics } from './business/productTransformer';

// Type definitions for analytics events
interface AnalyticsItem {
  item_id: string;
  item_name: string;
  price: number;
  item_brand?: string;
  item_category?: string;
  item_variant?: string;
  quantity?: number;
  discount?: number;
  coupon?: string;
  currency?: string;
  index?: number;
}

interface ViewItemListParams {
  items: AnalyticsItem[];
  item_list_id?: string;
  item_list_name: string;
}

interface ViewItemParams {
  items: AnalyticsItem[];
  currency?: string;
  value?: number;
}

interface AddToCartParams {
  items: AnalyticsItem[];
  currency?: string;
  value?: number;
}

interface BeginCheckoutParams {
  items: AnalyticsItem[];
  currency?: string;
  value?: number;
  coupon?: string;
}

interface PurchaseParams {
  transaction_id: string;
  items: AnalyticsItem[];
  currency: string;
  value: number;
  tax?: number;
  shipping?: number;
  coupon?: string;
}

/**
 * Initialize Google Analytics 4
 * @param {string} measurementId - The GA4 measurement ID
 */
export const initGA4 = (measurementId: string): void => {
  if (typeof window === 'undefined') return;
  
  // Skip if already initialized
  if (window.gtag) return;
  
  // Load the Google Analytics script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);
  
  // Initialize the dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  
  gtag('js', new Date());
  gtag('config', measurementId, {
    send_page_view: false, // We'll handle page views manually
  });
  
  console.log('Google Analytics 4 initialized with ID:', measurementId);
};

/**
 * Track page views
 * @param {string} url - The page URL
 * @param {string} [title] - Optional page title
 */
export const pageView = (url: string, title?: string): void => {
  if (!window.gtag) return;
  
  window.gtag('event', 'page_view', {
    page_location: url,
    page_title: title || document.title,
  });
};

// Enhanced e-commerce tracking functions
export const ecommerce = {
  /**
   * View item list (product category/collection page)
   * @param {ViewItemListParams} params - View item list parameters
   * @param {AnalyticsItem[]} params.items - Array of items in the list
   * @param {string} [params.item_list_id] - Optional list identifier
   * @param {string} params.item_list_name - Name of the item list
   */
  viewItemList: ({ items, item_list_id, item_list_name }: ViewItemListParams): void => {
    if (!window.gtag) return;
    
    window.gtag('event', 'view_item_list', {
      item_list_id,
      item_list_name,
      items,
    });
  },
  
  /**
   * Select item (click on product in a list)
   * @param {AnalyticsItem} item - The selected item
   * @param {string} list_name - Name of the list containing the item
   */
  selectItem: (item: AnalyticsItem, list_name: string): void => {
    if (!window.gtag) return;
    
    window.gtag('event', 'select_item', {
      item_list_name: list_name,
      items: [item],
    });
  },
  
  /**
   * View item details (product page)
   * @param {ViewItemParams} params - View item parameters
   * @param {AnalyticsItem[]} params.items - Array of items being viewed
   * @param {string} [params.currency='MXN'] - Currency code for the transaction
   * @param {number} [params.value] - Total value of the items
   */
  viewItem: ({ items, currency = 'MXN', value }: ViewItemParams): void => {
    if (!window.gtag) return;
    
    window.gtag('event', 'view_item', {
      currency,
      value: value || items[0]?.price || 0,
      items,
    });
  },
  
  /**
   * Add to cart event tracking
   * @param {AddToCartParams} params - Add to cart parameters
   * @param {AnalyticsItem[]} params.items - Array of items being added
   * @param {string} [params.currency='MXN'] - Currency code for the transaction
   * @param {number} [params.value] - Total value of the items
   */
  addToCart: ({ items, currency = 'MXN', value }: AddToCartParams): void => {
    if (!window.gtag) return;
    
    window.gtag('event', 'add_to_cart', {
      currency,
      value: value || items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0),
      items,
    });
  },
  
  /**
   * Remove from cart event tracking
   * @param {AddToCartParams} params - Remove from cart parameters
   * @param {AnalyticsItem[]} params.items - Array of items being removed
   * @param {string} [params.currency='MXN'] - Currency code for the transaction
   * @param {number} [params.value] - Total value of the items
   */
  removeFromCart: ({ items, currency = 'MXN', value }: AddToCartParams): void => {
    if (!window.gtag) return;
    
    window.gtag('event', 'remove_from_cart', {
      currency,
      value: value || items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0),
      items,
    });
  },
  
  /**
   * Begin checkout event tracking
   * @param {BeginCheckoutParams} params - Begin checkout parameters
   * @param {AnalyticsItem[]} params.items - Array of items in checkout
   * @param {string} [params.currency='MXN'] - Currency code for the transaction
   * @param {number} [params.value] - Total value of the cart
   * @param {string} [params.coupon] - Coupon code applied
   */
  beginCheckout: ({ items, currency = 'MXN', value, coupon }: BeginCheckoutParams): void => {
    if (!window.gtag) return;
    
    window.gtag('event', 'begin_checkout', {
      currency,
      value: value || items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0),
      items,
      coupon,
    });
  },
  
  /**
   * Add shipping info event tracking
   * @param {BeginCheckoutParams & { shipping_tier?: string }} params - Shipping info parameters
   * @param {AnalyticsItem[]} params.items - Array of items
   * @param {string} [params.currency='MXN'] - Currency code for the transaction
   * @param {number} [params.value] - Total value
   * @param {string} [params.coupon] - Coupon code applied
   * @param {string} [params.shipping_tier] - Selected shipping option
   */
  addShippingInfo: ({ items, currency = 'MXN', value, coupon, shipping_tier }: BeginCheckoutParams & { shipping_tier?: string }): void => {
    if (!window.gtag) return;
    
    window.gtag('event', 'add_shipping_info', {
      currency,
      value: value || items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0),
      items,
      coupon,
      shipping_tier,
    });
  },
  
  /**
   * Add payment info event tracking
   * @param {BeginCheckoutParams & { payment_type?: string }} params - Payment info parameters
   * @param {AnalyticsItem[]} params.items - Array of items
   * @param {string} [params.currency='MXN'] - Currency code for the transaction
   * @param {number} [params.value] - Total value
   * @param {string} [params.coupon] - Coupon code applied
   * @param {string} [params.payment_type] - Selected payment method
   */
  addPaymentInfo: ({ items, currency = 'MXN', value, coupon, payment_type }: BeginCheckoutParams & { payment_type?: string }): void => {
    if (!window.gtag) return;
    
    window.gtag('event', 'add_payment_info', {
      currency,
      value: value || items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0),
      items,
      coupon,
      payment_type,
    });
  },
  
  /**
   * Purchase event tracking
   * @param {PurchaseParams} params - Purchase parameters
   * @param {string} params.transaction_id - Unique transaction identifier
   * @param {AnalyticsItem[]} params.items - Array of purchased items
   * @param {string} params.currency - Currency code for the transaction
   * @param {number} params.value - Total transaction value
   * @param {number} [params.tax] - Tax amount
   * @param {number} [params.shipping] - Shipping cost
   * @param {string} [params.coupon] - Coupon code applied
   */
  purchase: ({ transaction_id, items, currency, value, tax, shipping, coupon }: PurchaseParams): void => {
    if (!window.gtag) return;
    
    window.gtag('event', 'purchase', {
      transaction_id,
      currency,
      value,
      tax,
      shipping,
      items,
      coupon,
    });
  },
};

/**
 * Custom event tracking
 * @param {string} eventName - Name of the event
 * @param {Record<string, any>} [params] - Optional event parameters
 */
export const trackEvent = (eventName: string, params?: Record<string, any>): void => {
  if (!window.gtag) return;
  
  window.gtag('event', eventName, params);
};

/**
 * Helper to convert Shopify product to Analytics item
 * @param {any} product - Shopify product object
 * @param {number} [quantity=1] - Quantity of the product
 * @param {string} [listName] - Name of the product list
 * @param {number} [position] - Position in the list
 * @returns {AnalyticsItem} Formatted analytics item
 */
export const shopifyProductToAnalyticsItem = (product: any, quantity = 1, listName?: string, position?: number): AnalyticsItem => {
  try {
    // Transform to standard format first using imported function
    const standardProduct = transformShopifyProduct(product);
    
    // Transform for analytics using centralized utility
    const analyticsData = transformProductForAnalytics(standardProduct, {
      listName,
      position,
      category: product.productType || 'Chair'
    });
    
    return {
      item_id: analyticsData.item_id,
      item_name: analyticsData.item_name,
      price: analyticsData.price,
      item_brand: 'SillaVida',
      item_category: analyticsData.item_category,
      item_variant: analyticsData.item_variant || '',
      quantity,
      currency: analyticsData.currency,
      index: analyticsData.index,
      ...(listName ? { item_list_name: listName } : {}),
    };
  } catch (error) {
    // Fallback to basic transformation if centralized utilities fail
    console.warn('Product transformation failed, using fallback:', error);
    return {
      item_id: product.id,
      item_name: product.title,
      price: parseFloat(product.priceRange?.minVariantPrice?.amount || '0'),
      item_brand: 'SillaVida',
      item_category: product.productType || 'Chair',
      item_variant: product.selectedVariant?.title || product.variants?.[0]?.title || '',
      quantity,
      currency: product.priceRange?.minVariantPrice?.currencyCode || 'MXN',
      index: position,
      ...(listName ? { item_list_name: listName } : {}),
    };
  }
};

// Declare global window interface
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
