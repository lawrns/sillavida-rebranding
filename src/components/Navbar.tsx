import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, Search, ChevronDown } from 'lucide-react';
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

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const collectionsData = await getCollections();
        setCollections(collectionsData);
        
        // Find collection handles for office chairs, promociones, and tienda
        const officeCollection = collectionsData.find(
          (collection: Collection) => collection.title.toLowerCase().includes('oficina')
        );
        const promocionesCollection = collectionsData.find(
          (collection: Collection) => collection.title.toLowerCase().includes('promociones')
        );
        const tiendaCollection = collectionsData.find(
          (collection: Collection) => collection.title.toLowerCase().includes('tienda')
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

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <button 
              className="sm:hidden p-2"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center md:ml-12">
              <img src="/images/logored.png" alt="Silla Vida" className="h-12" />
            </Link>
          </div>
          
          <div className="hidden sm:flex space-x-8">
            {/* Categories Dropdown */}
            <div className="relative" ref={categoriesRef}>
              <button 
                className="flex items-center text-gray-700 hover:text-red-600"
                onClick={toggleCategories}
                aria-expanded={categoriesOpen}
                aria-haspopup="true"
              >
                Categorías
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {categoriesOpen && (
                <div className="absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {loading ? (
                      <div className="px-4 py-2 text-sm text-gray-500">Loading categories...</div>
                    ) : error ? (
                      <div className="px-4 py-2 text-sm text-red-500">{error}</div>
                    ) : collections.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-gray-500">No categories found</div>
                    ) : (
                      collections.map((collection) => (
                        <Link
                          key={collection.id}
                          to={`/category/${collection.handle}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
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
            
            <Link 
              to={promocionesHandle ? `/category/${promocionesHandle}` : "/tienda"} 
              className="text-gray-700 hover:text-red-600"
            >
              Promociones
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2">
              <Search className="h-5 w-5 text-gray-600" />
            </button>
            <AccountButton />
            <button 
              className="p-2 relative"
              onClick={toggleCart}
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
            {/* Mobile Categories */}
            <div ref={categoriesRef}>
              <button 
                className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
                onClick={toggleCategories}
              >
                Categorías
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
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
                    collections.map((collection) => (
                      <Link
                        key={collection.id}
                        to={`/category/${collection.handle}`}
                        className="block px-3 py-2 text-sm text-gray-700 hover:text-red-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {collection.title}
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
            
            <Link 
              to={promocionesHandle ? `/category/${promocionesHandle}` : "/tienda"} 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Promociones
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
