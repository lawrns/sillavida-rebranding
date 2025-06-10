/**
 * ProductCard Component Tests
 * 
 * This file contains tests for the ProductCard component, which is a critical
 * component for displaying products in the SillaVida e-commerce site.
 */

import React from 'react';
import { render, screen, waitFor } from '../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import ProductCard from '../ProductCard';
import { CartProvider } from '../../context/CartContext';

// Mock the LazyImage component
jest.mock('../LazyImage', () => {
  return function MockLazyImage({ src, alt }: { src: string; alt: string }) {
    return <img src={src} alt={alt} data-testid="mock-lazy-image" />;
  };
});

// Mock chair data
const mockChair = {
  id: 'ergonomic',
  name: 'Silla Ergonómica Pro',
  price: 299.99,
  discountPrice: 249.99,
  rating: 4.8,
  reviewCount: 120,
  image: '/images/chairs/ergonomic.jpg',
  images: ['/images/chairs/ergonomic.jpg'],
  colors: ['black', 'gray', 'blue'],
  features: ['Adjustable height', 'Lumbar support', 'Breathable mesh'],
  description: 'Our premium ergonomic chair designed for maximum comfort during long work sessions.',
  longDescription: 'Detailed description of the ergonomic chair...',
  specs: {
    material: 'Mesh and aluminum',
    weight: '15kg',
    dimensions: '60 x 70 x 120 cm',
    maxWeight: '150kg',
  },
  category: 'office',
  tags: ['ergonomic', 'office', 'professional'],
  isNew: true,
  isBestseller: true,
  stock: 15,
};

// Mock the useCart hook
const mockAddItem = jest.fn();
jest.mock('../../context/CartContext', () => ({
  useCart: () => ({
    addItem: mockAddItem,
    items: [],
    removeItem: jest.fn(),
    clearCart: jest.fn(),
    updateItemQuantity: jest.fn(),
    totalItems: 0,
    totalPrice: 0,
  }),
  CartProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('ProductCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the product card with correct information', () => {
    render(<ProductCard chair={mockChair} />);
    
    // Check if product name is displayed
    expect(screen.getByText('Silla Ergonómica Pro')).toBeInTheDocument();
    
    // Check if price is displayed correctly
    expect(screen.getByText('$249.99')).toBeInTheDocument();
    expect(screen.getByText('$299.99')).toBeInTheDocument();
    
    // Check if rating is displayed
    expect(screen.getByText('4.8')).toBeInTheDocument();
    
    // Check if image is rendered
    expect(screen.getByTestId('mock-lazy-image')).toBeInTheDocument();
    
    // Check if "Add to Cart" button is displayed
    expect(screen.getByText('Agregar al Carrito')).toBeInTheDocument();
  });
  
  it('shows discount badge when product has a discount price', () => {
    render(<ProductCard chair={mockChair} />);
    
    // Calculate the discount percentage
    const discount = Math.round(((mockChair.price - mockChair.discountPrice) / mockChair.price) * 100);
    
    // Check if discount badge is displayed
    expect(screen.getByText(`${discount}% OFF`)).toBeInTheDocument();
  });
  
  it('shows "New" badge when product is marked as new', () => {
    render(<ProductCard chair={mockChair} />);
    
    // Check if "New" badge is displayed
    expect(screen.getByText('Nuevo')).toBeInTheDocument();
  });
  
  it('shows "Bestseller" badge when product is marked as bestseller', () => {
    render(<ProductCard chair={mockChair} />);
    
    // Check if "Bestseller" badge is displayed
    expect(screen.getByText('Más Vendido')).toBeInTheDocument();
  });
  
  it('calls addItem when "Add to Cart" button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<ProductCard chair={mockChair} />);
    
    // Click the "Add to Cart" button
    const addToCartButton = screen.getByText('Agregar al Carrito');
    await user.click(addToCartButton);
    
    // Check if addItem was called with the correct parameters
    await waitFor(() => {
      expect(mockAddItem).toHaveBeenCalledWith(expect.objectContaining({
        id: expect.any(String),
        name: mockChair.name,
        price: mockChair.discountPrice || mockChair.price,
        image: mockChair.image,
        quantity: 1,
      }));
    });
  });
  
  it('shows success message after adding to cart', async () => {
    const user = userEvent.setup();
    
    render(<ProductCard chair={mockChair} />);
    
    // Click the "Add to Cart" button
    const addToCartButton = screen.getByText('Agregar al Carrito');
    await user.click(addToCartButton);
    
    // Check if success message is displayed
    await waitFor(() => {
      expect(screen.getByText('¡Agregado!')).toBeInTheDocument();
    });
  });
});
