---
title: Implement Judge.me Reviews Carousel on Homepage
type: task
status: completed
created: 2025-05-08T14:15:44-06:00
updated: 2025-05-08T14:35:43-06:00
id: TASK-113
priority: medium
memory_types: [procedural, semantic]
dependencies: [TASK-107, TASK-108, TASK-109, TASK-110, TASK-111, TASK-112]
tags: [judge.me, integration, homepage, carousel]
---

# Implement Judge.me Reviews Carousel on Homepage

## Description
Implement a Judge.me Reviews Carousel widget below the HeroSlider component on the homepage. This widget will showcase featured customer reviews in a carousel format, enhancing social proof and helping visitors make informed purchase decisions.

## Objectives
- Add the Judge.me Reviews Carousel widget below the HeroSlider component
- Ensure the carousel loads properly with the Judge.me script
- Style the carousel to match the Silla Vida design system
- Add proper error handling and loading states
- Implement responsive design for all screen sizes

## Steps
1. Locate the homepage component and identify where the HeroSlider is rendered.
2. Create a new `ReviewsCarousel` component in the Judge.me components directory:
   ```tsx
   // src/components/judgeMe/ReviewsCarousel.tsx
   import React from 'react';
   import JudgeMeContainer from './JudgeMeContainer';
   import { useJudgeMe } from '../../hooks/useJudgeMe';
   
   interface ReviewsCarouselProps {
     containerClassName?: string;
     className?: string;
     title?: string;
     showAllReviewsLink?: boolean;
   }
   
   const ReviewsCarousel: React.FC<ReviewsCarouselProps> = ({
     containerClassName = '',
     className = '',
     title = 'Featured Reviews',
     showAllReviewsLink = true
   }) => {
     const { isLoading, error, ready } = useJudgeMe();
     const isEmpty = false; // We can't determine this until the widget loads
     
     const renderCarousel = () => {
       return (
         <div className={`jdgm-carousel-wrapper ${className}`}>
           <h2 className="jdgm-carousel-title text-2xl font-bold text-primary mb-6 font-heading">{title}</h2>
           {showAllReviewsLink && (
             <a href="/reviews" className="jdgm-all-reviews-rating-wrapper flex items-center mb-4 text-accent hover:text-accent-dark">
               <div data-score="" className="jdgm-all-reviews-rating"></div>
               <span className="ml-2">from <span className="jdgm-all-reviews-count"></span> reviews</span>
             </a>
           )}
         </div>
       );
     };
     
     return (
       <JudgeMeContainer
         isLoading={isLoading}
         error={error}
         isEmpty={isEmpty}
         containerClassName={`reviews-carousel-container ${containerClassName}`}
       >
         {renderCarousel()}
       </JudgeMeContainer>
     );
   };
   
   export default ReviewsCarousel;
   ```

3. Export the new component in the Judge.me components index file:
   ```tsx
   // src/components/judgeMe/index.ts
   export { default as ReviewsCarousel } from './ReviewsCarousel';
   ```

4. Update the homepage component to include the ReviewsCarousel:
   ```tsx
   import { ReviewsCarousel } from '../components/judgeMe';
   
   // After the HeroSlider component
   <section className="py-12 bg-white">
     <div className="container mx-auto px-4">
       <ReviewsCarousel
         containerClassName="mb-16"
         showAllReviewsLink={true}
       />
     </div>
   </section>
   ```

5. Add custom CSS styles for the carousel in the Judge.me CSS file:
   ```css
   /* In src/components/judgeMe/JudgeMe.css */
   
   /* Reviews Carousel Styling */
   .reviews-carousel-container {
     margin: 3rem 0;
   }
   
   .jdgm-carousel-wrapper {
     width: 100%;
   }
   
   .jdgm-carousel-title {
     color: #111827;
   }
   
   .jdgm-all-reviews-rating-wrapper {
     color: #4b7cae;
     display: inline-flex;
     align-items: center;
     font-family: 'Lato', sans-serif;
     font-size: 0.875rem;
     margin-bottom: 1.5rem;
   }
   ```

6. Test the carousel implementation on different screen sizes.
7. Ensure the carousel is correctly handling different states (loading, error, empty).

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
The carousel will use the native Judge.me div structure:
```html
<div class="jdgm-carousel-wrapper">
  <h2 class="jdgm-carousel-title">Featured reviews</h2>
  <a href="/reviews" class="jdgm-all-reviews-rating-wrapper">
    <div data-score="" class="jdgm-all-reviews-rating"></div>
    from <span class="jdgm-all-reviews-count"></span> reviews
  </a>
</div>
```

## Next Steps
- After implementation, consider adding filtering options for the carousel.
- Test with actual review data to ensure proper display.
