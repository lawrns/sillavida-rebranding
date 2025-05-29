import React from 'react';

interface FreeShippingIndicatorProps {
  cartItems: any[];
  cart: any;
  cartTotal: string;
}

/**
 * FreeShippingIndicator - Free shipping progress component
 * Isolated component for showing shipping threshold progress
 */
const FreeShippingIndicator: React.FC<FreeShippingIndicatorProps> = ({
  cartItems,
  cart,
  cartTotal
}) => {
  const calculateProgressPercentage = () => {
    if (!cartItems.length) return 0;

    let subtotal = 0;
    if (cart?.cost?.subtotalAmount?.amount) {
      subtotal = parseFloat(cart.cost.subtotalAmount.amount);
    } else if (cartTotal) {
      subtotal = parseFloat(cartTotal.replace(/[^\d.-]/g, ''));
    } else {
      subtotal = cartItems.reduce((sum, item) => {
        return sum + (parseFloat(item.price.amount) * item.quantity);
      }, 0);
    }

    return Math.min(100, (subtotal / 10000) * 100);
  };

  const formatRemainingAmount = () => {
    if (!cartItems.length) return "$0.00";

    let subtotal = 0;
    let currencyCode = 'MXN';

    if (cart?.cost?.subtotalAmount?.amount) {
      subtotal = parseFloat(cart.cost.subtotalAmount.amount);
      currencyCode = cart.cost.subtotalAmount.currencyCode;
    } else if (cartTotal) {
      subtotal = parseFloat(cartTotal.replace(/[^\d.-]/g, ''));
    } else {
      subtotal = cartItems.reduce((sum, item) => {
        currencyCode = item.price.currencyCode;
        return sum + (parseFloat(item.price.amount) * item.quantity);
      }, 0);
    }

    const remaining = Math.max(0, 10000 - subtotal);

    return remaining.toLocaleString('es-MX', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const isEligibleForFreeShipping = () => {
    return (cart?.cost?.subtotalAmount?.amount && parseFloat(cart.cost.subtotalAmount.amount) >= 10000) ||
           (cartTotal && parseFloat(cartTotal.replace(/[^\d.-]/g, '')) >= 10000);
  };

  if (!cartItems.length) return null;

  return (
    <div className="my-3">
      {isEligibleForFreeShipping() ? (
        <div className="bg-accent/10 text-black p-2 rounded-md flex items-center">
          <div className="mr-2 text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <span className="text-sm font-heading font-medium">¡Tu pedido califica para envío gratis!</span>
        </div>
      ) : (
        <div>
          <div className="bg-neutral-100 rounded-full h-2 mb-2">
            <div
              className="bg-accent h-2 rounded-full"
              style={{
                width: `${Math.min(100, calculateProgressPercentage())}%`
              }}
            />
          </div>
          <div className="text-sm text-neutral-600 font-body">
            Te faltan <span className="font-heading font-medium text-accent">
              {formatRemainingAmount()}
            </span> para obtener envío gratis
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeShippingIndicator;