import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { createLazyComponent } from '../components/common/LazyComponent';
import {
  HeroSection,
  ReviewsSection,
  BenefitsSection,
  BestSellersSection,
  CategoriesSection,
  TestimonialsSection,
  EmailSubscriptionSection
} from '../components/homepage';
import GuaranteeSection from '../components/homepage/GuaranteeSection';
import BannerTest from '../components/homepage/BannerTest';
import { getProducts, getFeaturedProducts, getCollections, shopifyClient } from '../lib/shopify';
import type { ShopifyProduct } from '../types/shopify';
import { errorHandler } from '../utils/errorHandler';
import { getFeatureFlag } from '../config/featureFlags';
import './HomePage.css';

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
  // State for Shopify data (simplified for composition pattern)
  const [bestSellers, setBestSellers] = useState<ShopifyProduct[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
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

      // Fetch Shopify collections
      const shopifyCollections = await getCollections(20);
      setCollections(shopifyCollections);

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
        bestSellers: productData.length
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

      <ReviewsSection />

      <LazyPersonalizedBanner />

      <BestSellersSection
        bestSellers={bestSellers}
        isLoading={isLoading}
        dataFetched={dataFetched}
      />

      <CategoriesSection collections={collections} />

      <LazyErgonomicEducationalSectionCondensed />

      <GuaranteeSection />

      {/* Back to Top Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-teal text-white p-3 rounded-full shadow-lg hover:bg-teal-light transition-colors"
          aria-label="Volver al inicio"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default HomePage;