import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FeatureFlagToggle from '../components/admin/FeatureFlagToggle';
import DesignSystemToggle from '../components/admin/DesignSystemToggle';
import StyleGuide from '../components/admin/StyleGuide';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import JudgeMeWidgetTester from '../components/admin/JudgeMeWidgetTester';
import ThemePreviewPage from './ThemePreviewPage';
import ThemeTestPage from './ThemeTestPage';
import ShopifyApiTester from '../components/ShopifyApiTester';
import AnimationDemoPage from './AnimationDemoPage';
import ProductCardDemo from './ProductCardDemo';

/**
 * AdminPage component
 * 
 * This page provides access to administrative functions such as
 * feature flag toggles, theme previews, API testing, and UI demos.
 */
const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'features' | 'design-system' | 'themes' | 'theme-test' | 'api-test' | 'ui-demos' | 'product-cards' | 'style-guide' | 'analytics' | 'judge-me'>('features');

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <motion.div 
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Panel de Administración</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8 overflow-x-auto">
        <nav className="flex -mb-px whitespace-nowrap">
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'features'
                ? 'border-teal text-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('features')}
          >
            Configuración de Funciones
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'design-system'
                ? 'border-teal text-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('design-system')}
          >
            Sistema de Diseño
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'themes'
                ? 'border-teal text-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('themes')}
          >
            Vista Previa de Temas
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'theme-test'
                ? 'border-teal text-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('theme-test')}
          >
            Prueba de Temas
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'api-test'
                ? 'border-teal text-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('api-test')}
          >
            API Shopify
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'ui-demos'
                ? 'border-teal text-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('ui-demos')}
          >
            Animaciones
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'product-cards'
                ? 'border-teal text-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('product-cards')}
          >
            Tarjetas de Producto
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'style-guide'
                ? 'border-teal text-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('style-guide')}
          >
            Guía de Estilos
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'analytics'
                ? 'border-teal text-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analítica
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === 'judge-me'
                ? 'border-teal text-teal'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('judge-me')}
          >
            Judge.me Widgets
          </button>
        </nav>
      </div>
      
      {/* Features Tab */}
      {activeTab === 'features' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Configuración de Funciones</h2>
            <FeatureFlagToggle />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Instrucciones</h2>
            <div className="prose">
              <p className="text-gray-600">
                Utilice los interruptores para activar o desactivar las funciones de autenticación:
              </p>
              <ul className="mt-2 space-y-2 text-gray-600">
                <li>
                  <strong>Cuentas de Cliente:</strong> Habilita o deshabilita completamente la API de Cuentas de Cliente de Shopify.
                </li>
                <li>
                  <strong>Autenticación Alternativa:</strong> Activa el sistema de respaldo cuando la API de Shopify falla.
                </li>
                <li>
                  <strong>Reportes de Error:</strong> Muestra mensajes de error detallados para la depuración.
                </li>
              </ul>
              <p className="mt-4 text-gray-600">
                Los cambios se aplican inmediatamente y se guardan en localStorage para persistir entre sesiones.
              </p>
            </div>
          </div>
          
          <div className="md:col-span-2 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <h3 className="text-lg font-medium text-amber-800 mb-2">Modo de Prueba</h3>
            <p className="text-amber-700">
              Para probar el modo de respaldo, puede:
            </p>
            <ul className="mt-2 list-disc list-inside text-amber-700">
              <li>Desactivar "Cuentas de Cliente" para simular un fallo completo de la API</li>
              <li>Visitar <a href="/login?fallback=true" className="text-teal-600 hover:underline">login?fallback=true</a> para forzar el modo de respaldo</li>
              <li>Visitar <a href="/register?fallback=true" className="text-teal-600 hover:underline">register?fallback=true</a> para probar el registro alternativo</li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Design System Tab */}
      {activeTab === 'design-system' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <DesignSystemToggle />
        </div>
      )}
      
      {/* Themes Tab */}
      {activeTab === 'themes' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <ThemePreviewPage />
        </div>
      )}

      {/* Theme Test Tab */}
      {activeTab === 'theme-test' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <ThemeTestPage />
        </div>
      )}

      {/* API Test Tab */}
      {activeTab === 'api-test' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center">Shopify API Testing</h2>
            <p className="text-center text-gray-600 mt-2">
              Use this page to test and validate the Shopify API integration
            </p>
          </div>
          <ShopifyApiTester />
        </div>
      )}

      {/* UI Demos Tab */}
      {activeTab === 'ui-demos' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <AnimationDemoPage />
        </div>
      )}

      {/* Product Cards Tab */}
      {activeTab === 'product-cards' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <ProductCardDemo />
        </div>
      )}

      {/* Style Guide Tab */}
      {activeTab === 'style-guide' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <StyleGuide />
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <AnalyticsDashboard />
        </div>
      )}

      {/* Judge.me Widget Tester */}
      {activeTab === 'judge-me' && (
        <JudgeMeWidgetTester />
      )}
    </motion.div>
  );
};

export default AdminPage;
