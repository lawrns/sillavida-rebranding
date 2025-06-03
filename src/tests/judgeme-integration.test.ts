/**
 * Judge.me Integration Tests
 * 
 * Comprehensive test suite for Judge.me widget lifecycle testing, error scenarios,
 * and integration with the existing regression test infrastructure.
 * 
 * Created as part of TASK-105 Phase 2 implementation.
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import JudgeMeWidgetTester from '../components/admin/JudgeMeWidgetTester';
import { useJudgeMe } from '../hooks/useJudgeMe';
import { errorHandler } from '../utils/errorHandler';
import { 
  mockDataGenerators, 
  performanceHelpers, 
  errorSimulators, 
  stateHelpers,
  assertionHelpers 
} from './utils/regression-helpers';

// Mock the Judge.me hook
jest.mock('../hooks/useJudgeMe', () => ({
  useJudgeMe: jest.fn()
}));

// Mock error handler
jest.mock('../utils/errorHandler', () => ({
  errorHandler: {
    handleError: jest.fn(),
  }
}));

// Mock Judge.me global object
const mockJudgeMeGlobal = {
  renderWidgets: jest.fn(),
  getAverageRating: jest.fn(),
  getProductReviewCount: jest.fn(),
  SHOP_DOMAIN: 'sbz5wk-e9.myshopify.com',
  PLATFORM: 'shopify',
  PUBLIC_TOKEN: 'CmgUOrdFZ2WZCDoTpirgmdavI4c'
};

// Mock window.jdgm
Object.defineProperty(window, 'jdgm', {
  value: mockJudgeMeGlobal,
  writable: true
});

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn()
  },
  writable: true
});

describe('Judge.me Integration Tests', () => {
  const mockUseJudgeMe = useJudgeMe as jest.MockedFunction<typeof useJudgeMe>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation
    mockUseJudgeMe.mockReturnValue({
      ready: true,
      loading: false,
      error: null,
      judgeMe: mockJudgeMeGlobal,
      initialize: jest.fn(),
      getProductReviewCount: jest.fn().mockResolvedValue(5),
      getAverageRating: jest.fn().mockResolvedValue(4.5)
    });

    // Reset Judge.me global mock
    mockJudgeMeGlobal.renderWidgets.mockClear();
    mockJudgeMeGlobal.getAverageRating.mockClear();
    mockJudgeMeGlobal.getProductReviewCount.mockClear();
  });

  describe('Widget Loading Validation', () => {
    it('should validate successful widget loading', async () => {
      const { container } = render(<JudgeMeWidgetTester />);
      
      // Wait for component to initialize
      await waitFor(() => {
        expect(screen.getByText('Judge.me Widget Tester')).toBeInTheDocument();
      });

      // Simulate widget loading by adding DOM elements
      const reviewWidget = container.querySelector('.jdgm-review-widget');
      if (reviewWidget) {
        // Add content to simulate successful loading
        reviewWidget.innerHTML = '<div class="jdgm-review">Test Review</div>';
      }

      // Trigger validation
      const validateButton = screen.getByText('Run Validation');
      fireEvent.click(validateButton);

      // Wait for validation to complete
      await waitFor(() => {
        expect(screen.queryByText('Running Tests...')).not.toBeInTheDocument();
      }, { timeout: 10000 });

      // Check for success indicators
      expect(container.querySelector('.bg-green-50')).toBeInTheDocument();
    });

    it('should detect widget loading timeouts', async () => {
      const { container } = render(<JudgeMeWidgetTester />);
      
      await waitFor(() => {
        expect(screen.getByText('Judge.me Widget Tester')).toBeInTheDocument();
      });

      // Don't add any content to widgets to simulate timeout
      const validateButton = screen.getByText('Run Validation');
      fireEvent.click(validateButton);

      // Wait for validation to complete with timeout
      await waitFor(() => {
        expect(screen.queryByText('Running Tests...')).not.toBeInTheDocument();
      }, { timeout: 15000 });

      // Check for timeout error indicators
      const errorElements = container.querySelectorAll('.bg-red-50');
      expect(errorElements.length).toBeGreaterThan(0);
    });

    it('should validate widget content presence', async () => {
      const { container } = render(<JudgeMeWidgetTester />);
      
      await waitFor(() => {
        expect(screen.getByText('Judge.me Widget Tester')).toBeInTheDocument();
      });

      // Add empty widgets (found but no content)
      const widgets = [
        '.jdgm-review-widget',
        '.jdgm-carousel-wrapper',
        '.jdgm-ugc-media-wrapper',
        '.jdgm-verified-badge',
        '.jdgm-preview-badge'
      ];

      widgets.forEach(selector => {
        const widget = container.querySelector(selector);
        if (widget) {
          // Widget exists but is empty
          widget.innerHTML = '';
        }
      });

      const validateButton = screen.getByText('Run Validation');
      fireEvent.click(validateButton);

      await waitFor(() => {
        expect(screen.queryByText('Running Tests...')).not.toBeInTheDocument();
      }, { timeout: 10000 });

      // Should detect empty widgets
      expect(screen.getByText(/Widget found but appears empty/)).toBeInTheDocument();
    });
  });

  describe('API Integration Testing', () => {
    it('should test product review count retrieval', async () => {
      const mockGetReviewCount = jest.fn().mockResolvedValue(10);
      mockUseJudgeMe.mockReturnValue({
        ready: true,
        loading: false,
        error: null,
        judgeMe: mockJudgeMeGlobal,
        initialize: jest.fn(),
        getProductReviewCount: mockGetReviewCount,
        getAverageRating: jest.fn().mockResolvedValue(4.2)
      });

      render(<JudgeMeWidgetTester />);
      
      await waitFor(() => {
        expect(screen.getByText('Judge.me Widget Tester')).toBeInTheDocument();
      });

      // Simulate successful widget loading
      const validateButton = screen.getByText('Run Validation');
      fireEvent.click(validateButton);

      await waitFor(() => {
        expect(mockGetReviewCount).toHaveBeenCalled();
      }, { timeout: 10000 });

      expect(mockGetReviewCount).toHaveBeenCalledWith('gid://shopify/Product/8273188053286');
    });

    it('should test average rating retrieval', async () => {
      const mockGetAverageRating = jest.fn().mockResolvedValue(4.7);
      mockUseJudgeMe.mockReturnValue({
        ready: true,
        loading: false,
        error: null,
        judgeMe: mockJudgeMeGlobal,
        initialize: jest.fn(),
        getProductReviewCount: jest.fn().mockResolvedValue(8),
        getAverageRating: mockGetAverageRating
      });

      render(<JudgeMeWidgetTester />);
      
      await waitFor(() => {
        expect(screen.getByText('Judge.me Widget Tester')).toBeInTheDocument();
      });

      const validateButton = screen.getByText('Run Validation');
      fireEvent.click(validateButton);

      await waitFor(() => {
        expect(mockGetAverageRating).toHaveBeenCalled();
      }, { timeout: 10000 });

      expect(mockGetAverageRating).toHaveBeenCalledWith('gid://shopify/Product/8273188053286');
    });

    it('should handle API errors gracefully', async () => {
      const apiError = new Error('API request failed');
      mockUseJudgeMe.mockReturnValue({
        ready: true,
        loading: false,
        error: null,
        judgeMe: mockJudgeMeGlobal,
        initialize: jest.fn(),
        getProductReviewCount: jest.fn().mockRejectedValue(apiError),
        getAverageRating: jest.fn().mockRejectedValue(apiError)
      });

      render(<JudgeMeWidgetTester />);
      
      await waitFor(() => {
        expect(screen.getByText('Judge.me Widget Tester')).toBeInTheDocument();
      });

      const validateButton = screen.getByText('Run Validation');
      fireEvent.click(validateButton);

      await waitFor(() => {
        expect(errorHandler.handleError).toHaveBeenCalledWith(
          expect.any(Error),
          expect.objectContaining({
            component: 'JudgeMeWidgetTester',
            action: 'runAutomatedValidation'
          })
        );
      }, { timeout: 10000 });
    });
  });

  describe('Error Scenario Testing', () => {
    it('should test network timeout scenarios', async () => {
      render(<JudgeMeWidgetTester />);
      
      await waitFor(() => {
        expect(screen.getByText('Judge.me Widget Tester')).toBeInTheDocument();
      });

      // Click error testing button
      const errorTestButton = screen.getByText('Test Error Handling');
      fireEvent.click(errorTestButton);

      await waitFor(() => {
        // Should show error test results
        expect(screen.getByText(/error-test-Network Timeout/)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should test invalid product ID scenarios', async () => {
      render(<JudgeMeWidgetTester />);
      
      await waitFor(() => {
        expect(screen.getByText('Judge.me Widget Tester')).toBeInTheDocument();
      });

      const errorTestButton = screen.getByText('Test Error Handling');
      fireEvent.click(errorTestButton);

      await waitFor(() => {
        expect(screen.getByText(/error-test-Invalid Product ID/)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should test script loading failure scenarios', async () => {
      render(<JudgeMeWidgetTester />);
      
      await waitFor(() => {
        expect(screen.getByText('Judge.me Widget Tester')).toBeInTheDocument();
      });

      const errorTestButton = screen.getByText('Test Error Handling');
      fireEvent.click(errorTestButton);

      await waitFor(() => {
        expect(screen.getByText(/error-test-Script Loading Failure/)).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('Performance Monitoring Integration', () => {
    it('should measure widget loading performance', async () => {
      const { container } = render(<JudgeMeWidgetTester />);

      await waitFor(() => {
        expect(screen.getByText('Judge.me Widget Tester')).toBeInTheDocument();
      });

      // Mock performance.now to return predictable values
      let callCount = 0;
      (window.performance.now as jest.Mock).mockImplementation(() => {
        callCount++;
        return callCount * 100; // 100ms increments
      });

      // Add content to widgets to simulate successful loading
      const widgets = container.querySelectorAll('.jdgm-widget, .jdgm-carousel-wrapper, .jdgm-ugc-media-wrapper, .jdgm-verified-badge, .jdgm-preview-badge');
      widgets.forEach(widget => {
        widget.innerHTML = '<div>Loaded content</div>';
      });

      const validateButton = screen.getByText('Run Validation');
      fireEvent.click(validateButton);

      await waitFor(() => {
        expect(screen.queryByText('Running Tests...')).not.toBeInTheDocument();
      }, { timeout: 10000 });

      // Should display performance metrics
      await waitFor(() => {
        expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
        expect(screen.getByText('Average Load Time')).toBeInTheDocument();
        expect(screen.getByText('Success Rate')).toBeInTheDocument();
      });
    });

    it('should track success rates across multiple test runs', async () => {
      const { container } = render(<JudgeMeWidgetTester />);

      await waitFor(() => {
        expect(screen.getByText('Judge.me Widget Tester')).toBeInTheDocument();
      });

      // First run - all widgets succeed
      const widgets = container.querySelectorAll('.jdgm-widget, .jdgm-carousel-wrapper, .jdgm-ugc-media-wrapper, .jdgm-verified-badge, .jdgm-preview-badge');
      widgets.forEach(widget => {
        widget.innerHTML = '<div>Success content</div>';
      });

      let validateButton = screen.getByText('Run Validation');
      fireEvent.click(validateButton);

      await waitFor(() => {
        expect(screen.queryByText('Running Tests...')).not.toBeInTheDocument();
      }, { timeout: 10000 });

      // Second run - some widgets fail
      widgets.forEach((widget, index) => {
        if (index < 2) {
          widget.innerHTML = ''; // Make first 2 widgets fail
        }
      });

      validateButton = screen.getByText('Run Validation');
      fireEvent.click(validateButton);

      await waitFor(() => {
        expect(screen.queryByText('Running Tests...')).not.toBeInTheDocument();
      }, { timeout: 10000 });

      // Should show updated success rate
      await waitFor(() => {
        const successRateElement = screen.getByText(/Success Rate/);
        expect(successRateElement).toBeInTheDocument();
      });
    });

    it('should detect performance regressions', async () => {
      const { container } = render(<JudgeMeWidgetTester />);

      await waitFor(() => {
        expect(screen.getByText('Judge.me Widget Tester')).toBeInTheDocument();
      });

      // Mock slow loading times
      let callCount = 0;
      (window.performance.now as jest.Mock).mockImplementation(() => {
        callCount++;
        return callCount * 2000; // 2 second increments (slow)
      });

      const widgets = container.querySelectorAll('.jdgm-widget, .jdgm-carousel-wrapper, .jdgm-ugc-media-wrapper, .jdgm-verified-badge, .jdgm-preview-badge');
      widgets.forEach(widget => {
        widget.innerHTML = '<div>Slow loaded content</div>';
      });

      const validateButton = screen.getByText('Run Validation');
      fireEvent.click(validateButton);

      await waitFor(() => {
        expect(screen.queryByText('Running Tests...')).not.toBeInTheDocument();
      }, { timeout: 15000 });

      // Should show high average load time
      await waitFor(() => {
        const loadTimeElements = container.querySelectorAll('.text-green-600');
        const hasHighLoadTime = Array.from(loadTimeElements).some(el =>
          el.textContent && parseInt(el.textContent) > 1000
        );
        expect(hasHighLoadTime).toBe(true);
      });
    });
  });

  describe('Auto-Validation Testing', () => {
    it('should enable auto-validation on product ID change', async () => {
      render(<JudgeMeWidgetTester />);

      await waitFor(() => {
        expect(screen.getByText('Judge.me Widget Tester')).toBeInTheDocument();
      });

      // Enable auto-validation
      const autoValidationCheckbox = screen.getByLabelText('Auto-validate on product change');
      fireEvent.click(autoValidationCheckbox);

      // Change product ID
      const productIdInput = screen.getByPlaceholderText('gid://shopify/Product/PRODUCT_ID');
      fireEvent.change(productIdInput, { target: { value: 'gid://shopify/Product/123456789' } });

      const applyButton = screen.getByText('Apply');
      fireEvent.click(applyButton);

      // Should automatically start validation
      await waitFor(() => {
        expect(screen.getByText('Running Tests...')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should not auto-validate when disabled', async () => {
      render(<JudgeMeWidgetTester />);

      await waitFor(() => {
        expect(screen.getByText('Judge.me Widget Tester')).toBeInTheDocument();
      });

      // Auto-validation should be disabled by default
      const autoValidationCheckbox = screen.getByLabelText('Auto-validate on product change');
      expect(autoValidationCheckbox).not.toBeChecked();

      // Change product ID
      const productIdInput = screen.getByPlaceholderText('gid://shopify/Product/PRODUCT_ID');
      fireEvent.change(productIdInput, { target: { value: 'gid://shopify/Product/987654321' } });

      const applyButton = screen.getByText('Apply');
      fireEvent.click(applyButton);

      // Should not automatically start validation
      await new Promise(resolve => setTimeout(resolve, 3000));
      expect(screen.queryByText('Running Tests...')).not.toBeInTheDocument();
    });
  });

  describe('Integration with Regression Test Infrastructure', () => {
    it('should use regression test utilities for mock data', async () => {
      // Test that we can use the regression helpers
      const mockProduct = mockDataGenerators.createMockProduct({
        id: 'gid://shopify/Product/test-integration',
        title: 'Test Integration Product'
      });

      expect(mockProduct.id).toBe('gid://shopify/Product/test-integration');
      expect(mockProduct.title).toBe('Test Integration Product');
      expect(mockProduct.priceRange).toBeDefined();
      expect(mockProduct.images).toBeDefined();
    });

    it('should use performance helpers for timing validation', async () => {
      const testFunction = async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return 'test result';
      };

      const { result, duration } = await performanceHelpers.measureExecutionTime(testFunction);

      expect(result).toBe('test result');
      expect(duration).toBeGreaterThan(90); // Should be around 100ms
      expect(duration).toBeLessThan(200);
    });

    it('should use error simulators for consistent error testing', async () => {
      const networkError = errorSimulators.networkErrors.timeout();
      expect(networkError.message).toBe('Request timeout');

      const shopifyError = errorSimulators.shopifyErrors.invalidProduct();
      expect(shopifyError.message).toBe('Product not found');

      const corruptedData = errorSimulators.dataCorruption.nullProduct();
      expect(corruptedData).toBeNull();
    });

    it('should use state helpers for localStorage testing', async () => {
      const mockStorage = stateHelpers.createMockLocalStorage();

      mockStorage.setItem('test-key', 'test-value');
      expect(mockStorage.getItem('test-key')).toBe('test-value');

      mockStorage.removeItem('test-key');
      expect(mockStorage.getItem('test-key')).toBeNull();
    });
  });

  describe('Widget State Management', () => {
    it('should handle Judge.me initialization states', async () => {
      // Test loading state
      mockUseJudgeMe.mockReturnValue({
        ready: false,
        loading: true,
        error: null,
        judgeMe: null,
        initialize: jest.fn(),
        getProductReviewCount: jest.fn(),
        getAverageRating: jest.fn()
      });

      const { rerender } = render(<JudgeMeWidgetTester />);

      await waitFor(() => {
        expect(screen.getByText('⏳ Loading')).toBeInTheDocument();
      });

      // Test ready state
      mockUseJudgeMe.mockReturnValue({
        ready: true,
        loading: false,
        error: null,
        judgeMe: mockJudgeMeGlobal,
        initialize: jest.fn(),
        getProductReviewCount: jest.fn(),
        getAverageRating: jest.fn()
      });

      rerender(<JudgeMeWidgetTester />);

      await waitFor(() => {
        expect(screen.getByText('✅ Ready')).toBeInTheDocument();
      });
    });

    it('should handle Judge.me error states', async () => {
      const testError = new Error('Judge.me initialization failed');
      mockUseJudgeMe.mockReturnValue({
        ready: false,
        loading: false,
        error: testError,
        judgeMe: null,
        initialize: jest.fn(),
        getProductReviewCount: jest.fn(),
        getAverageRating: jest.fn()
      });

      render(<JudgeMeWidgetTester />);

      await waitFor(() => {
        expect(screen.getByText('❌ Error')).toBeInTheDocument();
        expect(screen.getByText('Judge.me initialization failed')).toBeInTheDocument();
      });
    });

    it('should disable validation when Judge.me is not ready', async () => {
      mockUseJudgeMe.mockReturnValue({
        ready: false,
        loading: false,
        error: null,
        judgeMe: null,
        initialize: jest.fn(),
        getProductReviewCount: jest.fn(),
        getAverageRating: jest.fn()
      });

      render(<JudgeMeWidgetTester />);

      await waitFor(() => {
        const validateButton = screen.getByText('Run Validation');
        expect(validateButton).toBeDisabled();
      });
    });
  });
});
