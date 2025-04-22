import React from 'react';
import { Chair } from '../data/chairs';

interface PromoBannerProps {
  chair: Chair;
  dark?: boolean;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ chair, dark = false }) => {
  return (
    <div className={`relative overflow-hidden vida-shape-organic ${dark ? 'bg-[#1E5959] vida-bg-pattern-breathing' : 'bg-[#1E5959] vida-bg-pattern-leaf'}`}>
      <div className="flex items-center justify-between p-8">
        <div className="flex-1">
          <div className="inline-block px-4 py-1 rounded-full bg-[#7D9D8C] text-[#E8DED1] text-sm mb-4 font-heading font-medium">
            Campeón de Ventas
          </div>
          <h3 className="text-3xl font-heading font-bold mb-4 text-[#E8DED1]">
            {chair.name}
          </h3>
          <ul className="vida-feature-list space-y-2 mb-6 text-[#E8DED1] font-body">
            {chair.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <span className="text-sm line-through text-[#C87D55] font-heading">
              ${(chair.price * 1.2).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </span>
            <span className="text-2xl font-heading font-bold text-[#E8DED1] product-price">
              ${chair.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </span>
          </div>
          <button className="mt-6 px-8 py-3 bg-[#7D9D8C] text-[#E8DED1] vida-shape-soft hover:opacity-90 transition-colors font-heading font-semibold tracking-wide">
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
