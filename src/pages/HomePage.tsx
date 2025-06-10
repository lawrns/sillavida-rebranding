import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { createLazyComponent } from '../components/common/LazyComponent';
import {
  HeroSection,
  ReviewsSection,
  BenefitsSection,
  BestSellersSection,
  EmailSubscriptionSection
} from '../components/homepage';
import ProductCarousel from '../components/homepage/ProductCarousel';
import GuaranteeSection from '../components/homepage/GuaranteeSection';
import BannerTest from '../components/homepage/BannerTest';
import UGCSection from '../components/ugc/UGCSection';
import { getProducts, getFeaturedProducts, shopifyClient } from '../lib/shopify';
import type { ShopifyProduct } from '../types/shopify';
import { errorHandler } from '../utils/errorHandler';
import { getFeatureFlag } from '../config/featureFlags';
import { useMinimalCart } from '../hooks/useMinimalCart';

// Lazy load additional components
const LazyPersonalizedBanner = createLazyComponent(() => import('../components/PersonalizedBanner'));
const LazyErgonomicEducationalSectionCondensed = createLazyComponent(() => import('../components/ErgonomicEducationalSectionCondensed'));

// Analytics tracking function
const trackEvent = (eventName: string, eventData: Record<string, any> = {}) => {
  // In a real implementation, this would send data to an analytics service
  // For now, we'll just log to console
  console.log(`[Analytics] ${eventName}:`, eventData);

  // Example implementation with Google Analytics
  // if (window.gtag) {
  //   window.gtag('event', eventName, eventData);
  // }
};

const HomePage = () => {
  // Cart state for hiding buttons when cart is open
  const { isCartOpen } = useMinimalCart();
  
  // State for Shopify data (simplified for composition pattern)
  const [bestSellers, setBestSellers] = useState<ShopifyProduct[]>([]);
  const [allProducts, setAllProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch data from Shopify with retry logic
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Track page view
      trackEvent('page_view', { page: 'home' });

      // Fetch all products for carousel (limit 20 for performance)
      const allProductsResult = await getProducts(20, 'CREATED_AT');
      setAllProducts(allProductsResult.products);

      // Fetch products from Mas Vendidos collection
      const masVendidosProducts = await getFeaturedProducts({
        collectionHandle: 'mas-vendidos',
        limit: 6
      });

      let productData = masVendidosProducts;

      if (masVendidosProducts.length > 0) {
        setBestSellers(masVendidosProducts);
      } else {
        // If no products in Mas Vendidos collection, fall back to best sellers
        const result = await getProducts(6, 'BEST_SELLING');
        setBestSellers(result.products);
        productData = result.products;
      }

      // Set loading and data states
      setIsLoading(false);
      setDataFetched(true);
      setError(null);

      // Track successful data load with the actual data we just fetched
      trackEvent('data_loaded', {
        bestSellers: productData.length,
        allProducts: allProductsResult.products.length
      });

    } catch (error) {
      errorHandler.handleError(error as Error, {
        component: 'HomePage',
        action: 'fetchShopifyData'
      });

      // Track error
      trackEvent('data_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        retryCount
      });

      // Retry logic (max 3 retries)
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
        setError(`Failed to load products. Retrying... (${retryCount + 1}/3)`);

        // Retry after a delay
        setTimeout(() => {
          fetchData();
        }, 2000);
      } else {
        // After all retries failed, use static data
        setError('No se pudieron cargar los productos. Mostrando contenido alternativo.');
        setIsLoading(false);
        setDataFetched(true); // Mark as fetched so we show static data instead of loading indefinitely
      }
    }
  }, [retryCount]);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();

    // Clear cache when component unmounts
    return () => {
      // This ensures fresh data on next visit
      shopifyClient.clearCache();
    };
  }, [fetchData]);

  // Page transition variants
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

  // Show centralized loading screen while data is being fetched
  if (isLoading && !dataFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="rounded-full h-16 w-16 border-t-4 border-b-4 border-black mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.h2
            className="text-2xl font-bold text-black mb-2"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Cargando Silla Vida
          </motion.h2>
          <motion.p
            className="text-gray-600"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Preparando nuestros productos ergonómicos para ti...
          </motion.p>
          {error && (
            <motion.p
              className="text-sm text-gray-500 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {error}
            </motion.p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="flex flex-col"
    >
      {/* Feature flagged banner test - can be toggled in config/featureFlags.ts */}
      {getFeatureFlag('homepage.enableBannerTest') ? (
        <BannerTest />
      ) : (
        <HeroSection />
      )}

      <BenefitsSection />

      {/* Pass isLoading={false} since we handle loading centrally */}
      <ProductCarousel products={allProducts} isLoading={false} />

      <UGCSection />

      <ReviewsSection />

      <LazyPersonalizedBanner />

      {/* Pass isLoading={false} since we handle loading centrally */}
      <BestSellersSection
        bestSellers={bestSellers}
        isLoading={false}
        dataFetched={dataFetched}
      />

      <LazyErgonomicEducationalSectionCondensed />

      <GuaranteeSection />

      {/* Back to Top Button - Hide when cart is open - Below WhatsApp */}
      {!isCartOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-black text-white p-2.5 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
            aria-label="Volver al inicio"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default HomePage;