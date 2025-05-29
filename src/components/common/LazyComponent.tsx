import React, { Suspense, lazy, ComponentType } from 'react';
import './LazyComponent.css';

interface LazyComponentProps {
  importFunc: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  props?: Record<string, any>;
}

/**
 * LazyComponent - A wrapper for React.lazy that provides a consistent loading experience
 * 
 * @param {() => Promise<{ default: ComponentType<any> }>} importFunc - A function that returns a dynamic import (e.g., () => import('./MyComponent'))
 * @param {React.ReactNode} [fallback] - Optional custom fallback component to show while loading
 * @param {Record<string, any>} [props] - Props to pass to the loaded component
 */
const LazyComponent: React.FC<LazyComponentProps> = ({
  importFunc,
  fallback,
  props = {},
}) => {
  // Use React.lazy to dynamically import the component
  const Component = lazy(importFunc);
  
  // Default loading fallback
  const defaultFallback = (
    <div className="lazy-component-loading">
      <div className="lazy-component-spinner"></div>
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <Component {...props} />
    </Suspense>
  );
};

/**
 * createLazyComponent - A utility function to create a lazy-loaded component
 * 
 * @param {() => Promise<{ default: ComponentType<P> }>} importFunc - A function that returns a dynamic import
 * @returns {React.FC<P>} A component that will be lazy loaded
 * 
 * Example usage:
 * const LazyProductCard = createLazyComponent(() => import('./ProductCard'));
 * <LazyProductCard productId="123" />
 */
export const createLazyComponent = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>
) => {
  const LazyLoadedComponent: React.FC<P> = (props) => (
    <LazyComponent importFunc={importFunc} props={props} />
  );
  
  return LazyLoadedComponent;
};

export default LazyComponent;
