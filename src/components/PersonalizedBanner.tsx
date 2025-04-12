import React, { useState, useEffect } from 'react';
import { isLoggedIn, getCurrentCustomer } from '../services/customerAuth';

/**
 * PersonalizedBanner component
 * 
 * This component displays a personalized welcome message for logged-in users
 * on the homepage. It fetches the customer's first name from the Customer Account API.
 */
const PersonalizedBanner: React.FC = () => {
  const [customerName, setCustomerName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

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
          }
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
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
    <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg shadow-sm mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-red-800">
              ¡Bienvenido de nuevo, {customerName}!
            </h2>
            <p className="mt-1 text-sm text-red-600">
              Descubre nuestras nuevas ofertas seleccionadas especialmente para ti.
            </p>
          </div>
          <a
            href="/account"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Mi cuenta
          </a>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedBanner;
