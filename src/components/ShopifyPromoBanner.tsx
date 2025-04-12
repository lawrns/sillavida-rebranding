import React from 'react';
import { Link } from 'react-router-dom';
import type { ShopifyProduct } from '../types/shopify';

interface ShopifyPromoBannerProps {
  product: ShopifyProduct;
  dark?: boolean;
}

const ShopifyPromoBanner: React.FC<ShopifyPromoBannerProps> = ({ product, dark = false }) => {
  // Parse the price from string to number
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  
  // Calculate the original price (20% higher for display purposes)
  const originalPrice = price * 1.2;
  
  // Format the prices with the currency
  const formattedPrice = `$${price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} ${product.priceRange.minVariantPrice.currencyCode}`;
  const formattedOriginalPrice = `$${originalPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })} ${product.priceRange.minVariantPrice.currencyCode}`;
  
  // Extract image URL
  const imageUrl = product.images.edges[0]?.node.url || '/images/placeholder.png';
  
  // Extract features from product description (simplified approach)
  // In a real implementation, these would come from product metafields or tags
  const features = product.description
    .split('.')
    .filter(sentence => sentence.trim().length > 0)
    .slice(0, 3)
    .map(sentence => sentence.trim());

  return (
    <div className={`relative overflow-hidden rounded-2xl ${dark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="flex items-center justify-between p-8">
        <div className="flex-1">
          <div className="inline-block px-4 py-1 rounded-full bg-red-600 text-white text-sm mb-4">
            Campeón de Ventas
          </div>
          <h3 className={`text-3xl font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
            {product.title}
          </h3>
          <ul className={`space-y-2 mb-6 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
            {features.map((feature, index) => (
              <li key={index}>✓ {feature}</li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <span className={`text-sm line-through ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              {formattedOriginalPrice}
            </span>
            <span className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
              {formattedPrice}
            </span>
          </div>
          <Link to={`/product/${product.handle}`}>
            <button className="mt-6 px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Comprar Ahora
            </button>
          </Link>
        </div>
        <div className="flex-1">
          <img 
            src={imageUrl} 
            alt={product.title}
            className="w-full h-[400px] object-contain"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/images/placeholder.png';
              e.currentTarget.onerror = null;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ShopifyPromoBanner;
