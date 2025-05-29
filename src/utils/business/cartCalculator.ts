/**
 * Centralized Cart Calculation Utilities
 * Replaces 6 different cart calculation patterns across components
 */

import { formatPrice, calculateSubtotal, formatCartSummary, type Price } from './priceFormatter';

export interface CartItem {
  id: string;
  merchandiseId: string;
  quantity: number;
  title: string;
  price: Price;
  productTitle?: string;
  imageUrl?: string;
  variant?: {
    title: string;
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
  };
}

export interface CartSummary {
  itemCount: number;
  totalQuantity: number;
  subtotal: {
    amount: number;
    formatted: string;
  };
  tax?: {
    amount: number;
    formatted: string;
  };
  shipping?: {
    amount: number;
    formatted: string;
  };
  total: {
    amount: number;
    formatted: string;
  };
  savings?: {
    amount: number;
    formatted: string;
  };
}

export interface ShippingOption {
  id: string;
  name: string;
  description?: string;
  price: number;
  estimatedDays: number;
  isFree: boolean;
}

/**
 * Calculate total number of items in cart
 * @param {CartItem[]} items - Array of cart items
 * @returns {number} Total number of unique items
 */
export function calculateItemCount(items: CartItem[]): number {
  return items.length;
}

/**
 * Calculate total quantity of all items
 * @param {CartItem[]} items - Array of cart items
 * @returns {number} Total quantity across all items
 */
export function calculateTotalQuantity(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Calculate cart subtotal (before tax and shipping)
 * @param {CartItem[]} items - Array of cart items
 * @returns {number} Subtotal amount in MXN
 */
export function calculateCartSubtotal(items: CartItem[]): number {
  return calculateSubtotal(items.map(item => ({
    price: item.price,
    quantity: item.quantity
  })));
}

/**
 * Calculate tax for cart items
 * @param {number} subtotal - Cart subtotal amount
 * @param {number} [taxRate=0.16] - Tax rate (default IVA rate for Mexico)
 * @param {number} [exemptThreshold] - Optional minimum amount for tax exemption
 * @returns {number} Tax amount in MXN
 */
export function calculateCartTax(
  subtotal: number,
  taxRate: number = 0.16, // Default IVA rate for Mexico
  exemptThreshold?: number
): number {
  if (exemptThreshold && subtotal < exemptThreshold) {
    return 0;
  }
  return subtotal * taxRate;
}

/**
 * Calculate shipping cost based on cart and location
 */
export function calculateShipping(
  items: CartItem[],
  options: {
    shippingOption?: ShippingOption;
    freeShippingThreshold?: number;
    location?: string;
    weight?: number;
  } = {}
): number {
  const subtotal = calculateCartSubtotal(items);
  
  // Free shipping over threshold
  if (options.freeShippingThreshold && subtotal >= options.freeShippingThreshold) {
    return 0;
  }
  
  // Use selected shipping option
  if (options.shippingOption) {
    return options.shippingOption.price;
  }
  
  // Default shipping calculation based on location
  const baseShipping = options.location === 'CDMX' ? 199 : 299;
  
  // Weight-based additional charges
  const weightSurcharge = options.weight && options.weight > 25 ? 150 : 0;
  
  return baseShipping + weightSurcharge;
}

/**
 * Calculate potential savings from discounts
 * @param {CartItem[]} items - Array of cart items
 * @returns {number} Total savings amount in MXN
 */
export function calculateSavings(items: CartItem[]): number {
  return items.reduce((savings, item) => {
    if (item.variant?.selectedOptions) {
      // Check for compare at price in options (if available)
      const compareAtPrice = 0; // Would be extracted from product data
      const currentPrice = parseFloat(item.price.amount.toString());
      if (compareAtPrice > currentPrice) {
        return savings + ((compareAtPrice - currentPrice) * item.quantity);
      }
    }
    return savings;
  }, 0);
}

/**
 * Get comprehensive cart summary
 * @param {CartItem[]} items - Array of cart items
 * @param {Object} [options] - Summary calculation options
 * @param {boolean} [options.includeTax] - Whether to include tax in calculations
 * @param {number} [options.taxRate] - Tax rate to apply
 * @param {ShippingOption} [options.shippingOption] - Selected shipping option
 * @param {number} [options.freeShippingThreshold] - Free shipping threshold
 * @param {'MXN'|'USD'|'EUR'} [options.currency='MXN'] - Currency for formatting
 * @param {string} [options.location] - Delivery location
 * @returns {CartSummary} Complete cart summary with formatted amounts
 */
export function getCartSummary(
  items: CartItem[],
  options: {
    includeTax?: boolean;
    taxRate?: number;
    shippingOption?: ShippingOption;
    freeShippingThreshold?: number;
    currency?: 'MXN' | 'USD' | 'EUR';
    location?: string;
  } = {}
): CartSummary {
  const currency = options.currency || 'MXN';
  const subtotalAmount = calculateCartSubtotal(items);
  
  // Calculate tax
  let taxAmount = 0;
  if (options.includeTax) {
    taxAmount = calculateCartTax(subtotalAmount, options.taxRate);
  }
  
  // Calculate shipping
  const shippingAmount = calculateShipping(items, options);
  
  // Calculate savings
  const savingsAmount = calculateSavings(items);
  
  // Calculate total
  const totalAmount = subtotalAmount + taxAmount + shippingAmount;
  
  // Format amounts
  const subtotal = formatPrice(subtotalAmount, { currency });
  const tax = taxAmount > 0 ? formatPrice(taxAmount, { currency }) : undefined;
  const shipping = shippingAmount > 0 ? formatPrice(shippingAmount, { currency }) : undefined;
  const total = formatPrice(totalAmount, { currency });
  const savings = savingsAmount > 0 ? formatPrice(savingsAmount, { currency }) : undefined;
  
  return {
    itemCount: calculateItemCount(items),
    totalQuantity: calculateTotalQuantity(items),
    subtotal: {
      amount: subtotal.amount,
      formatted: subtotal.formatted
    },
    tax: tax ? {
      amount: tax.amount,
      formatted: tax.formatted
    } : undefined,
    shipping: shipping ? {
      amount: shipping.amount,
      formatted: shipping.formatted
    } : undefined,
    total: {
      amount: total.amount,
      formatted: total.formatted
    },
    savings: savings ? {
      amount: savings.amount,
      formatted: savings.formatted
    } : undefined
  };
}

/**
 * Check if cart qualifies for free shipping
 * @param {CartItem[]} items - Array of cart items
 * @param {number} [threshold=2500] - Free shipping threshold in MXN
 * @returns {Object} Free shipping qualification status
 * @returns {boolean} returns.qualifies - Whether cart qualifies for free shipping
 * @returns {number} returns.amountNeeded - Amount needed to qualify (0 if already qualified)
 * @returns {number} returns.threshold - The free shipping threshold amount
 */
export function qualifiesForFreeShipping(
  items: CartItem[],
  threshold: number = 2500 // Default free shipping threshold in MXN
): {
  qualifies: boolean;
  amountNeeded: number;
  threshold: number;
} {
  const subtotal = calculateCartSubtotal(items);
  const qualifies = subtotal >= threshold;
  const amountNeeded = qualifies ? 0 : threshold - subtotal;
  
  return {
    qualifies,
    amountNeeded,
    threshold
  };
}

/**
 * Get available shipping options based on cart
 * @param {CartItem[]} items - Array of cart items
 * @param {string} [location='other'] - Delivery location
 * @returns {ShippingOption[]} Array of available shipping options
 */
export function getShippingOptions(
  items: CartItem[],
  location: string = 'other'
): ShippingOption[] {
  const subtotal = calculateCartSubtotal(items);
  const freeShippingThreshold = 2500;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  
  const options: ShippingOption[] = [];
  
  if (location.toLowerCase().includes('cdmx') || location.toLowerCase().includes('mexico')) {
    // Mexico City options
    options.push({
      id: 'standard-cdmx',
      name: 'Envío Estándar CDMX',
      description: 'Entrega en 2-3 días hábiles',
      price: isFreeShipping ? 0 : 199,
      estimatedDays: 3,
      isFree: isFreeShipping
    });
    
    options.push({
      id: 'express-cdmx',
      name: 'Envío Express CDMX',
      description: 'Entrega en 24 horas',
      price: 399,
      estimatedDays: 1,
      isFree: false
    });
  } else {
    // Other locations in Mexico
    options.push({
      id: 'standard-national',
      name: 'Envío Nacional',
      description: 'Entrega en 5-7 días hábiles',
      price: isFreeShipping ? 0 : 299,
      estimatedDays: 6,
      isFree: isFreeShipping
    });
    
    options.push({
      id: 'express-national',
      name: 'Envío Express Nacional',
      description: 'Entrega en 3-4 días hábiles',
      price: 599,
      estimatedDays: 4,
      isFree: false
    });
  }
  
  return options;
}

/**
 * Validate cart item
 */
export function validateCartItem(item: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!item) {
    errors.push('Cart item is required');
    return { isValid: false, errors };
  }
  
  if (!item.id) {
    errors.push('Cart item ID is required');
  }
  
  if (!item.merchandiseId) {
    errors.push('Merchandise ID is required');
  }
  
  if (!item.title || item.title.trim() === '') {
    errors.push('Item title is required');
  }
  
  if (!item.price || parseFloat(item.price.amount) <= 0) {
    errors.push('Valid item price is required');
  }
  
  if (!item.quantity || item.quantity < 1) {
    errors.push('Valid quantity is required (minimum 1)');
  }
  
  if (item.quantity > 10) {
    errors.push('Quantity cannot exceed 10 items per product');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Find cart item by merchandise ID
 */
export function findCartItem(
  items: CartItem[],
  merchandiseId: string
): CartItem | null {
  return items.find(item => item.merchandiseId === merchandiseId) || null;
}

/**
 * Check if item already exists in cart
 */
export function itemExistsInCart(
  items: CartItem[],
  merchandiseId: string
): boolean {
  return findCartItem(items, merchandiseId) !== null;
}

/**
 * Get cart weight for shipping calculation
 */
export function calculateCartWeight(
  items: CartItem[],
  itemWeights: Record<string, number> = {}
): number {
  return items.reduce((totalWeight, item) => {
    const itemWeight = itemWeights[item.merchandiseId] || 15; // Default 15kg for chairs
    return totalWeight + (itemWeight * item.quantity);
  }, 0);
}

/**
 * Calculate estimated delivery date
 */
export function calculateDeliveryDate(
  shippingOption: ShippingOption,
  processingDays: number = 1
): Date {
  const today = new Date();
  const totalDays = shippingOption.estimatedDays + processingDays;
  
  // Add business days only (skip weekends)
  let deliveryDate = new Date(today);
  let daysAdded = 0;
  
  while (daysAdded < totalDays) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    
    // Skip weekends (Saturday = 6, Sunday = 0)
    if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
      daysAdded++;
    }
  }
  
  return deliveryDate;
}

/**
 * Format delivery date for display
 */
export function formatDeliveryDate(
  shippingOption: ShippingOption,
  processingDays: number = 1
): string {
  const deliveryDate = calculateDeliveryDate(shippingOption, processingDays);
  
  return deliveryDate.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}