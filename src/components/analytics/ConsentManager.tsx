/**
 * Consent Manager Component
 * 
 * This component manages user consent for analytics tracking and displays
 * a banner to collect consent when needed.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import analyticsConfig, { DEFAULT_CONSENT_SETTINGS, CONSENT_MODES } from '../../config/analytics';

// Local storage key for consent preferences
const CONSENT_STORAGE_KEY = 'sillavida-consent-preferences';

// Consent manager props
interface ConsentManagerProps {
  className?: string;
}

const ConsentManager: React.FC<ConsentManagerProps> = ({ className = '' }) => {
  // State to track if banner should be shown
  const [showBanner, setShowBanner] = useState(false);
  
  // Check if consent has been given on component mount
  useEffect(() => {
    const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
    
    if (!storedConsent && analyticsConfig.config.requireConsent) {
      // Show banner if consent hasn't been given yet
      setShowBanner(true);
      
      // Set default consent settings in Google Analytics
      if (window.gtag) {
        window.gtag('consent', 'default', DEFAULT_CONSENT_SETTINGS);
      }
    } else if (storedConsent) {
      // If consent preferences exist, apply them
      const consentSettings = JSON.parse(storedConsent);
      
      if (window.gtag) {
        window.gtag('consent', 'update', consentSettings);
      }
    }
  }, []);
  
  // Handle accepting all cookies
  const handleAcceptAll = () => {
    const fullConsent = {
      analytics_storage: CONSENT_MODES.GRANTED,
      ad_storage: CONSENT_MODES.GRANTED,
      functionality_storage: CONSENT_MODES.GRANTED,
      personalization_storage: CONSENT_MODES.GRANTED,
      security_storage: CONSENT_MODES.GRANTED,
    };
    
    // Update consent in Google Analytics
    if (window.gtag) {
      window.gtag('consent', 'update', fullConsent);
    }
    
    // Save preferences to local storage
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(fullConsent));
    
    // Hide the banner
    setShowBanner(false);
  };
  
  // Handle accepting only necessary cookies
  const handleAcceptNecessary = () => {
    // Update consent in Google Analytics
    if (window.gtag) {
      window.gtag('consent', 'update', DEFAULT_CONSENT_SETTINGS);
    }
    
    // Save preferences to local storage
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(DEFAULT_CONSENT_SETTINGS));
    
    // Hide the banner
    setShowBanner(false);
  };
  
  // Animation variants for the banner
  const bannerVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { y: 100, opacity: 0, transition: { duration: 0.2 } },
  };
  
  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          className={`fixed bottom-0 left-0 right-0 z-50 p-4 bg-white shadow-lg border-t border-gray-200 ${className}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={bannerVariants}
        >
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Preferencias de Cookies</h3>
                <p className="text-gray-600 text-sm">
                  Utilizamos cookies para mejorar su experiencia de navegación, mostrar contenido personalizado y analizar el tráfico del sitio. 
                  Puede elegir aceptar todas las cookies o solo las necesarias para el funcionamiento del sitio.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleAcceptNecessary}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Solo Necesarias
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Aceptar Todas
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsentManager;
