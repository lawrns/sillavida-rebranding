import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence
import { getProduct, getProductsByCollection } from '../lib/shopify';
import { useCart } from '../context/CartContext';
import type { ShopifyProduct } from '../types/shopify';
import { Star, ChevronRight, Plus, Minus, Share2, Heart, Maximize2, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import TrustIndicatorGroup from '../components/TrustIndicatorGroup';
import BenefitTabs from '../components/BenefitTabs';
import { Helmet } from 'react-helmet';

const ProductPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomActive, setZoomActive] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<ShopifyProduct[]>([]);
  const [cartSuccess, setCartSuccess] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const { addItem, isLoading: isCartLoading } = useCart();

  // Handle zoom effect on image
  const handleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomActive || !imageRef.current) return;
    
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width * 100;
    const y = (e.clientY - top) / height * 100;
    
    imageRef.current.style.backgroundPosition = `${x}% ${y}%`;
  };
  
  // Handle quantity changes
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  
  // Generate a Shopify-compatible variant ID from the product ID
  const generateVariantId = (productId: string): string => {
    // Create a deterministic numeric ID based on the product ID
    // In a real implementation, this would be the actual Shopify variant ID
    const numericId = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * 1000;
    return `gid://shopify/ProductVariant/${numericId}`;
  };

  // Add to cart functionality
  const handleAddToCart = async () => {
    if (!product) return;
    
    // Use selectedVariantId if available, otherwise generate one from the product ID
    let variantId = selectedVariantId;
    
    if (!variantId) {
      console.warn(`[ProductPage] No variant ID selected for product: ${product.title}, generating one`);
      variantId = generateVariantId(product.id);
      console.log(`[ProductPage] Generated variant ID: ${variantId} for product: ${product.title}`);
    }
    
    console.log(`[ProductPage] Adding item to cart: ${product.title} with variant ID: ${variantId}, quantity: ${quantity}`);
    
    try {
      // Add the item to the cart with retry logic
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          await addItem(variantId, quantity);
          console.log(`[ProductPage] Successfully added item to cart: ${product.title}`);
          setCartSuccess(true);
          setTimeout(() => setCartSuccess(false), 3000);
          break; // Success, exit the retry loop
        } catch (retryError) {
          retryCount++;
          console.warn(`[ProductPage] Retry ${retryCount}/${maxRetries} adding to cart: ${product.title}`);
          
          if (retryCount > maxRetries) {
            throw retryError; // Rethrow the error after max retries
          }
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(`Failed to add ${product.title} to cart. Please try again.`);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;
      try {
        const productData = await getProduct(handle);
        setProduct(productData);
        if (productData.variants?.edges[0]) {
          setSelectedVariantId(productData.variants.edges[0].node.id);
        }
        
        // Fetch related products
        try {
          // Assuming products in the same collection are related
          // In a real implementation, you might want to use a more sophisticated recommendation system
          const result = await getProductsByCollection('all', 4);
          setRelatedProducts(result.products.filter(p => p.id !== productData.id).slice(0, 4));
        } catch (relatedError) {
          console.error('Error fetching related products:', relatedError);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    
    // Reset state when handle changes
    setActiveImageIndex(0);
    setZoomActive(false);
    setQuantity(1);
    setCartSuccess(false);
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
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

  // Page transition variants (can be shared across pages)
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
    >
      <Helmet>
        <title>{product.title} | Silla Vida</title>
        <meta name="description" content={product.description.substring(0, 160)} />
        <meta property="og:title" content={`${product.title} | Silla Vida`} />
        <meta property="og:description" content={product.description.substring(0, 160)} />
        <meta property="og:image" content={product.images.edges[0]?.node.url} />
        <meta property="og:type" content="product" />
        <link rel="canonical" href={`${window.location.origin}/product/${handle}`} />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-teal">Inicio</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/category/all" className="hover:text-teal">Productos</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="font-medium text-gray-900">{product.title}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div 
              ref={imageRef}
              className={`aspect-square bg-gray-100 rounded-lg overflow-hidden relative ${
                zoomActive ? 'cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setZoomActive(!zoomActive)}
              onMouseMove={handleZoom}
              onMouseLeave={() => zoomActive && imageRef.current && (imageRef.current.style.backgroundPosition = 'center')}
              style={
                zoomActive 
                  ? {
                      backgroundImage: `url(${product.images.edges[activeImageIndex]?.node.url})`,
                      backgroundSize: '250%',
                      backgroundRepeat: 'no-repeat',
                    }
                  : undefined
              }
              whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              {!zoomActive && (
                <motion.img
                  src={product.images.edges[activeImageIndex]?.node.url}
                  alt={product.images.edges[activeImageIndex]?.node.altText || product.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  key={activeImageIndex} // This ensures it animates when changing images
                />
              )}
              <motion.button 
                className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomActive(!zoomActive);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Maximize2 className="h-5 w-5 text-gray-600" />
              </motion.button>
              
              {/* Image navigation buttons */}
              {product.images.edges.length > 1 && (
                <>
                  <motion.button 
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md hover:bg-white z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex(prev => 
                        prev === 0 ? product.images.edges.length - 1 : prev - 1
                      );
                    }}
                    whileHover={{ scale: 1.1, x: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </motion.button>
                  <motion.button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md hover:bg-white z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex(prev => 
                        prev === product.images.edges.length - 1 ? 0 : prev + 1
                      );
                    }}
                    whileHover={{ scale: 1.1, x: 2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRightIcon className="h-5 w-5 text-gray-700" />
                  </motion.button>
                </>
              )}
              
              {/* Zoom indicator */}
              {!zoomActive && (
                <motion.div 
                  className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-1 rounded-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.3 }}
                >
                  Clic para ampliar
                </motion.div>
              )}
            </motion.div>
            
            {/* Thumbnail gallery */}
            {product.images.edges.length > 1 && (
              <div className="grid grid-cols-5 gap-3 mt-4">
                {product.images.edges.map((image, index) => (
                  <motion.div 
                    key={index} 
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer ${
                      activeImageIndex === index 
                        ? 'ring-2 ring-teal shadow-md' 
                        : 'border border-gray-200 hover:border-teal-light'
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    animate={{ 
                      y: activeImageIndex === index ? -4 : 0,
                      opacity: activeImageIndex === index ? 1 : 0.8
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <img
                      src={image.node.url}
                      alt={image.node.altText || `${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            )}
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
              <p className="text-3xl font-bold text-teal">{formattedPrice}</p>
              <p 
                className="text-gray-600 cursor-help" 
                title="Paga a 12 meses sin intereses con tarjetas participantes."
              >
                Hasta 12 meses sin intereses (?)
              </p>
            </div>

            {product.variants && product.variants.edges.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Variantes</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.edges.map(({ node }) => (
                    <motion.button
                      key={node.id}
                      onClick={() => setSelectedVariantId(node.id)}
                      className={`p-3 rounded-md shadow-sm ${
                        selectedVariantId === node.id
                          ? 'bg-teal-50 border border-teal text-teal-dark'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-teal-light'
                      }`}
                      whileHover={{ 
                        scale: 1.03, 
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                      }}
                      whileTap={{ scale: 0.98 }}
                      animate={{ 
                        y: selectedVariantId === node.id ? -2 : 0,
                        boxShadow: selectedVariantId === node.id 
                          ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                          : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {node.title}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="font-semibold mb-2">Cantidad</h3>
              <div className="flex items-center">
                <motion.button 
                  onClick={decrementQuantity}
                  className="p-2.5 border border-gray-200 rounded-l-md hover:bg-gray-50"
                  whileHover={{ backgroundColor: "#f9fafb" }}
                  whileTap={{ scale: 0.95 }}
                  disabled={quantity <= 1}
                  aria-label="Disminuir cantidad"
                >
                  <Minus className={`h-4 w-4 ${quantity <= 1 ? 'text-gray-300' : 'text-gray-500'}`} />
                </motion.button>
                <motion.div 
                  className="px-4 py-2.5 border-t border-b border-gray-200 text-center font-medium min-w-[64px]"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    transition: { duration: 0.3 }
                  }}
                  key={quantity} // This triggers animation when quantity changes
                >
                  {quantity}
                </motion.div>
                <motion.button 
                  onClick={incrementQuantity}
                  className="p-2.5 border border-gray-200 rounded-r-md hover:bg-gray-50"
                  whileHover={{ backgroundColor: "#f9fafb" }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="h-4 w-4 text-gray-500" />
                </motion.button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button 
              onClick={handleAddToCart}
              disabled={isCartLoading}
              className={`w-full py-3.5 rounded-lg font-semibold mb-2 flex items-center justify-center ${
                isCartLoading 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-teal text-white hover:bg-teal-light'
              }`}
              whileHover={!isCartLoading ? { scale: 1.02, backgroundColor: "#0D9488" } : {}}
              whileTap={!isCartLoading ? { scale: 0.98 } : {}}
              transition={{ duration: 0.2 }}
            >
              {isCartLoading ? (
                <>
                  <motion.div 
                    className="rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Agregando...
                </>
              ) : (
                <motion.span
                  initial={{ opacity: 1 }}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center"
                >
                  Agregar al Carrito
                  <ChevronRight className="h-5 w-5 ml-1" />
                </motion.span>
              )}
            </motion.button>
            
            {/* Success Message */}
            <AnimatePresence>
              {cartSuccess && (
                <motion.div 
                  className="bg-green-100 text-green-800 p-3.5 rounded-lg mb-6 flex items-center justify-center shadow-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </motion.div>
                  <span className="font-medium">¡Producto agregado al carrito!</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trust Indicators */}
            <div className="border-t pt-6">
              <TrustIndicatorGroup 
                types={['warranty', 'shipping', 'payment']} 
                layout="horizontal" 
                size="medium" 
              />
            </div>

            {/* Benefit-Focused Tabs */}
            <BenefitTabs 
              content={{
                bienestar: (
                  <div className="py-4">
                    <h3 className="text-xl font-semibold mb-4 text-[#C87D55]">Bienestar</h3>
                    <p className="text-gray-600 mb-4">
                      Nuestras sillas están diseñadas para mejorar tu bienestar físico y mental durante largas jornadas de trabajo.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Soporte lumbar ajustable que reduce la tensión en la espalda baja</li>
                      <li>Diseño ergonómico que promueve una postura saludable</li>
                      <li>Materiales transpirables que mantienen una temperatura confortable</li>
                      <li>Reduce la fatiga y el estrés durante largas sesiones de trabajo</li>
                      {product.description && (
                        <li>{product.description.split('.')[0]}.</li>
                      )}
                    </ul>
                  </div>
                ),
                productividad: (
                  <div className="py-4">
                    <h3 className="text-xl font-semibold mb-4 text-[#7D9D8C]">Productividad</h3>
                    <p className="text-gray-600 mb-4">
                      Aumenta tu rendimiento y concentración con características diseñadas para optimizar tu espacio de trabajo.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Ajustes personalizables que se adaptan a tu estilo de trabajo</li>
                      <li>Movilidad fluida que te permite desplazarte eficientemente</li>
                      <li>Diseño que facilita mantener tu espacio de trabajo organizado</li>
                      <li>Reduce las distracciones causadas por incomodidad física</li>
                      {product.description && product.description.split('.').length > 1 && (
                        <li>{product.description.split('.')[1]}.</li>
                      )}
                    </ul>
                  </div>
                ),
                durabilidad: (
                  <div className="py-4">
                    <h3 className="text-xl font-semibold mb-4 text-teal">Durabilidad</h3>
                    <p className="text-gray-600 mb-4">
                      Invierte en una solución duradera con materiales y construcción de alta calidad que resisten el uso diario.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Estructura robusta diseñada para soportar uso intensivo</li>
                      <li>Materiales de alta calidad que mantienen su apariencia con el tiempo</li>
                      <li>Mecanismos probados para miles de ciclos de uso</li>
                      <li>Garantía que respalda la calidad y durabilidad del producto</li>
                      {product.description && product.description.split('.').length > 2 && (
                        <li>{product.description.split('.')[2]}.</li>
                      )}
                    </ul>
                  </div>
                ),
                especificaciones: (
                  <div className="py-4">
                    <h3 className="text-xl font-semibold mb-4 text-gray-600">Especificaciones</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Detalles Técnicos</h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {product.tags && product.tags.map((tag, index) => (
                            <li key={index}>{tag}</li>
                          ))}
                          {(!product.tags || product.tags.length === 0) && (
                            <>
                              <li>Peso máximo soportado: 120 kg</li>
                              <li>Altura ajustable: 45-55 cm</li>
                              <li>Material del asiento: Espuma de alta densidad</li>
                              <li>Material de la estructura: Aluminio reforzado</li>
                            </>
                          )}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Dimensiones</h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Altura total: 110-120 cm</li>
                          <li>Ancho del asiento: 50 cm</li>
                          <li>Profundidad del asiento: 48 cm</li>
                          <li>Altura del respaldo: 65 cm</li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Descripción Completa</h4>
                      <p className="text-gray-600 whitespace-pre-line">{product.description || 'No description available.'}</p>
                    </div>
                  </div>
                )
              }}
              className="mt-8"
            />
            
            {/* Social Sharing */}
            <div className="mt-8 flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-teal">
                <Share2 className="h-5 w-5" />
                <span>Compartir</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-teal">
                <Heart className="h-5 w-5" />
                <span>Favorito</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Productos Relacionados</h2>
              <Link 
                to="/category/all" 
                className="text-sm text-teal hover:text-teal-light flex items-center transition-colors duration-200"
              >
                Ver todos los productos
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div 
                  key={relatedProduct.id} 
                  className="rounded-lg overflow-hidden bg-white border border-gray-200 hover:border-teal-light transition-all duration-300"
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    borderColor: "rgba(45, 212, 191, 0.7)" // teal-light
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.1,
                    y: { type: "spring", stiffness: 300, damping: 15 }
                  }}
                >
                  <Link to={`/product/${relatedProduct.handle}`} className="flex flex-col h-full">
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <motion.img
                        src={relatedProduct.images.edges[0]?.node.url}
                        alt={relatedProduct.images.edges[0]?.node.altText || relatedProduct.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1 text-gray-800">{relatedProduct.title}</h3>
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">(4.0)</span>
                      </div>
                      <div className="mt-auto pt-2">
                        <p className="text-teal font-bold">
                          {parseFloat(relatedProduct.priceRange.minVariantPrice.amount).toLocaleString('es-MX', {
                            style: 'currency',
                            currency: relatedProduct.priceRange.minVariantPrice.currencyCode
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductPage;
