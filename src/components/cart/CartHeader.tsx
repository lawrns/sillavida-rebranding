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
    <div className="p-4 border-b border-neutral-200 bg-[#000000] text-white" style={{ borderTopLeftRadius: '0.5rem' }}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold text-white">Tu Carrito</h2>
        <button
          className="p-2 rounded-full hover:bg-black/30 text-white"
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