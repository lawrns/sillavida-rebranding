import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * FallbackLoginForm component
 * 
 * Provides a fallback login form when the Shopify Customer Account API
 * is unavailable or fails to initialize.
 */
const FallbackLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract return_to parameter from URL if present
  const getReturnUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('return_to') || '/account';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Call the fallback authentication API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
      
      // Redirect based on return_to parameter or to account page
      navigate(getReturnUrl());
    } catch (error: any) {
      setError(error.message || 'Ocurrió un error durante el inicio de sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fallback-login-form max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Iniciar Sesión</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 px-4 rounded-md font-medium hover:bg-teal-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <a href="/account/register" className="text-teal-600 hover:underline">
          Crear cuenta
        </a>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>
          Este es un método de inicio de sesión alternativo. Si continúas teniendo problemas,
          por favor contacta a soporte.
        </p>
      </div>
    </div>
  );
};

export default FallbackLoginForm;
