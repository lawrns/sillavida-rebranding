import React from 'react';
import { motion } from 'framer-motion';

const CookiesPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white"
    >
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Política de Cookies
            </h1>
            <p className="text-xl text-gray-300">
              Información sobre el uso de cookies en SillaVida
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">¿Qué son las cookies?</h2>
            <p className="text-gray-700 mb-4">
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo 
              cuando visitas nuestro sitio web. Nos ayudan a mejorar tu experiencia de navegación.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Tipos de cookies que utilizamos</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-black">Cookies esenciales</h3>
                <p className="text-gray-700">Necesarias para el funcionamiento básico del sitio web.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black">Cookies de rendimiento</h3>
                <p className="text-gray-700">Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black">Cookies de funcionalidad</h3>
                <p className="text-gray-700">Permiten recordar tus preferencias y personalizar tu experiencia.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Control de cookies</h2>
            <p className="text-gray-700 mb-4">
              Puedes controlar y eliminar las cookies a través de la configuración de tu navegador. 
              Sin embargo, esto puede afectar la funcionalidad del sitio web.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Contacto</h2>
            <p className="text-gray-700">
              Para más información sobre nuestra política de cookies, contáctanos en: 
              <a href="mailto:privacidad@sillavida.mx" className="text-black hover:underline"> privacidad@sillavida.mx</a>
            </p>
          </section>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CookiesPage;