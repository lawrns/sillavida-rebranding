import React from 'react';
import { render, screen } from '@testing-library/react';
import { JudgeMeProvider, useJudgeMeContext } from '../JudgeMeContext';

// Mock the useJudgeMe hook
jest.mock('../../hooks/useJudgeMe', () => ({
  useJudgeMe: jest.fn(() => ({
    ready: true,
    loading: false,
    error: null,
    judgeMe: { initialized: true },
    initialize: jest.fn(),
    getProductReviewCount: jest.fn(),
    getAverageRating: jest.fn(),
  }))
}));

// Test component that uses the context
const TestComponent = () => {
  const { ready, loading, error } = useJudgeMeContext();
  return (
    <div>
      <div data-testid="status">
        {ready ? 'ready' : 'not-ready'}
        {loading ? ' loading' : ' not-loading'}
        {error ? ' error' : ' no-error'}
      </div>
    </div>
  );
};

describe('JudgeMeContext', () => {
  test('provides context values to child components', () => {
    render(
      <JudgeMeProvider>
        <TestComponent />
      </JudgeMeProvider>
    );
    
    expect(screen.getByTestId('status').textContent).toBe('ready not-loading no-error');
  });
  
  test('throws error when used outside of provider', () => {
    // Suppress console.error for this test as we expect an error
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useJudgeMeContext must be used within a JudgeMeProvider');
    
    // Restore console.error
    console.error = originalConsoleError;
  });
});
