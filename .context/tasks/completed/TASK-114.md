---
title: Enhance Product Pages with Judge.me Full Review Widget
type: task
status: completed
created: 2025-05-08T14:15:44-06:00
updated: 2025-05-08T17:11:48-06:00
id: TASK-114
priority: medium
memory_types: [procedural, semantic]
dependencies: [TASK-107, TASK-108, TASK-109, TASK-110, TASK-111, TASK-112]
tags: [judge.me, integration, product-page, reviews]
---

# Enhance Product Pages with Judge.me Full Review Widget

## Description
Enhance the product pages by adding a full Judge.me Review Widget below the product image carousel. This will provide customers with detailed reviews to help them make informed purchase decisions.

## Objectives
- Implement the full Judge.me Review Widget below the product image carousel
- Ensure the widget correctly displays reviews for the current product
- Style the widget to match the Silla Vida design system (#111827 for backgrounds, #4b7cae for interactive elements)
- Add proper error handling and loading states
- Implement responsive design for all screen sizes

## Steps
1. Locate the product page component and identify where the product image carousel is rendered.

2. Update the existing ReviewWidget component to better accommodate the specific placement requirements:
   ```tsx
   // src/components/judgeMe/ReviewWidget.tsx
   import React from 'react';
   import JudgeMeContainer from './JudgeMeContainer';
   import { useJudgeMe } from '../../hooks/useJudgeMe';
   
   interface ReviewWidgetProps {
     productId: string;
     productTitle?: string;
     containerClassName?: string;
     className?: string;
     showLoadingState?: boolean;
     showIfEmpty?: boolean;
     widgetType?: 'inline' | 'carousel' | 'featured';
   }
   
   const ReviewWidget: React.FC<ReviewWidgetProps> = ({
     productId,
     productTitle,
     containerClassName = '',
     className = '',
     showLoadingState = true,
     showIfEmpty = true,
     widgetType = 'inline'
   }) => {
     const { isLoading, error, ready, judgeMe } = useJudgeMe();
     
     // Initialize an empty state - we'll let the widget itself handle the actual emptiness check
     const isEmpty = false;
     
     const renderWidget = () => {
       return (
         <div 
           className={`jdgm-widget jdgm-review-widget jdgm-${widgetType}-widget ${className}`}
           data-id={productId}
           data-product-title={productTitle || ''}
         ></div>
       );
     };
     
     return (
       <JudgeMeContainer
         isLoading={isLoading && showLoadingState}
         error={error}
         isEmpty={isEmpty}
         showIfEmpty={showIfEmpty}
         containerClassName={`judge-me-reviews-container ${containerClassName}`}
         emptyComponent={
           <div className="text-center py-4">
             <p className="mb-2">Be the first to review this product!</p>
             <button 
               className="bg-accent hover:bg-accent-dark text-white py-2 px-4 rounded transition-colors"
               onClick={() => judgeMe?.renderWidget('#write-review-form')}
             >
               Write a Review
             </button>
           </div>
         }
       >
         {renderWidget()}
       </JudgeMeContainer>
     );
   };
   
   export default ReviewWidget;
   ```

3. Modify the product page component to include the ReviewWidget below the product image carousel:
   ```tsx
   import { ReviewWidget } from '../components/judgeMe';
   
   // After the product image carousel
   <div className="mt-12 bg-[#111827] text-white p-6 rounded-lg shadow-md">
     <div className="mb-6 border-b border-[#4b7cae]/30 pb-4">
       <h2 className="text-2xl font-semibold font-heading">Customer Reviews</h2>
       <p className="text-sm mt-2 text-gray-300">Read what our customers are saying about this product</p>
     </div>
     <ReviewWidget
       productId={product.id}
       productTitle={product.title}
       containerClassName="w-full"
       showIfEmpty={true}
     />
   </div>
   ```

4. Update the styling in JudgeMe.css to match the Silla Vida design system:
   ```css
   /* In src/components/judgeMe/JudgeMe.css */
   
   /* Full Review Widget Styling */
   .jdgm-review-widget {
     background-color: transparent !important;
     color: white !important;
   }
   
   .jdgm-review-widget .jdgm-rev__header {
     border-color: rgba(75, 124, 174, 0.3) !important;
   }
   
   .jdgm-review-widget .jdgm-rev__author {
     color: white !important;
     font-weight: 500 !important;
   }
   
   .jdgm-review-widget .jdgm-rev__timestamp {
     color: rgba(255, 255, 255, 0.7) !important;
   }
   
   .jdgm-review-widget .jdgm-rev__body {
     color: rgba(255, 255, 255, 0.9) !important;
   }
   
   .jdgm-review-widget .jdgm-write-rev-link {
     color: #4b7cae !important;
     font-weight: 500 !important;
     transition: color 0.2s ease;
   }
   
   .jdgm-review-widget .jdgm-write-rev-link:hover {
     color: rgba(75, 124, 174, 0.8) !important;
     text-decoration: none !important;
   }
   ```

5. Test the review widget with various product IDs to ensure it loads properly.
6. Verify responsive behavior on different screen sizes.
7. Ensure proper handling of empty state (products with no reviews).

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
The widget will use the native Judge.me div structure:
```html
<div class="jdgm-widget jdgm-review-widget jdgm-outside-widget" data-id="add-your-product-id" data-product-title="add-your-product-title"></div>
```

## Next Steps
- Consider adding filtering and sorting options for reviews.
- Add pagination for products with many reviews.
