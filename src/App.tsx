import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion'; // Import AnimatePresence
import Navbar from './components/Navbar';
import ShippingPromoBanner from './components/ShippingPromoBanner';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import CheckoutDemoPage from './pages/CheckoutDemoPage';
import AccountPage from './pages/AccountPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import PromotionsPage from './pages/PromotionsPage';
import ErgonomicEducationPage from './pages/ErgonomicEducationPage';
import TestimonialsPage from './pages/TestimonialsPage';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { CartProvider } from './context/CartContext';
import themeSwitcher from './utils/theme-switcher';

// Component to handle animated routes
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait"> {/* Use mode="wait" for smoother exit/enter */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:handle" element={<ProductPage />} />
        <Route path="/products/:handle" element={<ProductPage />} />
        <Route path="/category/:handle" element={<CategoryPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/checkout-demo" element={<CheckoutDemoPage />} />
        
        {/* Account Routes */}
        <Route path="/account" element={<AccountPage />} />
        <Route path="/account/orders" element={<OrdersPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminPage />} />
        
        {/* Promotions Page */}
        <Route path="/promociones" element={<PromotionsPage />} />
        <Route path="/promotions" element={<PromotionsPage />} />
        
        {/* Educational Pages */}
        <Route path="/educacion/por-que-invertir-en-silla-ergonomica" element={<ErgonomicEducationPage />} />
        
        {/* Testimonials Page */}
        <Route path="/testimonios" element={<TestimonialsPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useEffect(() => {
    // Initialize the theme switcher
    themeSwitcher.init();
    
    // Apply the enhanced theme class to the root element by default
    document.documentElement.classList.add('enhanced-theme');
  }, []);

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <ShippingPromoBanner threshold={10000} />
          <Navbar />
          <main className="flex-grow">
            <AnimatedRoutes /> {/* Use the animated routes component */}
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
