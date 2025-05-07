import React from 'react';
import TrustIndicator, { TrustIndicatorSize, TrustIndicatorType } from './TrustIndicator';

// Props interface for the TrustIndicatorGroup component
interface TrustIndicatorGroupProps {
  title?: string;
  types?: TrustIndicatorType[];
  size?: TrustIndicatorSize;
  layout?: 'horizontal' | 'vertical' | 'grid';
  showDescription?: boolean;
  className?: string;
}

/**
 * TrustIndicatorGroup Component
 * 
 * A component that displays a group of trust indicators. This can be used
 * to show multiple trust indicators in a consistent way across the website.
 */
const TrustIndicatorGroup: React.FC<TrustIndicatorGroupProps> = ({
  title,
  types = ['warranty', 'shipping', 'payment', 'commitment'],
  size = 'medium',
  layout = 'vertical',
  showDescription = true,
  className = '',
}) => {
  // Define layout-specific container styles
  const containerStyles = {
    horizontal: 'flex flex-wrap gap-4',
    vertical: 'space-y-5',
    grid: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
  };

  return (
    <div className={`${className}`}>
      {title && (
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
          {title}
        </h3>
      )}
      
      <div className={containerStyles[layout]}>
        {types.map((type) => (
          <TrustIndicator
            key={type}
            type={type}
            size={size}
            layout={layout === 'horizontal' ? 'horizontal' : 'vertical'}
            showDescription={showDescription}
            className={layout === 'vertical' ? 'p-4 border border-gray-100 rounded-lg bg-white shadow-sm' : ''}
          />
        ))}
      </div>
    </div>
  );
};

export default TrustIndicatorGroup;
