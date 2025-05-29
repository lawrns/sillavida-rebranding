import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white flex items-center justify-center"
    >
      <div className="max-w-md mx-auto text-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-8xl font-bold text-black mb-4">404</h1>
            <h2 className="text-2xl font-bold text-black mb-4">Página no encontrada</h2>
            <p className="text-gray-600 mb-8">
              La página que buscas no existe o ha sido movida. 
              ¿Te ayudamos a encontrar lo que necesitas?
            </p>
          </div>

          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors w-full justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Ir al inicio
            </Link>
            
            <Link
              to="/category/sillavida-esencial"
              className="inline-flex items-center border border-black text-black px-6 py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition-colors w-full justify-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Ver productos
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-gray-600 px-6 py-3 rounded-lg hover:text-black transition-colors w-full justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver atrás
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">¿Necesitas ayuda?</p>
            <Link
              to="/contact"
              className="text-black hover:underline font-medium"
            >
              Contacta a nuestro equipo
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;