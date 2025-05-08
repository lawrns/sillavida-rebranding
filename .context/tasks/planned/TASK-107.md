---
title: Create Judge.me Script Manager Service
type: task
status: planned
created: 2025-05-07T15:46:13-06:00
updated: 2025-05-07T15:46:13-06:00
id: TASK-107
priority: high
memory_types: [procedural, semantic]
dependencies: []
tags: [judge.me, integration, service, third-party]
---

# Create Judge.me Script Manager Service

## Description
Create a dedicated service for managing Judge.me script integration in our React application. This service will handle script loading, initialization, and provide methods for interacting with Judge.me's functionality. The approach must follow React best practices for third-party script management.

## Objectives
- Create a modular service to manage Judge.me script loading and initialization
- Implement a clean API for the rest of the application to interact with Judge.me
- Ensure script loading doesn't block rendering or affect performance
- Provide proper TypeScript typing for the service and Judge.me global objects

## Steps
1. Create a new file structure in the services directory for Judge.me integration:
   ```
   src/services/
   └── judgeMe/
       ├── index.ts         # Main export file
       ├── types.ts         # TypeScript interfaces for Judge.me
       ├── scriptLoader.ts  # Script loading functionality
       └── api.ts           # Methods for interacting with Judge.me
   ```

2. Implement the TypeScript interfaces in `types.ts`:
   ```typescript
   // Define Judge.me global object structure
   export interface JudgeMeGlobal {
     SHOP_DOMAIN: string;
     PLATFORM: string;
     PUBLIC_TOKEN: string;
     ready?: boolean;
     widgets?: any;
     // Add other properties as needed based on Judge.me documentation
   }

   // Extend Window interface to include Judge.me global
   declare global {
     interface Window {
       jdgm: JudgeMeGlobal;
     }
   }
   ```

3. Create the script loader in `scriptLoader.ts`:
   ```typescript
   import { JudgeMeGlobal } from './types';

   interface ScriptLoaderOptions {
     shopDomain: string;
     publicToken: string;
     platform?: string;
     onLoad?: () => void;
     onError?: (error: Error) => void;
   }

   /**
    * Loads and initializes the Judge.me script
    */
   export const loadJudgeMeScript = (options: ScriptLoaderOptions): Promise<void> => {
     const {
       shopDomain,
       publicToken,
       platform = 'shopify',
       onLoad,
       onError
     } = options;

     return new Promise((resolve, reject) => {
       // Skip if already loaded
       if (window.jdgm && window.jdgm.ready) {
         onLoad?.();
         resolve();
         return;
       }

       try {
         // Initialize Judge.me global object
         window.jdgm = window.jdgm || {} as JudgeMeGlobal;
         window.jdgm.SHOP_DOMAIN = shopDomain;
         window.jdgm.PLATFORM = platform;
         window.jdgm.PUBLIC_TOKEN = publicToken;

         // Create and append script
         const script = document.createElement('script');
         script.type = 'text/javascript';
         script.async = true;
         script.src = 'https://cdnwidget.judge.me/widget_preloader.js';
         script.setAttribute('data-cfasync', 'false');
         
         script.onload = () => {
           console.log('Judge.me script loaded successfully');
           onLoad?.();
           resolve();
         };
         
         script.onerror = (error) => {
           console.error('Failed to load Judge.me script:', error);
           onError?.(new Error('Failed to load Judge.me script'));
           reject(new Error('Failed to load Judge.me script'));
         };
         
         document.head.appendChild(script);
       } catch (error) {
         console.error('Error initializing Judge.me:', error);
         onError?.(error as Error);
         reject(error);
       }
     });
   };

   /**
    * Checks if Judge.me script is loaded and ready
    */
   export const isJudgeMeReady = (): boolean => {
     return !!(window.jdgm && window.jdgm.ready);
   };
   ```

4. Implement the API layer in `api.ts`:
   ```typescript
   import { isJudgeMeReady } from './scriptLoader';

   /**
    * Refreshes Judge.me widgets on the page
    */
   export const refreshWidgets = (): void => {
     if (!isJudgeMeReady()) {
       console.warn('Judge.me is not ready yet, cannot refresh widgets');
       return;
     }
     
     if (window.jdgm && window.jdgm.widgets) {
       // Refresh all widgets
       window.jdgm.widgets.refreshAll();
     }
   };

   /**
    * Gets review count for a product by ID
    */
   export const getReviewCount = (productId: string): number | null => {
     if (!isJudgeMeReady() || !window.jdgm.widgets) {
       return null;
     }
     
     try {
       return window.jdgm.widgets.getReviewCount(productId) || 0;
     } catch (error) {
       console.error('Error getting review count:', error);
       return null;
     }
   };

   /**
    * Gets average rating for a product by ID
    */
   export const getAverageRating = (productId: string): number | null => {
     if (!isJudgeMeReady() || !window.jdgm.widgets) {
       return null;
     }
     
     try {
       return window.jdgm.widgets.getAverageRating(productId) || 0;
     } catch (error) {
       console.error('Error getting average rating:', error);
       return null;
     }
   };
   ```

5. Create the main export file `index.ts`:
   ```typescript
   import { loadJudgeMeScript, isJudgeMeReady } from './scriptLoader';
   import { refreshWidgets, getReviewCount, getAverageRating } from './api';

   // Configuration for SillaVida
   const DEFAULT_CONFIG = {
     shopDomain: 'sbz5wk-e9.myshopify.com',
     publicToken: 'CmgUOrdFZ2WZCDoTpirgmdavI4c',
     platform: 'shopify'
   };

   // Export a unified API
   export const JudgeMeService = {
     // Core functionality
     load: (onLoad?: () => void, onError?: (error: Error) => void) => 
       loadJudgeMeScript({...DEFAULT_CONFIG, onLoad, onError}),
     isReady: isJudgeMeReady,
     
     // Widget interaction
     refreshWidgets,
     getReviewCount,
     getAverageRating,
     
     // Configuration
     config: DEFAULT_CONFIG
   };

   export default JudgeMeService;
   export * from './types';
   ```

## Progress
- [ ] Create directory structure for Judge.me service
- [ ] Implement TypeScript interfaces for Judge.me in types.ts
- [ ] Create script loading functionality in scriptLoader.ts
- [ ] Implement API layer in api.ts
- [ ] Create main export file with unified API

## Dependencies
- None (this is the foundation task)

## Test Status
- Status: Not Started
- Test Files: None

## Notes
- The implementation follows the pattern of existing services in the codebase
- Script loading is done asynchronously to prevent blocking rendering
- Error handling is provided at each step of the integration
- The service is designed to be used with React hooks in future tasks
- Judge.me documentation doesn't provide complete TypeScript definitions, so the interfaces may need to be expanded as we discover more functionality

## Next Steps
- Create React hook for using Judge.me functionality in components
