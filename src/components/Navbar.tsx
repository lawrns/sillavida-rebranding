import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, ChevronDown } from 'lucide-react';
import { getCollections } from '../lib/shopify';
import { useCart } from '../context/CartContext';
import MiniCart from './MiniCart';
import AccountButton from './AccountButton';

interface Collection {
  id: string;
  title: string;
  handle: string;
}

const Navbar = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { cartCount, toggleCart } = useCart();
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [officeChairHandle, setOfficeChairHandle] = useState<string | null>(null);
  const [promocionesHandle, setPromocionesHandle] = useState<string | null>(null);
  const [tiendaHandle, setTiendaHandle] = useState<string | null>(null);
  const [masVendidosHandle, setMasVendidosHandle] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const collectionsData = await getCollections();
        setCollections(collectionsData);
        const officeCollection = collectionsData.find((c: Collection) => c.title.toLowerCase().includes('oficina'));
        const promocionesCollection = collectionsData.find((c: Collection) => c.title.toLowerCase().includes('promociones'));
        const tiendaCollection = collectionsData.find((c: Collection) => c.title.toLowerCase().includes('tienda'));
        const masVendidosCollection = collectionsData.find((c: Collection) => c.title.toLowerCase() === 'más vendidos');
        if (officeCollection) setOfficeChairHandle(officeCollection.handle);
        if (promocionesCollection) setPromocionesHandle(promocionesCollection.handle);
        if (tiendaCollection) setTiendaHandle(tiendaCollection.handle);
        if (masVendidosCollection) setMasVendidosHandle(masVendidosCollection.handle);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError('Failed to load categories');
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleCategories = () => setCategoriesOpen(!categoriesOpen);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.includes(path);
  };

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: { opacity: 1, y: 0, height: 'auto', transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, height: 0, transition: { duration: 0.15 } }
  };

  const mobileMenuVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: 'auto', opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { height: 0, opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } }
  };

  return (
    <nav
      className={`bg-white backdrop-blur-sm bg-opacity-95 ${
        scrolled ? 'shadow-lg border-b border-gray-100' : 'shadow-sm'
      } sticky top-0 z-50 transition-all duration-300`}
      style={{ fontFamily: "'Poppins Medium', sans-serif" }}
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
                  animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 0 : -3 }} // Adjusted y for centering rotation
                  transition={{ duration: 0.2 }}
                  className="absolute block h-0.5 w-6 bg-[#B02020]"
                  style={{ top: 'calc(50% - 1px)' }} // Centered vertically
                />
                <motion.span
                  animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                  transition={{ duration: 0.1 }}
                  className="absolute block h-0.5 w-6 bg-[#B02020]"
                   style={{ top: 'calc(50% - 1px)' }} // Centered vertically
                />
                <motion.span
                  animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? 0 : 3 }} // Adjusted y for centering rotation
                  transition={{ duration: 0.2 }}
                  className="absolute block h-0.5 w-6 bg-[#B02020]"
                   style={{ top: 'calc(50% - 1px)' }} // Centered vertically
                />
              </div>
            </button>
            {/* Logo */}
            <Link to="/" className="flex items-center md:ml-12">
              <img src="/images/logored.png" alt="Silla Vida" className="h-12" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-6 lg:space-x-8">
            <motion.div whileHover={{ y: -2 }}>
              <Link to={tiendaHandle ? `/category/${tiendaHandle}` : "/tienda"} className={`${isActive(tiendaHandle ? `/category/${tiendaHandle}` : "/tienda") ? 'text-[#B02020] border-b-2 border-[#B02020]' : 'text-gray-800'} text-base font-semibold tracking-wide hover:text-[#B02020] py-2 px-1 transition-colors duration-200`}>Tienda</Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link to={promocionesHandle ? `/category/${promocionesHandle}` : "/promociones"} className={`${isActive(promocionesHandle ? `/category/${promocionesHandle}` : "/promociones") ? 'text-[#B02020] border-b-2 border-[#B02020]' : 'text-gray-800'} text-base font-semibold tracking-wide hover:text-[#B02020] py-2 px-1 transition-colors duration-200`}>Promociones</Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link to={masVendidosHandle ? `/category/${masVendidosHandle}` : "/mas-vendidos"} className={`${isActive(masVendidosHandle ? `/category/${masVendidosHandle}` : "/mas-vendidos") ? 'text-[#B02020] border-b-2 border-[#B02020]' : 'text-gray-800'} text-base font-semibold tracking-wide hover:text-[#B02020] py-2 px-1 transition-colors duration-200`}>Más Vendidos</Link>
            </motion.div>

            {/* Categories Dropdown */}
            <div className="relative" ref={categoriesRef}>
              <motion.button 
                whileHover={{ y: -2 }} 
                className="flex items-center text-gray-800 text-base font-semibold tracking-wide hover:text-[#B02020] py-2 px-1 transition-colors duration-200"
                onClick={toggleCategories} 
                aria-expanded={categoriesOpen} 
                aria-haspopup="true" 
                id="categories-button"
              >
                Categorías
                <motion.div 
                  animate={{ rotate: categoriesOpen ? 180 : 0 }} 
                  transition={{ duration: 0.2 }}
                  className="ml-1 flex items-center justify-center"
                >
                  <ChevronDown className={`h-4 w-4 text-[#B02020]`} />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {categoriesOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute z-50 mt-2 w-64 rounded-lg shadow-[0px_8px_20px_rgba(0,0,0,0.15)] bg-white overflow-hidden border border-gray-100"
                    role="menu" aria-orientation="vertical" aria-labelledby="categories-button"
                  >
                    <div className="border-b border-gray-100 bg-gray-50 py-2 px-4">
                      <h3 className="text-sm font-semibold text-gray-800">Nuestras Categorías</h3>
                    </div>
                    <div className="p-4">
                      {loading ? <div className="text-sm text-gray-500">Loading categories...</div> :
                       error ? <div className="text-sm text-red-500">{error}</div> :
                       collections.length === 0 ? <div className="text-sm text-gray-500">No categories found</div> : (
                        <div className="grid grid-cols-1 gap-2">
                          {collections
                            .filter(collection => !collection.title.toLowerCase().includes('promociones') && !collection.title.toLowerCase().includes('tienda') && !collection.title.toLowerCase().includes('más vendidos'))
                            .map((collection) => (
                              <Link 
                                key={collection.id} 
                                to={`/category/${collection.handle}`} 
                                className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-md hover:bg-red-50 hover:text-[#B02020] transition-all duration-200" 
                                role="menuitem" 
                                onClick={() => setCategoriesOpen(false)}
                              >
                                {collection.title}
                              </Link>
                            ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <AccountButton />
            <button className="p-2 relative transition-all duration-200 hover:scale-110" onClick={toggleCart} aria-label={`Open cart (${cartCount} items)`}>
              <ShoppingCart className="h-5 w-5 text-[#B02020] transition-colors duration-200 hover:text-[#B02020]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B02020] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MiniCart */}
      <MiniCart />

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="sm:hidden relative z-50 overflow-hidden bg-white shadow-lg border-t border-gray-100" 
            id="mobile-menu-content"
          >
            <div className="px-3 pt-3 pb-4 space-y-2">
              <Link 
                to={tiendaHandle ? `/category/${tiendaHandle}` : "/tienda"} 
                className={`block px-4 py-3 rounded-md text-base font-semibold ${
                  isActive(tiendaHandle ? `/category/${tiendaHandle}` : "/tienda") 
                    ? 'text-[#B02020] bg-red-50' 
                    : 'text-gray-700'
                } hover:text-[#B02020] hover:bg-red-50 transition-all duration-200`} 
                onClick={() => setMobileMenuOpen(false)}
              >
                Tienda
              </Link>
              <Link 
                to={promocionesHandle ? `/category/${promocionesHandle}` : "/promociones"} 
                className={`block px-4 py-3 rounded-md text-base font-semibold ${
                  isActive(promocionesHandle ? `/category/${promocionesHandle}` : "/promociones") 
                    ? 'text-[#B02020] bg-red-50' 
                    : 'text-gray-700'
                } hover:text-[#B02020] hover:bg-red-50 transition-all duration-200`} 
                onClick={() => setMobileMenuOpen(false)}
              >
                Promociones
              </Link>
              <Link 
                to={masVendidosHandle ? `/category/${masVendidosHandle}` : "/mas-vendidos"} 
                className={`block px-4 py-3 rounded-md text-base font-semibold ${
                  isActive(masVendidosHandle ? `/category/${masVendidosHandle}` : "/mas-vendidos") 
                    ? 'text-[#B02020] bg-red-50' 
                    : 'text-gray-700'
                } hover:text-[#B02020] hover:bg-red-50 transition-all duration-200`} 
                onClick={() => setMobileMenuOpen(false)}
              >
                Más Vendidos
              </Link>
              {/* Mobile Categories */}
              <div ref={categoriesRef}>
                <button 
                  className="flex w-full items-center px-4 py-3 rounded-md text-base font-semibold text-gray-700 hover:text-[#B02020] hover:bg-red-50 transition-all duration-200" 
                  onClick={toggleCategories}
                >
                  Categorías
                  <motion.div 
                    animate={{ rotate: categoriesOpen ? 180 : 0 }} 
                    transition={{ duration: 0.2 }}
                    className="ml-1 flex items-center justify-center"
                  >
                     <ChevronDown className={`h-4 w-4 text-[#B02020]`} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {categoriesOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="pl-4 relative z-50 overflow-hidden"
                    >
                      {loading ? <div className="px-3 py-2 text-sm text-gray-500">Loading categories...</div> :
                       error ? <div className="px-3 py-2 text-sm text-red-500">{error}</div> :
                       collections.length === 0 ? <div className="px-3 py-2 text-sm text-gray-500">No categories found</div> : (
                        collections
                          .filter(collection => !collection.title.toLowerCase().includes('promociones') && !collection.title.toLowerCase().includes('tienda') && !collection.title.toLowerCase().includes('más vendidos'))
                          .map((collection) => (
                            <Link 
                              key={collection.id} 
                              to={`/category/${collection.handle}`} 
                              className="block px-4 py-2.5 text-sm font-medium text-gray-700 rounded-md hover:bg-red-50 hover:text-[#B02020] transition-all duration-200" 
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {collection.title}
                            </Link>
                          ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
