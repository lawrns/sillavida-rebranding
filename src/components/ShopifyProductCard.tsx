import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ShopifyProduct } from '../types/shopify';
import { useCart } from '../context/CartContext';

// Mock Shopify variant IDs for testing
// In a real implementation, these would come from the Shopify API
const MOCK_VARIANT_IDS: Record<string, string> = {
  'default-product': 'gid://shopify/ProductVariant/123456789',
};

interface ShopifyProductCardProps {
  product: ShopifyProduct;
}

const ShopifyProductCard: React.FC<ShopifyProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Parse the price from string to number
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  
  // Format the price with the currency
  const formattedPrice = price.toLocaleString('es-MX', {
    style: 'currency',
    currency: product.priceRange.minVariantPrice.currencyCode
  });

  // Default rating for now (could be fetched from Shopify metafields in the future)
  const rating = 4.5;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation(); // Stop event propagation
    
    setIsLoading(true);
    try {
      // Try to get the variant ID from the product
      let variantId = product.variants?.edges[0]?.node.id;
      
      // If no variant ID is found, use a mock ID
      if (!variantId) {
        console.warn('No variant ID found for product:', product.title);
        variantId = MOCK_VARIANT_IDS['default-product'];
      }
      
      await addItem(variantId, 1);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/product/${product.handle}`}>
        <img 
          src={product.images.edges[0]?.node.url}
          alt={product.images.edges[0]?.node.altText || product.title} 
          className="w-full h-48 object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/images/placeholder.png';
            e.currentTarget.onerror = null;
          }}
        />
      </Link>
      <div className="p-4">
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">{rating}</span>
        </div>
        <Link to={`/product/${product.handle}`}>
          <h3 className="font-semibold mb-2 hover:text-red-600 transition-colors">{product.title}</h3>
        </Link>
        <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        <p className="text-xl font-bold text-red-600">
          {formattedPrice}
        </p>
        <button 
          onClick={handleAddToCart}
          disabled={isLoading}
          className={`w-full mt-4 py-2 rounded transition-colors ${
            success 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {isLoading ? 'Agregando...' : success ? '¡Agregado!' : 'Agregar al Carrito'}
        </button>
      </div>
    </div>
  );
};

export default ShopifyProductCard;
