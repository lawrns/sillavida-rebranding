---
title: Add Judge.me Verified Badge to Email Capture Section
type: task
status: completed
created: 2025-05-08T14:15:44-06:00
updated: 2025-05-08T14:44:10-06:00
id: TASK-116
priority: medium
memory_types: [procedural, semantic]
dependencies: [TASK-107, TASK-108, TASK-109, TASK-110, TASK-111, TASK-112]
tags: [judge.me, integration, homepage, verified-badge]
---

# Add Judge.me Verified Badge to Email Capture Section

## Description
Add a Judge.me Verified Badge to the email capture section at the bottom of the landing page to replace the existing mock stars. This will enhance credibility and trust by displaying the verified review count and overall rating.

## Objectives
- Replace the mock stars in the email capture section with an authentic Judge.me Verified Badge
- Ensure proper loading and display of the verified review count
- Style the badge to match the Silla Vida design system (#111827 for backgrounds, #4b7cae for interactive elements)
- Add proper error handling and loading states
- Maintain responsiveness across all screen sizes

## Steps
1. Locate the email capture section component on the landing page.

2. Create a new VerifiedBadge component for the Judge.me verified badge:
   ```tsx
   // src/components/judgeMe/VerifiedBadge.tsx
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
     const { isLoading, error, ready } = useJudgeMe();
     const isEmpty = false; // Let the Judge.me script handle this
     
     const renderBadge = () => {
       return (
         <div className={`jdgm-verified-badge-wrapper ${className}`}>
           {showText && (
             <span className="verified-badge-text text-sm text-gray-200 block mb-1">
               Trusted by our customers
             </span>
           )}
         </div>
       );
     };
     
     return (
       <JudgeMeContainer
         isLoading={isLoading}
         error={error}
         isEmpty={isEmpty}
         containerClassName={`verified-badge-container ${containerClassName}`}
         loadingComponent={
           <div className="flex items-center">
             <div className="h-5 w-5 rounded-full bg-gray-300 animate-pulse"></div>
             <div className="h-4 w-32 bg-gray-300 animate-pulse ml-2 rounded"></div>
           </div>
         }
       >
         {renderBadge()}
       </JudgeMeContainer>
     );
   };
   
   export default VerifiedBadge;
   ```

3. Export the new component in the Judge.me components index file:
   ```tsx
   // src/components/judgeMe/index.ts
   export { default as VerifiedBadge } from './VerifiedBadge';
   ```

4. Update the email capture section on the landing page to include the VerifiedBadge:
   ```tsx
   import { VerifiedBadge } from '../components/judgeMe';
   
   // Inside the email capture section component
   <section className="bg-[#111827] text-white py-16">
     <div className="container mx-auto px-4">
       <div className="flex flex-col lg:flex-row items-center justify-between">
         <div className="mb-8 lg:mb-0 lg:mr-8">
           <h2 className="text-3xl font-bold mb-4 font-heading">Join Our Newsletter</h2>
           <p className="text-gray-300 mb-6">Stay updated with the latest products and exclusive offers.</p>
           
           {/* Replace the mock stars with the verified badge */}
           <VerifiedBadge 
             containerClassName="mb-6" 
             showText={true} 
           />
           
           {/* Email input form */}
           <div className="flex w-full max-w-md">
             <input
               type="email"
               placeholder="Your email address"
               className="flex-grow px-4 py-2 rounded-l text-gray-800 focus:outline-none"
             />
             <button 
               className="bg-[#4b7cae] hover:bg-[#3a6b9d] transition-colors px-6 py-2 rounded-r font-medium"
             >
               Subscribe
             </button>
           </div>
         </div>
         <div className="w-full lg:w-1/3">
           <img 
             src="/images/newsletter-image.jpg" 
             alt="Newsletter Sign Up" 
             className="rounded-lg shadow-lg"
           />
         </div>
       </div>
     </div>
   </section>
   ```

5. Add custom styling for the verified badge in the Judge.me CSS file:
   ```css
   /* In src/components/judgeMe/JudgeMe.css */
   
   /* Verified Badge Styling */
   .verified-badge-container {
     margin-bottom: 1.5rem;
   }
   
   .jdgm-verified-badge-wrapper {
     margin-bottom: 0.5rem;
   }
   
   .jdgm-verified-badge {
     display: inline-flex;
     align-items: center;
   }
   
   .jdgm-verified-badge__text {
     color: white !important;
     font-size: 0.9rem !important;
     font-weight: 500 !important;
   }
   
   .verified-badge-text {
     font-family: 'Lato', sans-serif;
     color: rgba(255, 255, 255, 0.7);
     font-size: 0.85rem;
   }
   ```

6. Test the verified badge implementation to ensure proper display.
7. Verify appearance on different screen sizes.

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
The verified badge will use the native Judge.me div structure:
```html
<div class="jdgm-verified-badge-wrapper"></div>
```

## Next Steps
- Consider adding a click event to the badge to open a modal with more customer testimonials
- Track engagement with the verified badge to measure its impact on newsletter signups
