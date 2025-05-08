/**
 * useJudgeMe React Hook
 * 
 * A custom React hook that provides access to Judge.me functionality throughout the application.
 * This hook handles script loading state, initialization, and exposes Judge.me methods.
 */

import { useState, useEffect, useCallback } from 'react';
import JudgeMeService, { 
  isJudgeMeReady, 
  initializeScript,
  getScriptStatus,
  getProductReviewCount,
  getAverageRating
} from '../services/judgeMe';
import type { JudgeMeGlobal } from '../services/judgeMe';

interface UseJudgeMeState {
  ready: boolean;
  loading: boolean;
  error: Error | null;
  judgeMe: JudgeMeGlobal | null;
}

interface UseJudgeMeResult extends UseJudgeMeState {
  initialize: () => Promise<void>;
  getProductReviewCount: (productId: string | number) => Promise<number>;
  getAverageRating: (productId: string | number) => Promise<number>;
}

/**
 * Custom React hook for accessing Judge.me functionality
 * 
 * @param autoInitialize Whether to automatically initialize Judge.me on mount
 * @returns Object containing Judge.me state and methods
 */
export const useJudgeMe = (autoInitialize = true): UseJudgeMeResult => {
  const [state, setState] = useState<UseJudgeMeState>({
    ready: isJudgeMeReady(),
    loading: false,
    error: null,
    judgeMe: null
  });

  /**
   * Initialize the Judge.me script
   */
  const initialize = useCallback(async () => {
    if (state.ready || state.loading) return;

    try {
      setState(prev => ({ ...prev, loading: true }));
      await initializeScript();
      
      // Get the Judge.me global object after initialization
      const judgeMe = (window as any).jdgm as JudgeMeGlobal;
      
      setState({
        ready: true,
        loading: false,
        error: null,
        judgeMe
      });
    } catch (error) {
      setState({
        ready: false,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
        judgeMe: null
      });
    }
  }, [state.ready, state.loading]);

  /**
   * Get the review count for a product
   */
  const getReviewCount = useCallback(
    async (productId: string | number): Promise<number> => {
      if (!state.ready) {
        console.warn('Judge.me not ready, initializing...');
        try {
          await initialize();
        } catch (error) {
          console.error('Failed to initialize Judge.me for review count:', error);
          return 0;
        }
      }
      
      return getProductReviewCount(productId);
    },
    [state.ready, initialize]
  );

  /**
   * Get the average rating for a product
   */
  const getAvgRating = useCallback(
    async (productId: string | number): Promise<number> => {
      if (!state.ready) {
        console.warn('Judge.me not ready, initializing...');
        try {
          await initialize();
        } catch (error) {
          console.error('Failed to initialize Judge.me for average rating:', error);
          return 0;
        }
      }
      
      return getAverageRating(productId);
    },
    [state.ready, initialize]
  );

  // Auto-initialize on mount if enabled
  useEffect(() => {
    if (autoInitialize && !state.ready && !state.loading) {
      initialize();
    }
    
    // Check if Judge.me status changes elsewhere in the app
    const checkStatus = () => {
      const status = getScriptStatus();
      const currentReady = isJudgeMeReady();
      
      if (currentReady !== state.ready || status.loading !== state.loading) {
        setState(prev => ({
          ...prev,
          ready: currentReady,
          loading: status.loading,
          error: status.error,
          judgeMe: currentReady ? (window as any).jdgm as JudgeMeGlobal : null
        }));
      }
    };
    
    // Check status periodically while loading
    let interval: NodeJS.Timeout | null = null;
    if (state.loading) {
      interval = setInterval(checkStatus, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoInitialize, state.ready, state.loading, initialize]);

  return {
    ...state,
    initialize,
    getProductReviewCount: getReviewCount,
    getAverageRating: getAvgRating
  };
};

export default useJudgeMe;
