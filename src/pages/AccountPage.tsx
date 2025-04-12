import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn, getCurrentCustomer, getCustomerOrders, updateCustomer } from '../services/customerAuth';
import { User, Package, Clock, Mail, Phone } from 'lucide-react';

/**
 * AccountPage component
 * 
 * This component displays the user's account information, including
 * personal details and order history. It also allows the user to
 * update their information.
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

  // Check login status and fetch customer data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const status = await isLoggedIn();
        setLoggedIn(status);
        
        if (status) {
          const customerData = await getCurrentCustomer();
          setCustomer(customerData);
          setFormData({
            firstName: customerData?.firstName || '',
            lastName: customerData?.lastName || '',
            phone: customerData?.phone || ''
          });
          
          const ordersData = await getCustomerOrders(10);
          setOrders(ordersData || []);
        }
      } catch (error) {
        console.error('Error fetching account data:', error);
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
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      setUpdateError('Ocurrió un error al actualizar la información.');
    }
  };

  // If login status is still loading, show loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to home page
  if (loggedIn === false) {
    return <Navigate to="/" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Mi Cuenta</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex -mb-px">
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'profile'
                ? 'border-red-600 text-red-600'
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
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('orders')}
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
              {!editMode && (
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
            
            {updateError && (
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
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
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
                    <p className="mt-1 text-gray-900">
                      {customer?.firstName} {customer?.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-gray-900">{customer?.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Teléfono</h3>
                    <p className="mt-1 text-gray-900">
                      {customer?.phone || 'No especificado'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Historial de Pedidos</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No tienes pedidos</h3>
                <p className="text-gray-500">
                  Cuando realices un pedido, aparecerá aquí.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-wrap justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Pedido #{order.orderNumber}
                        </h3>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(order.processedAt).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.fulfillmentStatus === 'FULFILLED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.fulfillmentStatus === 'FULFILLED' ? 'Enviado' : 'Pendiente'}
                        </span>
                        <div className="mt-2 text-right">
                          <span className="text-sm text-gray-500">Total:</span>
                          <span className="ml-1 font-medium text-gray-900">
                            ${parseFloat(order.totalPrice.amount).toFixed(2)} {order.totalPrice.currencyCode}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Productos</h4>
                      <ul className="space-y-3">
                        {order.lineItems.edges.map(({ node }: any) => (
                          <li key={node.id} className="flex justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-gray-800">{node.title}</p>
                              <p className="text-xs text-gray-500">Cantidad: {node.quantity}</p>
                            </div>
                            <div className="text-sm text-gray-900 font-medium">
                              ${parseFloat(node.originalTotalPrice.amount).toFixed(2)}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
