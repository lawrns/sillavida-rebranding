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
    <div 
      className="p-4 rounded-lg shadow-sm mb-8"
      style={{ 
        background: isInFallbackMode 
          ? 'linear-gradient(to right, #F5F5F5, #E5E5E5)' 
          : 'linear-gradient(to right, #F5F5F5, #E8EAED)' 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 
              className="text-xl font-medium font-heading"
              style={{ color: '#1A2A3A' }}
            >
              ¡Bienvenido de nuevo, {customerName}!
            </h2>
            <p 
              className="mt-1 text-sm"
              style={{ color: '#333333' }}
            >
              {isInFallbackMode 
                ? 'Estamos operando en modo limitado. Algunas funciones pueden no estar disponibles.' 
                : 'Descubre nuestras nuevas ofertas seleccionadas especialmente para ti.'}
            </p>
          </div>
          <a
            href="/account"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
            style={{ 
              backgroundColor: isInFallbackMode ? '#1A2A3A' : '#5CB85C',
              focusRingColor: isInFallbackMode ? '#1A2A3A' : '#5CB85C'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = isInFallbackMode ? '#0F1A26' : '#4A994A';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = isInFallbackMode ? '#1A2A3A' : '#5CB85C';
            }}
          >
            Mi cuenta
          </a>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedBanner;
