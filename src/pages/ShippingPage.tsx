import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, MapPin, Package } from 'lucide-react';

const ShippingPage: React.FC = () => {
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
              Envíos y Entregas
            </h1>
            <p className="text-xl text-gray-300">
              Tu silla perfecta, entregada con cuidado
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
          {/* Shipping Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="bg-black p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Envío Estándar</h3>
              <p className="text-gray-600 mb-4">5-7 días hábiles</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• GRATIS en compras mayores a $3,000</li>
                <li>• $299 en compras menores</li>
                <li>• Cobertura nacional</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="bg-black p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Envío Express</h3>
              <p className="text-gray-600 mb-4">2-3 días hábiles</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• $599 (sin mínimo de compra)</li>
                <li>• Solo CDMX y área metropolitana</li>
                <li>• Entrega con cita programada</li>
              </ul>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Zonas de cobertura</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-black">Ciudad de México y Estado de México</h3>
                  <p className="text-gray-700">Envío estándar y express disponible</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-black">Guadalajara, Monterrey, Puebla</h3>
                  <p className="text-gray-700">Envío estándar 3-5 días hábiles</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-black">Resto del país</h3>
                  <p className="text-gray-700">Envío estándar 7-10 días hábiles</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Proceso de entrega</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold text-black">Confirmación de pedido</h3>
                    <p className="text-gray-700">Recibes confirmación por email con número de seguimiento</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold text-black">Preparación</h3>
                    <p className="text-gray-700">Tu silla se prepara cuidadosamente en nuestro almacén</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold text-black">En camino</h3>
                    <p className="text-gray-700">Notificación cuando tu pedido esté en camino</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                  <div>
                    <h3 className="font-semibold text-black">Entrega</h3>
                    <p className="text-gray-700">Llamada previa para coordinar horario de entrega</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Información importante</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Package className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-black">Empaque especializado</h3>
                  <p className="text-gray-700">Todas las sillas se envían en empaques protectores especializados</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-black">Horarios de entrega</h3>
                  <p className="text-gray-700">Lunes a viernes de 9:00 a 18:00, sábados de 9:00 a 14:00</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Truck className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-black">Entrega en planta baja</h3>
                  <p className="text-gray-700">La entrega estándar incluye hasta planta baja o recepción del edificio</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">¿Necesitas ayuda?</h2>
            <div className="bg-black text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Servicio al Cliente - Envíos</h3>
              <div className="space-y-2">
                <p><strong>Email:</strong> envios@sillavida.mx</p>
                <p><strong>Teléfono:</strong> +52 (55) 1234-5678</p>
                <p><strong>WhatsApp:</strong> +52 (55) 9876-5432</p>
                <p><strong>Horario:</strong> Lunes a viernes, 9:00 - 18:00</p>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ShippingPage;