import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, AlertCircle, Check, ChevronRight } from 'lucide-react';

const PromotionsPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Promociones Actuales</h1>
      
      {/* Free Shipping Promotion */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-red-600 p-4 text-white flex items-center">
          <Truck className="h-6 w-6 mr-3" />
          <h2 className="text-xl font-bold">Envío Gratis</h2>
        </div>
        
        <div className="p-6">
          <div className="flex items-start mb-6">
            <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
              <Truck className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Envío Gratis en Compras Superiores a $10,000 MXN</h3>
              <p className="text-gray-600 mt-1">
                Disfruta de envío gratuito en todo México en tu pedido al alcanzar un subtotal de $10,000 MXN o más.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Detalles de la Promoción:</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Válido para todos los productos disponibles en nuestra tienda</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Aplicable automáticamente al alcanzar el monto mínimo</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Envío a cualquier parte de México</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Sin código promocional necesario - se aplica automáticamente</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-md p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Consideraciones importantes:</h4>
                <ul className="mt-2 text-sm text-gray-700 space-y-1 pl-6 list-disc">
                  <li>El monto mínimo de $10,000 MXN se calcula sobre el subtotal de la compra, antes de impuestos.</li>
                  <li>La promoción puede no ser combinable con otras ofertas o descuentos.</li>
                  <li>Los productos personalizados o especiales pueden tener condiciones diferentes.</li>
                  <li>Silla Vida se reserva el derecho de modificar o cancelar esta promoción en cualquier momento.</li>
                </ul>
              </div>
            </div>
          </div>
          
          <Link to="/tienda" className="bg-red-600 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center hover:bg-red-700 transition-colors">
            Comprar Ahora
            <ChevronRight className="ml-1 h-5 w-5" />
          </Link>
        </div>
      </div>
      
      {/* Additional promotions can be added below */}
    </div>
  );
};

export default PromotionsPage;
