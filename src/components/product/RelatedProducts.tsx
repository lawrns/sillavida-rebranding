import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getProductsByCollection } from '../../lib/shopify';
import ShopifyProductCard from '../ShopifyProductCard';
import type { ShopifyProduct } from '../../types/shopify';
import './RelatedProducts.css';

interface RelatedProductsProps {
  currentProductId: string;
  limit?: number;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  currentProductId, 
  limit = 4 
}) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
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
        let filteredProducts = result.products.filter((p: ShopifyProduct) => p.id !== currentProductId);
        
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
          let fallbackProducts = fallbackResult.products.filter((p: ShopifyProduct) => p.id !== currentProductId);
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
  const shuffleArray = (array: ShopifyProduct[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
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
        {products.map((product: ShopifyProduct, index: number) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ShopifyProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
