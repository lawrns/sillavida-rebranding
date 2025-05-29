import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white"
    >
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Política de Privacidad
            </h1>
            <p className="text-xl text-gray-300">
              Tu privacidad es importante para nosotros
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          <p className="text-gray-600 mb-8">
            Última actualización: {new Date().toLocaleDateString('es-MX')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">1. Información que Recopilamos</h2>
            <p className="text-gray-700 mb-4">
              En SillaVida recopilamos información que nos proporcionas directamente cuando:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Creas una cuenta en nuestro sitio web</li>
              <li>Realizas una compra</li>
              <li>Te suscribes a nuestro boletín</li>
              <li>Nos contactas para soporte al cliente</li>
              <li>Participas en encuestas o promociones</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">2. Cómo Utilizamos tu Información</h2>
            <p className="text-gray-700 mb-4">
              Utilizamos la información recopilada para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Procesar y enviar tus pedidos</li>
              <li>Proporcionar atención al cliente</li>
              <li>Enviarte actualizaciones sobre productos y ofertas</li>
              <li>Mejorar nuestros productos y servicios</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">3. Protección de Datos</h2>
            <p className="text-gray-700 mb-4">
              Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger 
              tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">4. Tus Derechos</h2>
            <p className="text-gray-700 mb-4">
              Tienes derecho a:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Acceder a tu información personal</li>
              <li>Rectificar datos incorrectos</li>
              <li>Cancelar el procesamiento de tus datos</li>
              <li>Oponerte al tratamiento de tus datos</li>
              <li>Portabilidad de datos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">5. Contacto</h2>
            <p className="text-gray-700">
              Para ejercer tus derechos o si tienes preguntas sobre esta política de privacidad, 
              contáctanos en: <a href="mailto:privacidad@sillavida.mx" className="text-black hover:underline">privacidad@sillavida.mx</a>
            </p>
          </section>

          <div className="border-t border-gray-200 pt-8 mt-12">
            <p className="text-sm text-gray-500 text-center">
              Esta política de privacidad está sujeta a cambios. Te notificaremos sobre 
              cualquier modificación significativa.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PrivacyPage;