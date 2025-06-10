import React from 'react';

interface PriceBreakdownProps {
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
}

/**
 * PriceBreakdown - Detailed cost breakdown component
 * Shows subtotal, shipping, tax, and total in a clean format
 */
const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  subtotal,
  shipping,
  tax,
  total
}) => {
  return (
    <div className="border-t border-gray-200 pt-4 pb-4">
      <div className="space-y-2">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-black font-medium">{subtotal}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Envío</span>
          <span className="text-black font-medium">
            {shipping === '$0.00' || shipping === '$0,00' ? 'Gratis' : shipping}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">IVA</span>
          <span className="text-black font-medium">{tax}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-2">
          {/* Total */}
          <div className="flex justify-between">
            <span className="text-base font-semibold text-black">Total Incl. IVA</span>
            <span className="text-base font-bold text-black">{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakdown;