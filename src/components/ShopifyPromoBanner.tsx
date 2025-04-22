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
    <div className={`relative overflow-hidden vida-shape-organic ${dark ? 'bg-[#E8DED1] vida-bg-pattern-breathing' : 'bg-[#E8DED1] vida-bg-pattern-leaf'}`}>
      <div className="flex flex-col md:flex-row items-center justify-between p-8">
        <div className="flex-1 mb-8 md:mb-0">
          <div className="inline-block px-4 py-1 rounded-full bg-[#7D9D8C] text-[#E8DED1] text-sm mb-4 font-heading font-medium">
            Campeón de Ventas
          </div>
          <h3 className="text-3xl font-heading font-bold mb-4 text-[#7D9D8C]">
            {product.title}
          </h3>
          <ul className="vida-feature-list space-y-2 mb-6 text-[#7D9D8C] font-body">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <span className="text-sm line-through text-[#C87D55] font-heading">
              {formattedOriginalPrice}
            </span>
            <span className="text-2xl font-heading font-bold text-[#7D9D8C] product-price">
              {formattedPrice}
            </span>
          </div>
          <Link to={`/product/${product.handle}`}>
            <button 
              className="mt-6 px-8 py-3 bg-[#7D9D8C] text-[#E8DED1] vida-shape-soft hover:opacity-90 transition-colors font-heading font-semibold tracking-wide"
              onClick={handleBuyClick}
              aria-label={`Ver ${product.title}`}
            >
              Ver Producto
            </button>
          </Link>
        </div>
        <div className="flex-1 relative">
          {!imageLoaded && !imageError && (
            <div className="w-full h-[400px] bg-gray-200 animate-pulse flex items-center justify-center">
              <span className="text-[#7D9D8C] font-body">Cargando imagen...</span>
            </div>
          )}
          {imageError && (
            <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
              <span className="text-[#7D9D8C] font-body">Imagen no disponible</span>
            </div>
          )}
          <img 
            src={imageUrl} 
            alt={product.title}
            className={`w-full h-[400px] object-contain vida-hover-breathing ${imageLoaded && !imageError ? 'block' : 'hidden'}`}
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
