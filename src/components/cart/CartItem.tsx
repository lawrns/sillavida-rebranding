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
    <li className="py-4 flex">
      <div className="flex-shrink-0 w-24 h-24 border border-neutral-200 rounded-md overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
            <ShoppingBag className="h-8 w-8 text-neutral-400" />
          </div>
        )}
      </div>

      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <h3 className="text-base font-heading font-medium">
            {item.productTitle || item.title}
          </h3>
          <p className="ml-4 font-heading font-semibold text-accent">{formattedPrice}</p>
        </div>

        <p className="mt-1 text-sm text-neutral-500 font-body">
          {item.title !== item.productTitle ? item.title : ''}
        </p>

        <div className="mt-2 flex justify-between">
          <div className="flex items-center border border-neutral-200 rounded-md">
            <button
              onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
              disabled={isLoading}
              className="p-2 sm:p-1 text-neutral-600 hover:text-accent"
              aria-label="Disminuir cantidad"
            >
              <Minus className="h-5 w-5 sm:h-4 sm:w-4" />
            </button>
            <span className="px-3 py-1 min-w-[40px] sm:min-w-[32px] text-center text-base sm:text-sm font-heading font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              disabled={isLoading}
              className="p-2 sm:p-1 text-neutral-600 hover:text-accent"
              aria-label="Aumentar cantidad"
            >
              <Plus className="h-5 w-5 sm:h-4 sm:w-4" />
            </button>
          </div>

          <button
            className="text-accent hover:text-accent/80 text-base sm:text-sm font-heading font-medium flex items-center px-2 py-1"
            onClick={() => onRemove(item.id)}
            disabled={isLoading}
            aria-label={`Eliminar ${item.title} del carrito`}
          >
            <Trash2 className="h-5 w-5 sm:h-4 sm:w-4 mr-1" />
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </li>
  );
};

export default CartItem;