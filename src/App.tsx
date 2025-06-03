import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createLazyComponent } from './components/common/LazyComponent';
import { CartProvider } from './context/CartContext';
import { JudgeMeProvider } from './context/JudgeMeContext';
import RouteWrapper from './components/routing/RouteWrapper';
import ScrollToTop from './components/common/ScrollToTop';

// Lazy load layout components
const LazyNavbar = createLazyComponent(() => import('./components/Navbar'));
const LazyShippingPromoBanner = createLazyComponent(() => import('./components/ShippingPromoBanner'));
const LazyFooter = createLazyComponent(() => import('./components/Footer'));
const LazyWhatsAppButton = createLazyComponent(() => import('./components/WhatsAppButton'));

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
    // Judge.me is loaded via JudgeMeScriptTag component when needed
  }, []);

  return (
    <CartProvider>
      <JudgeMeProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <LazyShippingPromoBanner threshold={10000} />
            <LazyNavbar />
            <main className="flex-grow">
              <RouteWrapper />
            </main>
            <LazyFooter />
            <LazyWhatsAppButton />
          </div>
        </Router>
      </JudgeMeProvider>
    </CartProvider>
  );
}

export default App;