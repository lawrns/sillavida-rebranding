import React from 'react';
import { Link } from 'react-router-dom';

interface ProductCardSimpleProps {
  title: string;
  price: number;
  imageSrc: string;
  productUrl: string;
  isBestSeller?: boolean;
}

const ProductCardSimple: React.FC<ProductCardSimpleProps> = ({
  title,
  price,
  imageSrc,
  productUrl,
  isBestSeller = false
}) => {
  // Format the price with the currency
  const formattedPrice = `$${price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
  
  return (
    <div className={`relative overflow-hidden rounded-md border border-neutral-100 shadow-sm hover:shadow-md transition-shadow bg-white`}>
      {isBestSeller && (
        <div className="absolute top-4 left-4 z-10">
          <div 
            className="inline-block px-4 py-1 rounded-full text-sm font-heading font-medium"
            style={{ 
              backgroundColor: 'rgba(217, 83, 79, 0.1)', 
              color: '#D9534F' 
            }}
          >
            Campeón de Ventas
          </div>
        </div>
      )}
      
      <div className="p-6">
        <h3 
          className="text-2xl font-heading font-bold mb-6"
          style={{ color: '#1A2A3A' }}
        >
          {title}
        </h3>
        
        <div className="flex items-center justify-between mb-6">
          <img 
            src={imageSrc} 
            alt={title}
            className="w-32 h-32 object-contain"
          />
          
          <span 
            className="text-2xl font-heading font-bold"
            style={{ color: '#D9534F' }}
          >
            {formattedPrice}
          </span>
        </div>
        
        <Link to={productUrl}>
          <button 
            className="w-full py-3 text-white rounded-md font-heading font-semibold transition-colors"
            style={{ backgroundColor: '#5CB85C' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#4A994A'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#5CB85C'}
          >
            Ver Producto
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCardSimple;
