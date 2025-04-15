import React, { useState, useEffect } from 'react';
import { User, LogOut, Settings, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import framer-motion
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

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      } 
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { 
        duration: 0.15,
        ease: "easeIn"
      } 
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.05 * custom,
        duration: 0.2
      }
    }),
    hover: { 
      backgroundColor: "rgba(254, 242, 242, 1)", // red-50
      x: 2
    }
  };

  if (loading) {
    return (
      <motion.button 
        className="p-2 flex items-center text-gray-500" 
        disabled
        aria-label="Loading account status"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: [0.7, 0.5, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <User className="h-5 w-5" />
      </motion.button>
    );
  }

  return (
    <div className="relative account-dropdown">
      <motion.button
        className="p-2 flex items-center text-gray-700 hover:text-[#B02020] transition-colors duration-200"
        onClick={loggedIn ? toggleDropdown : handleLogin}
        aria-label={loggedIn ? 'Account menu' : 'Login'}
        aria-expanded={dropdownOpen}
        aria-haspopup={loggedIn ? 'true' : 'false'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <User className="h-5 w-5" />
        {loggedIn && customer && (
          <span className="ml-2 hidden md:inline-block font-medium">
            {customer.firstName || 'Mi cuenta'}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {loggedIn && dropdownOpen && (
          <motion.div 
            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-10 overflow-hidden border border-gray-100"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900">
                {customer?.firstName} {customer?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate mt-1">
                {customer?.email}
              </p>
            </div>
            
            <div className="py-1">
              <motion.div
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
                custom={1}
                whileHover="hover"
              >
                <Link
                  to="/account"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:text-[#B02020] transition-colors duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-2 text-gray-400" />
                  Mi cuenta
                </Link>
              </motion.div>
              
              <motion.div
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
                custom={2}
                whileHover="hover"
              >
                <Link
                  to="/account/orders"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:text-[#B02020] transition-colors duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  <ShoppingBag className="h-4 w-4 mr-2 text-gray-400" />
                  Mis pedidos
                </Link>
              </motion.div>
            </div>
            
            <div className="border-t border-gray-100">
              <motion.div
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
                custom={3}
                whileHover="hover"
              >
                <button
                  className="w-full text-left flex items-center px-4 py-2.5 text-sm text-gray-700 hover:text-[#B02020] transition-colors duration-200"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2 text-gray-400" />
                  Cerrar sesión
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccountButton;
