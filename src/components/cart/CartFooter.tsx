import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { createLazyComponent } from '../common/LazyComponent';
import FreeShippingIndicator from './FreeShippingIndicator';

// Lazy load TrustIndicator
const LazyTrustIndicator = createLazyComponent(() => import('../TrustIndicator'));

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

  return (
    <div className="border-t border-neutral-200 p-4 bg-white" style={{ borderBottomLeftRadius: '0.5rem' }}>
      <div className="flex justify-between font-heading font-medium text-base mb-1">
        <p>Subtotal</p>
        <p className="text-accent">{cartTotal}</p>
      </div>

      <FreeShippingIndicator 
        cartItems={cartItems}
        cart={cart}
        cartTotal={cartTotal}
      />

      <p className="text-sm text-neutral-500 mb-4 font-body">
        Envío e impuestos calculados al finalizar la compra.
      </p>

      <button
        onClick={onCheckout}
        disabled={isLoading}
        className="w-full bg-accent text-white py-4 sm:py-3 rounded font-heading font-semibold tracking-wide hover:bg-accent/90 flex items-center justify-center text-base"
        aria-label="Finalizar compra"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 sm:h-4 sm:w-4 border-2 border-white border-t-transparent mr-2" />
            <span>Procesando...</span>
          </>
        ) : (
          <>
            <span>Finalizar Compra</span>
            <ChevronRight className="ml-1 h-5 w-5" />
          </>
        )}
      </button>

      <div className="mt-4 text-center">
        <p className="text-base sm:text-sm text-neutral-500 font-body">
          o{' '}
          <Link
            to="/cart"
            onClick={onCloseCart}
            className="text-accent font-heading font-medium hover:text-accent/80 px-2 py-1 inline-block"
            aria-label="Ver carrito completo"
          >
            Ver Carrito Completo
          </Link>
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-100">
        <div className="flex justify-center space-x-6">
          <LazyTrustIndicator
            type="warranty"
            size="small"
            layout="horizontal"
            showDescription={false}
          />
          <LazyTrustIndicator
            type="payment"
            size="small"
            layout="horizontal"
            showDescription={false}
          />
        </div>
        <p className="text-xs text-center text-neutral-500 mt-2 font-body">
          Garantía de Bienestar en todos nuestros productos
        </p>
      </div>
    </div>
  );
};

export default CartFooter;