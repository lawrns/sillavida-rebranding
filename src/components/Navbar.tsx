import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ChevronDown } from 'lucide-react';
import { getCollections } from '../lib/shopify';
import { useMinimalCart } from '../hooks/useMinimalCart';
import { useEventBus } from '../hooks/useComponentComposition';
import MiniCart from './MiniCart';
import { errorHandler } from '../utils/errorHandler';

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
  const { cartCount, toggleCart } = useMinimalCart();
  const eventBus = useEventBus();
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [promocionesHandle, setPromocionesHandle] = useState<string | null>(null);
  const [tiendaHandle, setTiendaHandle] = useState<string | null>(null);
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

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const collectionsData = await getCollections();
        setCollections(collectionsData);
        const promocionesCollection = collectionsData.find((c: Collection) => c.title.toLowerCase().includes('promociones'));
        const tiendaCollection = collectionsData.find((c: Collection) => c.title.toLowerCase().includes('tienda'));
        if (promocionesCollection) setPromocionesHandle(promocionesCollection.handle);
        if (tiendaCollection) setTiendaHandle(tiendaCollection.handle);
        setLoading(false);
      } catch (err) {
        errorHandler.handleError(err as Error, {
          component: 'Navbar',
          action: 'fetchCollections'
        });
        setError('No se pudieron cargar las categorías');
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
      className={`shadow-md z-50 sticky top-0 transition-all duration-300 font-heading`}
      style={{ backgroundColor: '#1A2A3A' }}
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
                  className="absolute block h-0.5 w-6 bg-white"
                  style={{ top: 'calc(50% - 1px)' }}
                />
                <motion.span
                  animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                  transition={{ duration: 0.1 }}
                  className="absolute block h-0.5 w-6 bg-white"
                   style={{ top: 'calc(50% - 1px)' }}
                />
                <motion.span
                  animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? 0 : 3 }}
                  transition={{ duration: 0.2 }}
                  className="absolute block h-0.5 w-6 bg-white"
                   style={{ top: 'calc(50% - 1px)' }}
                />
              </div>
            </button>
            {/* Logo with "Vida" emphasis */}
            <Link to="/" className="flex items-center md:ml-12">
              <motion.div
                className="vida-logo text-2xl text-white"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="vida-logo-silla" style={{ color: '#5CB85C' }}>Silla</span>
                <motion.span
                  className="vida-logo-vida"
                  initial={{ color: "#FFFFFF" }}
                  animate={{
                    color: ["#FFFFFF", "#5CB85C", "#FFFFFF"],
                    textShadow: ["0 0 0px rgba(92,184,92,0)", "0 0 8px rgba(92,184,92,0.3)", "0 0 0px rgba(92,184,92,0)"]
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
            <motion.div whileHover={{ y: -2 }}>
              <Link 
                to="/category/tienda" 
                className={`nav-item py-2 px-1 transition-colors duration-200 ${isActive("/category/tienda") ? 'border-b-2' : ''}`}
                style={{ 
                  color: isActive("/category/tienda") ? '#5CB85C' : '#FFFFFF',
                  borderColor: isActive("/category/tienda") ? '#5CB85C' : 'transparent'
                }}
                onMouseEnter={(e) => e.target.style.color = '#5CB85C'}
                onMouseLeave={(e) => e.target.style.color = isActive("/category/tienda") ? '#5CB85C' : '#FFFFFF'}
              >
                Tienda
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link 
                to={promocionesHandle ? `/category/${promocionesHandle}` : "/promociones"} 
                className={`nav-item py-2 px-1 transition-colors duration-200 ${isActive(promocionesHandle ? `/category/${promocionesHandle}` : "/promociones") ? 'border-b-2' : ''}`}
                style={{ 
                  color: isActive(promocionesHandle ? `/category/${promocionesHandle}` : "/promociones") ? '#5CB85C' : '#FFFFFF',
                  borderColor: isActive(promocionesHandle ? `/category/${promocionesHandle}` : "/promociones") ? '#5CB85C' : 'transparent'
                }}
                onMouseEnter={(e) => e.target.style.color = '#5CB85C'}
                onMouseLeave={(e) => e.target.style.color = isActive(promocionesHandle ? `/category/${promocionesHandle}` : "/promociones") ? '#5CB85C' : '#FFFFFF'}
              >
                Promociones
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link 
                to="/category/mas-vendidos" 
                className={`nav-item py-2 px-1 transition-colors duration-200 ${isActive("/category/mas-vendidos") ? 'border-b-2' : ''}`}
                style={{ 
                  color: isActive("/category/mas-vendidos") ? '#5CB85C' : '#FFFFFF',
                  borderColor: isActive("/category/mas-vendidos") ? '#5CB85C' : 'transparent'
                }}
                onMouseEnter={(e) => e.target.style.color = '#5CB85C'}
                onMouseLeave={(e) => e.target.style.color = isActive("/category/mas-vendidos") ? '#5CB85C' : '#FFFFFF'}
              >
                Más Vendidos
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link 
                to="/educacion/por-que-invertir-en-silla-ergonomica" 
                className={`nav-item py-2 px-1 transition-colors duration-200 ${isActive("/educacion/por-que-invertir-en-silla-ergonomica") ? 'border-b-2' : ''}`}
                style={{ 
                  color: isActive("/educacion/por-que-invertir-en-silla-ergonomica") ? '#5CB85C' : '#FFFFFF',
                  borderColor: isActive("/educacion/por-que-invertir-en-silla-ergonomica") ? '#5CB85C' : 'transparent'
                }}
                onMouseEnter={(e) => e.target.style.color = '#5CB85C'}
                onMouseLeave={(e) => e.target.style.color = isActive("/educacion/por-que-invertir-en-silla-ergonomica") ? '#5CB85C' : '#FFFFFF'}
              >
                Ergonomía
              </Link>
            </motion.div>

            {/* Categories Dropdown */}
            <div className="relative" ref={categoriesRef}>
              <motion.button
                whileHover={{ y: -2 }}
                className="flex items-center nav-item py-2 px-1 transition-colors duration-200"
                style={{ color: '#FFFFFF' }}
                onMouseEnter={(e) => e.target.style.color = '#5CB85C'}
                onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}
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
                  <ChevronDown className={`h-4 w-4`} style={{ color: '#5CB85C' }} />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {categoriesOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute z-50 mt-2 w-64 rounded-lg shadow-[0px_8px_20px_rgba(0,0,0,0.15)] bg-white overflow-hidden border border-neutral-100"
                    role="menu" aria-orientation="vertical" aria-labelledby="categories-button"
                  >
                    <div className="border-b border-neutral-100 bg-neutral-50 py-2 px-4">
                      <h3 className="text-sm font-heading font-semibold" style={{ color: '#1A2A3A' }}>Nuestras Categorías</h3>
                    </div>
                    <div className="p-4">
                      {loading ? <div className="text-sm" style={{ color: '#333333' }}>Loading categories...</div> :
                       error ? <div className="text-sm" style={{ color: '#D9534F' }}>{error}</div> :
                       collections.length === 0 ? <div className="text-sm" style={{ color: '#333333' }}>No categories found</div> : (
                        <div className="grid grid-cols-1 gap-2">
                          {collections
                            .filter(collection => !collection.title.toLowerCase().includes('promociones') && !collection.title.toLowerCase().includes('tienda') && !collection.title.toLowerCase().includes('más vendidos'))
                            .map((collection) => (
                              <Link
                                key={collection.id}
                                to={`/category/${collection.handle}`}
                                className="block px-3 py-2.5 text-sm font-heading font-medium rounded-md transition-all duration-200"
                                style={{ color: '#333333' }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = 'rgba(92, 184, 92, 0.1)';
                                  e.target.style.color = '#5CB85C';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = 'transparent';
                                  e.target.style.color = '#333333';
                                }}
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
            <motion.button
              className="p-2 relative transition-all duration-200"
              onClick={() => {
                toggleCart();
                // Emit event for analytics or other systems
                eventBus.emit('cart:toggle', { cartCount });
              }}
              aria-label={`Open cart (${cartCount} items)`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="h-5 w-5 transition-colors duration-200" style={{ color: '#5CB85C' }} />
              {cartCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  style={{ backgroundColor: '#D9534F' }}
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

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="sm:hidden relative z-50 overflow-hidden shadow-lg border-t border-neutral-800"
            style={{ backgroundColor: '#1A2A3A' }}
            id="mobile-menu-content"
          >
            <div className="px-3 pt-3 pb-4 space-y-3">
              <Link
                to="/category/tienda"
                className={`block px-4 py-4 rounded-md nav-item text-base transition-all duration-200`}
                style={{ 
                  color: isActive("/category/tienda") ? '#5CB85C' : '#FFFFFF',
                  backgroundColor: isActive("/category/tienda") ? 'rgba(92, 184, 92, 0.1)' : 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#5CB85C';
                  e.target.style.backgroundColor = 'rgba(92, 184, 92, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = isActive("/category/tienda") ? '#5CB85C' : '#FFFFFF';
                  e.target.style.backgroundColor = isActive("/category/tienda") ? 'rgba(92, 184, 92, 0.1)' : 'transparent';
                }}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Tienda"
              >
                Tienda
              </Link>
              <Link
                to={promocionesHandle ? `/category/${promocionesHandle}` : "/promociones"}
                className={`block px-4 py-4 rounded-md nav-item text-base ${
                  isActive(promocionesHandle ? `/category/${promocionesHandle}` : "/promociones")
                    ? 'text-accent bg-accent/10'
                    : 'text-black'
                } hover:text-accent hover:bg-accent/10 transition-all duration-200`}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Promociones"
              >
                Promociones
              </Link>
              <Link
                to="/category/mas-vendidos"
                className={`block px-4 py-4 rounded-md nav-item text-base ${
                  isActive("/category/mas-vendidos")
                    ? 'text-accent bg-accent/10'
                    : 'text-black'
                } hover:text-accent hover:bg-accent/10 transition-all duration-200`}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Más Vendidos"
              >
                Más Vendidos
              </Link>
              <Link
                to="/educacion/por-que-invertir-en-silla-ergonomica"
                className={`block px-4 py-4 rounded-md nav-item text-base ${
                  isActive("/educacion/por-que-invertir-en-silla-ergonomica")
                    ? 'text-accent bg-accent/10'
                    : 'text-black'
                } hover:text-accent hover:bg-accent/10 transition-all duration-200`}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Ergonomía"
              >
                Ergonomía
              </Link>
              {/* Mobile Categories */}
              <div ref={categoriesRef}>
                <button
                  className="flex w-full items-center px-4 py-4 rounded-md nav-item text-base transition-all duration-200"
                  style={{ color: '#FFFFFF' }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#5CB85C';
                    e.target.style.backgroundColor = 'rgba(92, 184, 92, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#FFFFFF';
                    e.target.style.backgroundColor = 'transparent';
                  }}
                  onClick={toggleCategories}
                  aria-expanded={categoriesOpen}
                  aria-controls="mobile-categories-dropdown"
                >
                  Categorías
                  <motion.div
                    animate={{ rotate: categoriesOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-1 flex items-center justify-center"
                  >
                     <ChevronDown className={`h-5 w-5`} style={{ color: '#5CB85C' }} />
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
                      id="mobile-categories-dropdown"
                    >
                      {loading ? <div className="px-3 py-3 text-base" style={{ color: '#FFFFFF' }}>Loading categories...</div> :
                       error ? <div className="px-3 py-3 text-base" style={{ color: '#D9534F' }}>{error}</div> :
                       collections.length === 0 ? <div className="px-3 py-3 text-base" style={{ color: '#FFFFFF' }}>No categories found</div> : (
                        collections
                          .filter(collection => !collection.title.toLowerCase().includes('promociones') && !collection.title.toLowerCase().includes('tienda') && !collection.title.toLowerCase().includes('más vendidos'))
                          .map((collection) => (
                            <Link
                              key={collection.id}
                              to={`/category/${collection.handle}`}
                              className="block px-4 py-3.5 text-base font-heading font-medium rounded-md transition-all duration-200"
                              style={{ color: '#FFFFFF' }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'rgba(92, 184, 92, 0.1)';
                                e.target.style.color = '#5CB85C';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#FFFFFF';
                              }}
                              onClick={() => setMobileMenuOpen(false)}
                              aria-label={collection.title}
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
