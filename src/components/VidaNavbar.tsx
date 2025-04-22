import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import MiniCart from './MiniCart';
import AccountButton from './AccountButton';
import VidaNavItem from './VidaNavItem';
import VidaNavDropdown from './VidaNavDropdown';
import VidaMobileMenu from './VidaMobileMenu';
import { 
  getPrimaryVidaCategories, 
  getSecondaryVidaCategories, 
  secondaryNavItems,
  getAllVidaCategories,
  getActiveVidaCategory
} from '../utils/vidaNavigation';

/**
 * VidaNavbar component
 * 
 * A navigation bar that uses the life-aspect based navigation structure.
 * Replaces the original Navbar component with the new navigation structure.
 */
const VidaNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, toggleCart } = useCart();
  const location = useLocation();
  
  // Get the primary and secondary vida categories
  const primaryCategories = getPrimaryVidaCategories();
  const secondaryCategories = getSecondaryVidaCategories();
  const allCategories = getAllVidaCategories();
  
  // Get the active category based on the current path
  const activeCategory = getActiveVidaCategory(location.pathname);
  
  // Handle scroll event to add shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  
  // Toggle more dropdown
  const toggleMoreDropdown = () => setMoreDropdownOpen(!moreDropdownOpen);
  
  // Check if a path is active
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.includes(path);
  };
  
  return (
    <nav
      className={`bg-white backdrop-blur-sm bg-opacity-95 ${
        scrolled ? 'shadow-lg border-b border-gray-100' : 'shadow-sm'
      } sticky top-0 z-50 transition-all duration-300 font-heading`}
      style={{
        backgroundImage: scrolled ? 'linear-gradient(to right, rgba(255,255,255,0.97), rgba(240,253,250,0.97))' : 'none',
      }}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex justify-between h-[80px] items-center">
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              className="sm:hidden p-2 transition-all duration-300 hover:scale-110 focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu-content"
            >
              <div className="relative w-6 h-6 flex justify-center items-center">
                {/* Animated Hamburger/Close Icon */}
                <motion.span
                  animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 0 : -3 }}
                  transition={{ duration: 0.2 }}
                  className="absolute block h-0.5 w-6 bg-teal"
                  style={{ top: 'calc(50% - 1px)' }}
                />
                <motion.span
                  animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                  transition={{ duration: 0.1 }}
                  className="absolute block h-0.5 w-6 bg-teal"
                  style={{ top: 'calc(50% - 1px)' }}
                />
                <motion.span
                  animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? 0 : 3 }}
                  transition={{ duration: 0.2 }}
                  className="absolute block h-0.5 w-6 bg-teal"
                  style={{ top: 'calc(50% - 1px)' }}
                />
              </div>
            </button>
            
            {/* Logo with "Vida" emphasis */}
            <Link to="/" className="flex items-center md:ml-12">
              <motion.div 
                className="vida-logo text-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="vida-logo-silla">Silla</span>
                <motion.span 
                  className="vida-logo-vida"
                  initial={{ color: "#0D9488" }}
                  animate={{ 
                    color: ["#0D9488", "#1E5959", "#0D9488"],
                    textShadow: ["0 0 0px rgba(13,148,136,0)", "0 0 8px rgba(13,148,136,0.3)", "0 0 0px rgba(13,148,136,0)"]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  Vida
                </motion.span>
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-6 lg:space-x-8">
            {/* Primary Vida Categories */}
            <div className="vida-desktop-nav vida-full-nav space-x-4">
              {primaryCategories.map(category => (
                <VidaNavItem
                  key={category.type}
                  type={category.type}
                  label={category.label}
                  to={category.path}
                  isActive={activeCategory?.type === category.type}
                />
              ))}
              
              {/* More Dropdown */}
              <VidaNavDropdown
                label="Más"
                isOpen={moreDropdownOpen}
                toggleDropdown={toggleMoreDropdown}
                items={secondaryCategories.map(category => ({
                  label: category.label,
                  to: category.path
                }))}
                headerText="Más Categorías"
              />
            </div>
            
            {/* Secondary Navigation Items */}
            <div className="hidden lg:flex items-center space-x-6">
              {secondaryNavItems.map((item, index) => (
                <motion.div key={index} whileHover={{ y: -2 }}>
                  <Link 
                    to={item.path} 
                    className={`${isActive(item.path) ? 'text-teal border-b-2 border-teal' : 'text-gray-800'} nav-item hover:text-teal py-2 px-1 transition-colors duration-200`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:block"
            >
              <button 
                className="p-2 rounded-full bg-teal-extralight hover:bg-teal-light transition-colors duration-200"
                aria-label="Search products"
              >
                <Search className="h-5 w-5 text-teal-dark" />
              </button>
            </motion.div>
            <AccountButton />
            <motion.button 
              className="p-2 relative transition-all duration-200"
              onClick={toggleCart} 
              aria-label={`Open cart (${cartCount} items)`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="h-5 w-5 text-teal transition-colors duration-200" />
              {cartCount > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 bg-teal text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* MiniCart */}
      <MiniCart />

      {/* Mobile Menu */}
      <VidaMobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        vidaCategories={allCategories}
        secondaryItems={secondaryNavItems}
        activePath={location.pathname}
      />
    </nav>
  );
};

export default VidaNavbar;
