import React from 'react';
import { Chair } from '../data/chairs';

interface PromoBannerProps {
  chair: Chair;
  dark?: boolean;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ chair, dark = false }) => {
  return (
    <div className={`relative overflow-hidden vida-shape-organic ${dark ? 'bg-gray-900 vida-bg-pattern-breathing' : 'bg-gray-100 vida-bg-pattern-leaf'}`}>
      <div className="flex items-center justify-between p-8">
        <div className="flex-1">
          <div className="inline-block px-4 py-1 rounded-full bg-teal text-white text-sm mb-4 font-heading font-medium">
            Campeón de Ventas
          </div>
          <h3 className={`text-3xl font-heading font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
            {chair.name}
          </h3>
          <ul className={`vida-feature-list space-y-2 mb-6 ${dark ? 'text-gray-300' : 'text-gray-600'} font-body`}>
            {chair.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <span className={`text-sm line-through ${dark ? 'text-gray-400' : 'text-gray-500'} font-heading`}>
              ${(chair.price * 1.2).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </span>
            <span className={`text-2xl font-heading font-bold ${dark ? 'text-white' : 'text-gray-900'} product-price`}>
              ${chair.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </span>
          </div>
          <button className="mt-6 px-8 py-3 bg-teal text-white vida-shape-soft hover:bg-teal-light transition-colors font-heading font-semibold tracking-wide">
            Agregar al Carrito
          </button>
        </div>
        <div className="flex-1">
          <img 
            src={chair.image} 
            alt={chair.name}
            className="w-full h-[400px] object-contain vida-hover-breathing"
          />
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
