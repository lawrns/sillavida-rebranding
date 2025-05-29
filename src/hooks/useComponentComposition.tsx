/**
 * Component Composition Utilities
 * Reduces coupling through composition patterns and dependency injection
 */

import React, { useCallback, useMemo, ReactNode } from 'react';

// Generic component composition interface
export interface ComponentComposition<T = any> {
  data: T;
  loading: boolean;
  error: string | null;
  render: (props: any) => ReactNode;
  actions: Record<string, (...args: any[]) => void>;
}

/**
 * Hook for creating composed components with dependency injection
 */
export function useComponentComposition<T>(
  dataSource: () => Promise<T> | T,
  actions: Record<string, (...args: any[]) => void> = {},
  renderFunction?: (data: T, actions: any) => ReactNode
): ComponentComposition<T> {
  
  const composedActions = useMemo(() => {
    return Object.keys(actions).reduce((acc, key) => {
      acc[key] = useCallback(actions[key], [actions[key]]);
      return acc;
    }, {} as Record<string, (...args: any[]) => void>);
  }, [actions]);

  const renderComponent = useCallback((props: any) => {
    if (renderFunction && props.data) {
      return renderFunction(props.data, composedActions);
    }
    return null;
  }, [renderFunction, composedActions]);

  return {
    data: {} as T, // Would be populated by data source
    loading: false,
    error: null,
    render: renderComponent,
    actions: composedActions
  };
}

/**
 * Factory for creating decoupled product components
 */
export interface ProductComponentProps {
  productId: string;
  variant?: 'card' | 'showcase' | 'list';
  actions?: {
    onAddToCart?: (productId: string, quantity: number) => void;
    onView?: (productId: string) => void;
    onCompare?: (productId: string) => void;
  };
}

export function createProductComponent(
  baseComponent: React.ComponentType<any>
) {
  return function ComposedProductComponent(props: ProductComponentProps) {
    const { actions = {} } = props;
    
    // Inject actions without tight coupling
    const composedProps = {
      ...props,
      onAddToCart: actions.onAddToCart || (() => {}),
      onView: actions.onView || (() => {}),
      onCompare: actions.onCompare || (() => {})
    };
    
    return React.createElement(baseComponent, composedProps);
  };
}

/**
 * Higher-order component for state injection without coupling
 */
export function withDecoupledState<T>(
  WrappedComponent: React.ComponentType<T>,
  stateProvider: () => any
) {
  return function DecoupledComponent(props: T) {
    const injectedState = stateProvider();
    
    return React.createElement(WrappedComponent, {
      ...props,
      ...injectedState
    });
  };
}

/**
 * Event delegation system to reduce component coupling
 */
export class EventBus {
  private events: Map<string, Set<(...args: any[]) => void>> = new Map();
  
  subscribe(event: string, callback: (...args: any[]) => void) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.events.get(event)?.delete(callback);
    };
  }
  
  emit(event: string, ...args: any[]) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(...args));
    }
  }
  
  clear() {
    this.events.clear();
  }
}

// Global event bus instance
export const globalEventBus = new EventBus();

/**
 * Hook for using event bus in components
 */
export function useEventBus() {
  return globalEventBus;
}

/**
 * Component registry for dynamic loading and reduced coupling
 */
class ComponentRegistry {
  private components: Map<string, React.ComponentType<any>> = new Map();
  
  register<T>(name: string, component: React.ComponentType<T>) {
    this.components.set(name, component);
  }
  
  get(name: string): React.ComponentType<any> | undefined {
    return this.components.get(name);
  }
  
  exists(name: string): boolean {
    return this.components.has(name);
  }
  
  list(): string[] {
    return Array.from(this.components.keys());
  }
}

export const componentRegistry = new ComponentRegistry();

/**
 * Hook for dynamic component loading
 */
export function useDynamicComponent(componentName: string) {
  return useMemo(() => {
    return componentRegistry.get(componentName);
  }, [componentName]);
}

/**
 * Utility for creating loosely coupled feature modules
 */
export interface FeatureModule {
  name: string;
  components: Record<string, React.ComponentType<any>>;
  services: Record<string, any>;
  state?: any;
}

export function createFeatureModule(module: FeatureModule) {
  // Register components
  Object.keys(module.components).forEach(name => {
    componentRegistry.register(`${module.name}.${name}`, module.components[name]);
  });
  
  // Return module interface
  return {
    name: module.name,
    getComponent: (name: string) => componentRegistry.get(`${module.name}.${name}`),
    getService: (name: string) => module.services[name],
    state: module.state
  };
}

/**
 * Props injection utility to reduce prop drilling
 */
export function createPropsProvider<T>(defaultProps: T) {
  const PropsContext = React.createContext<T>(defaultProps);
  
  const Provider: React.FC<{ value: T; children: ReactNode }> = ({ value, children }) => (
    <PropsContext.Provider value={value}>
      {children}
    </PropsContext.Provider>
  );
  
  const useProps = () => {
    const context = React.useContext(PropsContext);
    if (!context) {
      throw new Error('useProps must be used within PropsProvider');
    }
    return context;
  };
  
  return { Provider, useProps };
}