import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from '../../utils/DynamicImport';
import {
  HomePage,
  ProductPage,
  CategoryPage,
  CartPage,
  CheckoutPage,
  OrderConfirmationPage,
  CheckoutDemoPage,
  HbadaStylesDemo,
  AccountPage,
  OrdersPage,
  LoginPage,
  RegisterPage,
  AdminPage,
  PromotionsPage,
  ErgonomicEducationPage,
  TestimonialsPage,
  RouteLoadingFallback,
  RouteErrorFallback
} from './LazyRoutes';

/**
 * RouteWrapper - Handles all application routing with lazy loading
 * 
 * Benefits:
 * - Reduced initial bundle size
 * - Faster app startup
 * - Progressive loading of features
 * - Error boundaries for route-level error handling
 */
const RouteWrapper: React.FC = () => {
  const location = useLocation();

  return (
    <ErrorBoundary fallback={<RouteErrorFallback />}>
      <Suspense fallback={<RouteLoadingFallback />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Core Routes */}
            <Route path="/" element={<HomePage />} />
            
            {/* Product Routes */}
            <Route path="/product/:handle" element={<ProductPage />} />
            <Route path="/category/:handle" element={<CategoryPage />} />
            
            {/* Cart & Checkout Routes */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            
            {/* Demo Routes */}
            <Route path="/checkout-demo" element={<CheckoutDemoPage />} />
            <Route path="/design-system" element={<HbadaStylesDemo />} />
            
            {/* Account Routes */}
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/orders" element={<OrdersPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminPage />} />
            
            {/* Content Routes */}
            <Route path="/promociones" element={<PromotionsPage />} />
            <Route path="/promotions" element={<PromotionsPage />} />
            <Route path="/educacion/por-que-invertir-en-silla-ergonomica" element={<ErgonomicEducationPage />} />
            <Route path="/testimonios" element={<TestimonialsPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </ErrorBoundary>
  );
};

export default RouteWrapper;