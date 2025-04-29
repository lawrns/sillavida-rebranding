import React, { Suspense, lazy, ComponentType } from 'react';

interface DynamicImportProps {
  /** Component to show while loading the lazy component */
  fallback: React.ReactNode;
  /** Children to render inside the lazy component */
  children?: React.ReactNode;
}

/**
 * Creates a dynamically imported component with Suspense
 * 
 * @param importFunc - Function that returns a dynamic import
 * @returns A component that will be loaded dynamically
 */
export function createDynamicComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  const LazyComponent = lazy(importFunc);
  
  return function DynamicComponent(props: React.ComponentProps<T> & DynamicImportProps) {
    const { fallback, children, ...componentProps } = props;
    
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...componentProps as any}>
          {children}
        </LazyComponent>
      </Suspense>
    );
  };
}

/**
 * Higher-order component for dynamic imports with error boundary
 */
export class ErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dynamic import error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

/**
 * Wrapper component for dynamic imports with error boundary
 */
export function DynamicImport({ 
  component: Component, 
  fallback, 
  errorFallback,
  ...props 
}: { 
  component: React.ComponentType<any>; 
  fallback: React.ReactNode;
  errorFallback: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
