import React from 'react';
import type { ShopifyProduct } from '../types/shopify';
import { transformShopifyProduct, getProductPrimaryImage } from '../utils/business/productTransformer';

interface RelatedProduct {
  id: string;
  title: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  vidaScore?: number;
}

interface RelatedProductsProps {
  products: ShopifyProduct[] | RelatedProduct[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  // Transform products using centralized utilities
  const formattedProducts = products.map(product => {
    // Check if the product is already in RelatedProduct format
    if ('image' in product) {
      return product as RelatedProduct;
    }
    
    // Transform from ShopifyProduct format using centralized utility
    try {
      const shopifyProduct = product as ShopifyProduct;
      const standardProduct = transformShopifyProduct(shopifyProduct);
      const primaryImage = getProductPrimaryImage(standardProduct);
      
      return {
        id: standardProduct.id,
        title: standardProduct.title,
        image: primaryImage?.url || '/images/placeholder.png',
        price: parseFloat(standardProduct.price.amount),
        vidaScore: 90 // Default score if not provided
      } as RelatedProduct;
    } catch (error) {
      console.warn('Product transformation failed, using fallback:', error);
      const shopifyProduct = product as ShopifyProduct;
      return {
        id: shopifyProduct.id,
        title: shopifyProduct.title,
        image: shopifyProduct.images.edges[0]?.node.url || '/images/placeholder.png',
        price: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
        vidaScore: 90
      } as RelatedProduct;
    }
  });

  return (
    <div className="related-products">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {formattedProducts.map(product => (
          <div key={product.id} className="rounded-lg overflow-hidden bg-white border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="relative pb-[75%] overflow-hidden bg-gray-100">
              <img 
                src={product.image} 
                alt={product.title} 
                className="absolute inset-0 w-full h-full object-contain p-2" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder.png';
                }}
              />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-heading font-semibold text-lg mb-1 line-clamp-2 text-black h-14">{product.title}</h3>
              <div className="flex items-center space-x-1 mb-2">
                {product.vidaScore && (
                  <span 
                    className="text-white px-2 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: '#5CB85C' }}
                  >
                    Vida Score: {product.vidaScore}
                  </span>
                )}
              </div>
              <div className="mt-auto pt-2">
                <div className="flex items-baseline gap-2">
                  <p className="text-base font-heading font-bold text-black">${product.price.toFixed(2)} MXN</p>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <p className="text-xs text-red-500 line-through font-heading">
                      ${product.compareAtPrice.toFixed(2)} MXN
                    </p>
                  )}
                </div>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <p className="text-xs font-heading font-semibold text-red-500">
                    Ahorra {Math.round(100 - (product.price / product.compareAtPrice) * 100)}%
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
