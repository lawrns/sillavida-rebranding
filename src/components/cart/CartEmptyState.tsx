import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface CartEmptyStateProps {
  onContinueShopping: () => void;
}

/**
 * CartEmptyState - Empty cart state component
 * Isolated component for when cart is empty
 */
const CartEmptyState: React.FC<CartEmptyStateProps> = ({ onContinueShopping }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 max-w-xs mx-auto">
      <ShoppingBag className="h-16 w-16 text-neutral-300" />
      <p className="mt-4 text-neutral-500 text-lg font-body text-center">Tu carrito está vacío</p>
      <button
        className="mt-6 bg-[#4672a1] hover:bg-[#5a81d3] text-white py-3 px-6 rounded font-heading font-semibold tracking-wide text-base"
        onClick={onContinueShopping}
        aria-label="Continuar comprando"
      >
        Continuar Comprando
      </button>
    </div>
  );
};

export default CartEmptyState;