/**
 * Minimal Cart Interface
 * Provides a minimal interface to cart functionality to reduce tight coupling
 */

import { useCallback } from 'react';
import { useCart } from '../context/CartContext';

// Minimal cart interface - only what most components actually need
export interface MinimalCartInterface {
  // Read-only cart state
  cartCount: number;
  cartTotal: string;
  isLoading: boolean;
  cartItems: any[];
  cart: any;
  cartId: string | null;
  
  // Essential actions
  addToCart: (merchandiseId: string, quantity?: number) => Promise<void>;
  toggleCart: () => void;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  closeCart: () => void;
  
  // Optional state for components that need more
  isCartOpen?: boolean;
}

/**
 * Hook that provides minimal cart interface
 * Components using this hook are less tightly coupled to the full cart context
 */
export function useMinimalCart(): MinimalCartInterface {
  const { 
    cartCount, 
    cartTotal, 
    isLoading,
    isCartOpen,
    cartItems,
    cart,
    cartId,
    addToCart: addToCartContext, 
    toggleCart,
    updateItem,
    removeItem,
    closeCart
  } = useCart();

  // Wrap context method to provide simpler interface
  const addToCart = useCallback(async (merchandiseId: string, quantity = 1) => {
    await addToCartContext(merchandiseId, quantity);
  }, [addToCartContext]);

  return {
    cartCount,
    cartTotal,
    isLoading,
    cartItems,
    cart,
    cartId,
    addToCart,
    toggleCart,
    updateItem,
    removeItem,
    closeCart,
    isCartOpen
  };
}

/**
 * Even more minimal interface for components that only need cart count
 */
export interface CartCountInterface {
  cartCount: number;
  isLoading: boolean;
}

export function useCartCount(): CartCountInterface {
  const { cartCount, isLoading } = useCart();
  
  return {
    cartCount,
    isLoading
  };
}

/**
 * Minimal interface for components that only need to add items
 */
export interface AddToCartInterface {
  addToCart: (merchandiseId: string, quantity?: number) => Promise<void>;
  isLoading: boolean;
}

export function useAddToCart(): AddToCartInterface {
  const { addToCart: addToCartContext, isLoading } = useCart();
  
  const addToCart = useCallback(async (merchandiseId: string, quantity = 1) => {
    await addToCartContext(merchandiseId, quantity);
  }, [addToCartContext]);

  return {
    addToCart,
    isLoading
  };
}

/**
 * Factory function to create custom minimal cart interfaces
 */
export function createMinimalCartInterface<T extends Partial<MinimalCartInterface>>(
  fields: (keyof MinimalCartInterface)[]
): () => Pick<MinimalCartInterface, keyof T> {
  return function useCustomCartInterface() {
    const fullCart = useMinimalCart();
    
    const customInterface = {} as Pick<MinimalCartInterface, keyof T>;
    fields.forEach(field => {
      if (field in fullCart) {
        (customInterface as any)[field] = fullCart[field];
      }
    });
    
    return customInterface;
  };
}