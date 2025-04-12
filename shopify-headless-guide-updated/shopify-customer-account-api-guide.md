# Shopify Customer Account API Integration Guide

## Introduction

This guide is a companion to the main Headless Shopify Integration Guide. While the original guide covers the fundamentals of setting up a headless Shopify store with a custom landing page, this guide focuses specifically on implementing customer account functionality using Shopify's Customer Account API.

By following this guide, you'll learn how to integrate customer accounts into your headless Shopify implementation, allowing users to:
- Create and manage accounts
- Log in and authenticate
- View order history
- Manage personal information
- Access customer-specific content

## Prerequisites

Before starting with this guide, you should:
1. Have completed the basic headless Shopify setup from the original guide
2. Have a working Vite-based frontend that's connected to Shopify's Storefront API
3. Have a Shopify store with the Customer Accounts feature enabled

## Understanding the Customer Account API

### What is the Customer Account API?

The Customer Account API is a GraphQL API provided by Shopify that allows you to access and manage customer account information from your custom frontend. Unlike the Storefront API (which focuses on products, collections, and checkout), the Customer Account API specifically handles customer identity and account management.

As shown in your screenshot, the Customer Account API:
- Is a GraphQL API
- Requires an access token associated with a specific buyer
- Has different client types (e.g., Public web app)
- Provides credentials for client-side contexts

### Why Use the Customer Account API?

The Customer Account API enables you to:
1. Create a seamless, branded account experience across your custom landing page and Shopify-managed product pages
2. Display personalized content based on customer information
3. Allow customers to manage their accounts without leaving your custom UI
4. Access customer-specific data like order history and saved addresses

## Setting Up the Customer Account API

### Step 1: Create API Credentials

1. Log in to your Shopify Admin
2. Navigate to Settings > Apps and sales channels > Develop apps
3. Click "Create an app"
4. Name your app (e.g., "My Headless Customer Account")
5. Under Configuration, select "Configure Customer Account API"
6. Set the Client type to "Public (web app)" for browser-based applications
7. Save your changes
8. Copy the Client ID that's generated (it will look similar to the one in your screenshot: `shp_bac69bdb-b1eb-4cad-a351-e9a4817ce3bd`)

### Step 2: Configure CORS for Your Domain

1. In the same app configuration screen, find the CORS settings
2. Add your frontend domain (e.g., `https://your-custom-site.com`)
3. Save your changes

### Step 3: Set Up Authentication in Your Frontend

Add the following code to your Vite project to handle customer authentication:

```javascript
// src/services/customerAuth.js

const SHOPIFY_CUSTOMER_ACCOUNT_API_URL = 'https://your-store.myshopify.com/account/customer/api';
const CLIENT_ID = 'your_client_id_from_step_1';

// Initialize the Customer Account API client
export const initCustomerAccountClient = () => {
  return window.Shopify.loadFeatures([
    {
      name: 'customer-account-api',
      version: '1.0',
    }
  ]).then(() => {
    return window.Shopify.customerAccount.initialize({
      apiUrl: SHOPIFY_CUSTOMER_ACCOUNT_API_URL,
      clientId: CLIENT_ID,
      redirectUrl: window.location.origin + '/account',
    });
  });
};

// Check if user is logged in
export const isLoggedIn = async () => {
  const client = await initCustomerAccountClient();
  return client.isLoggedIn();
};

// Redirect to Shopify's login page
export const login = async () => {
  const client = await initCustomerAccountClient();
  client.login();
};

// Logout the current user
export const logout = async () => {
  const client = await initCustomerAccountClient();
  client.logout();
};
```

## Integrating with Your Vite Frontend

### Step 1: Add the Shopify Customer Account Library

Add the Shopify Customer Account library to your `index.html`:

```html
<!-- public/index.html or index.html -->
<head>
  <!-- Other head elements -->
  <script src="https://cdn.shopify.com/shopifycloud/customer-account/assets/latest/customer-account-api.min.js"></script>
</head>
```

### Step 2: Create Account Components

Create React components for account functionality:

```jsx
// src/components/AccountButton.jsx
import { useState, useEffect } from 'react';
import { isLoggedIn, login, logout } from '../services/customerAuth';

export default function AccountButton() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isLoggedIn().then(status => {
      setLoggedIn(status);
      setLoading(false);
    });
  }, []);

  if (loading) return <button disabled>Loading...</button>;

  return loggedIn ? (
    <button onClick={logout}>Logout</button>
  ) : (
    <button onClick={login}>Login / Register</button>
  );
}
```

### Step 3: Create an Account Page

```jsx
// src/pages/AccountPage.jsx
import { useState, useEffect } from 'react';
import { isLoggedIn, initCustomerAccountClient } from '../services/customerAuth';

export default function AccountPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const status = await isLoggedIn();
      setLoggedIn(status);
      
      if (status) {
        const client = await initCustomerAccountClient();
        
        // Example GraphQL query to get customer data
        const { data } = await client.query({
          query: `
            query {
              customer {
                firstName
                lastName
                email
                orders(first: 5) {
                  edges {
                    node {
                      id
                      orderNumber
                      totalPrice {
                        amount
                        currencyCode
                      }
                      processedAt
                    }
                  }
                }
              }
            }
          `
        });
        
        setCustomerData(data.customer);
      }
      
      setLoading(false);
    }
    
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  
  if (!loggedIn) {
    return (
      <div>
        <h1>Account</h1>
        <p>Please log in to view your account details.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>My Account</h1>
      {customerData && (
        <>
          <h2>Welcome, {customerData.firstName}!</h2>
          
          <h3>Your Information</h3>
          <p>Email: {customerData.email}</p>
          
          <h3>Recent Orders</h3>
          {customerData.orders.edges.length > 0 ? (
            <ul>
              {customerData.orders.edges.map(({ node }) => (
                <li key={node.id}>
                  Order #{node.orderNumber} - {new Date(node.processedAt).toLocaleDateString()}
                  <br />
                  Total: {node.totalPrice.amount} {node.totalPrice.currencyCode}
                </li>
              ))}
            </ul>
          ) : (
            <p>You haven't placed any orders yet.</p>
          )}
        </>
      )}
    </div>
  );
}
```

### Step 4: Add Routing for Account Pages

Using React Router (which you should have set up from the original guide):

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AccountPage from './pages/AccountPage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
```

## Advanced Customer Account Features

### Handling Customer Registration

For a better user experience, you might want to handle registration directly in your UI:

```jsx
// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { initCustomerAccountClient } from '../services/customerAuth';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const client = await initCustomerAccountClient();
      
      await client.mutate({
        mutation: `
          mutation customerCreate($input: CustomerCreateInput!) {
            customerCreate(input: $input) {
              customer {
                id
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
          input: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          },
        },
      });
      
      // Redirect to login
      client.login();
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Account</h1>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="8"
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
```

### Displaying Personalized Content on Your Landing Page

You can use the Customer Account API to personalize your landing page for logged-in users:

```jsx
// src/components/PersonalizedBanner.jsx
import { useState, useEffect } from 'react';
import { isLoggedIn, initCustomerAccountClient } from '../services/customerAuth';

export default function PersonalizedBanner() {
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const loggedIn = await isLoggedIn();
      
      if (loggedIn) {
        const client = await initCustomerAccountClient();
        
        const { data } = await client.query({
          query: `
            query {
              customer {
                firstName
              }
            }
          `
        });
        
        if (data.customer?.firstName) {
          setCustomerName(data.customer.firstName);
        }
      }
      
      setLoading(false);
    }
    
    fetchData();
  }, []);

  if (loading) return null;
  
  if (!customerName) return null;
  
  return (
    <div className="personalized-banner">
      <h2>Welcome back, {customerName}!</h2>
      <p>Check out our latest products selected just for you.</p>
    </div>
  );
}
```

Then add this component to your landing page:

```jsx
// src/pages/HomePage.jsx
import PersonalizedBanner from '../components/PersonalizedBanner';
// ... other imports

export default function HomePage() {
  return (
    <div>
      <PersonalizedBanner />
      {/* Rest of your landing page content */}
    </div>
  );
}
```

## Security Considerations

When working with the Customer Account API, keep these security best practices in mind:

1. **Never expose your Client ID in server-side code** - It's designed for client-side use only
2. **Set up proper CORS settings** in your Shopify app configuration
3. **Use HTTPS** for all communications
4. **Don't store sensitive customer data** in local storage or cookies
5. **Implement proper error handling** for authentication failures

## Integration with the Original Headless Setup

This Customer Account API implementation complements your original headless Shopify setup by:

1. **Enhancing your custom landing page** with personalized content
2. **Maintaining consistent branding** across the entire customer journey
3. **Providing a seamless experience** between your custom pages and Shopify-managed product pages
4. **Leveraging Shopify's security** for customer authentication

## Troubleshooting

### Common Issues and Solutions

1. **Authentication errors**
   - Verify your Client ID is correct
   - Check that your domain is properly configured in CORS settings
   - Ensure you're using HTTPS

2. **API query errors**
   - Validate your GraphQL syntax
   - Check that you're requesting fields that exist in the schema
   - Verify the user is properly authenticated before making queries

3. **Redirect issues**
   - Ensure your redirectUrl is properly configured
   - Check that your routes are correctly set up in your frontend

## Conclusion

By implementing the Customer Account API in your headless Shopify setup, you've created a fully integrated customer experience that maintains your brand identity while leveraging Shopify's powerful e-commerce capabilities.

This guide, combined with the original headless Shopify implementation guide, provides a comprehensive approach to building a custom e-commerce experience that gives you complete control over your landing page while still benefiting from Shopify's robust product management, checkout, and customer account features.

## Next Steps

1. Explore additional Customer Account API features like address management
2. Implement order tracking functionality
3. Add wishlist capabilities using metafields
4. Consider implementing customer segmentation for more targeted experiences

## Resources

- [Shopify Customer Account API Documentation](https://shopify.dev/docs/api/customer)
- [GraphQL API Reference](https://shopify.dev/docs/api/customer/latest/graphql)
- [Authentication Guide](https://shopify.dev/docs/api/customer/authentication)
- [Customer Account JavaScript Buy SDK](https://shopify.dev/docs/api/customer/javascript-buy-sdk)
