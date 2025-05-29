import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import themeSwitcher from '../utils/theme-switcher';

const ThemeTestPage: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<string>('enhanced');

  useEffect(() => {
    // Get current theme
    setCurrentTheme(themeSwitcher.currentTheme);

    // Listen for theme changes
    const handleThemeChange = (e: CustomEvent) => {
      setCurrentTheme(e.detail.theme);
    };

    document.addEventListener('themeChanged', handleThemeChange as EventListener);

    return () => {
      document.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-teal">
          Prueba de Temas SillaVida
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Esta página muestra cómo se ven los diferentes componentes con el tema actual.
          Usa el botón de abajo para cambiar entre los temas mejorado y original.
        </p>
        <div className="mt-6 flex justify-center">
          <ThemeToggle />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-12">
        <h2 className="text-2xl font-heading font-semibold mb-6 text-teal">Botones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-heading mb-4 text-teal">Botones Primarios</h3>
            <div className="space-y-4">
              <button className="bg-teal text-white px-6 py-3 rounded-md font-medium hover:bg-teal-light transition-colors duration-300">
                Botón Primario
              </button>
              <button className="bg-teal text-white px-6 py-3 rounded-md font-medium opacity-50 cursor-not-allowed">
                Botón Deshabilitado
              </button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-heading mb-4 text-teal">Botones Secundarios</h3>
            <div className="space-y-4">
              <button className="bg-white text-teal px-6 py-3 rounded-md font-medium border border-teal hover:bg-teal-extralight transition-colors duration-300">
                Botón Secundario
              </button>
              <button className="bg-sage text-white px-6 py-3 rounded-md font-medium hover:bg-sage-light transition-colors duration-300">
                Botón Alternativo
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-12">
        <h2 className="text-2xl font-heading font-semibold mb-6 text-teal">Tarjetas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-heading mb-2 text-teal">Tarjeta Estándar</h3>
            <p className="text-gray-600 mb-4">Esta es una tarjeta estándar con fondo blanco.</p>
            <button className="text-teal hover:text-teal-light transition-colors duration-300 font-medium">
              Ver más
            </button>
          </div>
          <div className="bg-beige-light p-6 rounded-lg shadow-md border border-beige hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-heading mb-2 text-teal">Tarjeta Beige</h3>
            <p className="text-gray-600 mb-4">Esta es una tarjeta con fondo beige claro.</p>
            <button className="text-teal hover:text-teal-light transition-colors duration-300 font-medium">
              Ver más
            </button>
          </div>
          <div className="bg-teal p-6 rounded-lg shadow-md text-white hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-heading mb-2">Tarjeta Teal</h3>
            <p className="text-beige-light mb-4">Esta es una tarjeta con fondo teal y texto claro.</p>
            <button className="text-white hover:text-beige-light transition-colors duration-300 font-medium">
              Ver más
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-12">
        <h2 className="text-2xl font-heading font-semibold mb-6 text-teal">Alertas y Notificaciones</h2>
        <div className="space-y-4">
          <div className="bg-teal-extralight border-l-4 border-teal p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-teal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-teal-dark">
                  Esta es una alerta informativa con el color teal.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-sage-extralight border-l-4 border-sage p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-sage" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-sage-dark">
                  Esta es una alerta de éxito con el color sage.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-terracotta-extralight border-l-4 border-terracotta p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-terracotta" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-terracotta-dark">
                  Esta es una alerta de advertencia con el color terracotta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-12">
        <h2 className="text-2xl font-heading font-semibold mb-6 text-teal">Formularios</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal focus:border-teal"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal focus:border-teal"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal focus:border-teal"
                placeholder="Tu mensaje"
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-teal text-white px-6 py-3 rounded-md font-medium hover:bg-teal-light transition-colors duration-300"
              >
                Enviar Mensaje
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-heading font-semibold mb-6 text-teal">Tipografía</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-heading mb-2 text-teal">Encabezados</h3>
              <h1 className="text-4xl font-heading font-bold text-gray-900 mb-2">Encabezado 1</h1>
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">Encabezado 2</h2>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">Encabezado 3</h3>
              <h4 className="text-xl font-heading font-bold text-gray-900 mb-2">Encabezado 4</h4>
              <h5 className="text-lg font-heading font-bold text-gray-900 mb-2">Encabezado 5</h5>
              <h6 className="text-base font-heading font-bold text-gray-900">Encabezado 6</h6>
            </div>
            <div>
              <h3 className="text-xl font-heading mb-2 text-teal">Texto</h3>
              <p className="text-base text-gray-700 mb-2">
                Este es un párrafo de texto normal. SillaVida ofrece sillas ergonómicas de alta calidad para mejorar tu postura y bienestar.
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Este es un texto más pequeño, ideal para notas o descripciones secundarias.
              </p>
              <p className="text-base text-gray-700">
                Este texto incluye un <a href="#" className="text-teal hover:text-teal-light">enlace</a> con los colores del tema.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-heading mb-2 text-teal">Colores de Texto</h3>
              <p className="text-teal mb-1">Texto en color teal</p>
              <p className="text-sage mb-1">Texto en color sage</p>
              <p className="text-terracotta mb-1">Texto en color terracotta</p>
              <p className="text-beige-dark mb-1">Texto en color beige oscuro</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ThemeTestPage;
