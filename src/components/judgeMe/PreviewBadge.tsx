/**
 * PreviewBadge Component
 * 
 * A compact component for displaying Judge.me star ratings on product cards.
 * This component is used across all product listings to show rating information.
 */

import React from 'react';
import JudgeMeContainer from './JudgeMeContainer';
import { useJudgeMe } from '../../hooks/useJudgeMe';
import { extractShopifyId } from '../../utils/business/productTransformer';

interface PreviewBadgeProps {
  productId: string;
  className?: string;
  containerClassName?: string;
}

const PreviewBadge: React.FC<PreviewBadgeProps> = ({
  productId,
  className = '',
  containerClassName = ''
}) => {
  const { loading, error } = useJudgeMe();
  
  const renderBadge = () => {
    return (
      <div 
        className={`jdgm-widget jdgm-preview-badge ${className}`}
        data-id={extractShopifyId(productId)}
      ></div>
    );
  };
  
  return (
    <JudgeMeContainer
      isLoading={loading}
      error={error}
      className={`preview-badge-container ${containerClassName}`}
      showLoadingState={true}
      showErrorState={false}
    >
      {renderBadge()}
    </JudgeMeContainer>
  );
};

export default PreviewBadge;
