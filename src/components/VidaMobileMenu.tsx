import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { VidaNavItemMobile } from './VidaNavItem';
import { VidaIconType } from './VidaIcons';

// Import the interfaces from vidaNavigation.ts
import { VidaCategory, SecondaryNavItem } from '../utils/vidaNavigation';

// Props for the VidaMobileMenu component
interface VidaMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  vidaCategories: VidaCategory[];
  secondaryItems: SecondaryNavItem[];
  activePath: string;
}

/**
 * VidaMobileMenu component
 * 
 * A mobile menu for the life-aspect based navigation.
 * Displays all life-aspect categories and secondary navigation items.
 * 
 * @param {boolean} isOpen - Whether the menu is open
 * @param {function} onClose - Function to close the menu
 * @param {Array} vidaCategories - Array of life-aspect categories
 * @param {Array} secondaryItems - Array of secondary navigation items
 * @param {string} activePath - The current active path
 */
const VidaMobileMenu: React.FC<VidaMobileMenuProps> = ({
  isOpen,
  onClose,
  vidaCategories,
  secondaryItems,
  activePath
}) => {
  // Animation variants for the mobile menu
  const menuVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.05
      } 
    },
    exit: { 
      x: "-100%", 
      opacity: 0, 
      transition: { 
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1]
      } 
    }
  };

  // Animation variants for the menu items
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      } 
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="vida-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          <div className="vida-mobile-menu-header">
            <h2 className="text-lg font-semibold">Menú</h2>
            <button 
              className="vida-mobile-menu-close"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="vida-mobile-menu-content">
            {/* Life-aspect categories */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-2 px-2">Categorías de Vida</h3>
              <div className="space-y-1">
                {vidaCategories.map((category, index) => (
                  <motion.div
                    key={category.type}
                    variants={itemVariants}
                    custom={index}
                  >
                    <VidaNavItemMobile
                      type={category.type}
                      label={category.label}
                      to={category.path}
                      isActive={activePath === category.path}
                      onClick={onClose}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Secondary navigation items */}
            {secondaryItems.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-2 px-2">Más</h3>
                <div className="space-y-1">
                  {secondaryItems.map((item, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      custom={index + vidaCategories.length}
                    >
                      <VidaNavItemMobile
                        type="complementos" // Using complementos as a default icon
                        label={item.label}
                        to={item.path}
                        isActive={activePath === item.path}
                        onClick={onClose}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VidaMobileMenu;
