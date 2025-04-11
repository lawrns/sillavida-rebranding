import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Silla Vida</h3>
            <p className="text-gray-400">
              Comodidad y estilo para tu espacio de trabajo y gaming.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li><Link to="/tienda" className="text-gray-400 hover:text-white">Tienda</Link></li>
              <li><Link to="/oficina" className="text-gray-400 hover:text-white">Sillas de Oficina</Link></li>
              <li><Link to="/gamer" className="text-gray-400 hover:text-white">Sillas Gamer</Link></li>
              <li><Link to="/nosotros" className="text-gray-400 hover:text-white">Nosotros</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Ayuda</h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-400 hover:text-white">Preguntas Frecuentes</Link></li>
              <li><Link to="/envios" className="text-gray-400 hover:text-white">Envíos</Link></li>
              <li><Link to="/garantia" className="text-gray-400 hover:text-white">Garantía</Link></li>
              <li><Link to="/contacto" className="text-gray-400 hover:text-white">Contacto</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Silla Vida. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;