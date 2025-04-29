import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  isLoggedIn, 
  getCurrentCustomer, 
  getCustomerOrders, 
  updateCustomer, 
  authErrorHandler, 
  AuthErrorType 
} from '../services/customerAuth';
import { User, Package, Clock, Mail, Phone } from 'lucide-react';
import AuthErrorBanner from '../components/auth/AuthErrorBanner';
import { getFeatureFlag } from '../config/featureFlags';

/**
 * AccountPage component
 * 
 * This component displays the user's account information, including
 * personal details and order history. It also allows the user to
 * update their information. It includes error handling for when the
 * Shopify Customer Account API fails.
 */
const AccountPage: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<{type: AuthErrorType, message: string} | null>(null);
  const [needsReauthentication, setNeedsReauthentication] = useState<boolean>(false);

  // Subscribe to auth errors
  useEffect(() => {
    const unsubscribe = authErrorHandler.addListener((type, message) => {
      setAuthError({ type, message });
      
      // If account access error, may need reauthentication
      if (type === AuthErrorType.ACCOUNT_ACCESS) {
        setNeedsReauthentication(true);
      }
    });
    
    return unsubscribe;
  }, []);

  // Check login status and fetch customer data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const status = await isLoggedIn();
        setLoggedIn(status);
        
        if (status) {
          const customerData = await getCurrentCustomer();
          
          if (customerData) {
            setCustomer(customerData);
            setFormData({
              firstName: customerData?.firstName || '',
              lastName: customerData?.lastName || '',
              phone: customerData?.phone || ''
            });
            
            const ordersData = await getCustomerOrders(10);
            setOrders(ordersData || []);
          } else if (getFeatureFlag('customerAccounts.enableFallback')) {
            // If customer data couldn't be fetched but we're still logged in
            // This could be a fallback auth scenario
            setCustomer({
              firstName: 'Usuario',
              lastName: 'Temporal',
              email: 'No disponible en modo fallback',
              phone: ''
            });
            setFormData({
              firstName: 'Usuario',
              lastName: 'Temporal',
              phone: ''
            });
            setOrders([]);
            
            // Show a specific error for fallback mode
            setAuthError({
              type: AuthErrorType.ACCOUNT_ACCESS,
              message: 'Acceso limitado en modo de respaldo. Algunas funciones pueden no estar disponibles.'
            });
          }
        }
      } catch (error) {
        console.error('Error fetching account data:', error);
        
        // If error occurs and fallback is enabled, show appropriate message
        if (getFeatureFlag('customerAccounts.enableFallback')) {
          setAuthError({
            type: AuthErrorType.ACCOUNT_ACCESS,
            message: 'No se pudieron cargar los datos de la cuenta. Funcionando en modo limitado.'
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateSuccess(false);
    setUpdateError(null);
    
    try {
      const updatedCustomer = await updateCustomer(formData);
      
      if (updatedCustomer) {
        setCustomer(updatedCustomer);
        setEditMode(false);
        setUpdateSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      } else {
        setUpdateError('No se pudo actualizar la información. Intenta de nuevo.');
        
        // If fallback is enabled, show appropriate message
        if (getFeatureFlag('customerAccounts.enableFallback')) {
          setAuthError({
            type: AuthErrorType.UPDATE_ACCOUNT,
            message: 'La actualización de datos no está disponible en modo de respaldo.'
          });
        }
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      setUpdateError('Ocurrió un error al actualizar la información.');
      
      // If fallback is enabled, show appropriate message
      if (getFeatureFlag('customerAccounts.enableFallback')) {
        setAuthError({
          type: AuthErrorType.UPDATE_ACCOUNT,
          message: 'La actualización de datos no está disponible en modo de respaldo.'
        });
      }
    }
  };

  // If login status is still loading, show loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to home page
  if (loggedIn === false) {
    return <Navigate to="/" />;
  }

  // If needs reauthentication, redirect to login page
  if (needsReauthentication) {
    return <Navigate to="/login?reauth=true" />;
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
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Mi Cuenta</h1>
      
      {/* Auth Error Banner */}
      {authError && (
        <AuthErrorBanner 
          type={authError.type} 
          message={authError.message} 
          onDismiss={() => setAuthError(null)}
        />
      )}
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex -mb-px">
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'profile'
                ? 'border-teal text-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            <User className="inline-block h-4 w-4 mr-2" />
            Perfil
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'orders'
                ? 'border-teal text-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('orders')}
            disabled={authError?.type === AuthErrorType.ACCOUNT_ACCESS}
          >
            <Package className="inline-block h-4 w-4 mr-2" />
            Pedidos
          </button>
        </nav>
      </div>
      
      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Información Personal</h2>
              {!editMode && !authError && (
                <button
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  onClick={() => setEditMode(true)}
                >
                  Editar
                </button>
              )}
            </div>
            
            {updateSuccess && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                Información actualizada correctamente.
              </div>
            )}
            
            {updateError && !authError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {updateError}
              </div>
            )}
            
            {editMode ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal"
                    />
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={customer?.email || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">El email no se puede cambiar</p>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal text-white rounded-md hover:bg-teal-light focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2"
                  >
                    Guardar Cambios
                  </button>
                  
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        firstName: customer?.firstName || '',
                        lastName: customer?.lastName || '',
                        phone: customer?.phone || ''
                      });
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Nombre Completo</p>
                    <p className="font-medium">{customer?.firstName} {customer?.lastName}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{customer?.email}</p>
                  </div>
                </div>
                
                {customer?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="font-medium">{customer.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          {orders.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pedido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-teal">#{order.orderNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">{new Date(order.processedAt).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {order.fulfillmentStatus || 'Procesando'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.totalPrice}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes pedidos aún</h3>
              <p className="text-gray-500">
                Cuando realices un pedido, aparecerá aquí para que puedas hacer seguimiento.
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AccountPage;
