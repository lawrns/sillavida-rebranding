import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
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

  // Derived cart data with improved validation and error handling
  const cartItems: CartItem[] = useMemo(() => {
    if (!cart?.lines?.edges) {
      return [];
    }
    
    try {
      // Log the raw cart data for debugging
      console.log('[CartContext] Deriving cartItems from cart data:', {
        cartId,
        linesCount: cart.lines.edges.length,
        rawLines: cart.lines.edges
      });
      
      // Process cart items and filter out any invalid ones
      const validItems: CartItem[] = [];
      
      for (const edge of cart.lines.edges) {
        const line = edge.node;
        
        // Validate required fields
        if (!line || !line.merchandise) {
          console.warn('[CartContext] Invalid line item structure:', line);
          continue;
        }
        
        console.log('[CartContext] Processing cart item:', line);
        
        validItems.push({
          id: line.id || '',
          merchandiseId: line.merchandise.id,
          quantity: line.quantity,
          title: line.merchandise.title,
          price: line.merchandise.price,
          productTitle: line.merchandise.product?.title
        });
      }
      
      console.log('[CartContext] Cart items processed successfully:', validItems);
      return validItems;
    } catch (error) {
      console.error('[CartContext] Error processing cart items:', error);
      return [];
    }
  }, [cart, cartId]);
  
  // Log cart items for debugging
  useEffect(() => {
    console.log('[CartContext] Cart items state:', {
      count: cartItems.length,
      items: cartItems
    });
  }, [cartItems]);

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
    
    // Validate merchandiseId
    if (!merchandiseId) {
      setIsLoading(false);
      throw new Error('Cannot add item to cart: Missing variant ID');
    }
    
    // Convert regular variant ID to mock variant ID if needed
    // This handles the case where ProductCard is passing a regular ID that needs to be used with our mock system
    const isMockVariant = merchandiseId.startsWith('mock-variant-');
    
    // For standard Shopify variant IDs (non-mock), check if we should convert to mock variant
    if (!isMockVariant && merchandiseId.startsWith('gid://shopify/ProductVariant/')) {
      // Extract the numeric part to match with our mock variant naming system
      const numericPart = merchandiseId.split('/').pop() || '';
      
      // If this appears to be our test data, use mock variant instead
      if (['123456789', '234567890', '345678901', '456789012', '567890123', '678901234', '789012345'].includes(numericPart)) {
        console.log(`[CartContext] Converting standard variant ID to mock variant ID: ${merchandiseId} -> mock-variant-${numericPart}`);
        merchandiseId = `mock-variant-${numericPart}`;
      } else if (merchandiseId.includes('777888999')) {
        // Special case for our test product
        console.log(`[CartContext] Converting test variant ID to mock variant: ${merchandiseId} -> mock-variant-345678901`);
        merchandiseId = 'mock-variant-345678901'; // Map to gamer chair
      }
    }
    
    // Retry logic
    let retryCount = 0;
    const maxRetries = 2;
    let lastError: Error | null = null;
    
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
          lineCount: updatedCart.lines?.edges?.length || 0,
          lines: updatedCart.lines?.edges?.map((edge: any) => ({
            id: edge.node.id,
            quantity: edge.node.quantity,
            title: edge.node.merchandise.title,
            productTitle: edge.node.merchandise.product?.title
          }))
        });
        
        setCart(updatedCart);
        setIsCartOpen(true); // Open cart when item is added
        
        // Success, exit the retry loop
        break;
      } catch (error) {
        retryCount++;
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.error(`[CartContext] Error adding item to cart (attempt ${retryCount}/${maxRetries}):`, error);
        
        if (error instanceof Error) {
          console.error(`[CartContext] Error details: ${error.message}`);
          
          // Check for specific error types
          if (error.message.includes('cart not found') && cartId) {
            console.warn(`[CartContext] Cart not found, creating a new cart`);
            localStorage.removeItem('cartId');
            setCartId(null);
          }
          
          // Check for variant not found errors
          if (error.message.includes('no existe')) {
            console.error(`[CartContext] Product variant does not exist: ${merchandiseId}`);
            setIsLoading(false);
            throw new Error(`Product variant does not exist: ${merchandiseId}`);
          }
        }
        
        if (retryCount > maxRetries) {
          console.error(`[CartContext] Failed to add item after ${maxRetries} retries`);
          break; // Don't throw, we'll handle the error after the loop
        }
        
        // Wait before retrying
        const delay = retryCount * 1000; // Increase delay with each retry
        console.log(`[CartContext] Retrying in ${delay}ms...`);
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
      console.error('[CartContext] Cannot update item: No cart ID');
      alert('Unable to update item: Cart not found');
      return;
    }
    
    setIsLoading(true);
    console.log(`[CartContext] Updating cart item: ${lineId}, quantity: ${quantity}`);
    
    // Retry logic
    let retryCount = 0;
    const maxRetries = 2;
    let lastError: Error | null = null;
    
    while (retryCount <= maxRetries) {
      try {
        const updatedCart = await updateCartLines(cartId, [{ id: lineId, quantity }]);
        console.log(`[CartContext] Cart item updated successfully`);
        setCart(updatedCart);
        break; // Success, exit the retry loop
      } catch (error) {
        retryCount++;
        lastError = error instanceof Error ? error : new Error('Unknown error');
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
    
    // If we've exhausted all retries and still have an error, show an alert to the user
    if (retryCount > maxRetries && lastError) {
      const errorMessage = lastError.message || 'Unknown error';
      alert(`Unable to update item: ${errorMessage}. Please try again later.`);
      return;
    }
  };

  const removeItem = async (lineId: string) => {
    if (!cartId) {
      console.error('[CartContext] Cannot remove item: No cart ID');
      alert('Unable to remove item: Cart not found');
      return;
    }
    
    setIsLoading(true);
    console.log(`[CartContext] Removing cart item: ${lineId}`);
    
    // Retry logic
    let retryCount = 0;
    const maxRetries = 2;
    let lastError: Error | null = null;
    
    while (retryCount <= maxRetries) {
      try {
        const updatedCart = await removeFromCart(cartId, [lineId]);
        console.log(`[CartContext] Cart item removed successfully`);
        setCart(updatedCart);
        break; // Success, exit the retry loop
      } catch (error) {
        retryCount++;
        lastError = error instanceof Error ? error : new Error('Unknown error');
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
    
    // If we've exhausted all retries and still have an error, show an alert to the user
    if (retryCount > maxRetries && lastError) {
      const errorMessage = lastError.message || 'Unknown error';
      alert(`Unable to remove item: ${errorMessage}. Please try again later.`);
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
      alert('Unable to checkout: Cart not found');
      return '';
    }
    
    try {
      return await getCheckoutUrl(cartId);
    } catch (error) {
      console.error('[CartContext] Error getting checkout URL:', error);
      
      // Show a user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Unable to proceed to checkout: ${errorMessage}. Please try again later.`);
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
