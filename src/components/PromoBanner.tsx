import React from 'react';
import { Chair } from '../data/chairs';

interface PromoBannerProps {
  chair: Chair;
  dark?: boolean;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ chair, dark = false }) => {
  return (
    <div className={`relative overflow-hidden vida-shape-organic ${dark ? 'bg-black vida-bg-pattern-breathing' : 'bg-black vida-bg-pattern-leaf'}`}>
      <div className="flex items-center justify-between p-8">
        <div className="flex-1">
          <div className="inline-block px-4 py-1 rounded-full bg-gray-600 text-white text-sm mb-4 font-heading font-medium">
            Campeón de Ventas
          </div>
          <h3 className="text-3xl font-heading font-bold mb-4 text-white">
            {chair.name}
          </h3>
          <ul className="vida-feature-list space-y-2 mb-6 text-white font-body">
            {chair.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <span className="text-sm line-through text-gray-400 font-heading">
              ${(chair.price * 1.2).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </span>
            <span className="text-2xl font-heading font-bold text-white product-price">
              ${chair.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </span>
          </div>
          <button className="mt-6 px-8 py-3 bg-gray-600 text-white vida-shape-soft hover:bg-gray-700 transition-colors font-heading font-semibold tracking-wide">
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
