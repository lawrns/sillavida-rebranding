import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { createCart, getCart, addToCart, updateCartLines, removeFromCart, getCheckoutUrl } from '../lib/shopify';
import type { ShopifyCart } from '../types/shopify';
import { handleCartError } from '../utils/errorHandler';
import { formatPrice } from '../utils/business/priceFormatter';

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
  imageUrl?: string; // Add image URL field
}

interface CartContextType {
  cart: ShopifyCart | null;
  cartId: string | null;
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: string;
  isCartOpen: boolean;
  isLoading: boolean;
  isGuestCheckout: boolean;
  setGuestCheckout: (value: boolean) => void;
  addToCart: (merchandiseId: string, quantity: number) => Promise<void>;
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
  const [isGuestCheckout, setGuestCheckout] = useState(false);

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

  // Derived cart data with improved validation and error handling
  const cartItems: CartItem[] = useMemo(() => {
    if (!cart?.lines?.edges) {
      return [];
    }
    
    try {
      // Log the raw cart data for debugging
      
      // Process cart items and filter out any invalid ones
      const validItems: CartItem[] = [];
      
      for (const edge of cart.lines.edges) {
        const line = edge.node;
        
        // Validate required fields
        if (!line || !line.merchandise) {
          continue;
        }
        
        
        // Extract image URL if available
        let imageUrl = undefined;
        // Safely check for image property in the merchandise object
        if (line.merchandise && (line.merchandise as any).image && (line.merchandise as any).image.url) {
          imageUrl = (line.merchandise as any).image.url;
        }
        
        validItems.push({
          id: line.id || '',
          merchandiseId: line.merchandise.id,
          quantity: line.quantity,
          title: line.merchandise.title,
          price: line.merchandise.price,
          productTitle: line.merchandise.product?.title,
          imageUrl: imageUrl
        });
      }
      
      return validItems;
    } catch (error) {
      return [];
    }
  }, [cart, cartId]);
  
  // Log cart items for debugging
  useEffect(() => {
  }, [cartItems]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const cartTotal = cart?.cost?.totalAmount 
    ? formatPrice({
        amount: cart.cost.totalAmount.amount,
        currencyCode: cart.cost.totalAmount.currencyCode
      }).formatted
    : '$0.00';

  // Cart actions
  const addToCart = async (merchandiseId: string, quantity: number) => {
    setIsLoading(true);
    
    
    // Validate merchandiseId
    if (!merchandiseId) {
      setIsLoading(false);
      throw new Error('Cannot add item to cart: Missing variant ID');
    }
    
    // Check if it's a mock variant (for backward compatibility)
    const isMockVariant = merchandiseId.startsWith('mock-variant-');
    
    // Retry logic
    let retryCount = 0;
    const maxRetries = 2;
    let lastError: Error | null = null;
    
    while (retryCount <= maxRetries) {
      try {
        let updatedCart;
        
        if (cartId) {
          // Add to existing cart
          updatedCart = await addToCart(cartId, [{ merchandiseId, quantity }]);
        } else {
          // Create new cart
          updatedCart = await createCart([{ merchandiseId, quantity }]);
          setCartId(updatedCart.id);
          localStorage.setItem('cartId', updatedCart.id);
        }
        
        
        setCart(updatedCart);
        setIsCartOpen(true); // Open cart when item is added
        
        // Success, exit the retry loop
        break;
      } catch (error) {
        retryCount++;
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (error instanceof Error) {
          
          // Check for specific error types
          if (error.message.includes('cart not found') && cartId) {
            localStorage.removeItem('cartId');
            setCartId(null);
          }
          
          // Check for variant not found errors
          if (error.message.includes('no existe')) {
            setIsLoading(false);
            throw new Error(`Product variant does not exist: ${merchandiseId}`);
          }
        }
        
        if (retryCount > maxRetries) {
          break; // Don't throw, we'll handle the error after the loop
        }
        
        // Wait before retrying
        const delay = retryCount * 1000; // Increase delay with each retry
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    setIsLoading(false);
    
    // If we've exhausted all retries and still have an error, throw the error
    if (retryCount > maxRetries && lastError) {
      throw lastError;
    }
  };

  const updateItem = async (lineId: string, quantity: number) => {
    if (!cartId) {
      await handleCartError('Cart not found when trying to update item', { component: 'CartContext', action: 'updateItem' });
      return;
    }
    
    setIsLoading(true);
    
    // Retry logic
    let retryCount = 0;
    const maxRetries = 2;
    let lastError: Error | null = null;
    
    while (retryCount <= maxRetries) {
      try {
        const updatedCart = await updateCartLines(cartId, [{ id: lineId, quantity }]);
        setCart(updatedCart);
        break; // Success, exit the retry loop
      } catch (error) {
        retryCount++;
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (retryCount > maxRetries) {
          break;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    setIsLoading(false);
    
    // If we've exhausted all retries and still have an error, use standardized error handling
    if (retryCount > maxRetries && lastError) {
      const errorMessage = lastError.message || 'Unknown error';
      await handleCartError(`Unable to update item: ${errorMessage}`, { component: 'CartContext', action: 'updateItem' });
      return;
    }
  };

  const removeItem = async (lineId: string) => {
    if (!cartId) {
      await handleCartError('Cart not found when trying to remove item', { component: 'CartContext', action: 'removeItem' });
      return;
    }
    
    setIsLoading(true);
    
    // Retry logic
    let retryCount = 0;
    const maxRetries = 2;
    let lastError: Error | null = null;
    
    while (retryCount <= maxRetries) {
      try {
        const updatedCart = await removeFromCart(cartId, [lineId]);
        setCart(updatedCart);
        break; // Success, exit the retry loop
      } catch (error) {
        retryCount++;
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (retryCount > maxRetries) {
          break;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    setIsLoading(false);
    
    // If we've exhausted all retries and still have an error, use standardized error handling
    if (retryCount > maxRetries && lastError) {
      const errorMessage = lastError.message || 'Unknown error';
      await handleCartError(`Unable to remove item: ${errorMessage}`, { component: 'CartContext', action: 'removeItem' });
      return;
    }
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
    if (!cartId) {
      await handleCartError('Cart not found when trying to checkout', { component: 'CartContext', action: 'getCheckout' });
      return '';
    }
    
    try {
      // Pass the isGuestCheckout flag to the getCheckoutUrl function
      return await getCheckoutUrl(cartId, isGuestCheckout);
    } catch (error) {
      
      // Use standardized error handling
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await handleCartError(`Unable to proceed to checkout: ${errorMessage}`, { component: 'CartContext', action: 'getCheckout' });
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
    isGuestCheckout,
    setGuestCheckout,
    addToCart,
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
