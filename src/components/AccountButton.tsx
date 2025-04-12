import React, { useState, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isLoggedIn, login, logout, getCurrentCustomer } from '../services/customerAuth';

/**
 * AccountButton component
 * 
 * This component displays a login/logout button and user information
 * when the user is logged in. It also provides a dropdown menu with
 * links to account-related pages.
 */
const AccountButton: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [customer, setCustomer] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  // Check login status and fetch customer data on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        setLoading(true);
        const status = await isLoggedIn();
        setLoggedIn(status);
        
        if (status) {
          const customerData = await getCurrentCustomer();
          setCustomer(customerData);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.account-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setLoggedIn(false);
      setCustomer(null);
      setDropdownOpen(false);
      // Reload the page to clear any customer-specific state
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Navigate to login page
  const handleLogin = () => {
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <button 
        className="p-2 flex items-center text-gray-600" 
        disabled
        aria-label="Loading account status"
      >
        <User className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="relative account-dropdown">
      <button
        className="p-2 flex items-center text-gray-600 hover:text-red-600"
        onClick={loggedIn ? toggleDropdown : handleLogin}
        aria-label={loggedIn ? 'Account menu' : 'Login'}
        aria-expanded={dropdownOpen}
        aria-haspopup={loggedIn ? 'true' : 'false'}
      >
        <User className="h-5 w-5" />
        {loggedIn && customer && (
          <span className="ml-2 hidden md:inline-block">
            {customer.firstName || 'Mi cuenta'}
          </span>
        )}
      </button>

      {loggedIn && dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {customer?.firstName} {customer?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {customer?.email}
            </p>
          </div>
          
          <Link
            to="/account"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
            onClick={() => setDropdownOpen(false)}
          >
            Mi cuenta
          </Link>
          
          <Link
            to="/account/orders"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
            onClick={() => setDropdownOpen(false)}
          >
            Mis pedidos
          </Link>
          
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 flex items-center"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountButton;
