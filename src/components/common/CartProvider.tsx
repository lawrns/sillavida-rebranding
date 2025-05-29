/**
 * Decoupled Cart Provider
 * Reduces tight coupling by providing minimal cart interface
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useCart as useCartInternal } from '../../context/CartContext';

// Minimal cart interface to reduce coupling
interface DecoupledCartInterface {
  // Essential state (read-only)
  itemCount: number;
  cartTotal: string;
  isLoading: boolean;
  
  // Essential actions (minimal interface)
  addItem: (merchandiseId: string, quantity?: number) => Promise<void>;
  openCart: () => void;
  
  // Optional advanced interface for components that need it
  advanced?: {
    cart: any;
    cartItems: any[];
    removeItem: (lineId: string) => Promise<void>;
    updateItem: (lineId: string, quantity: number) => Promise<void>;
    getCheckout: () => Promise<string>;
    isCartOpen: boolean;
    closeCart: () => void;
    toggleCart: () => void;
  };
}

const DecoupledCartContext = createContext<DecoupledCartInterface | undefined>(undefined);

/**
 * Hook for minimal cart access (reduces coupling)
 */
export const useMinimalCart = () => {
  const context = useContext(DecoupledCartContext);
  if (!context) {
    throw new Error('useMinimalCart must be used within DecoupledCartProvider');
  }
  
  // Return only essential interface
  return {
    itemCount: context.itemCount,
    cartTotal: context.cartTotal,
    isLoading: context.isLoading,
    addItem: context.addItem,
    openCart: context.openCart
  };
};

/**
 * Hook for full cart access (for components that need it)
 */
export const useFullCart = () => {
  const context = useContext(DecoupledCartContext);
  if (!context) {
    throw new Error('useFullCart must be used within DecoupledCartProvider');
  }
  
  if (!context.advanced) {
    throw new Error('Full cart interface not available');
  }
  
  return {
    // Essential interface
    ...useMinimalCart(),
    // Advanced interface
    ...context.advanced
  };
};

interface DecoupledCartProviderProps {
  children: ReactNode;
  enableAdvanced?: boolean; // Allow opt-in to full interface
}

/**
 * Decoupled Cart Provider that reduces component coupling
 */
export const DecoupledCartProvider: React.FC<DecoupledCartProviderProps> = ({ 
  children, 
  enableAdvanced = false 
}) => {
  const fullCart = useCartInternal();
  
  const minimalInterface: DecoupledCartInterface = {
    itemCount: fullCart.cartCount,
    cartTotal: fullCart.cartTotal,
    isLoading: fullCart.isLoading,
    addItem: fullCart.addItem,
    openCart: fullCart.openCart,
    
    // Conditionally provide advanced interface
    advanced: enableAdvanced ? {
      cart: fullCart.cart,
      cartItems: fullCart.cartItems,
      removeItem: fullCart.removeItem,
      updateItem: fullCart.updateItem,
      getCheckout: fullCart.getCheckout,
      isCartOpen: fullCart.isCartOpen,
      closeCart: fullCart.closeCart,
      toggleCart: fullCart.toggleCart
    } : undefined
  };
  
  return (
    <DecoupledCartContext.Provider value={minimalInterface}>
      {children}
    </DecoupledCartContext.Provider>
  );
};