import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Chair } from '../data/chairs';
import { useCart } from '../context/CartContext';

// Mock Shopify variant IDs for testing
// In a real implementation, these would come from the Shopify API
const MOCK_VARIANT_IDS: Record<string, string> = {
  'ergopro-elite': 'gid://shopify/ProductVariant/123456789',
  'xgamer-pro': 'gid://shopify/ProductVariant/987654321',
  'ergo-mesh': 'gid://shopify/ProductVariant/456789123',
  'gamer-elite': 'gid://shopify/ProductVariant/789123456',
};

interface ProductCardProps {
  chair: Chair;
}

const ProductCard: React.FC<ProductCardProps> = ({ chair }) => {
  const { addItem } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation(); // Stop event propagation
    
    setIsLoading(true);
    try {
      // Get the mock Shopify variant ID for this chair
      const variantId = MOCK_VARIANT_IDS[chair.id] || chair.id;
      
      // Add the item to the cart
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
    <Link to={`/product/${chair.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <img 
          src={chair.image}
          alt={chair.name} 
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < Math.floor(chair.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">{chair.rating}</span>
          </div>
          <h3 className="font-semibold mb-2">{chair.name}</h3>
          <p className="text-gray-600 mb-2 line-clamp-2">{chair.description}</p>
          <p className="text-xl font-bold text-red-600">
            ${chair.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
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
    </Link>
  );
};

export default ProductCard;
