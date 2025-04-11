import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, Search } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <button className="sm:hidden p-2">
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center md:ml-12">
              <img src="/images/logored.png" alt="Silla Vida" className="h-12" />
            </Link>
          </div>
          
          <div className="hidden sm:flex space-x-8">
            <Link to="/tienda" className="text-gray-700 hover:text-red-600">
              Tienda
            </Link>
            <Link to="/oficina" className="text-gray-700 hover:text-red-600">
              Sillas de Oficina
            </Link>
            <Link to="/gamer" className="text-gray-700 hover:text-red-600">
              Sillas Gamer
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2">
              <Search className="h-5 w-5 text-gray-600" />
            </button>
            <Link to="/carrito" className="p-2">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;