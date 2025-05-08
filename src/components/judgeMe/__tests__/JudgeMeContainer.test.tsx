import React from 'react';
import { render, screen } from '@testing-library/react';
import JudgeMeContainer from '../JudgeMeContainer';
// useJudgeMeContext is mocked below

// Mock the useJudgeMeContext hook
jest.mock('../../../context/JudgeMeContext', () => ({
  useJudgeMeContext: jest.fn(() => ({
    ready: true,
    loading: false,
    error: null,
    judgeMe: { initialized: true },
    initialize: jest.fn(),
    getProductReviewCount: jest.fn(),
    getAverageRating: jest.fn(),
  })),
  JudgeMeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('JudgeMeContainer', () => {
  test('renders children when not loading or error', () => {
    render(
      <JudgeMeContainer>
        <div data-testid="test-child">Child content</div>
      </JudgeMeContainer>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });
  
  test('renders loading state when isLoading is true', () => {
    render(
      <JudgeMeContainer isLoading={true} showLoadingState={true}>
        <div data-testid="test-child">Child content</div>
      </JudgeMeContainer>
    );
    
    // Child content should not be visible during loading
    expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
    
    // Loading indicator should be visible
    expect(screen.getByTestId('judge-me-loading')).toBeInTheDocument();
  });
  
  test('renders error state when error is provided and showErrorState is true', () => {
    const testError = new Error('Test error message');
    
    render(
      <JudgeMeContainer error={testError} showErrorState={true}>
        <div data-testid="test-child">Child content</div>
      </JudgeMeContainer>
    );
    
    // Child content should not be visible during error state
    expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
    
    // Error message should be visible
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });
  
  test('applies custom className to container', () => {
    render(
      <JudgeMeContainer className="custom-class">
        <div>Content</div>
      </JudgeMeContainer>
    );
    
    const container = screen.getByText('Content').closest('.judge-me-container');
    expect(container).toHaveClass('custom-class');
  });
});
