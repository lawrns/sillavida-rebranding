import React from 'react';
import { X } from 'lucide-react';

interface CartHeaderProps {
  onClose: () => void;
}

/**
 * CartHeader - Header component for cart panel
 * Isolated header component with close functionality
 */
const CartHeader: React.FC<CartHeaderProps> = ({ onClose }) => {
  return (
    <div className="p-4 border-b border-gray-200 bg-white" style={{ borderTopLeftRadius: '0.5rem' }}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-black">Tu Carrito</h2>
        <button
          className="p-2 rounded-full hover:bg-gray-100 text-black"
          onClick={onClose}
          aria-label="Cerrar carrito"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default CartHeader;