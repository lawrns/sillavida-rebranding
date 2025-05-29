import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductsByCollection } from '../../lib/shopify';
import { transformShopifyProduct, getProductPrimaryImage, getProductUrl } from '../../utils/business/productTransformer';
import { getProductPriceDisplay } from '../../utils/business/priceFormatter';
import './RelatedProducts.css';

interface RelatedProductsProps {
  currentProductId: string;
  limit?: number;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  currentProductId, 
  limit = 4 
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch products from the "tienda" collection
        const result = await getProductsByCollection('tienda', limit + 4); // Fetch extra to allow for filtering
        
        // Filter out the current product
        let filteredProducts = result.products.filter((p: any) => p.id !== currentProductId);
        
        // Randomize the order of products
        filteredProducts = shuffleArray(filteredProducts);
        
        // Limit to the specified number
        filteredProducts = filteredProducts.slice(0, limit);
        
        setProducts(filteredProducts);
      } catch (err) {
        console.error('Error fetching related products:', err);
        setError('No se pudieron cargar los productos relacionados.');
        
        // Try fallback to "all" collection if "tienda" fails
        try {
          const fallbackResult = await getProductsByCollection('all', limit + 4);
          let fallbackProducts = fallbackResult.products.filter((p: any) => p.id !== currentProductId);
          fallbackProducts = shuffleArray(fallbackProducts);
          fallbackProducts = fallbackProducts.slice(0, limit);
          setProducts(fallbackProducts);
          setError(null); // Clear error if fallback succeeds
        } catch (fallbackErr) {
          console.error('Error fetching fallback related products:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, limit]);

  // Function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Format price with currency
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return <div className="related-products-loading">Cargando productos relacionados...</div>;
  }

  if (error || products.length === 0) {
    return null; // Don't show anything if there's an error or no products
  }

  return (
    <section className="related-products-section">
      <h2 className="section-title">Productos relacionados</h2>
      <div className="related-products-grid">
        {products.map((product: any) => {
          try {
            // Use centralized transformation utilities
            const standardProduct = transformShopifyProduct(product);
            const primaryImage = getProductPrimaryImage(standardProduct);
            const productUrl = getProductUrl(standardProduct);
            const priceDisplay = getProductPriceDisplay(
              standardProduct.price,
              standardProduct.compareAtPrice
            );
            
            return (
              <Link 
                to={productUrl} 
                key={standardProduct.id}
                className="related-product-card"
              >
                <div className="related-product-image-container">
                  <img 
                    src={primaryImage?.url || '/images/placeholder.png'} 
                    alt={standardProduct.title} 
                    className="related-product-image"
                  />
                {priceDisplay.discount > 0 && (
                  <div className="related-product-discount">-{priceDisplay.discount}%</div>
                )}
              </div>
              <div className="related-product-info">
                <h3 className="related-product-title">{standardProduct.title}</h3>
                <div className="related-product-price">
                  {priceDisplay.current}
                  {priceDisplay.original && (
                    <span className="related-product-original-price">
                      {priceDisplay.original}
                    </span>
                  )}
                </div>
              </div>
            </Link>
            );
          } catch (error) {
            console.warn('Product transformation failed for related product:', error);
            // Fallback to original rendering logic
            const price = product.priceRange?.minVariantPrice?.amount 
              ? parseFloat(product.priceRange.minVariantPrice.amount) 
              : 0;
            const featuredImage = product.images?.edges?.[0]?.node?.url || '';
            
            return (
              <Link 
                to={`/product/${product.handle}`} 
                key={product.id}
                className="related-product-card"
              >
                <div className="related-product-image-container">
                  <img 
                    src={featuredImage} 
                    alt={product.title} 
                    className="related-product-image"
                  />
                </div>
                <div className="related-product-info">
                  <h3 className="related-product-title">{product.title}</h3>
                  <div className="related-product-price">
                    ${price.toLocaleString()}
                  </div>
                </div>
              </Link>
            );
          }
        })}
      </div>
    </section>
  );
};

export default RelatedProducts;
