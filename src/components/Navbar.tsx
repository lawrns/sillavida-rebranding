import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial check in case page is already scrolled
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const collectionsData = await getCollections();
        setCollections(collectionsData);
        
        // Find collection handles for office chairs, promociones, tienda, and mas vendidos
        const officeCollection = collectionsData.find(
          (collection: Collection) => collection.title.toLowerCase().includes('oficina')
        );
        const promocionesCollection = collectionsData.find(
          (collection: Collection) => collection.title.toLowerCase().includes('promociones')
        );
        const tiendaCollection = collectionsData.find(
          (collection: Collection) => collection.title.toLowerCase().includes('tienda')
        );
        const masVendidosCollection = collectionsData.find(
          (collection: Collection) => collection.title.toLowerCase().includes('mas vendidos') || 
                                      collection.title.toLowerCase().includes('más vendidos')
        );
        
        if (officeCollection) {
          setOfficeChairHandle(officeCollection.handle);
        }
        
        if (promocionesCollection) {
          setPromocionesHandle(promocionesCollection.handle);
        }
        
        if (tiendaCollection) {
          setTiendaHandle(tiendaCollection.handle);
        }
        
        if (masVendidosCollection) {
          setMasVendidosHandle(masVendidosCollection.handle);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError('Failed to load categories');
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleCategories = () => {
    setCategoriesOpen(!categoriesOpen);
  };
  
  // Helper function to check if a link is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.includes(path);
  };

  return (
    <nav className={`bg-gradient-to-b from-white to-[#FAFAFA] ${scrolled ? 'shadow-[0_4px_6px_rgba(0,0,0,0.1)]' : 'shadow-[0_2px_4px_rgba(0,0,0,0.05)]'} sticky top-0 z-50 transition-shadow duration-300`} style={{ fontFamily: "'Poppins Medium', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-12 sm:px-12 lg:px-12">
        <div className="flex justify-between h-[72px] items-center">
          <div className="flex items-center">
            <button 
              className="sm:hidden p-2 transition-all duration-300 hover:scale-110 focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-6 flex justify-center items-center">
                {mobileMenuOpen ? (
                  <div className="relative">
                    <span className="absolute block h-0.5 w-6 bg-[#B02020] transform transition-all duration-300 rotate-45"></span>
                    <span className="absolute block h-0.5 w-6 bg-[#B02020] transform transition-all duration-300 -rotate-45"></span>
                  </div>
                ) : (
                  <div className="relative">
                    <span className="absolute top-1 block h-0.5 w-6 bg-[#B02020] transform transition-all duration-300"></span>
                    <span className="absolute top-3 block h-0.5 w-6 bg-[#B02020] transform transition-all duration-300"></span>
                    <span className="absolute top-5 block h-0.5 w-6 bg-[#B02020] transform transition-all duration-300"></span>
                  </div>
                )}
              </div>
            </button>
            <Link to="/" className="flex items-center md:ml-12">
              <img src="/images/logored.png" alt="Silla Vida" className="h-12" />
            </Link>
          </div>
          
          <div className="hidden sm:flex space-x-8">
            {/* Main Navigation Items in specified order: Tienda, Promociones, Mas Vendidos, Categorías */}
            <Link 
              to={tiendaHandle ? `/category/${tiendaHandle}` : "/tienda"} 
              className={`${isActive(tiendaHandle ? `/category/${tiendaHandle}` : "/tienda") ? 'text-[#B02020] border-b-2 border-[#B02020]' : 'text-black'} text-base font-semibold tracking-wide hover:text-[#B02020] transition-all duration-200 hover:-translate-y-0.5`}
            >
              Tienda
            </Link>
            
            <Link 
              to={promocionesHandle ? `/category/${promocionesHandle}` : "/promociones"} 
              className={`${isActive(promocionesHandle ? `/category/${promocionesHandle}` : "/promociones") ? 'text-[#B02020] border-b-2 border-[#B02020]' : 'text-black'} text-base font-semibold tracking-wide hover:text-[#B02020] transition-all duration-200 hover:-translate-y-0.5`}
            >
              Promociones
            </Link>
            
            <Link 
              to={masVendidosHandle ? `/category/${masVendidosHandle}` : "/mas-vendidos"} 
              className={`${isActive(masVendidosHandle ? `/category/${masVendidosHandle}` : "/mas-vendidos") ? 'text-[#B02020] border-b-2 border-[#B02020]' : 'text-black'} text-base font-semibold tracking-wide hover:text-[#B02020] transition-all duration-200 hover:-translate-y-0.5`}
            >
              Mas Vendidos
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative" ref={categoriesRef}>
              <button 
                className="flex items-center text-black text-base font-semibold tracking-wide hover:text-[#B02020] transition-transform duration-200 hover:-translate-y-0.5"
                onClick={toggleCategories}
                aria-expanded={categoriesOpen}
                aria-haspopup="true"
              >
                Categorías
                <ChevronDown className={`ml-1 h-4 w-4 text-[#B02020] transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {categoriesOpen && (
                <div className="absolute z-50 mt-2 w-48 rounded-lg shadow-[0px_8px_12px_rgba(0,0,0,0.1)] bg-white overflow-hidden">
                  <div className="py-2" role="menu" aria-orientation="vertical">
                    {loading ? (
                      <div className="px-4 py-2 text-sm text-gray-500">Loading categories...</div>
                    ) : error ? (
                      <div className="px-4 py-2 text-sm text-red-500">{error}</div>
                    ) : collections.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-gray-500">No categories found</div>
                    ) : (
                      collections
                        .filter(collection => 
                          !collection.title.toLowerCase().includes('promociones') &&
                          !collection.title.toLowerCase().includes('tienda') &&
                          !collection.title.toLowerCase().includes('mas vendidos') &&
                          !collection.title.toLowerCase().includes('más vendidos')
                        )
                        .map((collection) => (
                          <Link
                            key={collection.id}
                            to={`/category/${collection.handle}`}
                            className="block px-4 py-2 text-sm font-semibold text-black hover:bg-[#F3F3F3] hover:text-[#B02020] transition-all duration-200"
                            role="menuitem"
                          >
                            {collection.title}
                          </Link>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <AccountButton />
            <button 
              className="p-2 relative transition-all duration-200 hover:scale-110"
              onClick={toggleCart}
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5 text-[#B02020] transition-colors duration-200 hover:text-[#B02020]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B02020] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* MiniCart */}
      <MiniCart />
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden relative z-50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile Navigation Items in specified order: Tienda, Promociones, Mas Vendidos, Categorías */}
            <Link 
              to={tiendaHandle ? `/category/${tiendaHandle}` : "/tienda"} 
              className={`block px-3 py-2 rounded-md text-base font-semibold ${isActive(tiendaHandle ? `/category/${tiendaHandle}` : "/tienda") ? 'text-[#B02020] bg-[#F9F0F0]' : 'text-black'} hover:text-[#B02020] hover:bg-[#F3F3F3] transition-all duration-200`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Tienda
            </Link>
            
            <Link 
              to={promocionesHandle ? `/category/${promocionesHandle}` : "/promociones"} 
              className={`block px-3 py-2 rounded-md text-base font-semibold ${isActive(promocionesHandle ? `/category/${promocionesHandle}` : "/promociones") ? 'text-[#B02020] bg-[#F9F0F0]' : 'text-black'} hover:text-[#B02020] hover:bg-[#F3F3F3] transition-all duration-200`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Promociones
            </Link>
            
            <Link 
              to={masVendidosHandle ? `/category/${masVendidosHandle}` : "/mas-vendidos"} 
              className={`block px-3 py-2 rounded-md text-base font-semibold ${isActive(masVendidosHandle ? `/category/${masVendidosHandle}` : "/mas-vendidos") ? 'text-[#B02020] bg-[#F9F0F0]' : 'text-black'} hover:text-[#B02020] hover:bg-[#F3F3F3] transition-all duration-200`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Mas Vendidos
            </Link>
            
            {/* Mobile Categories */}
            <div ref={categoriesRef}>
              <button 
                className="flex w-full items-center px-3 py-2 rounded-md text-base font-semibold text-black hover:text-[#B02020] hover:bg-[#F3F3F3] transition-all duration-200"
                onClick={toggleCategories}
              >
                Categorías
                <ChevronDown className={`ml-1 h-4 w-4 text-[#B02020] transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {categoriesOpen && (
                <div className="pl-4 relative z-50">
                  {loading ? (
                    <div className="px-3 py-2 text-sm text-gray-500">Loading categories...</div>
                  ) : error ? (
                    <div className="px-3 py-2 text-sm text-red-500">{error}</div>
                  ) : collections.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500">No categories found</div>
                  ) : (
                    collections
                      .filter(collection => 
                        !collection.title.toLowerCase().includes('promociones') &&
                        !collection.title.toLowerCase().includes('tienda') &&
                        !collection.title.toLowerCase().includes('mas vendidos') &&
                        !collection.title.toLowerCase().includes('más vendidos')
                      )
                      .map((collection) => (
                        <Link
                          key={collection.id}
                          to={`/category/${collection.handle}`}
                          className="block px-3 py-2 text-sm font-semibold text-black hover:bg-[#F3F3F3] hover:text-[#B02020] transition-all duration-200"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {collection.title}
                        </Link>
                      ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
