import React from 'react';

/**
 * CartLoadingState - Loading state component for cart
 * Isolated loading spinner and message
 */
const CartLoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      <p className="mt-4 text-neutral-500 text-lg font-body">Cargando carrito...</p>
    </div>
  );
};

export default CartLoadingState;