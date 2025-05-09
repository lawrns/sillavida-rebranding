/**
 * VerifiedBadge Component
 * 
 * Displays the Judge.me verified badge showing overall store rating.
 * This component is designed to be placed in the email capture section 
 * to replace mock stars and enhance credibility.
 */

import React from 'react';
import JudgeMeContainer from './JudgeMeContainer';
import { useJudgeMe } from '../../hooks/useJudgeMe';

interface VerifiedBadgeProps {
  containerClassName?: string;
  className?: string;
  showText?: boolean;
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  containerClassName = '',
  className = '',
  showText = true
}) => {
  const { loading, error } = useJudgeMe();
  
  const renderBadge = () => {
    return (
      <div className={`jdgm-verified-badge-wrapper ${className}`}>
        {showText && (
          <span className="verified-badge-text text-sm text-gray-200 block mb-1">
            Trusted by our customers
          </span>
        )}
        <div className="jdgm-verified-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
            <path d="M21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C6.75329 21.5 2.5 17.2467 2.5 12C2.5 6.75329 6.75329 2.5 12 2.5C17.2467 2.5 21.5 6.75329 21.5 12Z" stroke="#4b7cae" strokeWidth="1.5"/>
            <path d="M10.5 16.5L16.5 9" stroke="#4b7cae" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.5 12L10.5 15" stroke="#4b7cae" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="jdgm-verified-badge__text">Verified by Judge.me</span>
        </div>
      </div>
    );
  };
  
  return (
    <JudgeMeContainer
      isLoading={loading}
      error={error}
      className={`verified-badge-container ${containerClassName}`}
      showLoadingState={true}
      showErrorState={false}
    >
      {renderBadge()}
    </JudgeMeContainer>
  );
};

export default VerifiedBadge;
