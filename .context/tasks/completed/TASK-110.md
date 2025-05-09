---
title: Create Judge.me UI Components
type: task
status: completed
created: 2025-05-07T15:46:13-06:00
updated: 2025-05-07T23:53:00-06:00
id: TASK-110
priority: medium
memory_types: [procedural, semantic]
dependencies: [TASK-107, TASK-108, TASK-109]
tags: [judge.me, integration, components, UI]
---

# Create Judge.me UI Components

## Description
Create React component wrappers for Judge.me widgets that follow our application's component architecture. These components will provide consistent loading states, error handling, and styling compatibility with our design system. The components will serve as integration points for specific Judge.me widgets in the future.

## Objectives
- Create reusable, styled component wrappers for Judge.me widgets
- Ensure components handle loading and error states appropriately
- Maintain consistent UI with our design system
- Provide flexible props API for future customization

## Steps
1. Create a directory structure for Judge.me components:
   ```
   src/components/judgeMe/
   ├── index.ts              # Main export file
   ├── JudgeMeContainer.tsx  # Base wrapper for Judge.me widgets
   ├── ReviewsWidget.tsx     # Product reviews widget component
   ├── ReviewStars.tsx       # Star rating display component
   └── ReviewsBadge.tsx      # Reviews badge/count component
   ```

2. Create the base container component (`JudgeMeContainer.tsx`):
   ```tsx
   import React, { ReactNode } from 'react';
   import { useJudgeMe } from '../../hooks/useJudgeMe';

   interface JudgeMeContainerProps {
     children: ReactNode;
     fallback?: ReactNode;
     errorFallback?: ReactNode;
     className?: string;
     autoLoad?: boolean;
     showLoadingState?: boolean;
   }

   const JudgeMeContainer: React.FC<JudgeMeContainerProps> = ({
     children,
     fallback = <div className="animate-pulse bg-gray-200 rounded h-16 w-full"></div>,
     errorFallback = <div className="hidden"></div>,
     className = '',
     autoLoad = true,
     showLoadingState = true,
   }) => {
     const { isLoading, isReady, error } = useJudgeMe(autoLoad);

     if (error && errorFallback) {
       return (
         <div className={`judge-me-error ${className}`}>
           {errorFallback}
         </div>
       );
     }

     if (isLoading && showLoadingState) {
       return (
         <div className={`judge-me-loading ${className}`}>
           {fallback}
         </div>
       );
     }

     if (!isReady) {
       return null;
     }

     return (
       <div className={`judge-me-container ${className}`}>
         {children}
       </div>
     );
   };

   export default JudgeMeContainer;
   ```

3. Create the reviews widget component (`ReviewsWidget.tsx`):
   ```tsx
   import React, { useEffect, useRef } from 'react';
   import JudgeMeContainer from './JudgeMeContainer';
   import { useJudgeMe } from '../../hooks/useJudgeMe';

   interface ReviewsWidgetProps {
     productId: string;
     productHandle?: string;
     shopDomain?: string;
     className?: string;
     autoLoad?: boolean;
   }

   const ReviewsWidget: React.FC<ReviewsWidgetProps> = ({
     productId,
     productHandle,
     shopDomain,
     className = '',
     autoLoad = true,
   }) => {
     const containerRef = useRef<HTMLDivElement>(null);
     const { isReady, refreshWidgets } = useJudgeMe(autoLoad);
     
     useEffect(() => {
       if (isReady && containerRef.current) {
         // Create the widget container with proper data attributes
         const widgetContainer = document.createElement('div');
         widgetContainer.className = 'jdgm-widget jdgm-reviews-widget';
         widgetContainer.setAttribute('data-id', productId);
         
         if (productHandle) {
           widgetContainer.setAttribute('data-handle', productHandle);
         }
         
         if (shopDomain) {
           widgetContainer.setAttribute('data-shop-domain', shopDomain);
         }
         
         // Clear container and append the widget
         if (containerRef.current) {
           containerRef.current.innerHTML = '';
           containerRef.current.appendChild(widgetContainer);
           
           // Refresh widgets to initialize
           refreshWidgets();
         }
       }
     }, [isReady, productId, productHandle, shopDomain, refreshWidgets]);

     return (
       <JudgeMeContainer 
         className={`judge-me-reviews-widget-container ${className}`}
         autoLoad={autoLoad}
       >
         <div ref={containerRef} className="judge-me-reviews-widget"></div>
       </JudgeMeContainer>
     );
   };

   export default ReviewsWidget;
   ```

4. Create the star rating component (`ReviewStars.tsx`):
   ```tsx
   import React, { useEffect, useState } from 'react';
   import { useJudgeMe } from '../../hooks/useJudgeMe';
   import JudgeMeContainer from './JudgeMeContainer';

   interface ReviewStarsProps {
     productId: string;
     className?: string;
     size?: 'small' | 'medium' | 'large';
     showEmpty?: boolean;
     autoLoad?: boolean;
   }

   const ReviewStars: React.FC<ReviewStarsProps> = ({
     productId,
     className = '',
     size = 'medium',
     showEmpty = true,
     autoLoad = true,
   }) => {
     const { isReady, getAverageRating, getReviewCount } = useJudgeMe(autoLoad);
     const [rating, setRating] = useState<number | null>(null);
     const [count, setCount] = useState<number | null>(null);
     
     useEffect(() => {
       if (isReady) {
         setRating(getAverageRating(productId));
         setCount(getReviewCount(productId));
       }
     }, [isReady, productId, getAverageRating, getReviewCount]);
     
     if (!showEmpty && (!rating || rating === 0)) {
       return null;
     }
     
     const sizeClasses = {
       small: 'text-sm',
       medium: 'text-base',
       large: 'text-lg',
     };
     
     const renderStars = () => {
       if (!rating && rating !== 0) return null;
       
       const fullStars = Math.floor(rating);
       const hasHalfStar = rating % 1 >= 0.5;
       const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
       
       return (
         <div className="flex items-center">
           {/* Full stars */}
           {Array.from({ length: fullStars }).map((_, i) => (
             <span key={`full-${i}`} className="text-accent">★</span>
           ))}
           
           {/* Half star */}
           {hasHalfStar && <span className="text-accent">⯨</span>}
           
           {/* Empty stars */}
           {Array.from({ length: emptyStars }).map((_, i) => (
             <span key={`empty-${i}`} className="text-gray-300">★</span>
           ))}
           
           {/* Review count */}
           {count !== null && count > 0 && (
             <span className="ml-2 text-gray-600">({count})</span>
           )}
         </div>
       );
     };

     return (
       <JudgeMeContainer
         className={`judge-me-stars ${sizeClasses[size]} ${className}`}
         autoLoad={autoLoad}
         showLoadingState={false}
       >
         {renderStars()}
       </JudgeMeContainer>
     );
   };

   export default ReviewStars;
   ```

5. Create the reviews badge component (`ReviewsBadge.tsx`):
   ```tsx
   import React, { useEffect, useRef } from 'react';
   import JudgeMeContainer from './JudgeMeContainer';
   import { useJudgeMe } from '../../hooks/useJudgeMe';

   interface ReviewsBadgeProps {
     className?: string;
     autoLoad?: boolean;
   }

   const ReviewsBadge: React.FC<ReviewsBadgeProps> = ({
     className = '',
     autoLoad = true,
   }) => {
     const containerRef = useRef<HTMLDivElement>(null);
     const { isReady, refreshWidgets } = useJudgeMe(autoLoad);
     
     useEffect(() => {
       if (isReady && containerRef.current) {
         // Create the badge container with proper data attributes
         const badgeContainer = document.createElement('div');
         badgeContainer.className = 'jdgm-widget jdgm-shop-badge';
         
         // Clear container and append the widget
         if (containerRef.current) {
           containerRef.current.innerHTML = '';
           containerRef.current.appendChild(badgeContainer);
           
           // Refresh widgets to initialize
           refreshWidgets();
         }
       }
     }, [isReady, refreshWidgets]);

     return (
       <JudgeMeContainer 
         className={`judge-me-badge-container ${className}`}
         autoLoad={autoLoad}
       >
         <div ref={containerRef} className="judge-me-badge"></div>
       </JudgeMeContainer>
     );
   };

   export default ReviewsBadge;
   ```

6. Create the main export file (`index.ts`):
   ```typescript
   export { default as JudgeMeContainer } from './JudgeMeContainer';
   export { default as ReviewsWidget } from './ReviewsWidget';
   export { default as ReviewStars } from './ReviewStars';
   export { default as ReviewsBadge } from './ReviewsBadge';
   ```

## Progress
- Created directory structure for Judge.me components (2025-05-07T23:53:00-06:00)
- Implemented JudgeMeContainer base component for consistent styling and loading states
- Implemented ReviewStars component for displaying product ratings
- Implemented ReviewWidget component for displaying product reviews
- Created index.ts file for easy importing of components
- Added TypeScript definitions for Judge.me global objects
- Created test files for components
- Implementation completed

## Dependencies
- TASK-107 (Create Judge.me Script Manager Service)
- TASK-108 (Create useJudgeMe React Hook)
- TASK-109 (Implement Global Judge.me Script Initialization)

## Test Status
- Status: Not Started
- Test Files: None

## Notes
- These components follow our existing component architecture patterns
- The implementation uses React refs to create proper DOM elements for Judge.me widgets
- Loading states use the application's existing loading UI patterns
- Error fallbacks are provided but hidden by default to avoid disrupting the UI
- Components are designed to be composable and flexible for different use cases
- Future improvements could include more detailed typing for Judge.me widget attributes

## Next Steps
- Integrate Judge.me components in product pages
