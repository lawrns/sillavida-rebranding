import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

interface ProductHeroShowcaseProps {
  productTitle: string;
  productSubtitle: string;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  variantId?: string;
}

const ProductHeroShowcase: React.FC<ProductHeroShowcaseProps> = ({
  productTitle,
  productSubtitle,
  price,
  compareAtPrice,
  inStock,
  variantId
}) => {
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addItem, openCart } = useCart();

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(1, newQuantity));
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!inStock || addingToCart || !variantId) return;
    
    setAddingToCart(true);
    try {
      await addItem(variantId, quantity);
      openCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  // Format price
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Calculate discount percentage
  const discountPercentage = compareAtPrice ? Math.round((1 - price / compareAtPrice) * 100) : 0;

  return (
    <div className="product-info">
      {/* Product Title */}
      <h1 className="product-title text-2xl md:text-3xl font-bold mb-2">{productTitle}</h1>
      
      {/* Product Subtitle */}
      <p className="product-subtitle text-gray-600 mb-4">{productSubtitle}</p>
      
      {/* Product Price */}
      <div className="product-price-container mb-6">
        <div className="flex items-center gap-3">
          <span className="current-price text-2xl font-bold text-black">{formatPrice(price)}</span>
          
          {compareAtPrice && compareAtPrice > price && (
            <>
              <span className="original-price text-lg text-red-500/70 line-through">{formatPrice(compareAtPrice)}</span>
              <span className="discount-badge bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-medium">
                Ahorra {discountPercentage}%
              </span>
            </>
          )}
        </div>
      </div>
      
      {/* Stock Status */}
      <div className="stock-status mb-6">
        {inStock ? (
          <span className="in-stock-badge bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            En stock
          </span>
        ) : (
          <span className="out-of-stock-badge bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
            Agotado
          </span>
        )}
      </div>
      
      {/* Quantity Selector */}
      <div className="quantity-selector mb-6">
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
          Cantidad
        </label>
        <div className="flex items-center">
          <button 
            className="quantity-btn minus-btn"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Disminuir cantidad"
          >
            -
          </button>
          <input 
            type="number" 
            id="quantity"
            name="quantity"
            min="1"
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            className="quantity-input"
          />
          <button 
            className="quantity-btn plus-btn"
            onClick={() => handleQuantityChange(quantity + 1)}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      </div>
      
      {/* Add to Cart Button */}
      <button 
        className={`py-3 px-6 text-lg font-bold bg-black text-white border-none rounded cursor-pointer transition-all uppercase tracking-wider w-full font-heading
                hover:bg-black/90 hover:-translate-y-0.5 active:translate-y-0 ${!inStock || addingToCart ? 'opacity-70 cursor-not-allowed' : ''}`}
        onClick={handleAddToCart}
        disabled={!inStock || addingToCart}
      >
        {addingToCart ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            <span>Agregando...</span>
          </>
        ) : !inStock ? (
          'Agotado'
        ) : (
          'Agregar al carrito'
        )}
      </button>
    </div>
  );
};

export default ProductHeroShowcase;
