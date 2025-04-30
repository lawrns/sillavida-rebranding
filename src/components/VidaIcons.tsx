import React from 'react';

// Icon types for the life-aspect categories
export type VidaIconType = 
  | 'profesional' 
  | 'activa' 
  | 'saludable' 
  | 'productiva' 
  | 'social' 
  | 'complementos';

interface VidaIconProps {
  type: VidaIconType;
  className?: string;
  size?: number;
}

/**
 * VidaIcon component
 * 
 * Renders an SVG icon for a specific life-aspect category.
 * The icon color is controlled by the parent element's color.
 * 
 * @param {VidaIconType} type - The type of icon to render
 * @param {string} className - Additional CSS classes
 * @param {number} size - Icon size in pixels (default: 24)
 */
export const VidaIcon: React.FC<VidaIconProps> = ({ 
  type, 
  className = '', 
  size = 24 
}) => {
  // Common SVG props
  const svgProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className
  };

  // Render the appropriate icon based on type
  switch (type) {
    case 'profesional':
      return (
        <svg {...svgProps} aria-label="Vida Profesional">
          <path 
            d="M20 7H16V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7ZM10 5H14V7H10V5ZM20 19H4V9H20V19Z" 
            fill="currentColor"
          />
        </svg>
      );
    
    case 'activa':
      return (
        <svg {...svgProps} aria-label="Vida Activa">
          <path 
            d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" 
            fill="currentColor"
          />
        </svg>
      );
    
    case 'saludable':
      return (
        <svg {...svgProps} aria-label="Vida Saludable">
          <path 
            d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" 
            fill="currentColor"
          />
        </svg>
      );
    
    case 'productiva':
      return (
        <svg {...svgProps} aria-label="Vida Productiva">
          <path 
            d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" 
            fill="currentColor"
          />
        </svg>
      );
    
    case 'social':
      return (
        <svg {...svgProps} aria-label="Vida Social">
          <path 
            d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" 
            fill="currentColor"
          />
        </svg>
      );
    
    case 'complementos':
      return (
        <svg {...svgProps} aria-label="Complementos para tu Vida">
          <path 
            d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" 
            fill="currentColor"
          />
        </svg>
      );
    
    default:
      return null;
  }
};

/**
 * VidaIconSet component
 * 
 * A collection of all life-aspect icons.
 * Useful for documentation or icon selection interfaces.
 */
export const VidaIconSet: React.FC<{ size?: number }> = ({ size = 24 }) => {
  const iconTypes: VidaIconType[] = [
    'profesional', 
    'activa', 
    'saludable', 
    'productiva', 
    'social', 
    'complementos'
  ];
  
  return (
    <div className="flex flex-wrap gap-4">
      {iconTypes.map(type => (
        <div key={type} className="flex flex-col items-center">
          <VidaIcon type={type} size={size} />
          <span className="mt-2 text-sm">Vida {type.charAt(0).toUpperCase() + type.slice(1)}</span>
        </div>
      ))}
    </div>
  );
};

export default VidaIcon;
