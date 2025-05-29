/**
 * Centralized Product Data Transformation Utilities
 * Replaces 12 different product transformation patterns across components
 */

import type { ShopifyProduct } from '../../types/shopify';
import { formatPrice, type Price } from './priceFormatter';

// Standard product interface for internal use
export interface StandardProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: Price;
  compareAtPrice?: Price;
  images: StandardImage[];
  variants: StandardVariant[];
  collections: string[];
  tags: string[];
  availability: {
    isAvailable: boolean;
    stock?: number;
    message?: string;
  };
  seo: {
    title?: string;
    description?: string;
  };
  metadata: {
    vendor?: string;
    productType?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface StandardImage {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface StandardVariant {
  id: string;
  title: string;
  price: Price;
  compareAtPrice?: Price;
  isAvailable: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image?: StandardImage;
}

export interface MockProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  category: string;
  features: string[];
  tags: string[];
}

/**
 * Transform Shopify product to standard format
 */
export function transformShopifyProduct(shopifyProduct: any): StandardProduct {
  if (!shopifyProduct) {
    throw new Error('Product data is required');
  }

  // Extract images
  const images: StandardImage[] = shopifyProduct.images?.edges?.map((edge: any) => ({
    id: edge.node.id || `img_${Date.now()}`,
    url: edge.node.url,
    altText: edge.node.altText || shopifyProduct.title,
    width: edge.node.width,
    height: edge.node.height
  })) || [];

  // Extract variants
  const variants: StandardVariant[] = shopifyProduct.variants?.edges?.map((edge: any) => {
    const variant = edge.node;
    return {
      id: variant.id,
      title: variant.title,
      price: {
        amount: variant.price.amount,
        currencyCode: variant.price.currencyCode
      },
      compareAtPrice: variant.compareAtPrice ? {
        amount: variant.compareAtPrice.amount,
        currencyCode: variant.compareAtPrice.currencyCode
      } : undefined,
      isAvailable: variant.availableForSale,
      selectedOptions: variant.selectedOptions || [],
      image: variant.image ? {
        id: variant.image.id,
        url: variant.image.url,
        altText: variant.image.altText
      } : images[0]
    };
  }) || [];

  // Extract collections
  const collections: string[] = shopifyProduct.collections?.edges?.map((edge: any) => 
    edge.node.handle
  ) || [];

  // Extract price information
  const price: Price = {
    amount: shopifyProduct.priceRange?.minVariantPrice?.amount || '0',
    currencyCode: shopifyProduct.priceRange?.minVariantPrice?.currencyCode || 'MXN'
  };

  const compareAtPrice: Price | undefined = shopifyProduct.compareAtPriceRange?.minVariantPrice ? {
    amount: shopifyProduct.compareAtPriceRange.minVariantPrice.amount,
    currencyCode: shopifyProduct.compareAtPriceRange.minVariantPrice.currencyCode
  } : undefined;

  return {
    id: shopifyProduct.id,
    handle: shopifyProduct.handle,
    title: shopifyProduct.title,
    description: shopifyProduct.description || '',
    price,
    compareAtPrice,
    images,
    variants,
    collections,
    tags: shopifyProduct.tags || [],
    availability: {
      isAvailable: variants.some(v => v.isAvailable),
      message: variants.some(v => v.isAvailable) ? 'Disponible' : 'Agotado'
    },
    seo: {
      title: shopifyProduct.seo?.title || shopifyProduct.title,
      description: shopifyProduct.seo?.description || shopifyProduct.description
    },
    metadata: {
      vendor: shopifyProduct.vendor,
      productType: shopifyProduct.productType,
      createdAt: shopifyProduct.createdAt,
      updatedAt: shopifyProduct.updatedAt
    }
  };
}

/**
 * Transform mock product to standard format
 */
export function transformMockProduct(mockProduct: MockProduct): StandardProduct {
  const price: Price = {
    amount: mockProduct.price.toString(),
    currencyCode: 'MXN'
  };

  const compareAtPrice: Price | undefined = mockProduct.originalPrice ? {
    amount: mockProduct.originalPrice.toString(),
    currencyCode: 'MXN'
  } : undefined;

  const image: StandardImage = {
    id: `mock_img_${mockProduct.id}`,
    url: mockProduct.image,
    altText: mockProduct.title
  };

  const variant: StandardVariant = {
    id: `mock-variant-${mockProduct.id}`,
    title: 'Variante Estándar',
    price,
    compareAtPrice,
    isAvailable: true,
    selectedOptions: [],
    image
  };

  return {
    id: mockProduct.id,
    handle: mockProduct.title.toLowerCase().replace(/\s+/g, '-'),
    title: mockProduct.title,
    description: mockProduct.description,
    price,
    compareAtPrice,
    images: [image],
    variants: [variant],
    collections: [mockProduct.category],
    tags: mockProduct.tags,
    availability: {
      isAvailable: true,
      message: 'Disponible'
    },
    seo: {
      title: mockProduct.title,
      description: mockProduct.description
    },
    metadata: {
      vendor: 'SillaVida',
      productType: mockProduct.category
    }
  };
}

/**
 * Generate variant ID from product data (standardizes the 3 different approaches found)
 */
export function generateVariantId(productData: {
  id?: string;
  handle?: string;
  title?: string;
  category?: string;
}): string {
  // Priority order: id, handle, title-based
  if (productData.id) {
    return `variant-${productData.id}`;
  }
  
  if (productData.handle) {
    return `variant-${productData.handle}`;
  }
  
  if (productData.title) {
    const cleanTitle = productData.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return `variant-${cleanTitle}`;
  }
  
  // Fallback: generate random ID
  return `variant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extract primary image from product
 */
export function getProductPrimaryImage(product: StandardProduct): StandardImage | null {
  if (product.images.length === 0) {
    return null;
  }
  
  return product.images[0];
}

/**
 * Get product URL for navigation
 */
export function getProductUrl(product: StandardProduct | { handle: string }): string {
  return `/products/${product.handle}`;
}

/**
 * Get collection URL for navigation
 */
export function getCollectionUrl(collection: string): string {
  return `/collections/${collection}`;
}

/**
 * Check if product has multiple variants
 */
export function hasMultipleVariants(product: StandardProduct): boolean {
  return product.variants.length > 1;
}

/**
 * Get available variants for a product
 */
export function getAvailableVariants(product: StandardProduct): StandardVariant[] {
  return product.variants.filter(variant => variant.isAvailable);
}

/**
 * Get default variant for a product
 */
export function getDefaultVariant(product: StandardProduct): StandardVariant | null {
  // Try to get first available variant
  const availableVariants = getAvailableVariants(product);
  if (availableVariants.length > 0) {
    return availableVariants[0];
  }
  
  // Fallback to first variant even if not available
  return product.variants[0] || null;
}

/**
 * Transform product for analytics tracking
 */
export function transformProductForAnalytics(
  product: StandardProduct,
  options: {
    listName?: string;
    position?: number;
    category?: string;
  } = {}
): {
  item_id: string;
  item_name: string;
  item_category: string;
  item_variant?: string;
  price: number;
  currency: string;
  quantity?: number;
  list_name?: string;
  index?: number;
} {
  const defaultVariant = getDefaultVariant(product);
  
  return {
    item_id: product.id,
    item_name: product.title,
    item_category: options.category || product.collections[0] || 'uncategorized',
    item_variant: defaultVariant?.title,
    price: parseFloat(product.price.amount.toString()),
    currency: product.price.currencyCode,
    list_name: options.listName,
    index: options.position
  };
}

/**
 * Transform cart item for analytics
 */
export function transformCartItemForAnalytics(cartItem: {
  id: string;
  title: string;
  price: Price;
  quantity: number;
  productTitle?: string;
}): {
  item_id: string;
  item_name: string;
  price: number;
  currency: string;
  quantity: number;
} {
  return {
    item_id: cartItem.id,
    item_name: cartItem.productTitle || cartItem.title,
    price: parseFloat(cartItem.price.amount.toString()),
    currency: cartItem.price.currencyCode,
    quantity: cartItem.quantity
  };
}

/**
 * Search products by query (title, description, tags)
 */
export function searchProducts(
  products: StandardProduct[],
  query: string
): StandardProduct[] {
  if (!query.trim()) {
    return products;
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  return products.filter(product => {
    return (
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      product.collections.some(collection => collection.toLowerCase().includes(searchTerm))
    );
  });
}

/**
 * Filter products by availability
 */
export function filterAvailableProducts(products: StandardProduct[]): StandardProduct[] {
  return products.filter(product => product.availability.isAvailable);
}

/**
 * Sort products by price
 */
export function sortProductsByPrice(
  products: StandardProduct[],
  order: 'asc' | 'desc' = 'asc'
): StandardProduct[] {
  return [...products].sort((a, b) => {
    const priceA = parseFloat(a.price.amount.toString());
    const priceB = parseFloat(b.price.amount.toString());
    
    return order === 'asc' ? priceA - priceB : priceB - priceA;
  });
}

/**
 * Get products by collection
 */
export function getProductsByCollection(
  products: StandardProduct[],
  collection: string
): StandardProduct[] {
  return products.filter(product => 
    product.collections.includes(collection)
  );
}

/**
 * Validate product data
 */
export function validateProduct(product: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!product) {
    errors.push('Product data is required');
    return { isValid: false, errors };
  }
  
  if (!product.id) {
    errors.push('Product ID is required');
  }
  
  if (!product.title || product.title.trim() === '') {
    errors.push('Product title is required');
  }
  
  if (!product.price || parseFloat(product.price.amount) <= 0) {
    errors.push('Valid product price is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}