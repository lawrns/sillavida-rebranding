import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createCart, getCart, addToCart, updateCartLines, removeFromCart, getCheckoutUrl } from '../lib/shopify';
import type { ShopifyCart } from '../types/shopify';

interface CartItem {
  id: string;
  merchandiseId: string;
  quantity: number;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  productTitle?: string;
}

interface CartContextType {
  cart: ShopifyCart | null;
  cartId: string | null;
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: string;
  isCartOpen: boolean;
  isLoading: boolean;
  addItem: (merchandiseId: string, quantity: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  openCart: () => void;
  getCheckout: () => Promise<string>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize cart from localStorage
  useEffect(() => {
    const initializeCart = async () => {
      const storedCartId = localStorage.getItem('cartId');
      
      if (storedCartId) {
        setCartId(storedCartId);
        try {
          setIsLoading(true);
          const cartData = await getCart(storedCartId);
          setCart(cartData);
        } catch (error) {
          console.error('Error fetching cart:', error);
          // If cart fetch fails (e.g., cart was deleted on Shopify's end), create a new one
          localStorage.removeItem('cartId');
          setCartId(null);
          setCart(null);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeCart();
  }, []);

  // Derived cart data
  const cartItems: CartItem[] = cart?.lines?.edges ? 
    cart.lines.edges.map((edge: any) => {
      const line = edge.node;
      return {
        id: line.id || '',
        merchandiseId: line.merchandise.id,
        quantity: line.quantity,
        title: line.merchandise.title,
        price: line.merchandise.price,
        productTitle: line.merchandise.product?.title
      };
    }) : [];

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const cartTotal = cart?.cost?.totalAmount 
    ? `${parseFloat(cart.cost.totalAmount.amount).toLocaleString('es-MX', {
        style: 'currency',
        currency: cart.cost.totalAmount.currencyCode
      })}`
    : '$0.00';

  // Cart actions
  const addItem = async (merchandiseId: string, quantity: number) => {
    setIsLoading(true);
    
    console.log(`[CartContext] Adding item to cart: ${merchandiseId}, quantity: ${quantity}`);
    console.log(`[CartContext] Current cart state: cartId=${cartId}, itemCount=${cartCount}`);
    
    // Retry logic
    let retryCount = 0;
    const maxRetries = 2;
    
    while (retryCount <= maxRetries) {
      try {
        let updatedCart;
        
        if (cartId) {
          // Add to existing cart
          console.log(`[CartContext] Adding to existing cart: ${cartId}`);
          updatedCart = await addToCart(cartId, [{ merchandiseId, quantity }]);
        } else {
          // Create new cart
          console.log(`[CartContext] Creating new cart`);
          updatedCart = await createCart([{ merchandiseId, quantity }]);
          setCartId(updatedCart.id);
          localStorage.setItem('cartId', updatedCart.id);
        }
        
        console.log(`[CartContext] Cart updated successfully:`, {
          cartId: updatedCart.id,
          lineCount: updatedCart.lines?.edges?.length || 0
        });
        
        setCart(updatedCart);
        setIsCartOpen(true); // Open cart when item is added
        
        // Success, exit the retry loop
        break;
      } catch (error) {
        retryCount++;
        console.error(`[CartContext] Error adding item to cart (attempt ${retryCount}/${maxRetries}):`, error);
        
        if (error instanceof Error) {
          console.error(`[CartContext] Error details: ${error.message}`);
          
          // Check for specific error types
          if (error.message.includes('cart not found') && cartId) {
            console.warn(`[CartContext] Cart not found, creating a new cart`);
            localStorage.removeItem('cartId');
            setCartId(null);
          }
        }
        
        if (retryCount > maxRetries) {
          console.error(`[CartContext] Failed to add item after ${maxRetries} retries`);
          throw error; // Rethrow the error after max retries
        }
        
        // Wait before retrying
        const delay = retryCount * 1000; // Increase delay with each retry
        console.log(`[CartContext] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } finally {
        if (retryCount === maxRetries) {
          setIsLoading(false);
        }
      }
    }
    
    setIsLoading(false);
  };

  const updateItem = async (lineId: string, quantity: number) => {
    if (!cartId) {
      console.error('[CartContext] Cannot update item: No cart ID');
      return;
    }
    
    setIsLoading(true);
    console.log(`[CartContext] Updating cart item: ${lineId}, quantity: ${quantity}`);
    
    // Retry logic
    let retryCount = 0;
    const maxRetries = 2;
    
    while (retryCount <= maxRetries) {
      try {
        const updatedCart = await updateCartLines(cartId, [{ id: lineId, quantity }]);
        console.log(`[CartContext] Cart item updated successfully`);
        setCart(updatedCart);
        break; // Success, exit the retry loop
      } catch (error) {
        retryCount++;
        console.error(`[CartContext] Error updating cart item (attempt ${retryCount}/${maxRetries}):`, error);
        
        if (retryCount > maxRetries) {
          console.error(`[CartContext] Failed to update item after ${maxRetries} retries`);
          break;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    setIsLoading(false);
  };

  const removeItem = async (lineId: string) => {
    if (!cartId) {
      console.error('[CartContext] Cannot remove item: No cart ID');
      return;
    }
    
    setIsLoading(true);
    console.log(`[CartContext] Removing cart item: ${lineId}`);
    
    // Retry logic
    let retryCount = 0;
    const maxRetries = 2;
    
    while (retryCount <= maxRetries) {
      try {
        const updatedCart = await removeFromCart(cartId, [lineId]);
        console.log(`[CartContext] Cart item removed successfully`);
        setCart(updatedCart);
        break; // Success, exit the retry loop
      } catch (error) {
        retryCount++;
        console.error(`[CartContext] Error removing cart item (attempt ${retryCount}/${maxRetries}):`, error);
        
        if (retryCount > maxRetries) {
          console.error(`[CartContext] Failed to remove item after ${maxRetries} retries`);
          break;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    setIsLoading(false);
  };

  const clearCart = () => {
    localStorage.removeItem('cartId');
    setCartId(null);
    setCart(null);
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const closeCart = () => setIsCartOpen(false);
  const openCart = () => setIsCartOpen(true);

  const getCheckout = async (): Promise<string> => {
    if (!cartId) return '';
    
    try {
      return await getCheckoutUrl(cartId);
    } catch (error) {
      console.error('Error getting checkout URL:', error);
      return '';
    }
  };

  const value = {
    cart,
    cartId,
    cartItems,
    cartCount,
    cartTotal,
    isCartOpen,
    isLoading,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    toggleCart,
    closeCart,
    openCart,
    getCheckout
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
