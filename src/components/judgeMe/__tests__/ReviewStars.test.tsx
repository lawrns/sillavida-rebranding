import React from 'react';
import { render, screen, act } from '@testing-library/react';
import ReviewStars from '../ReviewStars';

// Mock the useJudgeMeContext hook
jest.mock('../../../context/JudgeMeContext', () => ({
  useJudgeMeContext: jest.fn(() => ({
    ready: true,
    loading: false,
    error: null,
    judgeMe: { initialized: true },
    initialize: jest.fn(),
    getProductReviewCount: jest.fn().mockResolvedValue(10),
    getAverageRating: jest.fn().mockResolvedValue(4.5),
  }))
}));

// Mock global window.jdgm
beforeEach(() => {
  // Mock Judge.me global object
  (window as any).jdgm = {
    renderWidget: jest.fn(),
    initialized: true
  };
  
  // Mock document methods
  Element.prototype.querySelector = jest.fn().mockReturnValue({});
});

afterEach(() => {
  jest.clearAllMocks();
  delete (window as any).jdgm;
});

describe('ReviewStars', () => {
  test('renders star rating container', async () => {
    render(<ReviewStars productId="123456" />);
    
    // Expect the container to be in the document
    const container = await screen.findByRole('heading', { level: 1 });
    expect(container).toBeInTheDocument();
  });
  
  test('initializes Judge.me widget with correct product ID', async () => {
    render(<ReviewStars productId="123456" />);
    
    // Wait for useEffect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Check that the widget was rendered
    expect((window as any).jdgm.renderWidget).toHaveBeenCalled();
  });
  
  test('applies custom class names', async () => {
    render(
      <ReviewStars 
        productId="123456" 
        className="custom-stars-class" 
        containerClassName="custom-container-class" 
      />
    );
    
    // Expect classes to be applied
    const container = await screen.findByRole('heading', { level: 1 });
    expect(container.closest('.judge-me-stars')).toHaveClass('custom-container-class');
  });
  
  test('handles loading state correctly', async () => {
    // Mock loading state
    jest.mock('../../../context/JudgeMeContext', () => ({
      useJudgeMeContext: jest.fn(() => ({
        ready: false,
        loading: true,
        error: null,
        judgeMe: null,
        initialize: jest.fn(),
        getProductReviewCount: jest.fn(),
        getAverageRating: jest.fn(),
      }))
    }));
    
    render(<ReviewStars productId="123456" />);
    
    // Expect loading state
    const loadingElement = await screen.findByTestId('judge-me-loading');
    expect(loadingElement).toBeInTheDocument();
  });
});
