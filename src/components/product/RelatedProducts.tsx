import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductsByCollection } from '../../lib/shopify';
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
          const price = product.priceRange?.minVariantPrice?.amount 
            ? parseFloat(product.priceRange.minVariantPrice.amount) 
            : 0;
          
          const compareAtPrice = product.compareAtPriceRange?.minVariantPrice?.amount
            ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
            : null;
          
          const discount = compareAtPrice && compareAtPrice > price 
            ? Math.round((1 - price / compareAtPrice) * 100) 
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
                {discount > 0 && (
                  <div className="related-product-discount">-{discount}%</div>
                )}
              </div>
              <div className="related-product-info">
                <h3 className="related-product-title">{product.title}</h3>
                <div className="related-product-price">
                  {formatPrice(price)}
                  {compareAtPrice && compareAtPrice > price && (
                    <span className="related-product-original-price">
                      {formatPrice(compareAtPrice)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedProducts;
