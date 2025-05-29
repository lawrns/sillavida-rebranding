import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, CheckCircle } from 'lucide-react';

const WarrantyPage: React.FC = () => {
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
              Garantía SillaVida
            </h1>
            <p className="text-xl text-gray-300">
              Protección completa para tu inversión en bienestar
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Warranty Coverage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-black p-4 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">5 Años de Garantía</h3>
              <p className="text-gray-600">Estructura y mecanismos principales</p>
            </div>
            <div className="text-center">
              <div className="bg-black p-4 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">3 Años</h3>
              <p className="text-gray-600">Tapicería y componentes de desgaste</p>
            </div>
            <div className="text-center">
              <div className="bg-black p-4 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">30 Días</h3>
              <p className="text-gray-600">Satisfacción garantizada o devolución</p>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">¿Qué cubre nuestra garantía?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-black">Defectos de fabricación</h3>
                  <p className="text-gray-700">Problemas en materiales o construcción bajo uso normal</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-black">Mecanismos de ajuste</h3>
                  <p className="text-gray-700">Sistemas de altura, inclinación y soporte lumbar</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-black">Estructura principal</h3>
                  <p className="text-gray-700">Base, respaldo y brazos de la silla</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">¿Qué NO cubre la garantía?</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Daños por uso indebido o accidental</li>
              <li>Desgaste normal por uso prolongado</li>
              <li>Daños causados por modificaciones no autorizadas</li>
              <li>Daños por exposición a condiciones extremas</li>
              <li>Daños cosméticos que no afecten la funcionalidad</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Cómo hacer válida tu garantía</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                <li>Conserva tu comprobante de compra original</li>
                <li>Contacta nuestro servicio al cliente en <strong>garantia@sillavida.mx</strong></li>
                <li>Proporciona fotos del problema y número de serie</li>
                <li>Nuestro equipo evaluará tu caso en 48 horas</li>
                <li>Si procede, coordinaremos reparación o reemplazo</li>
              </ol>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Contacto para garantías</h2>
            <div className="bg-black text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Servicio de Garantías</h3>
              <div className="space-y-2">
                <p><strong>Email:</strong> garantia@sillavida.mx</p>
                <p><strong>Teléfono:</strong> +52 (55) 1234-5678</p>
                <p><strong>Horario:</strong> Lunes a viernes, 9:00 - 18:00</p>
                <p><strong>Tiempo de respuesta:</strong> 48 horas máximo</p>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WarrantyPage;