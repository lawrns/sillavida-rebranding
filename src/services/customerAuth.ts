/**
 * Customer Authentication Service
 * 
 * This service handles authentication with Shopify's Customer Account API.
 * It provides functions for initializing the client, checking login status,
 * and handling login/logout operations.
 */

// Shopify store domain from environment variables
const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;

// Client ID for the Customer Account API
// This is the actual Client ID provided for the Customer Account API
const CLIENT_ID = 'shp_bac69bdb-b1eb-4cad-a351-e9a4817ce3bd';

// Customer Account API URL
const SHOPIFY_CUSTOMER_ACCOUNT_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/account/customer/api`;

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

/**
 * Initialize the Customer Account API client
 * @returns The initialized client
 */
export const initCustomerAccountClient = async () => {
  try {
    // Load the Customer Account API feature
    await window.Shopify.loadFeatures([
      {
        name: 'customer-account-api',
        version: '1.0',
      }
    ]);
    
    // Initialize the client with our configuration
    return window.Shopify.customerAccount.initialize({
      apiUrl: SHOPIFY_CUSTOMER_ACCOUNT_API_URL,
      clientId: CLIENT_ID,
      redirectUrl: window.location.origin + '/account',
    });
  } catch (error) {
    console.error('Failed to initialize Customer Account client:', error);
    throw new Error('Failed to initialize Customer Account client');
  }
};

/**
 * Check if the user is logged in
 * @returns Promise resolving to boolean indicating login status
 */
export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const client = await initCustomerAccountClient();
    return client.isLoggedIn();
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

/**
 * Redirect to Shopify's login page
 */
export const login = async (): Promise<void> => {
  try {
    const client = await initCustomerAccountClient();
    client.login();
  } catch (error) {
    console.error('Error initiating login:', error);
    throw new Error('Failed to initiate login');
  }
};

/**
 * Logout the current user
 */
export const logout = async (): Promise<void> => {
  try {
    const client = await initCustomerAccountClient();
    client.logout();
  } catch (error) {
    console.error('Error logging out:', error);
    throw new Error('Failed to logout');
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
    console.error('Error fetching customer data:', error);
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
    console.error('Error fetching customer orders:', error);
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
      console.error('Errors updating customer:', data.customerUpdate.customerUserErrors);
      return null;
    }
    
    return data.customerUpdate.customer;
  } catch (error) {
    console.error('Error updating customer:', error);
    return null;
  }
};
