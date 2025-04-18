import React, { useEffect, useState } from 'react';
import { Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface ShippingPromoBannerProps {
  threshold: number;
  currencyCode?: string;
}

const ShippingPromoBanner: React.FC<ShippingPromoBannerProps> = ({ 
  threshold = 10000, 
  currencyCode = 'MXN' 
}) => {
  const { cart, cartItems, cartTotal, isLoading, cartCount } = useCart();
  const [subtotal, setSubtotal] = useState(0);
  
  // Update subtotal when cart changes
  useEffect(() => {
    // Calculate subtotal from cartItems if cart.cost is not available
    if (cart?.cost?.subtotalAmount?.amount) {
      setSubtotal(parseFloat(cart.cost.subtotalAmount.amount));
    } else if (cartItems.length > 0) {
      // Fallback calculation from cartItems
      const total = cartItems.reduce((sum, item) => {
        return sum + (parseFloat(item.price.amount) * item.quantity);
      }, 0);
      setSubtotal(total);
    } else {
      setSubtotal(0);
    }
    
    console.log('[ShippingPromoBanner] Cart updated:', {
      cartCount,
      cartItemsLength: cartItems.length,
      cartTotal,
      subtotalFromCart: cart?.cost?.subtotalAmount?.amount,
      calculatedSubtotal: subtotal
    });
  }, [cart, cartItems, cartTotal, cartCount]);
  
  // Calculate the amount needed to reach free shipping
  const amountToFreeShipping = Math.max(0, threshold - subtotal);
  const hasQualifiedForFreeShipping = subtotal >= threshold;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('es-MX', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Don't show if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="bg-teal text-white py-2 px-4 text-center vida-bg-pattern-wave">
        <div className="container mx-auto flex items-center justify-center">
          <Truck className="h-5 w-5 mr-2 vida-hover-breathing" />
          <p className="text-sm font-heading font-medium">
            ¡Envío GRATIS en compras superiores a {formatCurrency(threshold)}! 
            <Link to="/promociones" className="underline ml-2">Ver detalles</Link>
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={hasQualifiedForFreeShipping ? "bg-sage text-white py-2 px-4 text-center vida-bg-pattern-wave" : "bg-teal text-white py-2 px-4 text-center vida-bg-pattern-wave"}>
      <div className="container mx-auto flex items-center justify-center">
        <Truck className="h-5 w-5 mr-2 vida-hover-breathing" />
        {hasQualifiedForFreeShipping ? (
          <p className="text-sm font-heading font-medium">
            ¡Felicidades! Tu pedido califica para envío GRATIS
          </p>
        ) : (
          <p className="text-sm font-heading font-medium">
            ¡Te faltan {formatCurrency(amountToFreeShipping)} para obtener envío GRATIS!
            <Link to="/promociones" className="underline ml-2">Ver detalles</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ShippingPromoBanner;
