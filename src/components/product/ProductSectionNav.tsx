import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ProductSectionNav.css';

interface Section {
  id: string;
  label: string;
}

interface ProductSectionNavProps {
  sections: Section[];
  offset?: number; // Offset for header height
}

const ProductSectionNav: React.FC<ProductSectionNavProps> = ({
  sections,
  offset = 80 // Default offset for header
}) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Track scroll position and determine active section
  useEffect(() => {
    const handleScroll = () => {
      // Show the navigation after scrolling past the hero section
      const scrollPosition = window.scrollY;
      const shouldShow = scrollPosition > 500;
      
      if (shouldShow !== isVisible) {
        setIsVisible(shouldShow);
      }
      
      // Find the current active section
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id),
      }));
      
      // Filter out sections that don't exist in the DOM
      const validSections = sectionElements.filter(section => section.element !== null);
      
      if (validSections.length === 0) return;
      
      // Calculate the position of each section relative to the viewport
      const sectionPositions = validSections.map(section => {
        const element = section.element!;
        const rect = element.getBoundingClientRect();
        return {
          id: section.id,
          top: rect.top - offset,
        };
      });
      
      // Find the first section that is currently visible or about to be visible
      const currentSection = sectionPositions.find(section => section.top <= 10);
      
      // If no section is visible yet, use the first one
      const newActiveSection = currentSection ? currentSection.id : validSections[0].id;
      
      if (newActiveSection !== activeSection) {
        setActiveSection(newActiveSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, activeSection, isVisible, offset]);

  // Scroll to section when clicking a nav item
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const yOffset = -offset; // Account for fixed header
    const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
    
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          ref={navRef}
          className="product-section-nav"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="section-nav-container">
            <ul className="section-nav-list">
              {sections.map(section => (
                <li key={section.id} className={activeSection === section.id ? 'active' : ''}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className="section-nav-button"
                    aria-current={activeSection === section.id ? 'true' : 'false'}
                  >
                    {section.label}
                    {activeSection === section.id && (
                      <motion.div 
                        className="active-indicator"
                        layoutId="activeIndicator"
                        transition={{ type: 'spring', damping: 20 }}
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductSectionNav;
