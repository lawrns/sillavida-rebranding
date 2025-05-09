---
title: Add Judge.me Star Ratings to All Product Cards
type: task
status: completed
created: 2025-05-08T14:15:44-06:00
updated: 2025-05-08T14:40:35-06:00
id: TASK-115
priority: medium
memory_types: [procedural, semantic]
dependencies: [TASK-107, TASK-108, TASK-109, TASK-110, TASK-111, TASK-112]
tags: [judge.me, integration, product-cards, ratings]
---

# Add Judge.me Star Ratings to All Product Cards

## Description
Enhance all product cards across the site with Judge.me star ratings to provide quick visual feedback on product quality and customer satisfaction. This will improve the shopping experience by helping customers make more informed decisions at a glance.

## Objectives
- Implement Judge.me star ratings on all product card components
- Ensure ratings display properly for each specific product
- Style the ratings to match the Silla Vida design system
- Add proper error handling and loading states
- Ensure consistent appearance across all locations where product cards appear

## Steps
1. Identify all instances of product card components across the site.

2. Create a compact version of the ReviewStars component specifically for product cards:
   ```tsx
   // src/components/judgeMe/PreviewBadge.tsx
   import React from 'react';
   import JudgeMeContainer from './JudgeMeContainer';
   import { useJudgeMe } from '../../hooks/useJudgeMe';
   
   interface PreviewBadgeProps {
     productId: string;
     className?: string;
     containerClassName?: string;
     showEmptyState?: boolean;
   }
   
   const PreviewBadge: React.FC<PreviewBadgeProps> = ({
     productId,
     className = '',
     containerClassName = '',
     showEmptyState = false,
   }) => {
     const { isLoading, error, ready } = useJudgeMe();
     const isEmpty = false; // Let the Judge.me script determine emptiness
     
     const renderBadge = () => {
       return (
         <div 
           className={`jdgm-widget jdgm-preview-badge ${className}`}
           data-id={productId}
         ></div>
       );
     };
     
     return (
       <JudgeMeContainer
         isLoading={isLoading}
         error={error}
         isEmpty={isEmpty}
         showIfEmpty={showEmptyState}
         containerClassName={`preview-badge-container ${containerClassName}`}
         emptyComponent={<div className="h-5 opacity-40">No reviews yet</div>}
         loadingComponent={<div className="h-5 w-20 bg-gray-200 animate-pulse rounded"></div>}
       >
         {renderBadge()}
       </JudgeMeContainer>
     );
   };
   
   export default PreviewBadge;
   ```

3. Export the new component in the Judge.me components index file:
   ```tsx
   // src/components/judgeMe/index.ts
   export { default as PreviewBadge } from './PreviewBadge';
   ```

4. Update the ProductCard component to include the PreviewBadge:
   ```tsx
   import { PreviewBadge } from '../judgeMe';
   
   // Inside the ProductCard component
   <div className="product-card">
     <div className="product-image">
       {/* Product image */}
     </div>
     <div className="product-details">
       <h3 className="product-title">{product.title}</h3>
       <PreviewBadge 
         productId={product.id} 
         containerClassName="mt-1 mb-2"
       />
       <p className="product-price">{formatPrice(product.priceRange.minVariantPrice)}</p>
     </div>
   </div>
   ```

5. Add custom CSS for the preview badge in the Judge.me CSS file:
   ```css
   /* In src/components/judgeMe/JudgeMe.css */
   
   /* Preview Badge Styling */
   .preview-badge-container {
     min-height: 20px;
     margin: 0.25rem 0;
   }
   
   .jdgm-preview-badge {
     font-size: 0.8rem !important;
   }
   
   .jdgm-prev-badge__stars {
     margin-right: 0.25rem !important;
   }
   
   .jdgm-prev-badge__text {
     font-size: 0.8rem !important;
     color: #666 !important;
   }
   ```

6. Test the implementation with various products to ensure consistent display.
7. Verify the appearance on different screen sizes.

## Progress
- No progress yet

## Dependencies
- TASK-107 (Create Judge.me Script Manager Service)
- TASK-108 (Create Judge.me API Integration Hook)
- TASK-109 (Implement Judge.me Script Initialization)
- TASK-110 (Create Judge.me UI Components)
- TASK-111 (Integrate Judge.me Components in Product Page)
- TASK-112 (Create Judge.me Integration Documentation)

## Notes
The preview badge will use the native Judge.me div structure:
```html
<div class="jdgm-widget jdgm-preview-badge" data-id="add-your-product-id"></div>
```

## Next Steps
- Consider adding a tooltip showing the number of reviews when hovering over the stars
- Add subtle animations for the stars to improve visual appeal
