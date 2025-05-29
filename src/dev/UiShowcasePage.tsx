import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Info,
  X
} from 'lucide-react';

const UiShowcasePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('header');

  const sections = [
    { id: 'header', name: 'Header & Navigation' },
    { id: 'animations', name: 'UI Animations' },
    { id: 'cart', name: 'Cart & Checkout' },
    { id: 'accessibility', name: 'Accessibility' },
  ];

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    // Smoothly scroll to the section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Mejoras de UI/UX | Silla Vida</title>
      </Helmet>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Mejoras de Interfaz y Experiencia
            </motion.h1>
            <motion.p 
              className="max-w-xl mt-5 mx-auto text-xl text-gray-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Descubre las mejoras visuales y de experiencia de usuario implementadas en Silla Vida
            </motion.p>
          </div>
        </div>
      </div>

      {/* Navigation between sections */}
      <div className="sticky top-[80px] z-30 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-3 gap-x-6">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`whitespace-nowrap px-3 py-2 font-medium text-sm rounded-md ${
                  activeSection === section.id
                    ? 'bg-red-50 text-red-700'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
                onClick={() => handleSectionChange(section.id)}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-24">
          {/* Header Section */}
          <motion.section 
            id="header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 sm:p-10 rounded-xl shadow-md"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Mejoras en la Navegación</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Barra de Navegación Mejorada</h3>
                <p className="text-gray-600 mb-4">
                  Se ha rediseñado la barra de navegación con un estilo moderno, incluyendo animaciones suaves y efectos de hover para mejorar la experiencia del usuario.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                      <div className="text-red-600 font-semibold">Logo</div>
                      <motion.div 
                        className="text-gray-800 font-medium"
                        whileHover={{ y: -2 }}
                      >
                        Tienda
                      </motion.div>
                      <motion.div 
                        className="text-gray-800 font-medium"
                        whileHover={{ y: -2 }}
                      >
                        Promociones
                      </motion.div>
                      <motion.div 
                        className="text-gray-800 font-medium"
                        whileHover={{ y: -2 }}
                      >
                        Categorías
                      </motion.div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="text-gray-700"
                      >
                        <ShoppingBag className="h-5 w-5" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Cuenta de Usuario Animada</h3>
                <p className="text-gray-600 mb-4">
                  El menú de cuenta de usuario ahora incluye animaciones suaves y un diseño más organizado e intuitivo.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg flex justify-end">
                  <div className="relative">
                    <motion.div 
                      className="w-56 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100"
                    >
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          Nombre de Usuario
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          usuario@ejemplo.com
                        </p>
                      </div>
                      <div className="py-1">
                        <div className="flex items-center px-4 py-2.5 text-sm text-gray-700">
                          <Info className="h-4 w-4 mr-2 text-gray-400" />
                          Mi cuenta
                        </div>
                        <div className="flex items-center px-4 py-2.5 text-sm text-gray-700">
                          <ShoppingBag className="h-4 w-4 mr-2 text-gray-400" />
                          Mis pedidos
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Animations Section */}
          <motion.section 
            id="animations"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 sm:p-10 rounded-xl shadow-md"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Animaciones y Efectos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Hover y Focus Effects</h3>
                <div className="space-y-4">
                  <motion.button
                    className="px-6 py-3 bg-red-600 text-white rounded-md font-medium w-full"
                    whileHover={{ scale: 1.03, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Botón con Hover Effect
                  </motion.button>
                  
                  <motion.div
                    className="p-4 border border-gray-200 rounded-lg"
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div>
                        <h4 className="font-semibold">Element con Hover Effect</h4>
                        <p className="text-sm text-gray-600">Pasa el cursor para ver el efecto</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Transiciones Animadas</h3>
                <div className="space-y-4">
                  <motion.div
                    className="bg-red-50 rounded-lg p-4"
                    initial={{ height: 100 }}
                    whileHover={{ height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="font-semibold text-red-800">Contenido Expandible</h4>
                    <p className="text-sm text-gray-700 mt-2">
                      Este contenido se expande suavemente cuando pasas el cursor por encima, creando una transición fluida que mejora la experiencia del usuario.
                    </p>
                  </motion.div>
                  
                  <div className="flex space-x-2">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="w-full h-20 bg-gradient-to-r from-red-100 to-red-200 rounded-lg flex items-center justify-center"
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <Star className="text-yellow-500" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Cart Section */}
          <motion.section 
            id="cart"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 sm:p-10 rounded-xl shadow-md"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Carrito y Checkout</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Mini Carrito Mejorado</h3>
                <p className="text-gray-600 mb-4">
                  El panel del carrito ahora cuenta con animaciones suaves al abrir y cerrar, así como elementos interactivos mejorados para modificar cantidades y eliminar productos.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg relative overflow-hidden h-80">
                  <div className="absolute top-0 right-0 w-4/5 sm:w-96 h-full bg-white shadow-lg rounded-l-lg p-6">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <h2 className="text-xl font-bold">Tu Carrito</h2>
                      <button className="text-gray-400 hover:text-red-600 transition-colors">
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="py-4">
                      <div className="py-6 flex">
                        <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md"></div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>Producto de Ejemplo</h3>
                            <p>$99.00</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">Variante</p>
                          <div className="flex justify-between items-end mt-2">
                            <div className="flex items-center border border-gray-200 rounded-md shadow-sm">
                              <button className="p-1.5 text-gray-600">-</button>
                              <span className="px-2 py-1 min-w-[32px] text-center text-sm font-medium">1</span>
                              <button className="p-1.5 text-gray-600">+</button>
                            </div>
                            <button className="font-medium text-red-600 text-sm">
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 py-4 mt-auto">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>$99.00</p>
                      </div>
                      <button className="w-full mt-4 bg-red-600 text-white py-3 rounded-md font-medium flex items-center justify-center">
                        <span>Finalizar Compra</span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Checkout Optimizado</h3>
                <p className="text-gray-600 mb-4">
                  El proceso de checkout ha sido mejorado con animaciones, mayor claridad en los pasos, y elementos de confianza para aumentar la tasa de conversión.
                </p>
                <div className="flex justify-center">
                  <div className="flex space-x-12 items-center">
                    <motion.div
                      className="flex flex-col items-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mb-2">1</div>
                      <span className="text-sm font-medium">Carrito</span>
                    </motion.div>
                    <div className="w-16 h-0.5 bg-gray-300"></div>
                    <motion.div
                      className="flex flex-col items-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mb-2">2</div>
                      <span className="text-sm font-medium">Envío</span>
                    </motion.div>
                    <div className="w-16 h-0.5 bg-gray-300"></div>
                    <motion.div
                      className="flex flex-col items-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="w-12 h-12 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center mb-2">3</div>
                      <span className="text-sm font-medium">Pago</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Accessibility Section */}
          <motion.section 
            id="accessibility"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 sm:p-10 rounded-xl shadow-md"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Mejoras de Accesibilidad</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Atributos ARIA</h3>
                <p className="text-gray-600 mb-4">
                  Se han implementado atributos ARIA en toda la aplicación para mejorar la accesibilidad para usuarios con lectores de pantalla.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-xs text-gray-700 overflow-x-auto">
{`<button
  aria-label="Toggle mobile menu"
  aria-expanded={menuOpen}
  aria-controls="mobile-menu"
>
  Menu
</button>

<div
  id="mobile-menu"
  role="navigation"
  aria-label="Mobile navigation"
>
  Menu items...
</div>`}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Foco y Estados Interactivos</h3>
                <p className="text-gray-600 mb-4">
                  Todos los elementos interactivos tienen estados de foco visibles y claros para mejorar la navegación por teclado.
                </p>
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <button className="px-4 py-2 border border-gray-300 rounded-md">Normal</button>
                    <button className="px-4 py-2 border-2 border-blue-500 rounded-md ring-2 ring-blue-200">Con Foco</button>
                    <button className="px-4 py-2 bg-gray-200 border border-gray-300 rounded-md">Presionado</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>

      {/* Footer with next steps */}
      <div className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Seguimos mejorando</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Estas mejoras son parte de un proceso continuo para ofrecer la mejor experiencia de usuario posible en Silla Vida.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
            >
              Volver a la tienda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UiShowcasePage;
