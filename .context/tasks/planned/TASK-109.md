---
title: Implement Global Judge.me Script Initialization
type: task
status: planned
created: 2025-05-07T15:46:13-06:00
updated: 2025-05-07T15:46:13-06:00
id: TASK-109
priority: high
memory_types: [procedural, semantic]
dependencies: [TASK-107, TASK-108]
tags: [judge.me, integration, global, initialization]
---

# Implement Global Judge.me Script Initialization

## Description
Implement global initialization of the Judge.me script in the application's main entry point. This ensures that the Judge.me script is loaded early in the application lifecycle, making it available throughout the application without requiring individual components to handle initialization.

## Objectives
- Add Judge.me script initialization to the application's main entry point
- Ensure script loading doesn't block initial rendering
- Provide error handling for script loading failures
- Make Judge.me globally available to all components

## Steps
1. Update the main application entry point (`src/main.tsx`) to initialize Judge.me:
   ```typescript
   import { StrictMode } from 'react';
   import { createRoot } from 'react-dom/client';
   import App from './App.tsx';
   import './index.css';
   import './styles/hide-scrollbar.css';
   import './styles/animations.css';
   import './styles/product-page.css';
   import * as serviceWorkerRegistration from './services/serviceWorkerRegistration';
   import setupDesignSystem from './styles/tokens/initializeDesignSystem';
   import JudgeMeService from './services/judgeMe'; // Import Judge.me service

   // Initialize the design system
   setupDesignSystem();

   // Initialize Judge.me script
   JudgeMeService.load(
     // onLoad callback
     () => {
       console.log('Judge.me script loaded successfully');
     },
     // onError callback
     (error) => {
       console.error('Failed to load Judge.me script:', error);
     }
   );

   createRoot(document.getElementById('root')!).render(
     <StrictMode>
       <App />
     </StrictMode>
   );

   // If you want your app to work offline and load faster, you can change
   // unregister() to register() below. Note this comes with some pitfalls.
   // Learn more about service workers: https://cra.link/PWA
   serviceWorkerRegistration.register({
     onUpdate: (registration) => {
       // When a new version is detected, show a notification
       const waitingServiceWorker = registration.waiting;
       
       if (waitingServiceWorker) {
         waitingServiceWorker.addEventListener('statechange', (event) => {
           // @ts-ignore
           if (event.target?.state === 'activated') {
             window.location.reload();
           }
         });
         
         waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
       }
     },
   });
   ```

2. Alternatively, if you prefer to keep the main.tsx file cleaner, create a separate initialization module:
   ```typescript
   // src/services/initializeThirdParty.ts
   import JudgeMeService from './judgeMe';

   export const initializeThirdPartyScripts = () => {
     // Initialize Judge.me
     JudgeMeService.load(
       // onLoad callback
       () => {
         console.log('Judge.me script loaded successfully');
       },
       // onError callback
       (error) => {
         console.error('Failed to load Judge.me script:', error);
       }
     );
     
     // Other third-party scripts can be initialized here in the future
   };

   export default initializeThirdPartyScripts;
   ```

3. Then import and call this function in main.tsx:
   ```typescript
   import { StrictMode } from 'react';
   import { createRoot } from 'react-dom/client';
   import App from './App.tsx';
   import './index.css';
   import './styles/hide-scrollbar.css';
   import './styles/animations.css';
   import './styles/product-page.css';
   import * as serviceWorkerRegistration from './services/serviceWorkerRegistration';
   import setupDesignSystem from './styles/tokens/initializeDesignSystem';
   import initializeThirdPartyScripts from './services/initializeThirdParty';

   // Initialize the design system
   setupDesignSystem();

   // Initialize third-party scripts
   initializeThirdPartyScripts();

   createRoot(document.getElementById('root')!).render(
     <StrictMode>
       <App />
     </StrictMode>
   );

   // Service worker registration code...
   ```

4. Add a React Context to make Judge.me status available throughout the app (src/context/JudgeMeContext.tsx):
   ```typescript
   import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
   import JudgeMeService from '../services/judgeMe';

   interface JudgeMeContextType {
     isLoading: boolean;
     isReady: boolean;
     error: Error | null;
   }

   const defaultContext: JudgeMeContextType = {
     isLoading: false,
     isReady: JudgeMeService.isReady(),
     error: null,
   };

   const JudgeMeContext = createContext<JudgeMeContextType>(defaultContext);

   export const useJudgeMeContext = () => useContext(JudgeMeContext);

   export const JudgeMeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
     const [state, setState] = useState<JudgeMeContextType>(defaultContext);

     useEffect(() => {
       // Check if already loaded
       if (JudgeMeService.isReady()) {
         setState(prev => ({ ...prev, isReady: true, isLoading: false }));
         return;
       }

       // Set loading state
       setState(prev => ({ ...prev, isLoading: true }));

       // Load Judge.me script if not already loaded
       JudgeMeService.load(
         // onLoad callback
         () => {
           setState({
             isLoading: false,
             isReady: true,
             error: null,
           });
         },
         // onError callback
         (error) => {
           setState({
             isLoading: false,
             isReady: false,
             error,
           });
         }
       );
     }, []);

     return (
       <JudgeMeContext.Provider value={state}>
         {children}
       </JudgeMeContext.Provider>
     );
   };

   export default JudgeMeProvider;
   ```

5. Update the App.tsx file to include the JudgeMeProvider:
   ```tsx
   // App.tsx
   import React, { useEffect } from 'react';
   import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
   import { AnimatePresence } from 'framer-motion';
   import Navbar from './components/Navbar';
   import ShippingPromoBanner from './components/ShippingPromoBanner';
   import HomePage from './pages/HomePage';
   import ProductPage from './pages/ProductPage';
   // ...other imports
   import { CartProvider } from './context/CartContext';
   import JudgeMeProvider from './context/JudgeMeContext'; // Import JudgeMeProvider

   // Component to handle animated routes
   function AnimatedRoutes() {
     // ... existing code
   }

   const App = () => {
     return (
       <Router>
         <CartProvider>
           <JudgeMeProvider> {/* Add JudgeMeProvider */}
             <ShippingPromoBanner threshold={10000} />
             <Navbar />
             <AnimatedRoutes />
             <Footer />
             <WhatsAppButton />
           </JudgeMeProvider>
         </CartProvider>
       </Router>
     );
   };

   export default App;
   ```

## Progress
- [ ] Create third-party script initialization service or update main.tsx
- [ ] Implement JudgeMeContext for global state management
- [ ] Update App.tsx to include JudgeMeProvider
- [ ] Test script loading in development environment
- [ ] Verify Judge.me is initialized properly

## Dependencies
- TASK-107 (Create Judge.me Script Manager Service)
- TASK-108 (Create useJudgeMe React Hook)

## Test Status
- Status: Not Started
- Test Files: None

## Notes
- The global initialization ensures Judge.me is loaded once at application startup
- Using a context provider allows components to access Judge.me loading state without prop drilling
- This approach separates concerns: the service handles script loading, the context provides state to components
- There's a minor risk that Judge.me script loading might fail in certain browsers or network conditions
- Consider adding retry logic or fallback UI for cases where Judge.me fails to load

## Next Steps
- Create reusable UI components for Judge.me reviews
