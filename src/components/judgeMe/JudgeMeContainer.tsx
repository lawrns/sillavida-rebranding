/**
 * JudgeMeContainer Component
 * 
 * A base container component for all Judge.me widget implementations.
 * It provides consistent loading states, error handling, and styling.
 */

import React from 'react';
import { useJudgeMeContext } from '../../context/JudgeMeContext';

interface JudgeMeContainerProps {
  children: React.ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  showIfEmpty?: boolean;
  emptyComponent?: React.ReactNode;
  className?: string;
  showLoadingState?: boolean;
  showErrorState?: boolean;
}

const JudgeMeContainer: React.FC<JudgeMeContainerProps> = ({
  children,
  isLoading,
  error,
  isEmpty = false,
  showIfEmpty = true,
  emptyComponent,
  className = '',
  showLoadingState = true,
  showErrorState = false,
}) => {
  const judgeMeContext = useJudgeMeContext();
  
  // Use provided loading/error state or fallback to context state
  const loading = isLoading !== undefined ? isLoading : judgeMeContext.loading;
  const errorState = error || judgeMeContext.error;
  
  if (loading && showLoadingState) {
    return (
      <div className={`judge-me-loading ${className}`} data-testid="judge-me-loading">
        <div className="animate-pulse flex space-x-1 justify-center items-center h-5">
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    );
  }
  
  if (errorState && showErrorState) {
    return (
      <div className={`judge-me-error text-red-500 text-sm ${className}`}>
        {errorState.message || 'Error loading reviews'}
      </div>
    );
  }
  
  // Handle empty state
  if (isEmpty && !showIfEmpty) {
    return null;
  }
  
  if (isEmpty && emptyComponent) {
    return (
      <div className={`judge-me-empty ${className}`}>
        {emptyComponent}
      </div>
    );
  }
  
  return (
    <div className={`judge-me-container ${className}`}>
      {children}
    </div>
  );
};

export default JudgeMeContainer;
