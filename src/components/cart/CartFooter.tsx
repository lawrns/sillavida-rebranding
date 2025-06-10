import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import PriceBreakdown from './PriceBreakdown';
import PaymentMethods from './PaymentMethods';

interface CartFooterProps {
  cartTotal: string;
  cartItems: any[];
  cart: any;
  isLoading: boolean;
  onCheckout: () => void;
  onCloseCart: () => void;
}

/**
 * CartFooter - Footer section of cart with totals and checkout
 * Isolated component for cart actions and trust indicators
 */
const CartFooter: React.FC<CartFooterProps> = ({
  cartTotal,
  cartItems,
  cart,
  isLoading,
  onCheckout,
  onCloseCart
}) => {
  if (cartItems.length === 0) return null;

  // Calculate price breakdown (simplified for now - could be enhanced with real data)
  const subtotal = cartTotal;
  const shipping = "$0.00"; // Free shipping
  const tax = "$0.00"; // Tax calculation would be done server-side
  const total = cartTotal;

  return (
    <div className="bg-white" style={{ borderBottomLeftRadius: '0.5rem' }}>
      {/* Price Breakdown Section */}
      <div className="px-4">
        <PriceBreakdown
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
        />
      </div>

      {/* Checkout Button */}
      <div className="px-4 pb-2">
        <button
          onClick={onCheckout}
          disabled={isLoading}
          className="w-full bg-black text-white py-4 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Pasar a pago"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2 inline-block" />
              <span>Procesando...</span>
            </>
          ) : (
            'PASAR A PAGO'
          )}
        </button>
      </div>

      {/* View Full Cart Link */}
      <div className="px-4 pb-4 text-center">
        <Link
          to="/cart"
          onClick={onCloseCart}
          className="text-xs text-gray-500 hover:text-black transition-colors"
          aria-label="Ver carrito completo"
        >
          Ver Carrito Completo
        </Link>
      </div>

      {/* Payment Methods Section */}
      <div className="px-4 pb-4">
        <PaymentMethods />
      </div>
    </div>
  );
};

export default CartFooter;