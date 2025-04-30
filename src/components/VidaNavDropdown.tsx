import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { VidaNavDropdownItem } from './VidaNavItem';

// Props for the VidaNavDropdown component
interface VidaNavDropdownProps {
  label: string;
  isOpen: boolean;
  toggleDropdown: () => void;
  items: Array<{
    label: string;
    to: string;
  }>;
  headerText?: string;
}

/**
 * VidaNavDropdown component
 * 
 * A dropdown menu for the life-aspect based navigation.
 * Used for the "More" dropdown in the navigation.
 * 
 * @param {string} label - The display text for the dropdown trigger
 * @param {boolean} isOpen - Whether the dropdown is open
 * @param {function} toggleDropdown - Function to toggle the dropdown
 * @param {Array} items - Array of dropdown items
 * @param {string} headerText - Optional header text for the dropdown
 */
const VidaNavDropdown: React.FC<VidaNavDropdownProps> = ({
  label,
  isOpen,
  toggleDropdown,
  items,
  headerText = 'Más Categorías'
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) toggleDropdown();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleDropdown]);

  // Animation variants for the dropdown
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: 'auto', 
      transition: { 
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      } 
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      height: 0, 
      transition: { 
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      } 
    }
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button 
        whileHover={{ y: -2 }} 
        className="flex items-center nav-item-vida"
        onClick={toggleDropdown} 
        aria-expanded={isOpen} 
        aria-haspopup="true" 
        id="vida-dropdown-button"
      >
        {label}
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }} 
          transition={{ duration: 0.2 }}
          className="ml-1 flex items-center justify-center"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="vida-dropdown"
            role="menu" 
            aria-orientation="vertical" 
            aria-labelledby="vida-dropdown-button"
          >
            {headerText && (
              <div className="vida-dropdown-header">
                <h3>{headerText}</h3>
              </div>
            )}
            
            <div className="vida-dropdown-content">
              {items.map((item, index) => (
                <VidaNavDropdownItem
                  key={index}
                  label={item.label}
                  to={item.to}
                  onClick={toggleDropdown}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VidaNavDropdown;
