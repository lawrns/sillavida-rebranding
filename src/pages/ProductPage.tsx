import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useCart } from '../context/CartContext';
import { ProductHeroShowcase, ProductDetailSections, RelatedProducts, ProductVideos } from '../components/product';
import ProductReviewsCarousel from '../components/product/ProductReviewsCarousel';
import { getProduct } from '../lib/shopify';
import { extractShopifyId } from '../utils/business/productTransformer';
import { mapProductHandleToChairModel, hasProductReviews } from '../utils/product-review-mapper';
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

  // Judge.me widgets should auto-initialize with the modern widget.js approach
  // No manual initialization needed - the script handles this automatically

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
      <ProductHeroShowcase product={product} />

      {/* Enhanced Product Reviews Section */}
      {handle && hasProductReviews(handle) && (
        <div className="max-w-7xl mx-auto px-4 my-12">
          <ProductReviewsCarousel
            productHandle={mapProductHandleToChairModel(handle)!}
            productName={product.title}
            showHeader={true}
            autoScroll={true}
            className="bg-gray-50 p-6 rounded-2xl"
          />
        </div>
      )}

      {/* Fallback Judge.me Reviews Section for products without enhanced reviews */}
      {handle && !hasProductReviews(handle) && (
        <div className="max-w-7xl mx-auto px-4 my-12">
          <div className="bg-white text-black p-6 rounded-lg shadow-md">
            <div className="mb-6 border-b border-[#E5E5E5] pb-4">
              <h2 className="text-2xl font-semibold font-heading text-black">Opiniones de Nuestros Clientes</h2>
              <p className="text-sm mt-2 text-black/70">Lee lo que nuestros clientes opinan sobre este producto</p>
            </div>
            {/* Judge.me Review Widget - Current Headless API */}
            <div
              className="judgeme_product_reviews"
              data-id={extractShopifyId(product.id)}
              data-limit="5"
              data-show-average-rating="true"
              data-show-product-rating="true"
            ></div>
          </div>
        </div>
      )}

      {/* Product Detail Sections */}
      <div className="product-sections-vertical">
        <ProductDetailSections product={product} />
      </div>

      {/* Dynamic Product Videos Section */}
      <ProductVideos product={product} />

      {/* UGC Media Grid Widget */}
      <div className="max-w-7xl mx-auto px-4 my-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Fotos de Nuestros Clientes</h2>
        {/* Using the exact Judge.me UGC Media Grid code */}
        <div className="jdgm-ugc-media-wrapper" data-product-id={extractShopifyId(product.id)} data-locale="es"></div>
      </div>

      {/* Related Products Section */}
      <RelatedProducts currentProductId={product.id} limit={4} />
    </div>
  );
};

export default ProductPage;
