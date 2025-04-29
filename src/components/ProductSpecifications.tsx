import React from 'react';

interface ProductSpecificationsProps {
  specs: { category: string; items: { label: string; value: string }[] }[];
  certifications?: string[];
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ specs, certifications }) => {
  return (
    <div className="product-specifications">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {specs.map((spec, i) => (
          <div key={i} className="spec-category">
            <h3 className="font-bold text-lg mb-3 text-terracotta font-heading">{spec.category}</h3>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {spec.items.map((item, j) => (
                <div key={j} className={`flex justify-between py-3 px-4 ${j !== spec.items.length - 1 ? 'border-b border-gray-200' : ''}`}>
                  <span className="text-gray-700 font-body">{item.label}</span>
                  <span className="font-medium text-black font-body ml-4">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {certifications && certifications.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="text-gray-700 font-body font-medium mr-2">Certificaciones:</span>
          {certifications.map((cert, i) => (
            <span key={i} className="bg-sage text-white px-3 py-1 rounded-full text-xs font-bold" title={cert}>{cert}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSpecifications;
