import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { ShopifyProduct } from '../types/shopify';

interface ShopifyPromoBannerProps {
  product: ShopifyProduct;
  dark?: boolean;
}

// Analytics tracking function (same as in HomePage)
const trackEvent = (eventName: string, eventData: Record<string, any> = {}) => {
  console.log(`[Analytics] ${eventName}:`, eventData);
};

const ShopifyPromoBanner: React.FC<ShopifyPromoBannerProps> = ({ product, dark = false }) => {
  // State for image loading
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
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
  
  // Track product impression when component mounts
  useEffect(() => {
    trackEvent('product_impression', {
      product_id: product.id,
      product_name: product.title,
      product_price: price,
      location: 'featured_banner'
    });
  }, [product.id, product.title, price]);
  
  // Handle click on "Buy Now" button
  const handleBuyClick = () => {
    trackEvent('product_click', {
      product_id: product.id,
      product_name: product.title,
      product_price: price,
      location: 'featured_banner'
    });
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl ${dark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="flex flex-col md:flex-row items-center justify-between p-8">
        <div className="flex-1 mb-8 md:mb-0">
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
            <button 
              className="mt-6 px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              onClick={handleBuyClick}
              aria-label={`Comprar ${product.title}`}
            >
              Comprar Ahora
            </button>
          </Link>
        </div>
        <div className="flex-1 relative">
          {!imageLoaded && !imageError && (
            <div className="w-full h-[400px] bg-gray-200 animate-pulse flex items-center justify-center">
              <span className={dark ? 'text-gray-600' : 'text-gray-400'}>Cargando imagen...</span>
            </div>
          )}
          {imageError && (
            <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
              <span className={dark ? 'text-gray-600' : 'text-gray-400'}>Imagen no disponible</span>
            </div>
          )}
          <img 
            src={imageUrl} 
            alt={product.title}
            className={`w-full h-[400px] object-contain ${imageLoaded && !imageError ? 'block' : 'hidden'}`}
            loading="lazy"
            onLoad={() => {
              setImageLoaded(true);
              trackEvent('image_loaded', { product_id: product.id });
            }}
            onError={(e) => {
              setImageError(true);
              trackEvent('image_error', { product_id: product.id });
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
