import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/hide-scrollbar.css';
import './styles/animations.css';
import './styles/product-page.css';
import * as serviceWorkerRegistration from './services/serviceWorkerRegistration';
import setupDesignSystem from './styles/tokens/initializeDesignSystem';
import { JudgeMeProvider } from './context/JudgeMeContext';

// Initialize the design system
setupDesignSystem();

// Initialize Judge.me at the application root level
// This ensures the script loads early and is available throughout the app
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <JudgeMeProvider autoInitialize={true}>
      <App />
    </JudgeMeProvider>
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
