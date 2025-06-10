import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { JudgeMeProvider } from './context/JudgeMeContext';
import RouteWrapper from './components/routing/RouteWrapper';
import ScrollToTop from './components/common/ScrollToTop';
import { initWebVitals } from './utils/webVitals';
import { preloadCriticalResources, initDNSPrefetch, registerServiceWorker } from './utils/resourcePreloader';
import './utils/performanceOptimizer'; // Auto-initializes performance optimizations
import './utils/fontOptimization'; // Auto-initializes font optimizations

// Create invisible loading fallback for layout components
const InvisibleLoader = () => <div style={{ minHeight: '1px' }} />;

// Lazy load layout components with invisible fallback
const LazyNavbar = React.lazy(() => import('./components/Navbar'));
const LazyShippingPromoBanner = React.lazy(() => import('./components/ShippingPromoBanner'));
const LazyFooter = React.lazy(() => import('./components/Footer'));
const LazyWhatsAppButton = React.lazy(() => import('./components/WhatsAppButton'));

/**
 * App Component - Simplified and decoupled application root
 * 
 * This version uses:
 * - Lazy loading for all layout components
 * - Route wrapper for organized routing
 * - Minimal direct imports
 * - Composition pattern for better separation of concerns
 * 
 * Benefits:
 * - Faster initial load time
 * - Better code splitting
 * - Reduced coupling between components
 * - Easier testing and maintenance
 */
function App() {
  useEffect(() => {
    // Initialize performance monitoring
    initWebVitals({ debug: process.env.NODE_ENV === 'development' });
    
    // Preload critical resources
    preloadCriticalResources();
    
    // DNS prefetch external domains
    initDNSPrefetch();
    
    // Register service worker for caching
    registerServiceWorker();
    
    // Judge.me is loaded via JudgeMeScriptTag component when needed
  }, []);

  return (
    <CartProvider>
      <JudgeMeProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <Suspense fallback={<InvisibleLoader />}>
              <LazyShippingPromoBanner threshold={10000} />
            </Suspense>
            <Suspense fallback={<InvisibleLoader />}>
              <LazyNavbar />
            </Suspense>
            <main className="flex-grow">
              <RouteWrapper />
            </main>
            <Suspense fallback={<InvisibleLoader />}>
              <LazyFooter />
            </Suspense>
            <Suspense fallback={<InvisibleLoader />}>
              <LazyWhatsAppButton />
            </Suspense>
          </div>
        </Router>
      </JudgeMeProvider>
    </CartProvider>
  );
}

export default App;