import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, CreditCard, Heart, Leaf } from 'lucide-react';

// Define the types of trust indicators
export type TrustIndicatorType = 'warranty' | 'shipping' | 'payment' | 'commitment';

// Define the sizes for the trust indicators
export type TrustIndicatorSize = 'small' | 'medium' | 'large';

// Props interface for the TrustIndicator component
interface TrustIndicatorProps {
  type: TrustIndicatorType;
  size?: TrustIndicatorSize;
  layout?: 'horizontal' | 'vertical';
  showDescription?: boolean;
  className?: string;
}

/**
 * TrustIndicator Component
 * 
 * A reusable component for displaying wellness-focused trust indicators
 * across the SillaVida website. This component supports different types,
 * sizes, and layouts to accommodate various use cases.
 */
const TrustIndicator: React.FC<TrustIndicatorProps> = ({
  type,
  size = 'medium',
  layout = 'horizontal',
  showDescription = true,
  className = '',
}) => {
  // Define the content for each trust indicator type
  const trustContent = {
    warranty: {
      icon: Shield,
      title: 'Garantía de Bienestar',
      description: 'Respaldamos tu inversión en bienestar por 12 meses',
      ariaLabel: 'Garantía de Bienestar - Respaldamos tu inversión en bienestar por 12 meses',
    },
    shipping: {
      icon: Truck,
      title: 'Envío Consciente',
      description: 'Tu camino hacia el bienestar comienza ahora',
      ariaLabel: 'Envío Consciente - Tu camino hacia el bienestar comienza ahora',
    },
    payment: {
      icon: CreditCard,
      title: 'Pago Sereno',
      description: 'Invierte en ti mismo con total tranquilidad',
      ariaLabel: 'Pago Sereno - Invierte en ti mismo con total tranquilidad',
    },
    commitment: {
      icon: Heart,
      title: 'Compromiso Vida',
      description: 'Más que una compra, una inversión en tu calidad de vida',
      ariaLabel: 'Compromiso Vida - Más que una compra, una inversión en tu calidad de vida',
    },
  };

  // Get the content for the selected trust indicator type
  const content = trustContent[type];
  const Icon = content.icon;

  // Define size-specific styles
  const sizeStyles = {
    small: {
      container: 'p-2',
      icon: 'h-4 w-4',
      leafIcon: 'w-2 h-2',
      title: 'text-xs font-medium',
      description: 'text-xs',
    },
    medium: {
      container: 'p-3',
      icon: 'h-6 w-6',
      leafIcon: 'w-3 h-3',
      title: 'text-sm font-medium',
      description: 'text-xs',
    },
    large: {
      container: 'p-4',
      icon: 'h-8 w-8',
      leafIcon: 'w-4 h-4',
      title: 'text-base font-medium',
      description: 'text-sm',
    },
  };

  // Get the styles for the selected size
  const styles = sizeStyles[size];

  // Define layout-specific styles
  const layoutStyles = {
    horizontal: 'flex items-center gap-3',
    vertical: 'flex flex-col items-center text-center gap-2',
  };

  // Render the trust indicator based on layout
  if (layout === 'horizontal') {
    return (
      <motion.div
        className={`${styles.container} ${layoutStyles.horizontal} ${className}`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        aria-label={content.ariaLabel}
      >
        <div className="relative">
          <Icon className={`${styles.icon} text-black`} />
          <div className="absolute top-0 right-0">
            <Leaf className={`${styles.leafIcon} text-accent`} />
          </div>
        </div>
        <div>
          <h4 className={`${styles.title} font-heading text-black`}>{content.title}</h4>
          {showDescription && (
            <p className={`${styles.description} text-gray-600 font-body`}>{content.description}</p>
          )}
        </div>
      </motion.div>
    );
  }

  // Vertical layout
  return (
    <motion.div
      className={`${styles.container} ${layoutStyles.vertical} ${className}`}
      whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
      aria-label={content.ariaLabel}
    >
      <div className="relative">
        <Icon className={`${styles.icon} text-black`} />
        <div className="absolute top-0 right-0">
          <Leaf className={`${styles.leafIcon} text-accent`} />
        </div>
      </div>
      <h4 className={`${styles.title} font-heading text-black`}>{content.title}</h4>
      {showDescription && (
        <p className={`${styles.description} text-gray-600 font-body`}>{content.description}</p>
      )}
    </motion.div>
  );
};

export default TrustIndicator;
