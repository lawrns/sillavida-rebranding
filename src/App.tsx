import React from 'react';
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
import TestPage from './pages/TestPage';
import ShopifyTestPage from './pages/ShopifyTestPage';
import AccountPage from './pages/AccountPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UiShowcasePage from './pages/UiShowcasePage';
import PromotionsPage from './pages/PromotionsPage';
import ErgonomicEducationPage from './pages/ErgonomicEducationPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ProductCardDemo from './pages/ProductCardDemo';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { CartProvider } from './context/CartContext';

// Component to handle animated routes
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait"> {/* Use mode="wait" for smoother exit/enter */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:handle" element={<ProductPage />} />
              <Route path="/category/:handle" element={<CategoryPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/carrito" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/checkout-demo" element={<CheckoutDemoPage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/shopify-test" element={<ShopifyTestPage />} />
              {/* Account Routes */}
              <Route path="/account" element={<AccountPage />} />
              <Route path="/account/orders" element={<OrdersPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/* UI Improvements Showcase Page */}
              <Route path="/ui-showcase" element={<UiShowcasePage />} />
              {/* Promotions Page */}
              <Route path="/promociones" element={<PromotionsPage />} />
              <Route path="/promotions" element={<PromotionsPage />} />
              {/* Educational Pages */}
              <Route path="/educacion/por-que-invertir-en-silla-ergonomica" element={<ErgonomicEducationPage />} />
              {/* Testimonials Page */}
              <Route path="/testimonios" element={<TestimonialsPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              {/* Demo Pages */}
              <Route path="/demos/product-cards" element={<ProductCardDemo />} />
            </Routes>
    </AnimatePresence>
  );
}

function App() {
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
