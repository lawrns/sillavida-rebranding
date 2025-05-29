import type { Chair } from '../../data/chairs';
import type { ShopifyProduct } from '../../types/shopify';
import type { UniversalProduct, ProductError } from '../../types/universal';
import { generateVariantId } from './productTransformer';
import { isUniversalProduct } from '../../types/universal';

/**
 * Product Data Adapters
 * 
 * Converts different data sources (Mock, Shopify, Simple) to the unified product interface.
 * This eliminates the need for hybrid logic in components and provides type safety.
 */

/**
 * Converts a mock Chair object to UniversalProduct format
 */
export function adaptMockProduct(chair: Chair): UniversalProduct {
  const product: UniversalProduct = {
    id: chair.id,
    title: chair.name,
    handle: chair.id, // Use ID as handle for mock products
    description: chair.description,
    price: {
      amount: chair.price,
      currencyCode: 'MXN'
    },
    compareAtPrice: chair.compareAtPrice ? {
      amount: chair.compareAtPrice,
      currencyCode: 'MXN'
    } : undefined,
    featuredImage: {
      url: chair.image,
      altText: chair.name
    },
    images: [{
      url: chair.image,
      altText: chair.name
    }],
    variantId: generateVariantId({ id: chair.id }),
    isAvailable: true, // Mock products are always available
    category: chair.category,
    lifeCategory: chair.lifeCategory,
    source: 'mock'
  };

  // Validate the product before returning
  if (!isUniversalProduct(product)) {
    throw new ProductError('Invalid mock product conversion', 'INVALID_CONVERSION', 'mock', chair.id);
  }

  return product;
}

/**
 * Converts a Shopify product to UniversalProduct format
 */
export function adaptShopifyProduct(product: ShopifyProduct): UniversalProduct {
  // Get the first variant ID directly without conversion
  const variantId = product.variants?.edges[0]?.node.id;
  
  if (!variantId) {
    throw new ProductError(`No variant ID found for Shopify product: ${product.title}`, 'NO_VARIANT', 'shopify', product.id);
  }

  const universalProduct: UniversalProduct = {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    price: {
      amount: product.priceRange.minVariantPrice.amount,
      currencyCode: product.priceRange.minVariantPrice.currencyCode
    },
    compareAtPrice: product.compareAtPriceRange?.minVariantPrice ? {
      amount: product.compareAtPriceRange.minVariantPrice.amount,
      currencyCode: product.compareAtPriceRange.minVariantPrice.currencyCode
    } : undefined,
    featuredImage: {
      url: product.images.edges[0]?.node.url || '/images/placeholder.png',
      altText: product.images.edges[0]?.node.altText || product.title
    },
    images: product.images.edges.map(edge => ({
      url: edge.node.url,
      altText: edge.node.altText || product.title
    })),
    variantId: variantId, // Use Shopify variant ID directly
    isAvailable: product.variants?.edges[0]?.node.availableForSale ?? true,
    productType: product.productType,
    tags: product.tags,
    seo: product.seo ? {
      title: product.seo.title,
      description: product.seo.description
    } : undefined,
    source: 'shopify'
  };

  // Validate the product before returning
  if (!isUniversalProduct(universalProduct)) {
    throw new ProductError('Invalid Shopify product conversion', 'INVALID_CONVERSION', 'shopify', product.id);
  }

  return universalProduct;
}

/**
 * Creates a simple product for basic display purposes
 */
export function createSimpleProduct(params: {
  title: string;
  price: number;
  imageSrc: string;
  productUrl: string;
  id?: string;
}): UniversalProduct {
  const id = params.id || `simple-${Date.now()}`;
  const handle = params.productUrl.replace('/product/', ''); // Extract handle from URL
  
  const simpleProduct: UniversalProduct = {
    id,
    title: params.title,
    handle,
    price: {
      amount: params.price,
      currencyCode: 'MXN'
    },
    featuredImage: {
      url: params.imageSrc,
      altText: params.title
    },
    images: [{
      url: params.imageSrc,
      altText: params.title
    }],
    variantId: generateVariantId({ id }),
    isAvailable: true,
    source: 'simple'
  };

  // Validate the product before returning
  if (!isUniversalProduct(simpleProduct)) {
    throw new ProductError('Invalid simple product creation', 'INVALID_CONVERSION', 'simple', id);
  }

  return simpleProduct;
}

/**
 * Type guard to check if a product is from a specific source
 */
export function isProductFromSource(product: UniversalProduct, source: UniversalProduct['source']): boolean {
  return product.source === source;
}

/**
 * Batch adapter for converting arrays of products
 */
export function adaptProductArray<T>(
  products: T[],
  adapter: (product: T) => UniversalProduct
): UniversalProduct[] {
  return products.map(adapter).filter(Boolean);
}

/**
 * Safe adapter that handles errors gracefully
 */
export function safeAdaptProduct<T>(
  product: T,
  adapter: (product: T) => UniversalProduct,
  fallbackTitle = 'Producto no disponible'
): UniversalProduct | null {
  try {
    return adapter(product);
  } catch (error) {
    console.error('Product adaptation failed:', error);
    
    // Return a minimal fallback product
    const fallbackId = `error-${Date.now()}`;
    return {
      id: fallbackId,
      title: fallbackTitle,
      handle: 'error',
      price: { amount: 0, currencyCode: 'MXN' },
      featuredImage: { url: '/images/placeholder.png', altText: fallbackTitle },
      images: [{ url: '/images/placeholder.png', altText: fallbackTitle }],
      variantId: generateVariantId({ id: fallbackId }),
      isAvailable: false,
      source: 'simple'
    };
  }
}

/**
 * Product repository interface for future data abstraction
 */
export interface ProductRepository {
  getById(id: string): Promise<UniversalProduct | null>;
  getByHandle(handle: string): Promise<UniversalProduct | null>;
  search(query: string): Promise<UniversalProduct[]>;
  getByCategory(category: string): Promise<UniversalProduct[]>;
}

/**
 * Factory for creating product repositories
 */
export function createProductRepository(
  dataSource: 'mock' | 'shopify' | 'mixed'
): ProductRepository {
  // This would be implemented based on the chosen data source
  // For now, return a placeholder that shows the interface
  return {
    async getById() { return null; },
    async getByHandle() { return null; },
    async search() { return []; },
    async getByCategory() { return []; }
  };
}