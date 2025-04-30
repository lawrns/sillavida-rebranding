import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import VidaIcon, { VidaIconType } from './VidaIcons';

// Props for the VidaNavItem component
interface VidaNavItemProps {
  type: VidaIconType;
  label: string;
  to: string;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * VidaNavItem component
 * 
 * A navigation item for the life-aspect based navigation.
 * Includes an icon, label, and styling based on the life-aspect type.
 * 
 * @param {VidaIconType} type - The life-aspect type
 * @param {string} label - The display text
 * @param {string} to - The link destination
 * @param {boolean} isActive - Whether this item is active
 * @param {string} className - Additional CSS classes
 * @param {function} onClick - Click handler
 */
const VidaNavItem: React.FC<VidaNavItemProps> = ({
  type,
  label,
  to,
  isActive = false,
  className = '',
  onClick
}) => {
  // Combine the base classes with any additional classes
  const baseClasses = `nav-item-vida nav-item-vida-${type}`;
  const combinedClasses = `${baseClasses} ${isActive ? 'active' : ''} ${className}`;
  
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Link 
        to={to} 
        className={combinedClasses}
        onClick={onClick}
        aria-current={isActive ? 'page' : undefined}
      >
        <VidaIcon type={type} className="nav-icon" />
        <span>{label}</span>
      </Link>
    </motion.div>
  );
};

// Props for the VidaNavItemMobile component
interface VidaNavItemMobileProps extends VidaNavItemProps {
  // Additional props specific to mobile
}

/**
 * VidaNavItemMobile component
 * 
 * A mobile-specific version of the VidaNavItem.
 * Optimized for touch interactions and mobile displays.
 */
export const VidaNavItemMobile: React.FC<VidaNavItemMobileProps> = ({
  type,
  label,
  to,
  isActive = false,
  className = '',
  onClick
}) => {
  // Combine the base classes with any additional classes
  const baseClasses = `vida-mobile-menu-item nav-item-vida-${type}`;
  const combinedClasses = `${baseClasses} ${isActive ? 'active' : ''} ${className}`;
  
  return (
    <Link 
      to={to} 
      className={combinedClasses}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
    >
      <VidaIcon type={type} className="nav-icon" size={28} />
      <span>{label}</span>
    </Link>
  );
};

// Props for the VidaNavDropdownItem component
interface VidaNavDropdownItemProps {
  label: string;
  to: string;
  onClick?: () => void;
}

/**
 * VidaNavDropdownItem component
 * 
 * A dropdown item for the life-aspect based navigation.
 * Used in dropdown menus for secondary navigation.
 */
export const VidaNavDropdownItem: React.FC<VidaNavDropdownItemProps> = ({
  label,
  to,
  onClick
}) => {
  return (
    <Link 
      to={to} 
      className="vida-dropdown-item"
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default VidaNavItem;
