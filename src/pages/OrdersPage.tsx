import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion
import { isLoggedIn, getCustomerOrders } from '../services/customerAuth';
import { Package, Clock, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * OrdersPage component
 * 
 * This component displays the user's order history with detailed information
 * about each order, including products, prices, and status.
 */
const OrdersPage: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // Check login status and fetch orders on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const status = await isLoggedIn();
        setLoggedIn(status);
        
        if (status) {
          const ordersData = await getCustomerOrders(20); // Get more orders for this dedicated page
          setOrders(ordersData || []);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Toggle order details expansion
  const toggleOrderExpansion = (orderId: string) => {
    const newExpandedOrders = new Set(expandedOrders);
    if (newExpandedOrders.has(orderId)) {
      newExpandedOrders.delete(orderId);
    } else {
      newExpandedOrders.add(orderId);
    }
    setExpandedOrders(newExpandedOrders);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Mis Pedidos</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">No tienes pedidos</h2>
          <p className="text-gray-500 mb-6">
            Cuando realices un pedido, aparecerá aquí.
          </p>
          <a 
            href="/tienda" 
            className="inline-block px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Explorar productos
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-wrap justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Pedido #{order.orderNumber}
                    </h2>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDate(order.processedAt)}
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0 flex flex-col items-end">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.fulfillmentStatus === 'FULFILLED'
                        ? 'bg-green-100 text-green-800'
                        : order.fulfillmentStatus === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.fulfillmentStatus === 'FULFILLED' 
                        ? 'Enviado' 
                        : order.fulfillmentStatus === 'IN_PROGRESS'
                        ? 'En proceso'
                        : 'Pendiente'}
                    </span>
                    <div className="mt-2 text-right">
                      <span className="text-sm text-gray-500">Total:</span>
                      <span className="ml-1 font-medium text-gray-900">
                        ${parseFloat(order.totalPrice.amount).toFixed(2)} {order.totalPrice.currencyCode}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  className="mt-4 flex items-center text-sm text-gray-600 hover:text-red-600"
                  onClick={() => toggleOrderExpansion(order.id)}
                >
                  {expandedOrders.has(order.id) ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Ocultar detalles
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Ver detalles
                    </>
                  )}
                </button>
              </div>
              
              {/* Order Details (Expanded) */}
              {expandedOrders.has(order.id) && (
                <div className="p-6 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Productos</h3>
                  <div className="space-y-4">
                    {order.lineItems.edges.map(({ node }: any) => (
                      <div key={node.id} className="flex items-start border-b border-gray-100 pb-4">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{node.title}</p>
                          <p className="text-sm text-gray-500 mt-1">Cantidad: {node.quantity}</p>
                          {node.variant && (
                            <p className="text-sm text-gray-500">
                              {node.variant.title !== 'Default Title' ? node.variant.title : ''}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            ${parseFloat(node.originalTotalPrice.amount).toFixed(2)}
                          </p>
                          {node.originalTotalPrice.amount !== node.discountedTotalPrice?.amount && (
                            <p className="text-sm text-green-600">
                              Ahorrado: ${(
                                parseFloat(node.originalTotalPrice.amount) - 
                                parseFloat(node.discountedTotalPrice.amount)
                              ).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order Summary */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">${parseFloat(order.subtotalPrice?.amount || order.totalPrice.amount).toFixed(2)}</span>
                    </div>
                    {order.totalShippingPrice && (
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Envío</span>
                        <span className="text-gray-900">${parseFloat(order.totalShippingPrice.amount).toFixed(2)}</span>
                      </div>
                    )}
                    {order.totalTax && (
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Impuestos</span>
                        <span className="text-gray-900">${parseFloat(order.totalTax.amount).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium text-base mt-4 pt-4 border-t border-gray-200">
                      <span>Total</span>
                      <span>${parseFloat(order.totalPrice.amount).toFixed(2)} {order.totalPrice.currencyCode}</span>
                    </div>
                  </div>
                  
                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Dirección de envío</h3>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.name}<br />
                        {order.shippingAddress.address1}<br />
                        {order.shippingAddress.address2 && <>{order.shippingAddress.address2}<br /></>}
                        {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}<br />
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default OrdersPage;
