import React from 'react';
import { motion } from 'framer-motion';

const TermsPage: React.FC = () => {
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
              Términos y Condiciones
            </h1>
            <p className="text-xl text-gray-300">
              Condiciones de uso de SillaVida
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
            <h2 className="text-2xl font-bold text-black mb-4">1. Aceptación de Términos</h2>
            <p className="text-gray-700 mb-4">
              Al acceder y utilizar el sitio web de SillaVida, aceptas estar sujeto a estos 
              términos y condiciones de uso y nuestra política de privacidad.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">2. Productos y Precios</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Todos los precios están en pesos mexicanos (MXN) e incluyen IVA</li>
              <li>Los precios pueden cambiar sin previo aviso</li>
              <li>Las imágenes de productos son referenciales</li>
              <li>Nos reservamos el derecho de limitar cantidades</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">3. Pedidos y Pagos</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Todos los pedidos están sujetos a confirmación y disponibilidad</li>
              <li>El pago debe realizarse al momento de confirmar el pedido</li>
              <li>Aceptamos tarjetas de crédito, débito y transferencias bancarias</li>
              <li>Nos reservamos el derecho de cancelar pedidos por razones válidas</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">4. Envíos y Entregas</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Los tiempos de entrega son estimados y pueden variar</li>
              <li>Los costos de envío se calculan según destino y peso</li>
              <li>La entrega se realiza en días hábiles</li>
              <li>Es responsabilidad del cliente verificar el producto al recibirlo</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">5. Garantías</h2>
            <p className="text-gray-700 mb-4">
              Todos nuestros productos cuentan con garantía contra defectos de fabricación. 
              Los términos específicos de garantía se proporcionan con cada producto.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">6. Limitación de Responsabilidad</h2>
            <p className="text-gray-700 mb-4">
              SillaVida no será responsable por daños indirectos, incidentales o consecuentes 
              que puedan resultar del uso de nuestros productos o servicios.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">7. Contacto</h2>
            <p className="text-gray-700">
              Para preguntas sobre estos términos, contáctanos en: 
              <a href="mailto:legal@sillavida.mx" className="text-black hover:underline"> legal@sillavida.mx</a>
            </p>
          </section>

          <div className="border-t border-gray-200 pt-8 mt-12">
            <p className="text-sm text-gray-500 text-center">
              Estos términos pueden ser modificados en cualquier momento. 
              El uso continuado del sitio implica la aceptación de los cambios.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TermsPage;