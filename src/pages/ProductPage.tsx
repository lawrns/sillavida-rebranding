import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useCart } from '../context/CartContext';
import { ProductHeroShowcase, ProductDetailSections, RelatedProducts, ProductVideos } from '../components/product';
import { ReviewWidget } from '../components/judgeMe';
import { getProduct } from '../lib/shopify';
import './ProductPage.css';

const ProductPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cartContext = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const productData = await getProduct(handle);
        console.log('Product data:', productData); // For debugging
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('No pudimos cargar el producto. Por favor, inténtalo de nuevo.');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [handle]);

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
        <button className="retry-button" onClick={() => window.location.reload()}>
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

  return (
    <div className="sillavida-product-page">
      {/* SEO metadata */}
      <Helmet>
        <title>{`${product.title} | SillaVida`}</title>
        <meta name="description" content={product.description?.substring(0, 160) || 'Descubre nuestras sillas ergonómicas de alta calidad'} />
        <meta property="og:title" content={`${product.title} | SillaVida`} />
        <meta property="og:description" content={product.description?.substring(0, 160) || 'Descubre nuestras sillas ergonómicas de alta calidad'} />
        <meta property="og:image" content={product.featuredImage?.url || ''} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Product Hero Section */}
      <ProductHeroShowcase product={product} useCart={cartContext} />

      {/* Judge.me Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 my-12">
        <div className="bg-white text-black p-6 rounded-lg shadow-md">
          <div className="mb-6 border-b border-[#4b7cae]/30 pb-4">
            <h2 className="text-2xl font-semibold font-heading text-black">Opiniones de Nuestros Clientes</h2>
            <p className="text-sm mt-2 text-black/70">Lee lo que nuestros clientes opinan sobre este producto</p>
          </div>
          <ReviewWidget
            productId={product.id}
            productTitle={product.title}
            containerClassName="w-full"
            showIfEmpty={true}
            widgetType="inline"
          />
        </div>
      </div>

      {/* Product Detail Sections */}
      <div className="product-sections-vertical">
        <ProductDetailSections product={product} />
      </div>

      {/* Dynamic Product Videos Section */}
      <ProductVideos product={product} />

      {/* UGC Media Grid Widget */}
      <div className="max-w-7xl mx-auto px-4 my-12">
        <div className="jdgm-ugc-media-wrapper"></div>
      </div>

      {/* Related Products Section */}
      <RelatedProducts currentProductId={product.id} limit={4} />
    </div>
  );
};

export default ProductPage;
