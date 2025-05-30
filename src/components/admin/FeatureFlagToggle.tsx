import React, { useState } from 'react';
import { setFeatureFlag, getFeatureFlag } from '../../config/featureFlags';

/**
 * FeatureFlagToggle component
 * 
 * Admin component that allows toggling feature flags for testing and debugging.
 * This component should only be accessible to admin users.
 */
const FeatureFlagToggle: React.FC = () => {
  const [bannerTestEnabled, setBannerTestEnabled] = useState(
    getFeatureFlag('homepage.enableBannerTest')
  );
  const [customerAccountsEnabled, setCustomerAccountsEnabled] = useState(
    getFeatureFlag('customerAccounts.enabled')
  );
  const [fallbackEnabled, setFallbackEnabled] = useState(
    getFeatureFlag('customerAccounts.enableFallback')
  );
  const [errorReportingEnabled, setErrorReportingEnabled] = useState(
    getFeatureFlag('customerAccounts.enableErrorReporting')
  );

  // Handle toggle for banner test
  const handleBannerTestToggle = () => {
    const newValue = !bannerTestEnabled;
    setBannerTestEnabled(newValue);
    setFeatureFlag('homepage.enableBannerTest', newValue);
  };

  // Handle toggle for customer accounts
  const handleCustomerAccountsToggle = () => {
    const newValue = !customerAccountsEnabled;
    setCustomerAccountsEnabled(newValue);
    setFeatureFlag('customerAccounts.enabled', newValue);
  };

  // Handle toggle for fallback authentication
  const handleFallbackToggle = () => {
    const newValue = !fallbackEnabled;
    setFallbackEnabled(newValue);
    setFeatureFlag('customerAccounts.enableFallback', newValue);
  };

  // Handle toggle for error reporting
  const handleErrorReportingToggle = () => {
    const newValue = !errorReportingEnabled;
    setErrorReportingEnabled(newValue);
    setFeatureFlag('customerAccounts.enableErrorReporting', newValue);
  };

  return (
    <div className="feature-flag-toggle space-y-8">
      {/* Homepage Section */}
      <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">Configuración de Homepage</h3>
        
        <div className="space-y-6">
          {/* Banner Test Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700">Banner de Prueba</span>
              <p className="text-sm text-gray-500">Mostrar banner de prueba en lugar del hero slider</p>
            </div>
            <button
              onClick={handleBannerTestToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                bannerTestEnabled ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  bannerTestEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Authentication Section */}
      <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">Configuración de Autenticación</h3>
        
        <div className="space-y-6">
          {/* Customer Accounts Toggle */}
          <div className="flex items-center justify-between">
          <div>
            <span className="font-medium text-gray-700">Cuentas de Cliente</span>
            <p className="text-sm text-gray-500">Habilitar API de Cuentas de Cliente de Shopify</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={customerAccountsEnabled}
              onChange={handleCustomerAccountsToggle}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>
        
        {/* Fallback Authentication Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium text-gray-700">Autenticación Alternativa</span>
            <p className="text-sm text-gray-500">Usar formularios personalizados cuando falla la autenticación de Shopify</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={fallbackEnabled}
              onChange={handleFallbackToggle}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>
        
        {/* Error Reporting Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium text-gray-700">Reportes de Error</span>
            <p className="text-sm text-gray-500">Mostrar mensajes de error de autenticación al usuario</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={errorReportingEnabled}
              onChange={handleErrorReportingToggle}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>
        </div>
      </div>
      
      <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
        <p className="text-sm text-gray-500">
          Estos ajustes son para fines de prueba y depuración. Los cambios se guardan en localStorage
          y persistirán entre sesiones hasta que se borren los datos del navegador.
        </p>
      </div>
    </div>
  );
};

export default FeatureFlagToggle;
