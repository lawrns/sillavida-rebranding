import React from 'react';
import ProductCardSimple from '../components/ProductCardSimple';

const ProductCardDemo: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-heading font-bold mb-8 text-center">Product Card Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Light Card - Oficina X */}
        <ProductCardSimple 
          title="Oficina X"
          price={1000.00}
          imageSrc="/images/chair-transparent.png"
          productUrl="/product/oficina-x"
          isBestSeller={true}
        />
        
        {/* Dark Card - Ergonomica X */}
        <ProductCardSimple 
          title="Ergonomica X"
          price={3500.00}
          imageSrc="/images/chair-full.png"
          productUrl="/product/ergonomica-x"
          dark={true}
          isBestSeller={true}
        />
      </div>
      
      <div className="mt-16">
      <h2 className="text-2xl font-heading font-bold mb-8 text-center">Color Palette</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-lg bg-[#1E5959] mb-4"></div>
            <p className="font-heading font-medium">Deep Teal (Background)</p>
            <p className="text-sm text-gray-600 font-mono">#1E5959</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-lg bg-[#7D9D8C] mb-4"></div>
            <p className="font-heading font-medium">Sage Green (Buttons/Badges)</p>
            <p className="text-sm text-gray-600 font-mono">#7D9D8C</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-lg bg-[#E8DED1] mb-4"></div>
            <p className="font-heading font-medium">Warm Beige (Text)</p>
            <p className="text-sm text-gray-600 font-mono">#E8DED1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardDemo;
