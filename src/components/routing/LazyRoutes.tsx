import { lazy } from 'react';
import { createLazyComponent } from '../common/LazyComponent';

/**
 * Lazy-loaded route components
 * This reduces the initial bundle size and improves app startup performance
 */

// Core pages - load immediately for better UX
export const HomePage = lazy(() => import('../../pages/HomePage'));

// Product pages - frequently accessed
export const ProductPage = lazy(() => import('../../pages/ProductPage'));
export const CategoryPage = lazy(() => import('../../pages/CategoryPage'));

// Cart and checkout - transactional pages
export const CartPage = lazy(() => import('../../pages/CartPage'));
export const CheckoutPage = lazy(() => import('../../pages/CheckoutPage'));
export const OrderConfirmationPage = lazy(() => import('../../pages/OrderConfirmationPage'));

// Demo and test pages - development only
export const CheckoutDemoPage = lazy(() => import('../../dev/CheckoutDemoPage'));

// Account pages - user-specific
export const AccountPage = lazy(() => import('../../pages/AccountPage'));
export const OrdersPage = lazy(() => import('../../pages/OrdersPage'));
export const LoginPage = lazy(() => import('../../pages/LoginPage'));
export const RegisterPage = lazy(() => import('../../pages/RegisterPage'));

// Admin pages - rarely accessed
export const AdminPage = lazy(() => import('../../pages/AdminPage'));

// Content pages - occasional access
export const PromotionsPage = lazy(() => import('../../pages/PromotionsPage'));
export const ErgonomicEducationPage = lazy(() => import('../../pages/ErgonomicEducationPage'));
export const TestimonialsPage = lazy(() => import('../../pages/TestimonialsPage'));

// Legal pages - rarely accessed
export const ContactPage = lazy(() => import('../../pages/ContactPage'));
export const PrivacyPage = lazy(() => import('../../pages/PrivacyPage'));
export const TermsPage = lazy(() => import('../../pages/TermsPage'));
export const CookiesPage = lazy(() => import('../../pages/CookiesPage'));
export const WarrantyPage = lazy(() => import('../../pages/WarrantyPage'));
export const ShippingPage = lazy(() => import('../../pages/ShippingPage'));
export const NotFoundPage = lazy(() => import('../../pages/NotFoundPage'));

/**
 * Route loading fallback component - Minimal and fast
 */
export const RouteLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black"></div>
  </div>
);

/**
 * Route error fallback component
 */
export const RouteErrorFallback = () => (
  <div className="flex items-center justify-center min-h-[400px] flex-col">
    <h2 className="text-xl font-bold text-gray-800 mb-2">Error al cargar la página</h2>
    <p className="text-gray-600 mb-4">Ha ocurrido un error inesperado.</p>
    <button 
      onClick={() => window.location.reload()} 
      className="bg-accent text-white px-4 py-2 rounded hover:bg-accent/90"
    >
      Recargar página
    </button>
  </div>
);