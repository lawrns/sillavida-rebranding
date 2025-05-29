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
    <section className="bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Ultra-Minimalist Strip - Icon | Title | Subtitle (no boxes) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="flex items-baseline space-x-3">
                <IconComponent className="h-5 w-5 text-black translate-y-0.5" />
                <h4 className="font-semibold text-black text-sm leading-5">{benefit.title}</h4>
                <p className="text-gray-600 text-xs leading-5">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Social Proof - Ultra Compact */}
        <div className="text-center mt-3">
          <p className="text-gray-500 text-xs">
            De norte a sur, clientes en todo México eligen SillaVida por su calidad y diseño
          </p>
        </div>
        
      </div>
    </section>
  );
};

export default BenefitsSection;