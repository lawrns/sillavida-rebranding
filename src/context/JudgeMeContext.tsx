/**
 * JudgeMeContext
 * 
 * Provides a global React context for Judge.me integration.
 * This context makes Judge.me's loading state and methods available throughout the application.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { JudgeMeReviewData } from '../types/judgeMe';
import { useJudgeMe } from '../hooks/useJudgeMe';
import type { JudgeMeGlobal } from '../services/judgeMe';

// Context state interface
export interface JudgeMeContextState {
  ready: boolean;
  loading: boolean;
  error: Error | null;
  judgeMe: JudgeMeGlobal | null;
}

// Context value interface with methods
export interface JudgeMeContextValue extends JudgeMeContextState {
  initialize: () => Promise<void>;
  getProductReviewCount: (productId: string | number) => Promise<number>;
  getAverageRating: (productId: string | number) => Promise<number>;
}

// Create context with default values
const JudgeMeContext = createContext<JudgeMeContextValue | null>(null);

// Provider props interface
interface JudgeMeProviderProps {
  children: ReactNode;
  autoInitialize?: boolean;
}

/**
 * Provider component for Judge.me context
 */
export const JudgeMeProvider: React.FC<JudgeMeProviderProps> = ({ 
  children, 
  autoInitialize = true 
}) => {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkJudgeMeReady = () => {
      // Since script is loaded in index.html, just check if it's ready
      if (typeof window.jdgm !== 'undefined') {
        setReady(true);
        setLoading(false);
      } else {
        // Try again after a short delay in case script is still loading
        setTimeout(() => {
          if (typeof window.jdgm !== 'undefined') {
            setReady(true);
          } else {
            setError(new Error('Judge.me script not loaded from index.html'));
          }
          setLoading(false);
        }, 1000);
      }
    };

    if (autoInitialize) {
      setLoading(true);
      checkJudgeMeReady();
    }
  }, [autoInitialize]);

  // Simplified initialization since script is loaded from index.html
  const initialize = async () => {
    if (typeof window.jdgm !== 'undefined') {
      setReady(true);
      setLoading(false);
    } else {
      setError(new Error('Judge.me script not available'));
      setLoading(false);
    }
  };

  // Get the review count for a product
  const getProductReviewCount = async (productId: string | number): Promise<number> => {
    if (!ready) {
      await initialize();
    }

    if (!window.jdgm) {
      return 0;
    }

    return new Promise((resolve) => {
      try {
        // Use Judge.me's API to get review count
        window.jdgm.getReviewCount(productId, (count: number) => {
          resolve(count || 0);
        });
      } catch (error) {
        resolve(0);
      }
    });
  };

  // Get the average rating for a product
  const getAverageRating = async (productId: string | number): Promise<number> => {
    if (!ready) {
      await initialize();
    }

    if (!window.jdgm) {
      return 0;
    }

    return new Promise((resolve) => {
      try {
        // Use Judge.me's API to get average rating
        window.jdgm.getAverageRating(productId, (rating: number) => {
          resolve(rating || 0);
        });
      } catch (error) {
        resolve(0);
      }
    });
  };

  return (
    <JudgeMeContext.Provider value={{
      ready,
      loading,
      error,
      judgeMe: null,
      initialize,
      getProductReviewCount,
      getAverageRating,
    }}>
      {children}
    </JudgeMeContext.Provider>
  );
};

/**
 * Custom hook for consuming the Judge.me context
 * @returns Judge.me context value
 * @throws Error if used outside of JudgeMeProvider
 */
export const useJudgeMeContext = (): JudgeMeContextValue => {
  const context = useContext(JudgeMeContext);
  
  if (!context) {
    throw new Error('useJudgeMeContext must be used within a JudgeMeProvider');
  }
  
  return context;
};

export default JudgeMeContext;
