/**
 * JudgeMeContext
 * 
 * Provides a global React context for Judge.me integration.
 * This context makes Judge.me's loading state and methods available throughout the application.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  // Use the useJudgeMe hook to manage Judge.me state
  const judgeMeState = useJudgeMe(autoInitialize);
  
  return (
    <JudgeMeContext.Provider value={judgeMeState}>
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
