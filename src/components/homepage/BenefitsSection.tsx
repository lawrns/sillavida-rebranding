import React from 'react';
import { Truck, CreditCard, Shield, HeadphonesIcon } from 'lucide-react';

/**
 * BenefitsSection - Why Choose SillaVida section
 * Self-contained component with all icons and content
 */
const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: Truck,
      title: "Envío a Todo México",
      description: "Entrega rápida y segura a cualquier parte del país."
    },
    {
      icon: CreditCard,
      title: "Pagos Seguros",
      description: "Múltiples métodos de pago con seguridad garantizada."
    },
    {
      icon: Shield,
      title: "Garantía de Calidad",
      description: "12 meses de garantía en todos nuestros productos."
    },
    {
      icon: HeadphonesIcon,
      title: "Atención al Cliente",
      description: "Soporte personalizado para resolver todas tus dudas."
    }
  ];

  return (
    <section className="bg-gray-50 py-12 overflow-hidden border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-black mb-2">Por Qué Elegir SillaVida</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Nos comprometemos a ofrecerte la mejor experiencia en cada aspecto</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-start">
                <div className="bg-green-50 p-3 rounded-full mb-4 flex items-center justify-center">
                  <IconComponent className="h-6 w-6 text-[#425e99]" />
                </div>
                <h3 className="font-heading font-bold text-[#000000] text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;