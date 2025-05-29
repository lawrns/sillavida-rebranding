/**
 * Customer Authentication Service
 * 
 * This service handles authentication with Shopify's Customer Account API.
 * It provides functions for initializing the client, checking login status,
 * and handling login/logout operations with proper error handling and fallbacks.
 */

import { getFeatureFlag } from '../config/featureFlags';
import { errorHandler } from '../utils/errorHandler';

// Shopify store domain from environment variables
const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;

// Client ID for the Customer Account API
// This is the actual Client ID provided for the Customer Account API
const CLIENT_ID = 'shp_bac69bdb-b1eb-4cad-a351-e9a4817ce3bd';

// Customer Account API URL
const SHOPIFY_CUSTOMER_ACCOUNT_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/account/customer/api`;

// Error types for authentication errors
export enum AuthErrorType {
  INITIALIZATION = 'initialization',
  LOGIN = 'login',
  LOGOUT = 'logout',
  REGISTRATION = 'registration',
  ACCOUNT_ACCESS = 'account_access',
  UPDATE_ACCOUNT = 'update_account',
}

// Type definitions for the Shopify Customer Account client
declare global {
  interface Window {
    Shopify: {
      loadFeatures: (features: { name: string; version: string }[]) => Promise<void>;
      customerAccount: {
        initialize: (config: {
          apiUrl: string;
          clientId: string;
          redirectUrl: string;
        }) => any;
      };
    };
  }
}

// Error handler for authentication errors
class AuthErrorHandler {
  private static instance: AuthErrorHandler;
  private errorListeners: ((type: AuthErrorType, message: string) => void)[] = [];
  
  private constructor() {}
  
  public static getInstance(): AuthErrorHandler {
    if (!AuthErrorHandler.instance) {
      AuthErrorHandler.instance = new AuthErrorHandler();
    }
    return AuthErrorHandler.instance;
  }
  
  public addListener(callback: (type: AuthErrorType, message: string) => void): () => void {
    this.errorListeners.push(callback);
    return () => {
      this.errorListeners = this.errorListeners.filter(listener => listener !== callback);
    };
  }
  
  public handleError(type: AuthErrorType, error: any): string {
    const message = this.getErrorMessage(type, error);
    
    // Log error with type for debugging
    console.warn(`Auth error (${type}):`, error);
    
    // Only notify listeners if error reporting is enabled
    if (getFeatureFlag('customerAccounts.enableErrorReporting')) {
      // Notify all listeners
      this.errorListeners.forEach(listener => listener(type, message));
    }
    
    return message;
  }
  
  private getErrorMessage(type: AuthErrorType, error: any): string {
    // Default messages for different error types
    const defaultMessages = {
      [AuthErrorType.INITIALIZATION]: 'No se pudo inicializar el servicio de autenticación.',
      [AuthErrorType.LOGIN]: 'No se pudo iniciar sesión en este momento.',
      [AuthErrorType.LOGOUT]: 'No se pudo cerrar sesión en este momento.',
      [AuthErrorType.REGISTRATION]: 'No se pudo crear la cuenta en este momento.',
      [AuthErrorType.ACCOUNT_ACCESS]: 'No se pudo acceder a la información de la cuenta.',
      [AuthErrorType.UPDATE_ACCOUNT]: 'No se pudo actualizar la información de la cuenta.',
    };
    
    // Extract message from error if possible
    let message = defaultMessages[type];
    if (error?.message) {
      // Clean up technical details for user-friendly message
      const userMessage = error.message
        .replace(/^Error:?\s*/i, '')
        .replace(/\.\s*$/, '');
        
      if (userMessage.length < 100) { // Only use if it's reasonably short
        message = userMessage;
      }
    }
    
    return message;
  }
}

// Create singleton instance
export const authErrorHandler = AuthErrorHandler.getInstance();

// Track initialization state
let customerAccountClient: any = null;
let initializationAttempted = false;

/**
 * Get appropriate redirect URL based on current page
 * @returns The redirect URL for authentication
 */
export const getRedirectUrl = (): string => {
  const origin = window.location.origin;
  const path = window.location.pathname;
  
  // If on checkout page, redirect back to checkout after auth
  if (path.includes('/checkout')) {
    return `${origin}/checkout`;
  }
  
  // If on account pages, redirect back to account
  if (path.includes('/account')) {
    return `${origin}/account`;
  }
  
  // Store current page for other pages
  const returnTo = encodeURIComponent(window.location.href);
  return `${origin}/account?return_to=${returnTo}`;
};

/**
 * Initialize the Customer Account API client
 * @returns The initialized client or null if initialization fails
 */
export const initCustomerAccountClient = async () => {
  // Skip if feature is disabled
  if (!getFeatureFlag('customerAccounts.enabled')) {
    return null;
  }
  
  // Return existing client if already initialized
  if (customerAccountClient) {
    return customerAccountClient;
  }
  
  // Skip if initialization already attempted and failed
  if (initializationAttempted) {
    return null;
  }
  
  try {
    initializationAttempted = true;
    
    // Validate required configuration
    if (!SHOPIFY_STORE_DOMAIN || !CLIENT_ID) {
      throw new Error('Configuración incompleta para la API de Cuentas de Cliente');
    }
    
    // Load the Customer Account API feature
    if (window.Shopify && window.Shopify.loadFeatures) {
      await window.Shopify.loadFeatures([
        {
          name: 'customer-account-api',
          version: '1.0',
        }
      ]);
    } else {
      throw new Error('Shopify Customer Account API not available');
    }
    
    // Initialize the client with our configuration
    customerAccountClient = window.Shopify.customerAccount.initialize({
      apiUrl: SHOPIFY_CUSTOMER_ACCOUNT_API_URL,
      clientId: CLIENT_ID,
      redirectUrl: getRedirectUrl(),
    });
    
    return customerAccountClient;
  } catch (error) {
    authErrorHandler.handleError(AuthErrorType.INITIALIZATION, error);
    return null;
  }
};

/**
 * Check if the user is logged in
 * @returns Promise resolving to boolean indicating login status
 */
export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const client = await initCustomerAccountClient();
    
    if (!client) {
      // Fallback check using cookies if client initialization failed
      if (getFeatureFlag('customerAccounts.enableFallback')) {
        // Check for authentication cookie
        const hasAuthCookie = document.cookie.includes('_shopify_y');
        return hasAuthCookie;
      }
      return false;
    }
    
    return await client.isLoggedIn();
  } catch (error) {
    authErrorHandler.handleError(AuthErrorType.ACCOUNT_ACCESS, error);
    return false;
  }
};

/**
 * Redirect to Shopify's login page
 * @returns Promise resolving to boolean indicating success
 */
export const login = async (): Promise<boolean> => {
  try {
    const client = await initCustomerAccountClient();
    
    if (!client) {
      // Fallback to custom login page if client initialization failed
      if (getFeatureFlag('customerAccounts.enableFallback')) {
        window.location.href = `/account/login?fallback=true&return_to=${encodeURIComponent(window.location.href)}`;
        return true;
      }
      return false;
    }
    
    client.login();
    return true;
  } catch (error) {
    authErrorHandler.handleError(AuthErrorType.LOGIN, error);
    
    // Fallback to custom login page if login failed
    if (getFeatureFlag('customerAccounts.enableFallback')) {
      window.location.href = `/account/login?fallback=true&return_to=${encodeURIComponent(window.location.href)}`;
      return true;
    }
    
    return false;
  }
};

/**
 * Redirect to Shopify's registration page
 * @returns Promise resolving to boolean indicating success
 */
export const register = async (): Promise<boolean> => {
  try {
    const client = await initCustomerAccountClient();
    
    if (!client) {
      // Fallback to custom registration page if client initialization failed
      if (getFeatureFlag('customerAccounts.enableFallback')) {
        window.location.href = `/account/register?fallback=true&return_to=${encodeURIComponent(window.location.href)}`;
        return true;
      }
      return false;
    }
    
    client.register();
    return true;
  } catch (error) {
    authErrorHandler.handleError(AuthErrorType.REGISTRATION, error);
    
    // Fallback to custom registration page if registration failed
    if (getFeatureFlag('customerAccounts.enableFallback')) {
      window.location.href = `/account/register?fallback=true&return_to=${encodeURIComponent(window.location.href)}`;
      return true;
    }
    
    return false;
  }
};

/**
 * Logout the current user
 * @returns Promise resolving to boolean indicating success
 */
export const logout = async (): Promise<boolean> => {
  try {
    const client = await initCustomerAccountClient();
    
    if (!client) {
      // Fallback logout if client initialization failed
      if (getFeatureFlag('customerAccounts.enableFallback')) {
        // Clear any auth cookies and redirect to home
        document.cookie = '_shopify_y=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = '/';
        return true;
      }
      return false;
    }
    
    client.logout();
    return true;
  } catch (error) {
    authErrorHandler.handleError(AuthErrorType.LOGOUT, error);
    
    // Fallback logout if logout failed
    if (getFeatureFlag('customerAccounts.enableFallback')) {
      // Clear any auth cookies and redirect to home
      document.cookie = '_shopify_y=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.href = '/';
      return true;
    }
    
    return false;
  }
};

/**
 * Get the current customer data
 * @returns Customer data or null if not logged in
 */
export const getCurrentCustomer = async () => {
  try {
    const loggedIn = await isLoggedIn();
    
    if (!loggedIn) {
      return null;
    }
    
    const client = await initCustomerAccountClient();
    
    if (!client) {
      // Fallback to API endpoint if client initialization failed
      if (getFeatureFlag('customerAccounts.enableFallback')) {
        try {
          const response = await fetch('/api/customer/current');
          if (response.ok) {
            return await response.json();
          }
        } catch (error) {
          errorHandler.handleError(error as Error, {
            component: 'CustomerAuth',
            action: 'getCustomerData'
          });
        }
      }
      return null;
    }
    
    const { data } = await client.query({
      query: `
        query {
          customer {
            firstName
            lastName
            email
            phone
          }
        }
      `
    });
    
    return data.customer;
  } catch (error) {
    authErrorHandler.handleError(AuthErrorType.ACCOUNT_ACCESS, error);
    return null;
  }
};

/**
 * Get customer orders
 * @param first Number of orders to fetch (default: 5)
 * @returns Customer orders or null if not logged in
 */
export const getCustomerOrders = async (first = 5) => {
  try {
    const loggedIn = await isLoggedIn();
    
    if (!loggedIn) {
      return null;
    }
    
    const client = await initCustomerAccountClient();
    
    if (!client) {
      // Fallback to API endpoint if client initialization failed
      if (getFeatureFlag('customerAccounts.enableFallback')) {
        try {
          const response = await fetch(`/api/customer/orders?limit=${first}`);
          if (response.ok) {
            return await response.json();
          }
        } catch (error) {
          errorHandler.handleError(error as Error, {
            component: 'CustomerAuth',
            action: 'getCustomerOrders'
          });
        }
      }
      return null;
    }
    
    const { data } = await client.query({
      query: `
        query GetOrders($first: Int!) {
          customer {
            orders(first: $first) {
              edges {
                node {
                  id
                  orderNumber
                  processedAt
                  financialStatus
                  fulfillmentStatus
                  totalPrice {
                    amount
                    currencyCode
                  }
                  lineItems(first: 10) {
                    edges {
                      node {
                        title
                        quantity
                        originalTotalPrice {
                          amount
                          currencyCode
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        first
      }
    });
    
    return data.customer.orders.edges.map((edge: any) => edge.node);
  } catch (error) {
    authErrorHandler.handleError(AuthErrorType.ACCOUNT_ACCESS, error);
    return null;
  }
};

/**
 * Update customer information
 * @param customerInput Customer input data
 * @returns Updated customer data or null if update failed
 */
export const updateCustomer = async (customerInput: {
  firstName?: string;
  lastName?: string;
  phone?: string;
}) => {
  try {
    const client = await initCustomerAccountClient();
    
    if (!client) {
      // Fallback to API endpoint if client initialization failed
      if (getFeatureFlag('customerAccounts.enableFallback')) {
        try {
          const response = await fetch('/api/customer/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(customerInput),
          });
          
          if (response.ok) {
            return await response.json();
          }
        } catch (error) {
          errorHandler.handleError(error as Error, {
            component: 'CustomerAuth',
            action: 'updateCustomer'
          });
        }
      }
      return null;
    }
    
    const { data } = await client.mutate({
      mutation: `
        mutation customerUpdate($input: CustomerUpdateInput!) {
          customerUpdate(input: $input) {
            customer {
              firstName
              lastName
              email
              phone
            }
            customerUserErrors {
              code
              field
              message
            }
          }
        }
      `,
      variables: {
        input: customerInput
      }
    });
    
    if (data.customerUpdate.customerUserErrors.length > 0) {
      const error = new Error(data.customerUpdate.customerUserErrors[0].message);
      authErrorHandler.handleError(AuthErrorType.UPDATE_ACCOUNT, error);
      return null;
    }
    
    return data.customerUpdate.customer;
  } catch (error) {
    authErrorHandler.handleError(AuthErrorType.UPDATE_ACCOUNT, error);
    return null;
  }
};
