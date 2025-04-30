import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import './ProductComparison.css';

interface Product {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  handle: string;
  specs?: Record<string, string>;
}

interface ProductComparisonProps {
  currentProduct: Product;
  suggestedProducts?: Product[];
  maxProducts?: number;
}

const ProductComparison: React.FC<ProductComparisonProps> = ({
  currentProduct,
  suggestedProducts = [],
  maxProducts = 3
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [comparedProducts, setComparedProducts] = useState<Product[]>([currentProduct]);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  // Initialize available products from suggested products
  useEffect(() => {
    // Filter out products already in comparison
    const filtered = suggestedProducts.filter(
      product => !comparedProducts.some(p => p.id === product.id)
    );
    setAvailableProducts(filtered);
  }, [suggestedProducts, comparedProducts]);

  // Initialize selected specs from current product
  useEffect(() => {
    if (currentProduct.specs) {
      const specKeys = Object.keys(currentProduct.specs);
      setSelectedSpecs(specKeys.slice(0, 5)); // Start with first 5 specs
    }
  }, [currentProduct]);

  // Open comparison modal
  const openComparison = () => {
    setIsOpen(true);
  };

  // Close comparison modal
  const closeComparison = () => {
    setIsOpen(false);
  };

  // Add product to comparison
  const addProduct = (product: Product) => {
    if (comparedProducts.length < maxProducts) {
      setComparedProducts([...comparedProducts, product]);
      
      // Remove from available products
      setAvailableProducts(availableProducts.filter(p => p.id !== product.id));
    }
  };

  // Remove product from comparison
  const removeProduct = (productId: string) => {
    // Don't allow removing the current product
    if (productId === currentProduct.id) return;
    
    const removedProduct = comparedProducts.find(p => p.id === productId);
    
    setComparedProducts(comparedProducts.filter(p => p.id !== productId));
    
    // Add back to available products if it was from suggested products
    if (removedProduct && suggestedProducts.some(p => p.id === productId)) {
      setAvailableProducts([...availableProducts, removedProduct]);
    }
  };

  // Toggle spec selection
  const toggleSpec = (spec: string) => {
    if (selectedSpecs.includes(spec)) {
      setSelectedSpecs(selectedSpecs.filter(s => s !== spec));
    } else {
      setSelectedSpecs([...selectedSpecs, spec]);
    }
  };

  // Get all available specs from all products
  const getAllSpecs = () => {
    const allSpecs = new Set<string>();
    
    comparedProducts.forEach(product => {
      if (product.specs) {
        Object.keys(product.specs).forEach(spec => allSpecs.add(spec));
      }
    });
    
    return Array.from(allSpecs);
  };

  // Pagination for available products
  const productsPerPage = 3;
  const pageCount = Math.ceil(availableProducts.length / productsPerPage);
  
  const nextPage = () => {
    setCurrentPage(prev => (prev + 1) % pageCount);
  };
  
  const prevPage = () => {
    setCurrentPage(prev => (prev - 1 + pageCount) % pageCount);
  };
  
  const paginatedProducts = availableProducts.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  return (
    <>
      {/* Comparison Button */}
      {comparedProducts.length > 0 && (
        <motion.button
          className="comparison-toggle-btn"
          onClick={openComparison}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          <span>Comparar</span>
        </motion.button>
      )}
      
      {/* Comparison Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="comparison-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeComparison}
          >
            <motion.div
              className="comparison-modal"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="comparison-header">
                <h2>Comparación de Productos</h2>
                <button className="close-btn" onClick={closeComparison} aria-label="Cerrar comparación">
                  <X size={20} />
                </button>
              </div>
              
              <div className="comparison-content">
                {/* Products being compared */}
                <div className="compared-products">
                  {comparedProducts.map(product => (
                    <div key={product.id} className="compared-product">
                      <div className="product-image-container">
                        <img src={product.image} alt={product.title} />
                        {product.id !== currentProduct.id && (
                          <button
                            className="remove-product-btn"
                            onClick={() => removeProduct(product.id)}
                            aria-label={`Eliminar ${product.title} de la comparación`}
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      <h3 className="product-title">{product.title}</h3>
                      <div className="product-price">
                        <span className="current-price">${product.price.toFixed(2)}</span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="compare-price">${product.compareAtPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <a
                        href={`/product/${product.handle}`}
                        className="view-product-link"
                        target={product.id !== currentProduct.id ? '_blank' : undefined}
                        rel={product.id !== currentProduct.id ? 'noopener noreferrer' : undefined}
                      >
                        Ver producto
                        <ChevronRight size={16} />
                      </a>
                    </div>
                  ))}
                  
                  {/* Add product slot */}
                  {comparedProducts.length < maxProducts && (
                    <div className="add-product-slot">
                      <div className="add-product-placeholder">
                        <Plus size={24} />
                        <span>Agregar producto</span>
                      </div>
                      
                      {availableProducts.length > 0 ? (
                        <div className="available-products">
                          <h4>Productos sugeridos</h4>
                          
                          <div className="product-carousel">
                            {pageCount > 1 && (
                              <button
                                className="carousel-nav prev"
                                onClick={prevPage}
                                disabled={pageCount <= 1}
                                aria-label="Productos anteriores"
                              >
                                <ChevronLeft size={20} />
                              </button>
                            )}
                            
                            <div className="carousel-items">
                              {paginatedProducts.map(product => (
                                <div key={product.id} className="carousel-item">
                                  <img src={product.image} alt={product.title} />
                                  <div className="carousel-item-details">
                                    <h5>{product.title}</h5>
                                    <span className="price">${product.price.toFixed(2)}</span>
                                  </div>
                                  <button
                                    className="add-to-comparison-btn"
                                    onClick={() => addProduct(product)}
                                    aria-label={`Agregar ${product.title} a la comparación`}
                                  >
                                    <Plus size={16} />
                                    <span>Agregar</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                            
                            {pageCount > 1 && (
                              <button
                                className="carousel-nav next"
                                onClick={nextPage}
                                disabled={pageCount <= 1}
                                aria-label="Productos siguientes"
                              >
                                <ChevronRight size={20} />
                              </button>
                            )}
                          </div>
                          
                          {pageCount > 1 && (
                            <div className="carousel-pagination">
                              {Array.from({ length: pageCount }).map((_, i) => (
                                <button
                                  key={i}
                                  className={`pagination-dot ${i === currentPage ? 'active' : ''}`}
                                  onClick={() => setCurrentPage(i)}
                                  aria-label={`Página ${i + 1}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="no-products-message">
                          <p>No hay productos adicionales para comparar</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Specs comparison */}
                <div className="specs-comparison">
                  <div className="specs-header">
                    <h3>Especificaciones</h3>
                    <div className="specs-selector">
                      <button
                        className="toggle-specs-btn"
                        onClick={() => setIsOpen(prev => !prev)}
                        aria-label="Seleccionar especificaciones"
                      >
                        Seleccionar especificaciones
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            className="specs-dropdown"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            {getAllSpecs().map(spec => (
                              <label key={spec} className="spec-checkbox">
                                <input
                                  type="checkbox"
                                  checked={selectedSpecs.includes(spec)}
                                  onChange={() => toggleSpec(spec)}
                                />
                                <span>{spec}</span>
                              </label>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  <div className="specs-table">
                    {selectedSpecs.map(spec => (
                      <div key={spec} className="spec-row">
                        <div className="spec-name">{spec}</div>
                        <div className="spec-values">
                          {comparedProducts.map(product => (
                            <div key={product.id} className="spec-value">
                              {product.specs?.[spec] || '-'}
                            </div>
                          ))}
                          {/* Empty slot for potential new product */}
                          {comparedProducts.length < maxProducts && (
                            <div className="spec-value empty"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductComparison;
