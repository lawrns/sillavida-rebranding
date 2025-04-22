import React from 'react';
import { Link } from 'react-router-dom';

interface ProductCardSimpleProps {
  title: string;
  price: number;
  imageSrc: string;
  productUrl: string;
  dark?: boolean;
  isBestSeller?: boolean;
}

const ProductCardSimple: React.FC<ProductCardSimpleProps> = ({
  title,
  price,
  imageSrc,
  productUrl,
  dark = false,
  isBestSeller = false
}) => {
  // Format the price with the currency
  const formattedPrice = `$${price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
  
  return (
    <div className={`relative overflow-hidden rounded-lg shadow-md bg-beige`}>
      {isBestSeller && (
        <div className="absolute top-4 left-4 z-10">
          <div className="inline-block px-4 py-1 rounded-full bg-sage text-[#C87D55] text-sm font-heading font-medium">
            Campeón de Ventas
          </div>
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-2xl font-heading font-bold mb-6 text-sage">
          {title}
        </h3>
        
        <div className="flex items-center justify-between mb-6">
          <img 
            src={imageSrc} 
            alt={title}
            className="w-32 h-32 object-contain"
          />
          
          <span className="text-2xl font-heading font-bold text-sage">
            {formattedPrice}
          </span>
        </div>
        
        <Link to={productUrl}>
          <button 
            className="w-full py-3 bg-sage text-[#C87D55] rounded-lg font-heading font-semibold hover:bg-sage-light transition-colors"
          >
            Ver Producto
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCardSimple;
