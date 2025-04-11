import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../lib/shopify';
import type { ShopifyProduct } from '../types/shopify';
import { Star, Truck, Shield, CreditCard } from 'lucide-react';

const ProductPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;
      try {
        const productData = await getProduct(handle);
        setProduct(productData);
        if (productData.variants?.edges[0]) {
          setSelectedVariantId(productData.variants.edges[0].node.id);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Producto no encontrado</p>
      </div>
    );
  }

  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const formattedPrice = price.toLocaleString('es-MX', {
    style: 'currency',
    currency: product.priceRange.minVariantPrice.currencyCode
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images.edges[0]?.node.url}
              alt={product.images.edges[0]?.node.altText || product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.edges.slice(1).map((image, index) => (
              <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={image.node.url}
                  alt={image.node.altText || `${product.title} ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
            <span className="ml-2 text-gray-600">(4.0)</span>
          </div>

          <div className="mb-6">
            <p className="text-3xl font-bold text-red-600">{formattedPrice}</p>
            <p className="text-gray-600">Hasta 12 meses sin intereses</p>
          </div>

          {product.variants && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Variantes</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.edges.map(({ node }) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedVariantId(node.id)}
                    className={`p-3 rounded border ${
                      selectedVariantId === node.id
                        ? 'border-red-600 bg-red-50'
                        : 'border-gray-300 hover:border-red-600'
                    }`}
                  >
                    {node.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors mb-6">
            Agregar al Carrito
          </button>

          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center gap-3">
              <Truck className="h-6 w-6 text-gray-600" />
              <div>
                <h4 className="font-semibold">Envío Gratis</h4>
                <p className="text-sm text-gray-600">En pedidos mayores a $999 MXN</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-gray-600" />
              <div>
                <h4 className="font-semibold">Garantía de 12 Meses</h4>
                <p className="text-sm text-gray-600">En todos nuestros productos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-gray-600" />
              <div>
                <h4 className="font-semibold">Pago Seguro</h4>
                <p className="text-sm text-gray-600">Múltiples métodos de pago</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-2">Descripción</h3>
            <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;