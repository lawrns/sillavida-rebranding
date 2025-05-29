/**
 * Universal Type Definitions
 * 
 * Provides consistent type interfaces that can accommodate data from different sources
 * (Mock data, Shopify API, Simple display props, etc.)
 * 
 * This eliminates the need for complex conversion logic in components.
 */

// Universal Price interface that handles different price formats
export interface UniversalPrice {
  amount: string | number;
  currencyCode: string;
}

// Universal Image interface
export interface UniversalImage {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

// Universal Product interface that accommodates all data sources
export interface UniversalProduct {
  id: string;
  title: string;
  handle: string;
  description?: string;
  
  // Price information (standardized)
  price: UniversalPrice;
  compareAtPrice?: UniversalPrice;
  
  // Images (standardized)
  featuredImage: UniversalImage;
  images: UniversalImage[];
  
  // Variant information
  variantId: string;
  isAvailable: boolean;
  
  // Category and classification
  category?: string;
  productType?: string;
  tags?: string[];
  
  // Custom SillaVida fields
  lifeCategory?: 'Vida Profesional' | 'Vida Activa' | 'Vida Gamer';
  features?: string[];
  specifications?: Record<string, string>;
  
  // Source tracking
  source: 'mock' | 'shopify' | 'simple';
  
  // SEO and metadata
  seo?: {
    title?: string;
    description?: string;
  };
}

// Type guards for runtime type checking
export function isUniversalProduct(obj: any): obj is UniversalProduct {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.handle === 'string' &&
    obj.price &&
    typeof obj.price.amount === 'string' || typeof obj.price.amount === 'number' &&
    typeof obj.price.currencyCode === 'string' &&
    obj.featuredImage &&
    typeof obj.featuredImage.url === 'string' &&
    Array.isArray(obj.images) &&
    typeof obj.variantId === 'string' &&
    typeof obj.isAvailable === 'boolean' &&
    ['mock', 'shopify', 'simple'].includes(obj.source)
  );
}

export function isValidPrice(obj: any): obj is UniversalPrice {
  return (
    obj &&
    (typeof obj.amount === 'string' || typeof obj.amount === 'number') &&
    typeof obj.currencyCode === 'string'
  );
}

export function isValidImage(obj: any): obj is UniversalImage {
  return obj && typeof obj.url === 'string';
}

// Helper types for different data sources
export type MockProduct = Pick<UniversalProduct, 
  | 'id' 
  | 'title' 
  | 'price' 
  | 'compareAtPrice' 
  | 'featuredImage' 
  | 'variantId' 
  | 'isAvailable' 
  | 'category'
  | 'lifeCategory'
> & { source: 'mock' };

export type ShopifyProductData = Pick<UniversalProduct,
  | 'id'
  | 'title' 
  | 'handle'
  | 'description'
  | 'price'
  | 'compareAtPrice'
  | 'featuredImage'
  | 'images'
  | 'variantId'
  | 'isAvailable'
  | 'productType'
  | 'tags'
  | 'seo'
> & { source: 'shopify' };

export type SimpleProductData = Pick<UniversalProduct,
  | 'id'
  | 'title'
  | 'handle'
  | 'price'
  | 'featuredImage'
  | 'variantId'
  | 'isAvailable'
> & { source: 'simple' };

// Utility types for component props
export interface ProductComponentProps {
  product: UniversalProduct;
  variant?: 'card' | 'showcase' | 'list' | 'simple';
  showActions?: boolean;
  hideDescription?: boolean;
  customActions?: {
    onAddToCart?: (product: UniversalProduct, quantity: number) => void;
    onView?: (product: UniversalProduct) => void;
    onCompare?: (product: UniversalProduct) => void;
  };
}

// Cart item interface that works with universal products
export interface UniversalCartItem {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  price: UniversalPrice;
  quantity: number;
  image?: UniversalImage;
  source: UniversalProduct['source'];
}

// Collection/Category interface
export interface ProductCollection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  products: UniversalProduct[];
  featuredImage?: UniversalImage;
}

// Search and filtering interfaces
export interface ProductSearchParams {
  query?: string;
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy?: 'title' | 'price' | 'created' | 'updated';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface ProductSearchResult {
  products: UniversalProduct[];
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Error handling for product operations
export class ProductError extends Error {
  constructor(
    message: string,
    public code: string,
    public source: UniversalProduct['source'],
    public productId?: string
  ) {
    super(message);
    this.name = 'ProductError';
  }
}

// Constants for product operations
export const PRODUCT_SOURCES = ['mock', 'shopify', 'simple'] as const;
export const LIFE_CATEGORIES = ['Vida Profesional', 'Vida Activa', 'Vida Gamer'] as const;
export const PRODUCT_VARIANTS = ['card', 'showcase', 'list', 'simple'] as const;