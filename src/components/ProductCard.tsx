import React from 'react';
import { Star } from 'lucide-react';
import { Chair } from '../data/chairs';

interface ProductCardProps {
  chair: Chair;
}

const ProductCard: React.FC<ProductCardProps> = ({ chair }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={chair.image}
        alt={chair.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < Math.floor(chair.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">{chair.rating}</span>
        </div>
        <h3 className="font-semibold mb-2">{chair.name}</h3>
        <p className="text-gray-600 mb-2">{chair.description}</p>
        <p className="text-xl font-bold text-red-600">
          ${chair.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
        </p>
        <button className="w-full mt-4 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors">
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;