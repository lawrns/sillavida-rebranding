import React from 'react';
import { Truck, CreditCard, Shield, HeadphonesIcon } from 'lucide-react';

/**
 * BenefitsSection - Ultra-compact horizontal strip layout
 * Optimized for modern attention spans - quick scan, maximum impact
 */
const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: Truck,
      title: "Envío Gratis",
      description: "A todo México"
    },
    {
      icon: CreditCard,
      title: "Pagos Seguros",
      description: "12 MSI disponibles"
    },
    {
      icon: Shield,
      title: "Garantía",
      description: "5 años extendida"
    },
    {
      icon: HeadphonesIcon,
      title: "Soporte",
      description: "Atención 24/7"
    }
  ];

  return (
    <section className="bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Horizontal Strip Layout - Ultra Compact */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="bg-black/5 p-2 rounded-full mb-3 mx-auto w-fit">
                  <IconComponent className="h-5 w-5 text-black" />
                </div>
                <h4 className="font-bold text-black text-sm mb-1">{benefit.title}</h4>
                <p className="text-gray-600 text-xs">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Optional Subtitle - Very Compact */}
        <div className="text-center mt-4">
          <p className="text-gray-600 text-sm">
            Más de 50,000 clientes confían en SillaVida
          </p>
        </div>
        
      </div>
    </section>
  );
};

export default BenefitsSection;