import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import type { ShopifyProduct } from '../types/shopify';
import { ChevronRight, RefreshCw, Check } from 'lucide-react';
import { Helmet } from 'react-helmet';
import ProductHeroShowcase from '../components/ProductHeroShowcase';
import ProductSpecifications from '../components/ProductSpecifications';
// Import components that will be dynamically loaded
import { createDynamicComponent } from '../utils/DynamicImport';
import { StickyAddToCart, ProductSectionNav } from '../components/product';
import { getProduct, getProductsByCollection } from '../lib/shopify';
import { getFeatureFlag } from '../config/featureFlags';
import './ProductPage.css';

// Dynamically import heavy components
const DynamicChairFeatures = lazy(() => import('../components/ChairFeaturesComponent'));
const DynamicProductFeatures = lazy(() => import('../components/ProductFeatures'));
const DynamicVidaBenefits = lazy(() => import('../components/VidaBenefits'));
const DynamicJudgeMeReviews = lazy(() => import('../components/JudgeMeReviews'));
const DynamicRelatedProducts = lazy(() => import('../components/RelatedProducts'));
const DynamicProductComparison = lazy(() => import('../components/product/ProductComparison'));
const DynamicProductGallery = lazy(() => import('../components/product/ProductGallery'));

// Loading placeholders
const LoadingPlaceholder = () => (
  <div className="loading-placeholder">
    <div className="loading-spinner"></div>
    <p>Cargando...</p>
  </div>
);

const ProductPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ShopifyProduct[]>([]);
  const [cartSuccess, setCartSuccess] = useState(false);
  const { addItem } = useCart();

  const fetchProductData = async () => {
    if (!handle) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const productData = await getProduct(handle);
      setProduct(productData);
      
      if (productData.variants?.edges[0]) {
        setSelectedVariantId(productData.variants.edges[0].node.id);
      }
      
      // Fetch related products from the same collection
      try {
        // Get the first collection handle from the product
        const collectionHandle = productData.collections?.edges[0]?.node.handle || 'all';
        
        // Fetch products from the same collection
        const result = await getProductsByCollection(collectionHandle, 4);
        
        // Filter out the current product and limit to 4 items
        setRelatedProducts(result.products.filter(p => p.id !== productData.id).slice(0, 4));
      } catch (relatedError) {
        console.error('Error fetching related products:', relatedError);
        
        // Fallback to all products if collection-specific fetch fails
        try {
          const fallbackResult = await getProductsByCollection('all', 4);
          setRelatedProducts(fallbackResult.products.filter(p => p.id !== productData.id).slice(0, 4));
        } catch (fallbackError) {
          console.error('Error fetching fallback related products:', fallbackError);
          // Don't set an error for related products, just show empty state
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('No pudimos cargar el producto. Por favor, inténtalo de nuevo.');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
    setCartSuccess(false);
  }, [handle]);

  // --- Add to Cart handler for ProductHeroShowcase ---
  useEffect(() => {
    const onAddToCart = (e: CustomEvent) => {
      if (!product || !selectedVariantId) return;
      
      try {
        addItem(selectedVariantId, e.detail.quantity);
        setCartSuccess(true);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setCartSuccess(false);
        }, 3000);
      } catch (error) {
        console.error('Error adding item to cart:', error);
      }
    };
    
    window.addEventListener('add-to-cart', onAddToCart as EventListener);
    return () => window.removeEventListener('add-to-cart', onAddToCart as EventListener);
  }, [product, selectedVariantId, addItem]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="retry-button" onClick={fetchProductData}>
          <RefreshCw size={16} className="mr-2" />
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <p className="error-message">Producto no encontrado</p>
        <Link to="/" className="retry-button">
          Volver a la página principal
        </Link>
      </div>
    );
  }

  // --- Shopify-driven Product Page: Enhanced Vertical Layout ---
  // Prepare Shopify product data for all sections
  const heroImages = product.images.edges.map((img: any) => img.node.url);
  const inStock = !!(product.variants && product.variants.edges.some((v: any) => v.node.availableForSale));
  const productSubtitle = product.description?.split('.')[0] || 'Invierte en tu bienestar';
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice?.amount
    ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
    : undefined;

  // Extract Shopify metafields/specs if available, else fallback
  const productSpecs = [
    {
      category: 'Detalles Técnicos',
      items: [
        { label: 'Peso máximo soportado', value: product.metafields?.maxWeight || '120 kg' },
        { label: 'Altura ajustable', value: product.metafields?.adjustableHeight || '45-55 cm' },
        { label: 'Material del asiento', value: product.metafields?.seatMaterial || 'Espuma de alta densidad' },
        { label: 'Material de la estructura', value: product.metafields?.frameMaterial || 'Aluminio reforzado' },
      ],
    },
    {
      category: 'Dimensiones',
      items: [
        { label: 'Altura total', value: product.metafields?.height || '110-120 cm' },
        { label: 'Ancho del asiento', value: product.metafields?.seatWidth || '50 cm' },
        { label: 'Profundidad del asiento', value: product.metafields?.seatDepth || '48 cm' },
        { label: 'Altura del respaldo', value: product.metafields?.backrestHeight || '65 cm' },
      ],
    },
  ];

  // Product features: icons/images, ergonomic highlights
  const productFeatures = [
    { id: 'ajustes', title: 'Ajustes Personalizables', description: 'Se adapta a tu estilo de trabajo.', icon: '/icons/ajustes.svg', image: heroImages[0], vidaScore: { Ergonomía: 95, Movilidad: 0 } },
    { id: 'movilidad', title: 'Movilidad Fluida', description: 'Desplázate eficientemente.', icon: '/icons/movilidad.svg', image: heroImages[1] || heroImages[0], vidaScore: { Movilidad: 90, Ergonomía: 0 } },
  ];

  // Vida benefits: testimonials, wellness
  const vidaBenefits = [
    { id: 'bienestar', title: 'Bienestar', description: 'Mejora tu bienestar físico y mental.', icon: '/icons/bienestar.svg', testimonial: { quote: 'Me siento con más energía y menos dolor de espalda.', author: 'María G.' } },
    { id: 'productividad', title: 'Productividad', description: 'Optimiza tu espacio de trabajo.', icon: '/icons/productividad.svg', testimonial: { quote: 'Mi productividad aumentó significativamente.', author: 'Carlos R.' } },
  ];

  // Section navigation configuration
  const productSections = [
    { id: 'product-hero', label: 'Producto' },
    { id: 'product-features', label: 'Características' },
    { id: 'product-specs', label: 'Especificaciones' },
    { id: 'product-benefits', label: 'Beneficios' },
    { id: 'product-reviews', label: 'Experiencias' },
    { id: 'product-related', label: 'Relacionados' },
  ];

  // Prepare data for product comparison
  const currentProductForComparison = {
    id: product.id,
    title: product.title,
    price: price,
    compareAtPrice: compareAtPrice,
    image: heroImages[0],
    handle: handle || '',
    specs: {
      'Peso máximo': product.metafields?.maxWeight || '120 kg',
      'Altura ajustable': product.metafields?.adjustableHeight || '45-55 cm',
      'Material del asiento': product.metafields?.seatMaterial || 'Espuma de alta densidad',
      'Material de la estructura': product.metafields?.frameMaterial || 'Aluminio reforzado',
      'Altura total': product.metafields?.height || '110-120 cm',
      'Ancho del asiento': product.metafields?.seatWidth || '50 cm',
      'Profundidad del asiento': product.metafields?.seatDepth || '48 cm',
      'Altura del respaldo': product.metafields?.backrestHeight || '65 cm',
    }
  };

  const relatedProductsForComparison = relatedProducts.map(relatedProduct => ({
    id: relatedProduct.id,
    title: relatedProduct.title,
    price: parseFloat(relatedProduct.priceRange.minVariantPrice.amount),
    compareAtPrice: relatedProduct.compareAtPriceRange?.minVariantPrice?.amount 
      ? parseFloat(relatedProduct.compareAtPriceRange.minVariantPrice.amount) 
      : undefined,
    image: relatedProduct.images.edges[0]?.node.url || '/images/placeholder.png',
    handle: relatedProduct.handle,
    specs: {
      'Peso máximo': relatedProduct.metafields?.maxWeight || '120 kg',
      'Altura ajustable': relatedProduct.metafields?.adjustableHeight || '45-55 cm',
      'Material del asiento': relatedProduct.metafields?.seatMaterial || 'Espuma de alta densidad',
      'Material de la estructura': relatedProduct.metafields?.frameMaterial || 'Aluminio reforzado',
      'Altura total': relatedProduct.metafields?.height || '110-120 cm',
      'Ancho del asiento': relatedProduct.metafields?.seatWidth || '50 cm',
      'Profundidad del asiento': relatedProduct.metafields?.seatDepth || '48 cm',
      'Altura del respaldo': relatedProduct.metafields?.backrestHeight || '65 cm',
    }
  }));

  return (
    <div className="product-page max-w-[1200px] mx-auto px-4 py-8">
      <Helmet>
        <title>{product.title} | SillaVida</title>
        <meta name="description" content={product.description} />
      </Helmet>

      {/* Product Section Navigation */}
      {getFeatureFlag('productPage.enableSectionNavigation') && (
        <ProductSectionNav sections={productSections} offset={80} />
      )}

      {/* Breadcrumb Navigation */}
      <div className="breadcrumb mb-6">
        <div className="breadcrumb-item">
          <Link to="/">Inicio</Link>
          <span className="breadcrumb-separator">
            <ChevronRight size={16} />
          </span>
        </div>
        {product.collections?.edges[0] && (
          <div className="breadcrumb-item">
            <Link to={`/category/${product.collections.edges[0].node.handle}`}>
              {product.collections.edges[0].node.title}
            </Link>
            <span className="breadcrumb-separator">
              <ChevronRight size={16} />
            </span>
          </div>
        )}
        <div className="breadcrumb-item">
          <span>{product.title}</span>
        </div>
      </div>

      {/* Cart Success Message */}
      <AnimatePresence>
        {cartSuccess && (
          <motion.div 
            className="cart-success-message"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Check size={20} />
            <span>¡Producto agregado al carrito!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Hero Section */}
      <section id="product-hero" className="product-section mb-8">
        <div className="product-hero-enhanced">
          <div className="product-images-container">
            {getFeatureFlag('productPage.enableZoomableImages') ? (
              <Suspense fallback={<LoadingPlaceholder />}>
                <DynamicProductGallery 
                  images={heroImages}
                  productTitle={product.title}
                  enable360View={getFeatureFlag('productPage.enable360View') && heroImages.length >= 8}
                />
              </Suspense>
            ) : (
              <div className="standard-product-image">
                <img 
                  src={heroImages[0]} 
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
          
          <div className="product-info-container">
            <ProductHeroShowcase 
              productTitle={product.title}
              productSubtitle={productSubtitle}
              price={price}
              compareAtPrice={compareAtPrice}
              inStock={inStock}
              variantId={selectedVariantId}
            />
          </div>
        </div>
      </section>

      {/* Chair Features Section */}
      <section id="product-features" className="product-section mb-8">
        <div className="section-header">
          <h2>Características Ergonómicas</h2>
        </div>
        <div className="section-content">
          <Suspense fallback={<LoadingPlaceholder />}>
            <DynamicChairFeatures />
          </Suspense>
        </div>
      </section>

      {/* Product Specifications Section */}
      <section id="product-specs" className="product-section mb-8">
        <div className="section-header">
          <h2>Especificaciones</h2>
        </div>
        <div className="section-content">
          <ProductSpecifications 
            specs={productSpecs}
            certifications={['ANSI/BIFMA', 'ISO 9001', 'Ergonomic Certified']}
          />
        </div>
      </section>

      {/* Product Features Section */}
      <section className="product-section mb-8">
        <div className="section-header">
          <h2>Características Destacadas</h2>
        </div>
        <div className="section-content">
          <Suspense fallback={<LoadingPlaceholder />}>
            <DynamicProductFeatures features={productFeatures} />
          </Suspense>
        </div>
      </section>

      {/* Vida Benefits Section */}
      <section id="product-benefits" className="product-section mb-8">
        <div className="section-header">
          <h2>Beneficios Vida</h2>
        </div>
        <div className="section-content">
          <Suspense fallback={<LoadingPlaceholder />}>
            <DynamicVidaBenefits benefits={vidaBenefits} />
          </Suspense>
        </div>
      </section>

      {/* Experiencias Vida (Judge.me Reviews) Section */}
      <section id="product-reviews" className="product-section mb-8">
        <div className="section-header">
          <h2>Experiencias Vida</h2>
        </div>
        <div className="section-content">
          <Suspense fallback={<LoadingPlaceholder />}>
            <DynamicJudgeMeReviews 
              productId={product.id}
              language="es"
            />
          </Suspense>
        </div>
      </section>

      {/* Related Products Section */}
      <section id="product-related" className="product-section">
        <div className="section-header">
          <h2>Productos Relacionados</h2>
        </div>
        <div className="section-content">
          <Suspense fallback={<LoadingPlaceholder />}>
            <DynamicRelatedProducts products={relatedProducts} />
          </Suspense>
        </div>
      </section>
      
      {/* Sticky Add to Cart for Mobile */}
      {getFeatureFlag('productPage.enableStickyAddToCart') && (
        <StickyAddToCart 
          productTitle={product.title}
          price={price}
          compareAtPrice={compareAtPrice}
          inStock={inStock}
          variantId={selectedVariantId}
          thumbnailUrl={heroImages[0]}
        />
      )}
      
      {/* Product Comparison */}
      {getFeatureFlag('productPage.enableProductComparison') && (
        <Suspense fallback={<LoadingPlaceholder />}>
          <DynamicProductComparison 
            currentProduct={currentProductForComparison}
            suggestedProducts={relatedProductsForComparison}
          />
        </Suspense>
      )}
    </div>
  );
};

export default ProductPage;
