import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import useJudgeMe from '../useJudgeMe';
import JudgeMeService from '../../services/judgeMe';

// Mock the JudgeMeService
jest.mock('../../services/judgeMe', () => ({
  isJudgeMeReady: jest.fn(),
  initializeScript: jest.fn(),
  getScriptStatus: jest.fn(),
  getProductReviewCount: jest.fn(),
  getAverageRating: jest.fn()
}));

describe('useJudgeMe', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    (JudgeMeService.isJudgeMeReady as jest.Mock).mockReturnValue(false);
    (JudgeMeService.getScriptStatus as jest.Mock).mockReturnValue({
      loading: false,
      loaded: false,
      error: null
    });
    (JudgeMeService.initializeScript as jest.Mock).mockResolvedValue(undefined);
    (JudgeMeService.getProductReviewCount as jest.Mock).mockResolvedValue(5);
    (JudgeMeService.getAverageRating as jest.Mock).mockResolvedValue(4.5);
    
    // Mock window.jdgm
    Object.defineProperty(window, 'jdgm', {
      value: {
        initialized: true,
        widgetIds: [],
        getReviews: jest.fn(),
        renderWidget: jest.fn(),
        renderBadges: jest.fn(),
        getProductReviewCount: jest.fn(),
        getAverageRating: jest.fn()
      },
      configurable: true
    });
  });

  test('should initialize Judge.me automatically', async () => {
    // Mock Judge.me as not ready initially
    (JudgeMeService.isJudgeMeReady as jest.Mock).mockReturnValue(false);
    
    const { result, waitForNextUpdate } = renderHook(() => useJudgeMe(true));
    
    // Initial state should show loading
    expect(result.current.ready).toBe(false);
    expect(result.current.loading).toBe(true);
    
    // Mock Judge.me becoming ready after initialization
    (JudgeMeService.isJudgeMeReady as jest.Mock).mockReturnValue(true);
    (JudgeMeService.getScriptStatus as jest.Mock).mockReturnValue({
      loading: false,
      loaded: true,
      error: null
    });
    
    // Wait for the hook to update
    await waitForNextUpdate();
    
    // Verify the hook shows Judge.me as ready
    expect(result.current.ready).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.judgeMe).not.toBe(null);
    
    // Verify initialize was called
    expect(JudgeMeService.initializeScript).toHaveBeenCalledTimes(1);
  });

  test('should not initialize Judge.me automatically when disabled', () => {
    renderHook(() => useJudgeMe(false));
    
    // Verify initialize was not called
    expect(JudgeMeService.initializeScript).not.toHaveBeenCalled();
  });

  test('should handle initialization errors', async () => {
    // Mock initialization failure
    const mockError = new Error('Initialization failed');
    (JudgeMeService.initializeScript as jest.Mock).mockRejectedValue(mockError);
    
    const { result, waitForNextUpdate } = renderHook(() => useJudgeMe(true));
    
    // Wait for the hook to update after initialization fails
    await waitForNextUpdate();
    
    // Verify error state
    expect(result.current.ready).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(mockError);
    expect(result.current.judgeMe).toBe(null);
  });

  test('should initialize manually when called', async () => {
    // Start with auto-initialization disabled
    const { result, waitForNextUpdate } = renderHook(() => useJudgeMe(false));
    
    // Verify not initialized yet
    expect(result.current.ready).toBe(false);
    expect(JudgeMeService.initializeScript).not.toHaveBeenCalled();
    
    // Mock Judge.me becoming ready
    (JudgeMeService.isJudgeMeReady as jest.Mock).mockReturnValue(true);
    
    // Manually initialize
    act(() => {
      result.current.initialize();
    });
    
    // Wait for the update
    await waitForNextUpdate();
    
    // Verify initialized
    expect(result.current.ready).toBe(true);
    expect(JudgeMeService.initializeScript).toHaveBeenCalledTimes(1);
  });

  test('should get product review count', async () => {
    // Mock Judge.me as ready
    (JudgeMeService.isJudgeMeReady as jest.Mock).mockReturnValue(true);
    
    const { result } = renderHook(() => useJudgeMe(true));
    
    // Call getProductReviewCount
    let reviewCount;
    await act(async () => {
      reviewCount = await result.current.getProductReviewCount('123');
    });
    
    // Verify correct review count is returned
    expect(reviewCount).toBe(5);
    expect(JudgeMeService.getProductReviewCount).toHaveBeenCalledWith('123');
  });

  test('should get average rating', async () => {
    // Mock Judge.me as ready
    (JudgeMeService.isJudgeMeReady as jest.Mock).mockReturnValue(true);
    
    const { result } = renderHook(() => useJudgeMe(true));
    
    // Call getAverageRating
    let avgRating;
    await act(async () => {
      avgRating = await result.current.getAverageRating('123');
    });
    
    // Verify correct average rating is returned
    expect(avgRating).toBe(4.5);
    expect(JudgeMeService.getAverageRating).toHaveBeenCalledWith('123');
  });

  test('should auto-initialize when methods are called and not ready', async () => {
    // Mock Judge.me as not ready initially
    (JudgeMeService.isJudgeMeReady as jest.Mock).mockReturnValue(false);
    
    const { result } = renderHook(() => useJudgeMe(false));
    
    // Verify not initialized initially
    expect(result.current.ready).toBe(false);
    expect(JudgeMeService.initializeScript).not.toHaveBeenCalled();
    
    // Mock Judge.me becoming ready after method call
    (JudgeMeService.isJudgeMeReady as jest.Mock).mockImplementation(() => {
      // Return true after initializeScript is called
      return JudgeMeService.initializeScript.mock.calls.length > 0;
    });
    
    // Call getProductReviewCount
    await act(async () => {
      await result.current.getProductReviewCount('123');
    });
    
    // Verify initialize was called
    expect(JudgeMeService.initializeScript).toHaveBeenCalledTimes(1);
    expect(JudgeMeService.getProductReviewCount).toHaveBeenCalledWith('123');
  });
});
