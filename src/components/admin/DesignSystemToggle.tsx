import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  isDesignSystemActive, 
  revertDesignSystem 
} from '../../styles/tokens/implementation';
import { toggleDesignSystemGlobally } from '../../styles/tokens/initializeDesignSystem';

interface DesignSystemToggleProps {
  className?: string;
}

const DesignSystemToggle: React.FC<DesignSystemToggleProps> = ({ className = '' }) => {
  const [isActive, setIsActive] = useState(false);
  const [preserveOriginal, setPreserveOriginal] = useState(true);

  // Initialize state on component mount
  useEffect(() => {
    setIsActive(isDesignSystemActive());
  }, []);

  // Handle toggle click
  const handleToggle = () => {
    const newState = !isActive;
    toggleDesignSystemGlobally(newState);
    setIsActive(newState);
    
    // Save preference to localStorage
    localStorage.setItem('sillavida-use-design-system', newState.toString());
  };

  // Handle revert click
  const handleRevert = () => {
    revertDesignSystem();
    setIsActive(false);
    
    // Save preference to localStorage
    localStorage.setItem('sillavida-use-design-system', 'false');
  };

  return (
    <div className={`design-system-toggle p-4 bg-white rounded-lg shadow ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Design System Controls</h3>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Design System Status:</span>
          <span className={`px-2 py-1 rounded text-sm ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <motion.button
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isActive 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleToggle}
        >
          {isActive ? 'Disable Design System' : 'Enable Design System'}
        </motion.button>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={preserveOriginal}
            onChange={(e) => setPreserveOriginal(e.target.checked)}
            className="form-checkbox h-5 w-5 text-primary rounded"
          />
          <span className="ml-2 text-sm">Preserve original styles (recommended)</span>
        </label>
        <p className="text-xs text-gray-500 mt-1">
          When enabled, both design systems will be active. Disable to see only the new design system.
        </p>
      </div>
      
      <div className="border-t pt-4">
        <motion.button
          className="w-full py-2 px-4 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRevert}
        >
          Revert All Changes
        </motion.button>
        <p className="text-xs text-gray-500 mt-1">
          This will completely revert to the original styles and disable the new design system.
        </p>
      </div>
    </div>
  );
};

export default DesignSystemToggle;
