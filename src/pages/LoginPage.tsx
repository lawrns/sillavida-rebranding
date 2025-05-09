import React, { useState, useEffect } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isLoggedIn, login, authErrorHandler, AuthErrorType } from '../services/customerAuth';
import { Eye, EyeOff } from 'lucide-react';
import AuthErrorBanner from '../components/auth/AuthErrorBanner';
import FallbackLoginForm from '../components/auth/FallbackLoginForm';
import { getFeatureFlag } from '../config/featureFlags';

/**
 * LoginPage component
 * 
 * This component provides a login form for users to authenticate
 * with Shopify's Customer Account API. It also includes a fallback
 * authentication mechanism when the Shopify API fails.
 */
const LoginPage: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<{type: AuthErrorType, message: string} | null>(null);
  const [useFallback, setUseFallback] = useState<boolean>(false);
  const location = useLocation();

  // Check if fallback mode is requested in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const fallback = searchParams.get('fallback') === 'true';
    setUseFallback(fallback);
  }, [location]);

  // Subscribe to auth errors
  useEffect(() => {
    const unsubscribe = authErrorHandler.addListener((type, message) => {
      setAuthError({ type, message });
      
      // Switch to fallback if login fails and fallback is enabled
      if (type === AuthErrorType.LOGIN && getFeatureFlag('customerAccounts.enableFallback')) {
        setUseFallback(true);
      }
    });
    
    return unsubscribe;
  }, []);

  // Check login status on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        setLoading(true);
        const status = await isLoggedIn();
        setLoggedIn(status);
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  // Handle password input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim()) {
      setError('Por favor, ingresa tu email');
      return;
    }
    
    if (!password) {
      setError('Por favor, ingresa tu contraseña');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // The login function redirects to Shopify's login page
      // which handles the actual authentication
      const success = await login();
      
      if (!success && getFeatureFlag('customerAccounts.enableFallback')) {
        setUseFallback(true);
      }
    } catch (error) {
      console.error('Error initiating login:', error);
      setError('Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo.');
      
      // Switch to fallback if login fails and fallback is enabled
      if (getFeatureFlag('customerAccounts.enableFallback')) {
        setUseFallback(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // If login status is still loading, show loading state
  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
        </div>
      </div>
    );
  }

  // If already logged in, redirect to account page
  if (loggedIn) {
    return <Navigate to="/account" />;
  }

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <motion.div 
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="max-w-md mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Iniciar Sesión</h1>
      
      {authError && (
        <AuthErrorBanner 
          type={authError.type} 
          message={authError.message} 
          onDismiss={() => setAuthError(null)}
        />
      )}
      
      {error && !authError && (
        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {useFallback ? (
          // Show fallback login form when Shopify authentication fails
          <FallbackLoginForm />
        ) : (
          // Show standard login form that redirects to Shopify
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal"
                />
              </div>
              
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Forgot Password */}
              <div className="text-right">
                <a href="#" className="text-sm text-teal hover:text-teal-light">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full mt-6 px-4 py-2 bg-[#4672a1] text-white rounded-md hover:bg-[#5a81d3] focus:outline-none focus:ring-2 focus:ring-[#4672a1] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
              data-component-name="LoginPage"
            >
              {submitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-teal hover:text-teal-light">
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
