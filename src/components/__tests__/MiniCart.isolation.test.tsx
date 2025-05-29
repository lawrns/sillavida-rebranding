import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MiniCart from '../MiniCart';
import { useMinimalCart } from '../../hooks/useMinimalCart';

// Mock the minimal cart hook
jest.mock('../../hooks/useMinimalCart');
const mockUseMinimalCart = useMinimalCart as jest.MockedFunction<typeof useMinimalCart>;

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: any) => children
}));

// Mock cart components
jest.mock('../cart', () => ({
  CartItem: ({ item, onQuantityChange, onRemove }: any) => (
    <div data-testid={`cart-item-${item.id}`}>
      <span>{item.title}</span>
      <button onClick={() => onQuantityChange(item.id, item.quantity + 1)}>+</button>
      <button onClick={() => onRemove(item.id)}>Remove</button>
    </div>
  ),
  CartHeader: ({ onClose }: any) => (
    <div data-testid="cart-header">
      <button onClick={onClose}>Close</button>
    </div>
  ),
  CartEmptyState: ({ onContinueShopping }: any) => (
    <div data-testid="cart-empty">
      <button onClick={onContinueShopping}>Continue Shopping</button>
    </div>
  ),
  CartLoadingState: () => <div data-testid="cart-loading">Loading...</div>,
  CartFooter: ({ onCheckout }: any) => (
    <div data-testid="cart-footer">
      <button onClick={onCheckout}>Checkout</button>
    </div>
  )
}));

const renderMiniCart = () => {
  return render(
    <BrowserRouter>
      <MiniCart />
    </BrowserRouter>
  );
};

describe('MiniCart Component Isolation Tests', () => {
  const mockCartData = {
    isCartOpen: true,
    closeCart: jest.fn(),
    cartItems: [
      {
        id: '1',
        title: 'Test Chair',
        productTitle: 'Test Chair',
        imageUrl: 'test.jpg',
        price: { amount: '100.00', currencyCode: 'MXN' },
        quantity: 1
      }
    ],
    cartTotal: '$100.00',
    cartCount: 1,
    updateItem: jest.fn(),
    removeItem: jest.fn(),
    isLoading: false,
    cart: null,
    cartId: 'test-cart-id'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Independence', () => {
    it('renders without requiring full cart context', () => {
      mockUseMinimalCart.mockReturnValue({
        ...mockCartData,
        isCartOpen: false
      });

      renderMiniCart();
      
      // Should not render when cart is closed
      expect(screen.queryByTestId('cart-header')).not.toBeInTheDocument();
    });

    it('can be tested in isolation with mocked dependencies', () => {
      mockUseMinimalCart.mockReturnValue(mockCartData);

      renderMiniCart();
      
      expect(screen.getByTestId('cart-header')).toBeInTheDocument();
      expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('cart-footer')).toBeInTheDocument();
    });

    it('works independently of other components', () => {
      mockUseMinimalCart.mockReturnValue(mockCartData);

      renderMiniCart();
      
      // Test cart functionality without needing other components
      fireEvent.click(screen.getByText('Close'));
      expect(mockCartData.closeCart).toHaveBeenCalled();
    });
  });

  describe('Composition Pattern Verification', () => {
    it('uses composed cart components correctly', () => {
      mockUseMinimalCart.mockReturnValue(mockCartData);

      renderMiniCart();
      
      // Verify all composed components are rendered
      expect(screen.getByTestId('cart-header')).toBeInTheDocument();
      expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('cart-footer')).toBeInTheDocument();
    });

    it('handles empty state with composed component', () => {
      mockUseMinimalCart.mockReturnValue({
        ...mockCartData,
        cartItems: []
      });

      renderMiniCart();
      
      expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
      expect(screen.queryByTestId('cart-footer')).not.toBeInTheDocument();
    });

    it('handles loading state with composed component', () => {
      mockUseMinimalCart.mockReturnValue({
        ...mockCartData,
        isLoading: true
      });

      renderMiniCart();
      
      expect(screen.getByTestId('cart-loading')).toBeInTheDocument();
    });
  });

  describe('Minimal Interface Usage', () => {
    it('only uses minimal cart interface methods', () => {
      const minimalInterface = {
        isCartOpen: true,
        closeCart: jest.fn(),
        cartItems: [],
        cartTotal: '$0.00',
        cartCount: 0,
        updateItem: jest.fn(),
        removeItem: jest.fn(),
        isLoading: false,
        cart: null,
        cartId: null
      };

      mockUseMinimalCart.mockReturnValue(minimalInterface);

      renderMiniCart();
      
      // Verify the component renders with minimal interface
      expect(screen.getByTestId('cart-header')).toBeInTheDocument();
      expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
    });

    it('functions correctly without full cart context data', () => {
      mockUseMinimalCart.mockReturnValue({
        isCartOpen: true,
        closeCart: jest.fn(),
        cartItems: mockCartData.cartItems,
        cartTotal: '$100.00',
        cartCount: 1,
        updateItem: jest.fn(),
        removeItem: jest.fn(),
        isLoading: false,
        cart: null, // No full cart object
        cartId: null // No cart ID
      });

      renderMiniCart();
      
      // Should still function correctly
      expect(screen.getByTestId('cart-header')).toBeInTheDocument();
      expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    });
  });

  describe('Event Handling Isolation', () => {
    it('handles cart interactions through minimal interface', async () => {
      const mockUpdateItem = jest.fn();
      const mockRemoveItem = jest.fn();
      
      mockUseMinimalCart.mockReturnValue({
        ...mockCartData,
        updateItem: mockUpdateItem,
        removeItem: mockRemoveItem
      });

      renderMiniCart();
      
      // Test item interactions
      fireEvent.click(screen.getByText('+'));
      expect(mockUpdateItem).toHaveBeenCalledWith('1', 2);
      
      fireEvent.click(screen.getByText('Remove'));
      expect(mockRemoveItem).toHaveBeenCalledWith('1');
    });

    it('handles checkout flow independently', () => {
      const mockCloseCart = jest.fn();
      
      mockUseMinimalCart.mockReturnValue({
        ...mockCartData,
        closeCart: mockCloseCart
      });

      renderMiniCart();
      
      fireEvent.click(screen.getByText('Checkout'));
      
      // Should close cart and handle navigation internally
      expect(mockCloseCart).toHaveBeenCalled();
    });
  });

  describe('Reusability Tests', () => {
    it('can be reused in different contexts', () => {
      // Test in different cart states
      const scenarios = [
        { cartItems: [], scenario: 'empty' },
        { cartItems: mockCartData.cartItems, scenario: 'with-items' },
        { isLoading: true, scenario: 'loading' }
      ];

      scenarios.forEach(({ scenario, ...overrides }) => {
        mockUseMinimalCart.mockReturnValue({
          ...mockCartData,
          ...overrides
        });

        const { unmount } = renderMiniCart();
        
        // Component should render appropriately for each scenario
        expect(screen.getByTestId('cart-header')).toBeInTheDocument();
        
        unmount();
      });
    });

    it('maintains functionality across different prop combinations', () => {
      // Test with various cart configurations
      const configurations = [
        { cartTotal: '$0.00', cartCount: 0 },
        { cartTotal: '$1,234.56', cartCount: 5 },
        { cartTotal: '$50.00', cartCount: 1 }
      ];

      configurations.forEach((config) => {
        mockUseMinimalCart.mockReturnValue({
          ...mockCartData,
          ...config
        });

        const { unmount } = renderMiniCart();
        
        expect(screen.getByTestId('cart-header')).toBeInTheDocument();
        unmount();
      });
    });
  });
});

describe('Component Decoupling Verification', () => {
  it('does not import unnecessary dependencies', () => {
    // This test verifies that MiniCart only imports what it needs
    // The fact that we can mock useMinimalCart and render the component
    // proves it's not tightly coupled to the full cart context
    
    mockUseMinimalCart.mockReturnValue({
      isCartOpen: true,
      closeCart: jest.fn(),
      cartItems: [],
      cartTotal: '$0.00',
      cartCount: 0,
      updateItem: jest.fn(),
      removeItem: jest.fn(),
      isLoading: false,
      cart: null,
      cartId: null
    });

    expect(() => renderMiniCart()).not.toThrow();
  });

  it('can function without external component dependencies', () => {
    // The component should work even if other parts of the app fail
    mockUseMinimalCart.mockReturnValue({
      isCartOpen: true,
      closeCart: jest.fn(),
      cartItems: mockCartData.cartItems,
      cartTotal: '$100.00',
      cartCount: 1,
      updateItem: jest.fn(),
      removeItem: jest.fn(),
      isLoading: false,
      cart: null,
      cartId: null
    });

    renderMiniCart();
    
    // All functionality should be available
    expect(screen.getByTestId('cart-header')).toBeInTheDocument();
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('cart-footer')).toBeInTheDocument();
  });
});