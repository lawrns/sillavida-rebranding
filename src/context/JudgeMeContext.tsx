/**
 * JudgeMeContext
 * 
 * Provides a global React context for Judge.me integration.
 * This context makes Judge.me's loading state and methods available throughout the application.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loadJudgeMeScript } from '../lib/judgeMe';
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
    const loadJudgeMeScriptAndInitialize = async () => {
      try {
        setLoading(true);
        
        // Check if script is already loaded
        if (typeof window.jdgm !== 'undefined') {
          setReady(true);
          setLoading(false);
          return;
        }

        // Load the script using our utility
        await loadJudgeMeScript();
        
        // Script loaded successfully
        if (typeof window.jdgm !== 'undefined') {
          setReady(true);
        } else {
          setError(new Error('Judge.me script loaded but global object not available'));
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading Judge.me script:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    };

    if (autoInitialize) {
      loadJudgeMeScriptAndInitialize();
    }
  }, [autoInitialize]);

  // Function to load script and initialize Judge.me
  const loadJudgeMeScriptAndInitialize = async () => {
    try {
      setLoading(true);
      
      // Check if script is already loaded
      if (typeof window.jdgm !== 'undefined') {
        setReady(true);
        setLoading(false);
        return;
      }

      // Load the script using our utility
      await loadJudgeMeScript();
      
      // Script loaded successfully
      if (typeof window.jdgm !== 'undefined') {
        setReady(true);
      } else {
        setError(new Error('Judge.me script loaded but global object not available'));
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading Judge.me script:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
    }
  };

  // Public method to initialize Judge.me
  const initialize = async () => {
    await loadJudgeMeScriptAndInitialize();
  };

  // Get the review count for a product
  const getProductReviewCount = async (productId: string | number): Promise<number> => {
    if (!ready) {
      await loadJudgeMeScriptAndInitialize();
    }

    if (!window.jdgm) {
      console.error('Judge.me is not available');
      return 0;
    }

    return new Promise((resolve) => {
      try {
        // Use Judge.me's API to get review count
        window.jdgm.getReviewCount(productId, (count: number) => {
          resolve(count || 0);
        });
      } catch (error) {
        console.error('Error getting review count:', error);
        resolve(0);
      }
    });
  };

  // Get the average rating for a product
  const getAverageRating = async (productId: string | number): Promise<number> => {
    if (!ready) {
      await loadJudgeMeScriptAndInitialize();
    }

    if (!window.jdgm) {
      console.error('Judge.me is not available');
      return 0;
    }

    return new Promise((resolve) => {
      try {
        // Use Judge.me's API to get average rating
        window.jdgm.getAverageRating(productId, (rating: number) => {
          resolve(rating || 0);
        });
      } catch (error) {
        console.error('Error getting average rating:', error);
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
