import React, { useState, useEffect } from 'react';
import { isLoggedIn, getCurrentCustomer, authErrorHandler, AuthErrorType } from '../services/customerAuth';
import { getFeatureFlag } from '../config/featureFlags';

/**
 * PersonalizedBanner component
 * 
 * This component displays a personalized welcome message for logged-in users
 * on the homepage. It fetches the customer's first name from the Customer Account API.
 * It includes fallback handling when the API fails.
 */
const PersonalizedBanner: React.FC = () => {
  const [customerName, setCustomerName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isInFallbackMode, setIsInFallbackMode] = useState<boolean>(false);

  // Subscribe to auth errors
  useEffect(() => {
    const unsubscribe = authErrorHandler.addListener((type) => {
      // If we get an account access error, we might be in fallback mode
      if (type === AuthErrorType.ACCOUNT_ACCESS && getFeatureFlag('customerAccounts.enableFallback')) {
        setIsInFallbackMode(true);
        setCustomerName('Usuario');
      }
    });
    
    return unsubscribe;
  }, []);

  // Fetch customer data on mount
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const loggedIn = await isLoggedIn();
        
        if (loggedIn) {
          const customerData = await getCurrentCustomer();
          if (customerData?.firstName) {
            setCustomerName(customerData.firstName);
          } else if (getFeatureFlag('customerAccounts.enableFallback')) {
            // If we're logged in but can't get customer data, we might be in fallback mode
            setIsInFallbackMode(true);
            setCustomerName('Usuario');
          }
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
        
        // If error occurs and fallback is enabled, show generic name
        if (getFeatureFlag('customerAccounts.enableFallback')) {
          setIsInFallbackMode(true);
          setCustomerName('Usuario');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  // Don't render anything if loading or no customer name
  if (loading || !customerName) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-r ${isInFallbackMode ? 'from-amber-50 to-amber-100' : 'from-red-50 to-red-100'} p-4 rounded-lg shadow-sm mb-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-medium ${isInFallbackMode ? 'text-amber-800' : 'text-red-800'}`}>
              ¡Bienvenido de nuevo, {customerName}!
            </h2>
            <p className={`mt-1 text-sm ${isInFallbackMode ? 'text-amber-600' : 'text-red-600'}`}>
              {isInFallbackMode 
                ? 'Estamos operando en modo limitado. Algunas funciones pueden no estar disponibles.' 
                : 'Descubre nuestras nuevas ofertas seleccionadas especialmente para ti.'}
            </p>
          </div>
          <a
            href="/account"
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              isInFallbackMode 
                ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500' 
                : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            Mi cuenta
          </a>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedBanner;
