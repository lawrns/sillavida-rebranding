/**
 * SillaVida Analytics Module
 * 
 * This module provides functions for tracking user interactions and e-commerce events
 * using Google Analytics 4. It implements enhanced e-commerce tracking for product
 * impressions, clicks, detail views, add to cart, checkout, and purchase events.
 */

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

// Initialize Google Analytics 4
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

// Track page views
export const pageView = (url: string, title?: string): void => {
  if (!window.gtag) return;
  
  window.gtag('event', 'page_view', {
    page_location: url,
    page_title: title || document.title,
  });
};

// Enhanced e-commerce tracking functions
export const ecommerce = {
  // View item list (product category/collection page)
  viewItemList: ({ items, item_list_id, item_list_name }: ViewItemListParams): void => {
    if (!window.gtag) return;
    
    window.gtag('event', 'view_item_list', {
      item_list_id,
      item_list_name,
      items,
    });
  },
  
  // Select item (click on product in a list)
  selectItem: (item: AnalyticsItem, list_name: string): void => {
    if (!window.gtag) return;
    
    window.gtag('event', 'select_item', {
      item_list_name: list_name,
      items: [item],
    });
  },
  
  // View item details (product page)
  viewItem: ({ items, currency = 'USD', value }: ViewItemParams): void => {
    if (!window.gtag) return;
    
    window.gtag('event', 'view_item', {
      currency,
      value: value || items[0]?.price || 0,
      items,
    });
  },
  
  // Add to cart
  addToCart: ({ items, currency = 'USD', value }: AddToCartParams): void => {
    if (!window.gtag) return;
    
    window.gtag('event', 'add_to_cart', {
      currency,
      value: value || items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0),
      items,
    });
  },
  
  // Remove from cart
  removeFromCart: ({ items, currency = 'USD', value }: AddToCartParams): void => {
    if (!window.gtag) return;
    
    window.gtag('event', 'remove_from_cart', {
      currency,
      value: value || items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0),
      items,
    });
  },
  
  // Begin checkout
  beginCheckout: ({ items, currency = 'USD', value, coupon }: BeginCheckoutParams): void => {
    if (!window.gtag) return;
    
    window.gtag('event', 'begin_checkout', {
      currency,
      value: value || items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0),
      items,
      coupon,
    });
  },
  
  // Add shipping info
  addShippingInfo: ({ items, currency = 'USD', value, coupon, shipping_tier }: BeginCheckoutParams & { shipping_tier?: string }): void => {
    if (!window.gtag) return;
    
    window.gtag('event', 'add_shipping_info', {
      currency,
      value: value || items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0),
      items,
      coupon,
      shipping_tier,
    });
  },
  
  // Add payment info
  addPaymentInfo: ({ items, currency = 'USD', value, coupon, payment_type }: BeginCheckoutParams & { payment_type?: string }): void => {
    if (!window.gtag) return;
    
    window.gtag('event', 'add_payment_info', {
      currency,
      value: value || items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0),
      items,
      coupon,
      payment_type,
    });
  },
  
  // Purchase
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

// Custom event tracking
export const trackEvent = (eventName: string, params?: Record<string, any>): void => {
  if (!window.gtag) return;
  
  window.gtag('event', eventName, params);
};

// Helper to convert Shopify product to Analytics item
export const shopifyProductToAnalyticsItem = (product: any, quantity = 1, listName?: string, position?: number): AnalyticsItem => {
  return {
    item_id: product.id,
    item_name: product.title,
    price: parseFloat(product.priceRange?.minVariantPrice?.amount || '0'),
    item_brand: 'SillaVida',
    item_category: product.productType || 'Chair',
    item_variant: product.selectedVariant?.title || product.variants?.[0]?.title || '',
    quantity,
    currency: product.priceRange?.minVariantPrice?.currencyCode || 'USD',
    index: position,
    ...(listName ? { item_list_name: listName } : {}),
  };
};

// Declare global window interface
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
