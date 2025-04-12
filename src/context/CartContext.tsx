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
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (lineId: string, quantity: number) => {
    if (!cartId) return;
    
    setIsLoading(true);
    try {
      const updatedCart = await updateCartLines(cartId, [{ id: lineId, quantity }]);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (lineId: string) => {
    if (!cartId) return;
    
    setIsLoading(true);
    try {
      const updatedCart = await removeFromCart(cartId, [lineId]);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing cart item:', error);
    } finally {
      setIsLoading(false);
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
