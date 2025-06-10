import React from 'react';
import { Shield, Truck, RotateCcw, Award, Clock, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

interface GuaranteeItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: string;
}

const guaranteeItems: GuaranteeItemProps[] = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Garantía de Satisfacción",
    description: "Si no estás completamente satisfecho con tu silla en los primeros 30 días, te devolvemos tu dinero.",
    highlight: "30 días"
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Envío Gratis Garantizado",
    description: "Entrega gratuita a toda la República Mexicana sin compra mínima. Instalación incluida.",
    highlight: "Sin costo adicional"
  },
  {
    icon: <RotateCcw className="w-8 h-8" />,
    title: "Intercambio Sin Complicaciones",
    description: "¿No es la talla perfecta? Intercambiamos tu silla por otra sin costo adicional.",
    highlight: "Sin costo"
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Garantía de Calidad Extendida",
    description: "Respaldamos la calidad de nuestras sillas con garantía extendida contra defectos de fabricación.",
    highlight: "2 años"
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Soporte de Por Vida",
    description: "Nuestro equipo de especialistas en ergonomía te acompaña durante toda la vida útil de tu silla.",
    highlight: "De por vida"
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: "Pagos Flexibles",
    description: "Hasta 12 meses sin intereses con tarjetas participantes. Invierte en tu salud sin comprometer tu presupuesto.",
    highlight: "12 MSI"
  }
];

/**
 * GuaranteeSection - Addresses customer objections and builds purchase confidence
 * Features risk reversals, guarantees, and trust-building elements
 */
const GuaranteeSection: React.FC = () => {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
            Tu Inversión Está Protegida
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Compramos contigo en mente. Por eso ofrecemos las mejores garantías de la industria 
            para que tengas total tranquilidad en tu compra.
          </p>
        </div>

        {/* Main Guarantee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {guaranteeItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              {/* Icon Container */}
              <div className="inline-flex items-center justify-center w-16 h-16 text-white rounded-full mb-6 transition-colors duration-200" style={{ backgroundColor: '#5CB85C' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#4A994A'} onMouseLeave={(e) => e.target.style.backgroundColor = '#5CB85C'}>
                {item.icon}
              </div>
              
              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-black">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
                {item.highlight && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: '#D9534F' }}>
                    {item.highlight}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        
      </div>
    </section>
  );
};

export default GuaranteeSection;