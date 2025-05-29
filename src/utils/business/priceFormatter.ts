/**
 * Centralized Price Formatting Utilities
 * Replaces 8 different price formatting patterns across components
 */

export interface Price {
  amount: string | number;
  currencyCode: string;
}

export interface FormattedPrice {
  amount: number;
  formatted: string;
  currency: string;
  display: string;
}

// Supported currencies with their formatting options
const CURRENCY_CONFIG = {
  MXN: {
    locale: 'es-MX',
    symbol: '$',
    decimals: 2,
    symbolPosition: 'before' as const
  },
  USD: {
    locale: 'en-US',
    symbol: '$',
    decimals: 2,
    symbolPosition: 'before' as const
  },
  EUR: {
    locale: 'es-ES',
    symbol: '€',
    decimals: 2,
    symbolPosition: 'after' as const
  }
} as const;

type SupportedCurrency = keyof typeof CURRENCY_CONFIG;

/**
 * Parse price amount to number, handling string and number inputs
 * @param {string|number} amount - Price amount to parse
 * @returns {number} Parsed numeric value
 */
export function parsePrice(amount: string | number): number {
  if (typeof amount === 'number') {
    return amount;
  }
  
  // Handle string amounts (remove currency symbols and parse)
  const cleanAmount = amount.toString()
    .replace(/[,$€]/g, '') // Remove common currency symbols
    .trim();
    
  const parsed = parseFloat(cleanAmount);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format price with proper currency and locale formatting
 * @param {Price|string|number} price - Price to format
 * @param {Object} [options] - Formatting options
 * @param {SupportedCurrency} [options.currency='MXN'] - Currency code
 * @param {string} [options.locale] - Locale for formatting
 * @param {boolean} [options.showCurrency=true] - Whether to show currency symbol
 * @param {number} [options.decimals] - Number of decimal places
 * @returns {FormattedPrice} Formatted price object
 */
export function formatPrice(
  price: Price | string | number,
  options: {
    currency?: SupportedCurrency;
    locale?: string;
    showCurrency?: boolean;
    decimals?: number;
  } = {}
): FormattedPrice {
  let amount: number;
  let currency: SupportedCurrency;

  // Parse input
  if (typeof price === 'object' && price !== null) {
    amount = parsePrice(price.amount);
    currency = (price.currencyCode as SupportedCurrency) || 'MXN';
  } else {
    amount = parsePrice(price);
    currency = options.currency || 'MXN';
  }

  // Get currency configuration
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.MXN;
  const locale = options.locale || config.locale;
  const decimals = options.decimals ?? config.decimals;
  const showCurrency = options.showCurrency ?? true;

  // Format using Intl.NumberFormat for proper localization
  const formatter = new Intl.NumberFormat(locale, {
    style: showCurrency ? 'currency' : 'decimal',
    currency: showCurrency ? currency : undefined,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const formatted = formatter.format(amount);

  return {
    amount,
    formatted,
    currency,
    display: formatted
  };
}

/**
 * Format price range (min - max)
 * @param {Price|string|number} minPrice - Minimum price
 * @param {Price|string|number} maxPrice - Maximum price
 * @param {Object} [options] - Formatting options (same as formatPrice)
 * @returns {string} Formatted price range string
 */
export function formatPriceRange(
  minPrice: Price | string | number,
  maxPrice: Price | string | number,
  options: Parameters<typeof formatPrice>[1] = {}
): string {
  const min = formatPrice(minPrice, options);
  const max = formatPrice(maxPrice, options);

  if (min.amount === max.amount) {
    return min.formatted;
  }

  return `${min.formatted} - ${max.formatted}`;
}

/**
 * Calculate discount percentage between original and sale price
 * @param {Price|string|number} originalPrice - Original price
 * @param {Price|string|number} salePrice - Sale price
 * @returns {number} Discount percentage (0-100)
 */
export function calculateDiscount(
  originalPrice: Price | string | number,
  salePrice: Price | string | number
): number {
  const original = parsePrice(originalPrice);
  const sale = parsePrice(salePrice);

  if (original <= 0 || sale >= original) {
    return 0;
  }

  const discount = ((original - sale) / original) * 100;
  return Math.round(discount);
}

/**
 * Format discount percentage for display
 */
export function formatDiscount(
  originalPrice: Price | string | number,
  salePrice: Price | string | number
): string {
  const discount = calculateDiscount(originalPrice, salePrice);
  return discount > 0 ? `-${discount}%` : '';
}

/**
 * Calculate subtotal for multiple items
 */
export function calculateSubtotal(
  items: Array<{
    price: Price | string | number;
    quantity: number;
  }>
): number {
  return items.reduce((total, item) => {
    const price = parsePrice(item.price);
    return total + (price * item.quantity);
  }, 0);
}

/**
 * Calculate tax amount
 */
export function calculateTax(
  subtotal: number,
  taxRate: number = 0.16 // Default IVA rate for Mexico
): number {
  return subtotal * taxRate;
}

/**
 * Calculate total with tax
 */
export function calculateTotal(
  subtotal: number,
  taxRate: number = 0.16,
  shipping: number = 0
): number {
  const tax = calculateTax(subtotal, taxRate);
  return subtotal + tax + shipping;
}

/**
 * Format cart total with breakdown
 */
export function formatCartSummary(
  items: Array<{
    price: Price | string | number;
    quantity: number;
  }>,
  options: {
    currency?: SupportedCurrency;
    includeTax?: boolean;
    taxRate?: number;
    shipping?: number;
  } = {}
): {
  subtotal: FormattedPrice;
  tax?: FormattedPrice;
  shipping?: FormattedPrice;
  total: FormattedPrice;
} {
  const subtotalAmount = calculateSubtotal(items);
  const taxRate = options.taxRate || 0.16;
  const shippingAmount = options.shipping || 0;
  
  const subtotal = formatPrice(subtotalAmount, { currency: options.currency });
  
  let tax: FormattedPrice | undefined;
  let shipping: FormattedPrice | undefined;
  let totalAmount = subtotalAmount;

  if (options.includeTax) {
    const taxAmount = calculateTax(subtotalAmount, taxRate);
    tax = formatPrice(taxAmount, { currency: options.currency });
    totalAmount += taxAmount;
  }

  if (shippingAmount > 0) {
    shipping = formatPrice(shippingAmount, { currency: options.currency });
    totalAmount += shippingAmount;
  }

  const total = formatPrice(totalAmount, { currency: options.currency });

  return {
    subtotal,
    tax,
    shipping,
    total
  };
}

/**
 * Convert price between currencies (basic conversion - in production would use real exchange rates)
 */
export function convertPrice(
  price: Price | string | number,
  fromCurrency: SupportedCurrency,
  toCurrency: SupportedCurrency,
  exchangeRate?: number
): FormattedPrice {
  const amount = parsePrice(price);
  
  // Basic conversion rates (in production, these would come from an API)
  const rates: Record<string, number> = {
    'MXN-USD': 0.059,
    'USD-MXN': 17.0,
    'MXN-EUR': 0.054,
    'EUR-MXN': 18.5,
    'USD-EUR': 0.92,
    'EUR-USD': 1.09
  };

  const rateKey = `${fromCurrency}-${toCurrency}`;
  const rate = exchangeRate || rates[rateKey] || 1;
  
  const convertedAmount = amount * rate;
  
  return formatPrice(convertedAmount, { currency: toCurrency });
}

/**
 * Utility to check if a price is on sale
 */
export function isOnSale(
  originalPrice: Price | string | number,
  salePrice?: Price | string | number
): boolean {
  if (!salePrice) return false;
  
  const original = parsePrice(originalPrice);
  const sale = parsePrice(salePrice);
  
  return sale > 0 && sale < original;
}

/**
 * Generate price display string for product cards
 */
export function getProductPriceDisplay(
  price: Price | string | number,
  compareAtPrice?: Price | string | number,
  options: Parameters<typeof formatPrice>[1] = {}
): {
  price: string;
  originalPrice?: string;
  discount?: string;
  isOnSale: boolean;
} {
  const currentPrice = formatPrice(price, options);
  
  if (compareAtPrice && isOnSale(compareAtPrice, price)) {
    const originalPrice = formatPrice(compareAtPrice, options);
    const discount = formatDiscount(compareAtPrice, price);
    
    return {
      price: currentPrice.formatted,
      originalPrice: originalPrice.formatted,
      discount,
      isOnSale: true
    };
  }
  
  return {
    price: currentPrice.formatted,
    isOnSale: false
  };
}