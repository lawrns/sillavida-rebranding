import React from 'react';
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';

interface CartItemProps {
  item: {
    id: string;
    title: string;
    productTitle?: string;
    imageUrl?: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    quantity: number;
  };
  isLoading: boolean;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

/**
 * CartItem - Individual cart item component
 * Isolated component for displaying and managing a single cart item
 */
const CartItem: React.FC<CartItemProps> = ({
  item,
  isLoading,
  onQuantityChange,
  onRemove
}) => {
  const price = parseFloat(item.price.amount);
  const formattedPrice = price.toLocaleString('es-MX', {
    style: 'currency',
    currency: item.price.currencyCode
  });

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
      const placeholder = document.createElement('div');
      placeholder.className = 'w-full h-full bg-neutral-100 flex items-center justify-center';
      placeholder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-neutral-400"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>';
      parent.appendChild(placeholder);
    }
  };

  return (
    <li className="py-6 border-b border-gray-200 last:border-b-0">
      <div className="flex items-start space-x-4">
        {/* Enhanced Product Image */}
        <div className="flex-shrink-0 w-20 h-20 border border-gray-200 rounded-lg overflow-hidden bg-white">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full bg-gray-50 flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-gray-300" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          {/* Product Name and Price Row */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-semibold text-black leading-tight pr-2">
              {item.productTitle || item.title}
            </h3>
            <p className="text-sm font-bold text-black whitespace-nowrap">{formattedPrice}</p>
          </div>

          {/* Variant Info */}
          {item.title !== item.productTitle && (
            <p className="text-xs text-gray-600 mb-3">
              {item.title}
            </p>
          )}

          {/* Quantity Controls and Actions Row */}
          <div className="flex items-center justify-between">
            {/* Modern Quantity Controls */}
            <div className="flex items-center">
              <button
                onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                disabled={isLoading}
                className="min-w-[44px] min-h-[44px] rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-colors disabled:opacity-50"
                aria-label="Disminuir cantidad"
              >
                <Minus className="h-4 w-4 text-gray-600" />
              </button>
              
              <span className="mx-4 text-sm font-medium text-black min-w-[20px] text-center">
                {item.quantity}
              </span>
              
              <button
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                disabled={isLoading}
                className="min-w-[44px] min-h-[44px] rounded-full border border-gray-300 flex items-center justify-center hover:border-black transition-colors disabled:opacity-50"
                aria-label="Aumentar cantidad"
              >
                <Plus className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4 text-xs">
              <button
                className="text-gray-500 hover:text-black font-medium transition-colors"
                disabled={isLoading}
              >
                Editar
              </button>
              <button
                className="text-gray-500 hover:text-black font-medium transition-colors"
                onClick={() => onRemove(item.id)}
                disabled={isLoading}
                aria-label={`Eliminar ${item.title} del carrito`}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;