import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion
import { getProduct, getProductsByCollection } from '../lib/shopify';
import { useCart } from '../context/CartContext';
import type { ShopifyProduct } from '../types/shopify';
import { Star, Truck, Shield, CreditCard, ChevronRight, Plus, Minus, Share2, Heart, Maximize2, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
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
          <Link to="/" className="hover:text-red-600">Inicio</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/category/all" className="hover:text-red-600">Productos</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="font-medium text-gray-900">{product.title}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div 
              ref={imageRef}
              className={`aspect-square bg-gray-100 rounded-lg overflow-hidden relative ${
                zoomActive ? 'cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setZoomActive(!zoomActive)}
              onMouseMove={handleZoom}
              style={
                zoomActive 
                  ? {
                      backgroundImage: `url(${product.images.edges[activeImageIndex]?.node.url})`,
                      backgroundSize: '200%',
                      backgroundRepeat: 'no-repeat'
                    }
                  : undefined
              }
            >
              {!zoomActive && (
                <img
                  src={product.images.edges[activeImageIndex]?.node.url}
                  alt={product.images.edges[activeImageIndex]?.node.altText || product.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
              <button 
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomActive(!zoomActive);
                }}
              >
                <Maximize2 className="h-5 w-5 text-gray-600" />
              </button>
              
              {/* Image navigation buttons */}
              {product.images.edges.length > 1 && (
                <>
                  <button 
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex(prev => 
                        prev === 0 ? product.images.edges.length - 1 : prev - 1
                      );
                    }}
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex(prev => 
                        prev === product.images.edges.length - 1 ? 0 : prev + 1
                      );
                    }}
                  >
                    <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail gallery */}
            {product.images.edges.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.edges.map((image, index) => (
                  <div 
                    key={index} 
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 ${
                      activeImageIndex === index ? 'border-red-600' : 'border-transparent'
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img
                      src={image.node.url}
                      alt={image.node.altText || `${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
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
              <p className="text-3xl font-bold text-red-600">{formattedPrice}</p>
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

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Cantidad</h3>
              <div className="flex items-center">
                <button 
                  onClick={decrementQuantity}
                  className="p-2 border border-gray-300 rounded-l hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="px-4 py-2 border-t border-b border-gray-300 text-center min-w-[60px]">
                  {quantity}
                </div>
                <button 
                  onClick={incrementQuantity}
                  className="p-2 border border-gray-300 rounded-r hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              disabled={isCartLoading}
              className={`w-full py-3 rounded-lg font-semibold transition-colors mb-2 flex items-center justify-center ${
                isCartLoading 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isCartLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Agregando...
                </>
              ) : (
                'Agregar al Carrito'
              )}
            </button>
            
            {/* Success Message */}
            {cartSuccess && (
              <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-6 text-center">
                ¡Producto agregado al carrito!
              </div>
            )}

            {/* Product Features */}
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

            {/* Product Description */}
            <div className="mt-8">
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-gray-600 whitespace-pre-line">{product.description || 'No description available.'}</p>
            </div>

            {/* Product Features (from Tags) */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold mb-2">Características</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {product.tags.map((tag, index) => (
                    <li key={index}>{tag}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Social Sharing */}
            <div className="mt-8 flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-red-600">
                <Share2 className="h-5 w-5" />
                <span>Compartir</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-red-600">
                <Heart className="h-5 w-5" />
                <span>Favorito</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Productos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <Link to={`/product/${relatedProduct.handle}`}>
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={relatedProduct.images.edges[0]?.node.url}
                        alt={relatedProduct.images.edges[0]?.node.altText || relatedProduct.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{relatedProduct.title}</h3>
                      <p className="text-red-600 font-bold">
                        {parseFloat(relatedProduct.priceRange.minVariantPrice.amount).toLocaleString('es-MX', {
                          style: 'currency',
                          currency: relatedProduct.priceRange.minVariantPrice.currencyCode
                        })}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductPage;
