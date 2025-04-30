import React from 'react';

interface Feature {
  id: string;
  title: string;
  description: string;
  position: { x: number; y: number };
}

interface ChairFeaturesComponentProps {
  features?: Feature[];
}

const ChairFeaturesComponent: React.FC<ChairFeaturesComponentProps> = ({ features = [] }) => {
  // Always use the placeholder image instead of product images
  const mainImage = '/images/chair-features.png';
  
  // Default features if none provided
  const defaultFeatures = [
    { id: 'headrest', title: 'Soporte Cervical', description: 'Reduce la tensión en la espalda alta.', position: { x: 50, y: 15 } },
    { id: 'lumbar', title: 'Soporte Lumbar', description: 'Mantiene la curvatura natural de la columna.', position: { x: 50, y: 40 } },
    { id: 'seat', title: 'Asiento Ergonómico', description: 'Promueve una postura saludable.', position: { x: 50, y: 60 } },
    { id: 'armrest', title: 'Apoyabrazos Ajustable', description: 'Soporte ergonómico para el codo.', position: { x: 75, y: 50 } },
    { id: 'base', title: 'Base Resistente', description: 'Estabilidad y movilidad fluida.', position: { x: 50, y: 85 } },
  ];

  // Use provided features or default ones
  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  return (
    <div className="chair-features">
      <div className="relative flex justify-center items-center mb-8 bg-gray-50 rounded-lg p-6">
        <img src={mainImage} alt="Chair features" className="max-w-full h-auto max-h-[400px] object-contain" />
        
        {/* Feature callouts removed as requested */}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayFeatures.map(feature => (
          <div key={feature.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-heading font-semibold text-lg mb-2 text-teal">{feature.title}</h3>
            <p className="font-body text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChairFeaturesComponent;
