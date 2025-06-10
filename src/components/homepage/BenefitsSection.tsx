import React from 'react';
import { Truck, WalletCards, ShieldCheck } from 'lucide-react';
import WhatsAppIcon from '../icons/WhatsAppIcon';

/**
 * BenefitsSection - Ultra-compact horizontal strip layout
 * Optimized for modern attention spans - quick scan, maximum impact
 */
const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: Truck,
      title: "Envío Asegurado",
      description: ""
    },
    {
      icon: WalletCards,
      title: "Pagos en 12 MSI",
      description: ""
    },
    {
      icon: ShieldCheck,
      title: "Garantía 5 años",
      description: ""
    },
    {
      icon: WhatsAppIcon,
      title: "Soporte vía WhatsApp",
      description: ""
    }
  ];

  return (
    <section className="py-4" style={{ backgroundColor: '#1A2A3A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Enhanced Icon Strip - Professional Visual Hierarchy with SillaVida Brand Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="flex items-center space-x-3 group transition-all duration-200 hover:opacity-80">
                <div 
                  className="flex-shrink-0 w-8 h-8 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  style={{ 
                    backgroundColor: 'rgba(92, 184, 92, 0.1)' 
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(92, 184, 92, 0.2)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(92, 184, 92, 0.1)'}
                >
                  <IconComponent 
                    className="h-5 w-5 stroke-2" 
                    style={{ color: '#5CB85C' }}
                  />
                </div>
                <h4 className="font-semibold text-white text-sm leading-tight font-heading">{benefit.title}</h4>
                {benefit.description && (
                  <p className="text-gray-300 text-xs leading-5">{benefit.description}</p>
                )}
              </div>
            );
          })}
        </div>

        
      </div>
    </section>
  );
};

export default BenefitsSection;