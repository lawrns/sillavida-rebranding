import React from 'react';

interface ProductFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  vidaScore?: { [category: string]: number };
}

interface ProductFeaturesProps {
  features: ProductFeature[];
}

const ProductFeatures: React.FC<ProductFeaturesProps> = ({ features }) => {
  return (
    <div className="product-features">
      <div className="flex flex-col gap-6">
        {features.map(feature => (
          <div key={feature.id} className="flex flex-col md:flex-row gap-6 items-center bg-white rounded-md p-6 border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-full md:w-1/3 flex justify-center">
              <img 
                src={feature.image} 
                alt={feature.title} 
                className="w-full max-w-[200px] h-auto object-contain rounded-md bg-neutral-50 p-4" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder.png';
                }}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 flex items-center justify-center bg-primary rounded-md p-2">
                  <img src={feature.icon} alt="icon" className="w-5 h-5 object-contain" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-neutral-900">{feature.title}</h3>
              </div>
              <p className="font-body text-neutral-700 mb-4 leading-relaxed">{feature.description}</p>
              {feature.vidaScore && (
                <div className="flex flex-wrap gap-2 text-xs">
                  {Object.entries(feature.vidaScore)
                    .filter(([_, score]) => score > 0) // Only show scores > 0
                    .map(([cat, score]) => (
                      <div key={cat} className="flex items-center">
                        <span className="bg-primary text-white px-3 py-1 rounded-md font-bold">{cat}</span>
                        <div className="ml-2 bg-neutral-200 h-2 w-24 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full" 
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                        <span className="ml-1 text-xs font-medium text-neutral-700">{score}%</span>
                      </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFeatures;
