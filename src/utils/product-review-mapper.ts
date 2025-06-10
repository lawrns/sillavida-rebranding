/**
 * Product Review Mapper Utility
 * Maps Shopify product handles to chair models for review display
 */

import type { ChairModel } from '../data/enhanced-reviews';

// Mapping from Shopify product handles to our chair model types
const PRODUCT_HANDLE_MAP: Record<string, ChairModel> = {
  'empirea': 'empirea',
  'silla-empirea': 'empirea',
  'serafin': 'serafin',
  'silla-serafin': 'serafin',
  'aura': 'aura',
  'silla-aura': 'aura',
  'livina': 'livina',
  'silla-livina': 'livina',
  'calma': 'calma',
  'silla-calma': 'calma',
  'serenidad': 'serenidad',
  'silla-serenidad': 'serenidad',
  'terra': 'terra',
  'silla-terra': 'terra',
  'celeste': 'celeste',
  'silla-celeste': 'celeste',
  // Add variations as needed
  'silla-ergonomica-vida': 'empirea', // Fallback for generic handles
};

/**
 * Maps a Shopify product handle to a chair model type
 * @param productHandle - The Shopify product handle
 * @returns ChairModel type or null if no mapping found
 */
export const mapProductHandleToChairModel = (productHandle: string): ChairModel | null => {
  // Try exact match first
  if (PRODUCT_HANDLE_MAP[productHandle]) {
    return PRODUCT_HANDLE_MAP[productHandle];
  }
  
  // Try partial matching for handles that might contain the chair name
  const lowerHandle = productHandle.toLowerCase();
  
  for (const [key, chairModel] of Object.entries(PRODUCT_HANDLE_MAP)) {
    if (lowerHandle.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerHandle)) {
      return chairModel;
    }
  }
  
  return null;
};

/**
 * Checks if a product has reviews available
 * @param productHandle - The Shopify product handle
 * @returns boolean indicating if reviews are available
 */
export const hasProductReviews = (productHandle: string): boolean => {
  return mapProductHandleToChairModel(productHandle) !== null;
};

/**
 * Gets the display name for a chair model
 * @param chairModel - The chair model type
 * @returns Display name for the chair
 */
export const getChairDisplayName = (chairModel: ChairModel): string => {
  const displayNames: Record<ChairModel, string> = {
    'empirea': 'Silla Empirea',
    'serafin': 'Silla Serafín',
    'aura': 'Silla Aura',
    'livina': 'Silla Livina',
    'calma': 'Silla Calma',
    'serenidad': 'Silla Serenidad',
    'terra': 'Silla Terra',
    'celeste': 'Silla Celeste',
  };
  
  return displayNames[chairModel] || 'Silla SillaVida';
};

export default {
  mapProductHandleToChairModel,
  hasProductReviews,
  getChairDisplayName,
};