import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, ArrowRight, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Helmet } from 'react-helmet';
import { getProducts, getProduct } from '../lib/shopify';

const CheckoutDemoPage: React.FC = () => {
  const { addToCart, cartCount, cartTotal } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [product, setProduct] = useState<{
    id: string;
    title: string;
    price: string;
    handle: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch a product from Shopify
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsInitializing(true);
        // Get the first product from the store
        const products = await getProducts(1);
        
        if (products.length === 0) {
          setError('No products found in the store');
          setIsInitializing(false);
          return;
        }
        
        // Get the full product details including variants
        const productDetails = await getProduct(products[0].handle);
        
        if (!productDetails.variants || productDetails.variants.edges.length === 0) {
          setError('No variants available for the product');
          setIsInitializing(false);
          return;
        }
        
        // Get the first variant
        const variant = productDetails.variants.edges[0].node;
        
        setProduct({
          id: variant.id,
          title: productDetails.title,
          price: `$${parseFloat(variant.price.amount).toLocaleString('es-MX')} ${variant.price.currencyCode}`,
          handle: productDetails.handle
        });
        
        setIsInitializing(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error fetching product. Please try again later.');
        setIsInitializing(false);
      }
    };
    
    fetchProduct();
  }, []);
  
  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsLoading(true);
    try {
      await addToCart(product.id, 1);
      setIsLoading(false);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setError('Error adding item to cart. Please try again later.');
      setIsLoading(false);
    }
  };
  
  const handleGoToCheckout = () => {
    navigate('/checkout');
  };
  
  return (
    <>
      <Helmet>
        <title>Demo de Checkout | Silla Vida</title>
        <meta name="description" content="Página de demostración del proceso de checkout en Silla Vida." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Demo de Checkout</h1>
        
        {isInitializing ? (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 flex items-center justify-center">
            <div className="text-center py-12">
              <Loader className="h-12 w-12 text-red-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Cargando producto...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 text-lg font-semibold mb-2">{error}</p>
              <p className="text-gray-600">
                No se pudo cargar el producto para la demostración.
              </p>
            </div>
          </div>
        ) : product ? (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/3 bg-gray-100 rounded-lg p-6 flex items-center justify-center">
                <ShoppingBag className="h-24 w-24 text-gray-400" />
              </div>
              
              <div className="w-full md:w-2/3">
                <h2 className="text-2xl font-semibold mb-2">{product.title}</h2>
                <p className="text-gray-600 mb-4">
                  Este es un producto de demostración para probar el flujo de checkout. 
                  Al hacer clic en "Agregar al Carrito", se agregará este producto al carrito.
                </p>
                <p className="text-xl font-bold mb-6">{product.price}</p>
                
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className="w-full md:w-auto bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Agregando...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Agregar al Carrito
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : null}
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold mb-4">Resumen del Carrito</h2>
          
          {cartCount === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tu carrito está vacío</p>
              <p className="text-sm text-gray-500 mt-2">
                Agrega productos al carrito para continuar con el checkout.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <p className="text-gray-600">Productos en el carrito:</p>
                <p className="font-medium">{cartCount}</p>
              </div>
              <div className="flex justify-between mb-6">
                <p className="text-gray-600">Total:</p>
                <p className="font-bold">{cartTotal}</p>
              </div>
              
              <button
                onClick={handleGoToCheckout}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 flex items-center justify-center"
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                Proceder al Checkout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CheckoutDemoPage;
