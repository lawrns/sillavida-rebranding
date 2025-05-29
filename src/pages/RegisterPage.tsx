import React, { useState, useEffect } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isLoggedIn, register, authErrorHandler, AuthErrorType } from '../services/customerAuth';
import { Eye, EyeOff } from 'lucide-react';
import AuthErrorBanner from '../components/auth/AuthErrorBanner';
import FallbackRegisterForm from '../components/auth/FallbackRegisterForm';
import { getFeatureFlag } from '../config/featureFlags';

/**
 * RegisterPage component
 * 
 * This component provides a form for users to create a new account
 * with Shopify's Customer Account API. It also includes a fallback
 * registration mechanism when the Shopify API fails.
 */
const RegisterPage: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
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
      
      // Switch to fallback if registration fails and fallback is enabled
      if (type === AuthErrorType.REGISTRATION && getFeatureFlag('customerAccounts.enableFallback')) {
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
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setGeneralError(null);
    
    try {
      // Use the register function which handles both Shopify API and fallback
      const success = await register();
      
      if (!success && getFeatureFlag('customerAccounts.enableFallback')) {
        setUseFallback(true);
      }
    } catch (error) {
      setGeneralError('Ocurrió un error al crear la cuenta. Por favor, intenta de nuevo.');
      
      // Switch to fallback if registration fails and fallback is enabled
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Crear Cuenta</h1>
      
      {authError && (
        <AuthErrorBanner 
          type={authError.type} 
          message={authError.message} 
          onDismiss={() => setAuthError(null)}
        />
      )}
      
      {generalError && !authError && (
        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
          {generalError}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {useFallback ? (
          // Show fallback registration form when Shopify authentication fails
          <FallbackRegisterForm />
        ) : (
          // Show standard registration form that redirects to Shopify
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-teal`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-teal`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-teal`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
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
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-teal`}
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
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">La contraseña debe tener al menos 8 caracteres</p>
              </div>
              
              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-teal`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full mt-6 px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-light focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-teal hover:text-teal-light">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
