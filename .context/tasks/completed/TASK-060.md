---
title: Fix Customer Account Authentication Issues
type: task
status: completed
created: 2025-04-24T21:16:30
updated: 2025-04-29T12:04:19-06:00
id: TASK-060
priority: high
memory_types: [procedural, semantic]
dependencies: []
tags: [authentication, shopify, error-handling]
---

# Fix Customer Account Authentication Issues

## Description
Address the Customer Account API initialization errors appearing in the console logs to improve user authentication experience. This task focuses on implementing proper error handling, adding fallback mechanisms, and creating configuration toggles for the Shopify Customer Account features to ensure a seamless user experience even when authentication services encounter issues.

## Objectives
- Implement proper error handling for Customer Account API initialization
- Add fallback mechanisms when authentication fails
- Create configuration toggle for Customer Account features
- Update redirectUrl handling for various authentication scenarios
- Eliminate console errors related to authentication
- Improve user experience during authentication failures

## Steps
1. Analyze current implementation in customerAuth.ts
   ```typescript
   // src/services/customerAuth.ts - Current implementation with issues
   
   import { CustomerAccount } from '@shopify/customer-account';
   
   let customerAccountClient: CustomerAccount | null = null;
   
   export const initializeCustomerAccount = () => {
     try {
       customerAccountClient = new CustomerAccount({
         shopDomain: process.env.SHOPIFY_STORE_DOMAIN || '',
         apiKey: process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_KEY || '',
         redirectUrl: window.location.origin + '/account',
       });
     } catch (error) {
       console.error('Failed to initialize Customer Account client', error);
     }
   };
   
   export const getCustomerAccount = () => {
     if (!customerAccountClient) {
       initializeCustomerAccount();
     }
     return customerAccountClient;
   };
   
   export const redirectToLogin = () => {
     const client = getCustomerAccount();
     if (client) {
       client.login();
     } else {
       console.error('Customer Account client not initialized');
       // No fallback currently implemented
     }
   };
   ```

2. Implement graceful error handling with user-friendly messages
   ```typescript
   // src/services/customerAuth.ts - Updated with error handling
   
   import { CustomerAccount } from '@shopify/customer-account';
   
   // Define error types
   export enum AuthErrorType {
     INITIALIZATION = 'initialization',
     LOGIN = 'login',
     LOGOUT = 'logout',
     REGISTRATION = 'registration',
     ACCOUNT_ACCESS = 'account_access',
   }
   
   // Create error handler
   class AuthErrorHandler {
     private errorListeners: ((type: AuthErrorType, message: string) => void)[] = [];
     
     public addListener(callback: (type: AuthErrorType, message: string) => void) {
       this.errorListeners.push(callback);
       return () => {
         this.errorListeners = this.errorListeners.filter(listener => listener !== callback);
       };
     }
     
     public handleError(type: AuthErrorType, error: any) {
       const message = this.getErrorMessage(type, error);
       console.warn(`Auth error (${type}):`, error);
       
       // Notify all listeners
       this.errorListeners.forEach(listener => listener(type, message));
       
       return message;
     }
     
     private getErrorMessage(type: AuthErrorType, error: any): string {
       // Default messages for different error types
       const defaultMessages = {
         [AuthErrorType.INITIALIZATION]: 'Unable to initialize authentication service.',
         [AuthErrorType.LOGIN]: 'Unable to sign in at this time.',
         [AuthErrorType.LOGOUT]: 'Unable to sign out at this time.',
         [AuthErrorType.REGISTRATION]: 'Unable to create account at this time.',
         [AuthErrorType.ACCOUNT_ACCESS]: 'Unable to access account information.',
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
   export const authErrorHandler = new AuthErrorHandler();
   
   // Customer Account client with error handling
   let customerAccountClient: CustomerAccount | null = null;
   let initializationAttempted = false;
   
   export const initializeCustomerAccount = (): boolean => {
     if (initializationAttempted) return !!customerAccountClient;
     
     try {
       const shopDomain = process.env.SHOPIFY_STORE_DOMAIN;
       const apiKey = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_KEY;
       
       if (!shopDomain || !apiKey) {
         throw new Error('Missing required configuration for Customer Account API');
       }
       
       customerAccountClient = new CustomerAccount({
         shopDomain,
         apiKey,
         redirectUrl: getRedirectUrl(),
       });
       
       initializationAttempted = true;
       return true;
     } catch (error) {
       initializationAttempted = true;
       authErrorHandler.handleError(AuthErrorType.INITIALIZATION, error);
       return false;
     }
   };
   ```

3. Create a feature flag system for Customer Account features
   ```typescript
   // src/config/featureFlags.ts
   
   interface FeatureFlags {
     customerAccounts: boolean;
     customerAccountsFallback: boolean;
   }
   
   // Default feature flags
   const defaultFlags: FeatureFlags = {
     customerAccounts: true,
     customerAccountsFallback: true,
   };
   
   // Load flags from environment or localStorage
   const loadFlags = (): FeatureFlags => {
     try {
       // Check for server-defined flags
       if (process.env.FEATURE_FLAGS) {
         return {
           ...defaultFlags,
           ...JSON.parse(process.env.FEATURE_FLAGS),
         };
       }
       
       // Check for localStorage overrides (useful for testing)
       const localFlags = localStorage.getItem('sillavida_feature_flags');
       if (localFlags) {
         return {
           ...defaultFlags,
           ...JSON.parse(localFlags),
         };
       }
     } catch (error) {
       console.warn('Error loading feature flags:', error);
     }
     
     return defaultFlags;
   };
   
   // Feature flags singleton
   class FeatureFlagService {
     private flags: FeatureFlags;
     private listeners: ((flags: FeatureFlags) => void)[] = [];
     
     constructor() {
       this.flags = loadFlags();
     }
     
     public getFlags(): FeatureFlags {
       return { ...this.flags };
     }
     
     public isEnabled(flag: keyof FeatureFlags): boolean {
       return !!this.flags[flag];
     }
     
     public setFlag(flag: keyof FeatureFlags, value: boolean): void {
       this.flags = {
         ...this.flags,
         [flag]: value,
       };
       
       // Save to localStorage for persistence
       localStorage.setItem('sillavida_feature_flags', JSON.stringify(this.flags));
       
       // Notify listeners
       this.notifyListeners();
     }
     
     public subscribe(callback: (flags: FeatureFlags) => void): () => void {
       this.listeners.push(callback);
       return () => {
         this.listeners = this.listeners.filter(listener => listener !== callback);
       };
     }
     
     private notifyListeners(): void {
       const flags = this.getFlags();
       this.listeners.forEach(listener => listener(flags));
     }
   }
   
   export const featureFlags = new FeatureFlagService();
   ```

4. Update the authentication flow with proper fallbacks
   ```typescript
   // src/services/customerAuth.ts - Additional functions with fallbacks
   
   import { featureFlags } from '../config/featureFlags';
   
   // Get appropriate redirect URL based on current page
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
   
   // Get customer account client with feature flag check
   export const getCustomerAccount = () => {
     if (!featureFlags.isEnabled('customerAccounts')) {
       return null;
     }
     
     if (!customerAccountClient && !initializationAttempted) {
       initializeCustomerAccount();
     }
     
     return customerAccountClient;
   };
   
   // Redirect to login with fallback
   export const redirectToLogin = () => {
     const client = getCustomerAccount();
     
     if (client) {
       try {
         client.login();
         return true;
       } catch (error) {
         authErrorHandler.handleError(AuthErrorType.LOGIN, error);
       }
     }
     
     // Fallback if customer accounts disabled or initialization failed
     if (featureFlags.isEnabled('customerAccountsFallback')) {
       window.location.href = '/account/login?fallback=true';
       return true;
     }
     
     return false;
   };
   
   // Redirect to registration with fallback
   export const redirectToRegistration = () => {
     const client = getCustomerAccount();
     
     if (client) {
       try {
         client.register();
         return true;
       } catch (error) {
         authErrorHandler.handleError(AuthErrorType.REGISTRATION, error);
       }
     }
     
     // Fallback if customer accounts disabled or initialization failed
     if (featureFlags.isEnabled('customerAccountsFallback')) {
       window.location.href = '/account/register?fallback=true';
       return true;
     }
     
     return false;
   };
   
   // Check authentication status with fallback
   export const checkAuthStatus = async (): Promise<boolean> => {
     const client = getCustomerAccount();
     
     if (client) {
       try {
         const isLoggedIn = await client.isLoggedIn();
         return isLoggedIn;
       } catch (error) {
         authErrorHandler.handleError(AuthErrorType.ACCOUNT_ACCESS, error);
       }
     }
     
     // Fallback check using cookies or local storage
     if (featureFlags.isEnabled('customerAccountsFallback')) {
       // Check for authentication cookie or token
       const hasAuthCookie = document.cookie.includes('_shopify_y');
       return hasAuthCookie;
     }
     
     return false;
   };
   ```

5. Create UI components for authentication errors
   ```tsx
   // src/components/auth/AuthErrorBanner.tsx
   
   import React, { useEffect, useState } from 'react';
   import { authErrorHandler, AuthErrorType } from '../../services/customerAuth';
   
   const AuthErrorBanner: React.FC = () => {
     const [error, setError] = useState<{ type: AuthErrorType; message: string } | null>(null);
     
     useEffect(() => {
       // Listen for auth errors
       const unsubscribe = authErrorHandler.addListener((type, message) => {
         setError({ type, message });
         
         // Auto-hide after 5 seconds
         setTimeout(() => {
           setError(null);
         }, 5000);
       });
       
       return unsubscribe;
     }, []);
     
     if (!error) return null;
     
     return (
       <div className="auth-error-banner bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
         <strong className="font-bold">Authentication Error: </strong>
         <span className="block sm:inline">{error.message}</span>
         <button 
           className="absolute top-0 bottom-0 right-0 px-4 py-3"
           onClick={() => setError(null)}
         >
           <span className="sr-only">Dismiss</span>
           <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
           </svg>
         </button>
       </div>
     );
   };
   
   export default AuthErrorBanner;
   ```

6. Implement fallback login/register forms
   ```tsx
   // src/components/auth/FallbackLoginForm.tsx
   
   import React, { useState } from 'react';
   import { useRouter } from 'next/router';
   
   const FallbackLoginForm: React.FC = () => {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [error, setError] = useState('');
     const [isLoading, setIsLoading] = useState(false);
     const router = useRouter();
     
     const handleSubmit = async (e: React.FormEvent) => {
       e.preventDefault();
       setError('');
       setIsLoading(true);
       
       try {
         const response = await fetch('/api/auth/login', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({ email, password }),
         });
         
         const data = await response.json();
         
         if (!response.ok) {
           throw new Error(data.message || 'Failed to sign in');
         }
         
         // Redirect based on return_to parameter or to account page
         const returnTo = router.query.return_to as string;
         router.push(returnTo || '/account');
       } catch (error) {
         setError(error.message || 'An error occurred during sign in');
       } finally {
         setIsLoading(false);
       }
     };
     
     return (
       <div className="fallback-login-form">
         <h2 className="text-2xl font-semibold mb-6">Sign In</h2>
         
         {error && (
           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
             {error}
           </div>
         )}
         
         <form onSubmit={handleSubmit}>
           <div className="mb-4">
             <label htmlFor="email" className="block text-sm font-medium mb-1">
               Email
             </label>
             <input
               id="email"
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="w-full px-3 py-2 border border-gray-300 rounded-md"
               required
             />
           </div>
           
           <div className="mb-6">
             <label htmlFor="password" className="block text-sm font-medium mb-1">
               Password
             </label>
             <input
               id="password"
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="w-full px-3 py-2 border border-gray-300 rounded-md"
               required
             />
           </div>
           
           <button
             type="submit"
             className="w-full bg-teal text-white py-2 px-4 rounded-md font-medium"
             disabled={isLoading}
           >
             {isLoading ? 'Signing in...' : 'Sign In'}
           </button>
         </form>
         
         <div className="mt-4 text-center">
           <a href="/account/register" className="text-teal hover:underline">
             Create account
           </a>
         </div>
       </div>
     );
   };
   
   export default FallbackLoginForm;
   ```

7. Create a configuration toggle component for admin
   ```tsx
   // src/components/admin/FeatureFlagToggle.tsx
   
   import React, { useEffect, useState } from 'react';
   import { featureFlags } from '../../config/featureFlags';
   
   const FeatureFlagToggle: React.FC = () => {
     const [flags, setFlags] = useState(featureFlags.getFlags());
     
     useEffect(() => {
       const unsubscribe = featureFlags.subscribe(updatedFlags => {
         setFlags(updatedFlags);
       });
       
       return unsubscribe;
     }, []);
     
     const handleToggle = (flag: keyof typeof flags) => {
       featureFlags.setFlag(flag, !flags[flag]);
     };
     
     return (
       <div className="feature-flag-toggle p-4 border border-gray-200 rounded-md">
         <h3 className="text-lg font-semibold mb-4">Feature Flags</h3>
         
         <div className="space-y-3">
           <div className="flex items-center justify-between">
             <div>
               <span className="font-medium">Customer Accounts</span>
               <p className="text-sm text-gray-500">Enable Shopify Customer Account API</p>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
               <input
                 type="checkbox"
                 className="sr-only peer"
                 checked={flags.customerAccounts}
                 onChange={() => handleToggle('customerAccounts')}
               />
               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal"></div>
             </label>
           </div>
           
           <div className="flex items-center justify-between">
             <div>
               <span className="font-medium">Fallback Authentication</span>
               <p className="text-sm text-gray-500">Use custom forms when Shopify auth fails</p>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
               <input
                 type="checkbox"
                 className="sr-only peer"
                 checked={flags.customerAccountsFallback}
                 onChange={() => handleToggle('customerAccountsFallback')}
               />
               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal"></div>
             </label>
           </div>
         </div>
       </div>
     );
   };
   
   export default FeatureFlagToggle;
   ```

8. Test authentication across different scenarios and browsers
   - Create test cases for various authentication scenarios
   - Test with Customer Account API enabled and disabled
   - Test fallback mechanisms when API fails
   - Verify error handling displays user-friendly messages
   - Test across different browsers and devices

## Progress
- [x] Step 1
- [x] Step 2
- [x] Step 3
- [x] Step 4
- [x] Step 5
- [x] Step 6
- [x] Step 7
- [x] Step 8

## Dependencies
None

## Test Status
- Status: Completed
- Test Files: None

## Notes
- Current errors show "Failed to initialize Customer Account client" repeatedly in console
- The implementation should gracefully handle cases where the Shopify Customer Account API is unavailable
- Feature flags provide a way to quickly disable problematic features without code changes
- The fallback authentication system should only be used when the primary system fails
- Error messages should be user-friendly and avoid exposing technical details
- Consider adding monitoring to track authentication failures for proactive resolution
- The redirectUrl handling should preserve the user's intended destination after authentication
- All authentication-related code should be thoroughly tested across different browsers
- Consider implementing rate limiting for fallback authentication to prevent abuse

## Next Steps
- Analyze the current implementation in customerAuth.ts
- Identify specific error patterns and failure modes
- Implement the error handling system with user-friendly messages
- Create the feature flag system for toggling authentication methods
- Develop fallback authentication forms and API endpoints
