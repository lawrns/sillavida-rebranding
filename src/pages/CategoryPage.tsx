import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion
import { getProductsByCollection, getCollections } from '../lib/shopify';
import type { ShopifyProduct } from '../types/shopify';
import ShopifyProductCard from '../components/ShopifyProductCard';
import Pagination from '../components/Pagination';
import { ChevronRight, Filter, SortAsc, X, Search } from 'lucide-react';

// Define filter types
type PriceRange = 'under-1000' | '1000-3000' | '3000-5000' | 'over-5000';
type Color = 'black' | 'white' | 'gray' | 'red';
type Material = 'leather' | 'mesh' | 'fabric' | 'plastic';

interface Filters {
  price: PriceRange[];
  color: Color[];
  material: Material[];
}

const CategoryPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse URL parameters
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [collection, setCollection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Initialize state from URL parameters
  const [sortBy, setSortBy] = useState(queryParams.get('sort') || 'default');
  const [filters, setFilters] = useState<Filters>({
    price: (queryParams.get('price')?.split(',') as PriceRange[]) || [],
    color: (queryParams.get('color')?.split(',') as Color[]) || [],
    material: (queryParams.get('material')?.split(',') as Material[]) || []
  });
  const [activeFilters, setActiveFilters] = useState<Filters>({
    price: (queryParams.get('price')?.split(',') as PriceRange[]) || [],
    color: (queryParams.get('color')?.split(',') as Color[]) || [],
    material: (queryParams.get('material')?.split(',') as Material[]) || []
  });
  const [activeFilterCount, setActiveFilterCount] = useState(
    (queryParams.get('price')?.split(',').length || 0) +
    (queryParams.get('color')?.split(',').length || 0) +
    (queryParams.get('material')?.split(',').length || 0)
  );
  
  // Search state
  const [searchQuery, setSearchQuery] = useState(queryParams.get('q') || '');
  const [isSearching, setIsSearching] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(parseInt(queryParams.get('page') || '1'));
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [productsPerPage, setProductsPerPage] = useState(parseInt(queryParams.get('limit') || '20'));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Update URL when filters, search, or pagination changes
  useEffect(() => {
    if (!handle) return;
    
    const params = new URLSearchParams();
    
    // Add sort parameter
    if (sortBy !== 'default') {
      params.set('sort', sortBy);
    }
    
    // Add filter parameters
    if (activeFilters.price.length > 0) {
      params.set('price', activeFilters.price.join(','));
    }
    
    if (activeFilters.color.length > 0) {
      params.set('color', activeFilters.color.join(','));
    }
    
    if (activeFilters.material.length > 0) {
      params.set('material', activeFilters.material.join(','));
    }
    
    // Add search parameter
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    
    // Add pagination parameters
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    
    if (productsPerPage !== 20) {
      params.set('limit', productsPerPage.toString());
    }
    
    // Update URL
    const newSearch = params.toString();
    if (newSearch !== location.search.substring(1)) {
      navigate(`/category/${handle}${newSearch ? `?${newSearch}` : ''}`, { replace: true });
    }
  }, [handle, sortBy, activeFilters, searchQuery, currentPage, productsPerPage, navigate, location.search]);

  useEffect(() => {
    const fetchData = async () => {
      if (!handle) return;
      
      setLoading(true);
      try {
        // Fetch products for this collection
        const result = await getProductsByCollection(handle, productsPerPage);
        setProducts(result.products);
        setHasNextPage(result.pageInfo.hasNextPage);
        setEndCursor(result.pageInfo.endCursor);
        
        // Fetch collection details
        const collections = await getCollections();
        const currentCollection = collections.find((c: { handle: string }) => c.handle === handle);
        setCollection(currentCollection || null);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Reset pagination when handle changes
    setCurrentPage(1);
    setEndCursor(null);
    setProducts([]);
    
    fetchData();
  }, [handle, productsPerPage]);
  
  // Load more products
  const loadMoreProducts = async () => {
    if (!handle || !hasNextPage || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      // Convert null to undefined for the cursor parameter
      const cursor = endCursor || undefined;
      const result = await getProductsByCollection(handle, productsPerPage, cursor);
      setProducts(prevProducts => [...prevProducts, ...result.products]);
      setHasNextPage(result.pageInfo.hasNextPage);
      setEndCursor(result.pageInfo.endCursor);
      setCurrentPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (type: keyof Filters, value: PriceRange | Color | Material) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      // Type guard to ensure we're adding the right type of value to the right array
      if (type === 'price' && isPriceRange(value)) {
        if (newFilters.price.includes(value)) {
          newFilters.price = newFilters.price.filter(item => item !== value);
        } else {
          newFilters.price = [...newFilters.price, value];
        }
      } else if (type === 'color' && isColor(value)) {
        if (newFilters.color.includes(value)) {
          newFilters.color = newFilters.color.filter(item => item !== value);
        } else {
          newFilters.color = [...newFilters.color, value];
        }
      } else if (type === 'material' && isMaterial(value)) {
        if (newFilters.material.includes(value)) {
          newFilters.material = newFilters.material.filter(item => item !== value);
        } else {
          newFilters.material = [...newFilters.material, value];
        }
      }
      
      return newFilters;
    });
  };
  
  // Type guards for filter values
  const isPriceRange = (value: any): value is PriceRange => {
    return ['under-1000', '1000-3000', '3000-5000', 'over-5000'].includes(value);
  };
  
  const isColor = (value: any): value is Color => {
    return ['black', 'white', 'gray', 'red'].includes(value);
  };
  
  const isMaterial = (value: any): value is Material => {
    return ['leather', 'mesh', 'fabric', 'plastic'].includes(value);
  };

  // Apply filters
  const applyFilters = () => {
    setActiveFilters(filters);
    setActiveFilterCount(
      filters.price.length + filters.color.length + filters.material.length
    );
    setFilterOpen(false);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      price: [],
      color: [],
      material: []
    });
    setActiveFilters({
      price: [],
      color: [],
      material: []
    });
    setActiveFilterCount(0);
  };

  // Check if a product matches the active filters
  const matchesFilters = (product: ShopifyProduct) => {
    const price = parseFloat(product.priceRange.minVariantPrice.amount);
    
    // If no filters are active, show all products
    if (activeFilterCount === 0) return true;
    
    // Check price filters
    if (activeFilters.price.length > 0) {
      const matchesPrice = activeFilters.price.some(range => {
        switch (range) {
          case 'under-1000':
            return price < 1000;
          case '1000-3000':
            return price >= 1000 && price <= 3000;
          case '3000-5000':
            return price >= 3000 && price <= 5000;
          case 'over-5000':
            return price > 5000;
          default:
            return false;
        }
      });
      
      if (activeFilters.price.length > 0 && !matchesPrice) return false;
    }
    
    // For color and material, we would need product variant data
    // This is a simplified implementation since we don't have that data yet
    // In a real implementation, we would check product.variants for color and material
    
    return true;
  };

  // Check if a product matches the search query
  const matchesSearch = (product: ShopifyProduct) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    
    // Search in title
    if (product.title.toLowerCase().includes(query)) return true;
    
    // Search in description
    if (product.description.toLowerCase().includes(query)) return true;
    
    // Search in variant titles (if available)
    if (product.variants && product.variants.edges.some(edge => 
      edge.node.title.toLowerCase().includes(query)
    )) return true;
    
    return false;
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    return [...products]
      .filter(product => matchesFilters(product) && matchesSearch(product))
      .sort((a, b) => {
        const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
        const priceB = parseFloat(b.priceRange.minVariantPrice.amount);
        
        switch (sortBy) {
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          case 'name-asc':
            return a.title.localeCompare(b.title);
          case 'name-desc':
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
  }, [products, activeFilters, activeFilterCount, sortBy, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal"></div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Categoría no encontrada</p>
      </div>
    );
  }

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
      className="max-w-7xl mx-auto px-4 py-8"
    >
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-teal">Inicio</a>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="font-medium text-gray-900">{collection.title}</span>
      </div>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{collection.title}</h1>
        {collection.description && (
          <p className="text-gray-600">{collection.description}</p>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 ${
              activeFilterCount > 0 ? 'border-teal text-teal' : ''
            }`}
          >
            <Filter className="h-5 w-5" />
            <span>Filtrar</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-teal text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          
          {activeFilterCount > 0 && (
            <button 
              onClick={resetFilters}
              className="text-sm text-gray-500 hover:text-teal"
              title="Limpiar todos los filtros"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <SortAsc className="h-5 w-5 text-gray-500" />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal"
          >
            <option value="default">Ordenar por</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="name-asc">Nombre: A-Z</option>
            <option value="name-desc">Nombre: Z-A</option>
          </select>
        </div>
      </div>

      {/* Filter Panel (hidden by default) */}
      {filterOpen && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Filtros</h3>
            {activeFilterCount > 0 && (
              <button 
                onClick={resetFilters}
                className="text-sm text-teal hover:text-teal-light flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                Limpiar filtros
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Precio</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2"
                    checked={filters.price.includes('under-1000')}
                    onChange={() => handleFilterChange('price', 'under-1000')}
                  />
                  <span>Menos de $1,000</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2"
                    checked={filters.price.includes('1000-3000')}
                    onChange={() => handleFilterChange('price', '1000-3000')}
                  />
                  <span>$1,000 - $3,000</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2"
                    checked={filters.price.includes('3000-5000')}
                    onChange={() => handleFilterChange('price', '3000-5000')}
                  />
                  <span>$3,000 - $5,000</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2"
                    checked={filters.price.includes('over-5000')}
                    onChange={() => handleFilterChange('price', 'over-5000')}
                  />
                  <span>Más de $5,000</span>
                </label>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Color</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2"
                    checked={filters.color.includes('black')}
                    onChange={() => handleFilterChange('color', 'black')}
                  />
                  <span>Negro</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2"
                    checked={filters.color.includes('white')}
                    onChange={() => handleFilterChange('color', 'white')}
                  />
                  <span>Blanco</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2"
                    checked={filters.color.includes('gray')}
                    onChange={() => handleFilterChange('color', 'gray')}
                  />
                  <span>Gris</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2"
                    checked={filters.color.includes('red')}
                    onChange={() => handleFilterChange('color', 'red')}
                  />
                  <span>Rojo</span>
                </label>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Material</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2"
                    checked={filters.material.includes('leather')}
                    onChange={() => handleFilterChange('material', 'leather')}
                  />
                  <span>Cuero</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2"
                    checked={filters.material.includes('mesh')}
                    onChange={() => handleFilterChange('material', 'mesh')}
                  />
                  <span>Malla</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2"
                    checked={filters.material.includes('fabric')}
                    onChange={() => handleFilterChange('material', 'fabric')}
                  />
                  <span>Tela</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2"
                    checked={filters.material.includes('plastic')}
                    onChange={() => handleFilterChange('material', 'plastic')}
                  />
                  <span>Plástico</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6 gap-3">
            <button 
              onClick={() => setFilterOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button 
              onClick={applyFilters}
              className="bg-teal text-white px-4 py-2 rounded hover:bg-teal-light"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Product Grid */}
      {filteredAndSortedProducts.length > 0 ? (
        <>
          <div id="product-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product: ShopifyProduct) => (
              <ShopifyProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-12">
            {isLoadingMore ? (
              <div className="flex justify-center">
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-5 w-5 mr-2 border-t-2 border-b-2 border-teal rounded-full"></span>
                  Cargando...
                </span>
              </div>
            ) : (
              <Pagination 
                currentPage={currentPage}
                totalPages={Math.ceil(filteredAndSortedProducts.length / productsPerPage) || 1}
                onPageChange={(page: number) => {
                  // If we're going to a page we haven't loaded yet, load more products
                  if (page > currentPage && hasNextPage) {
                    loadMoreProducts();
                  } else {
                    // Otherwise just update the current page
                    setCurrentPage(page);
                    // Scroll to top of products
                    window.scrollTo({
                      top: document.getElementById('product-grid')?.offsetTop || 0,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="mb-8"
              />
            )}
          </div>
          
          {/* Products per page selector */}
          <div className="mt-8 flex justify-end">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Productos por página:</span>
              <select
                value={productsPerPage}
                onChange={(e) => setProductsPerPage(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal"
              >
                <option value={12}>12</option>
                <option value={20}>20</option>
                <option value={36}>36</option>
                <option value={48}>48</option>
              </select>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No se encontraron productos en esta categoría.</p>
        </div>
      )}
    </motion.div>
  );
};

export default CategoryPage;
