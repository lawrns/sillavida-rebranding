---
title: Integrate Judge.me Components in Product Page
type: task
status: completed
created: 2025-05-07T15:46:13-06:00
updated: 2025-05-08T00:03:52-06:00
id: TASK-111
priority: medium
memory_types: [procedural, semantic]
dependencies: [TASK-107, TASK-108, TASK-109, TASK-110]
tags: [judge.me, integration, product-page, components]
---

# Integrate Judge.me Components in Product Page

## Description
Integrate the previously created Judge.me components into the product page to display review stars and prepare placement for the full reviews widget. This task focuses on non-invasive integration that maintains the existing product page layout while adding review functionality.

## Objectives
- Add review stars to the product information section
- Prepare a section for the full reviews widget
- Ensure integration follows existing product page layout and styling
- Implement conditional rendering based on Judge.me script loading state

## Steps
1. Locate the product page component (`src/pages/ProductPage.tsx`) and identify appropriate locations for review components:
   - Review stars should appear near the product title or price
   - Full reviews widget should appear in the product details section

2. Update the product page to include review stars:
   ```tsx
   // src/pages/ProductPage.tsx
   import React, { useEffect, useState } from 'react';
   import { useParams } from 'react-router-dom';
   import { getProduct } from '../lib/shopify';
   // ... other imports
   import { ReviewStars } from '../components/judgeMe'; // Import ReviewStars component

   const ProductPage = () => {
     const { handle } = useParams<{ handle: string }>();
     const [product, setProduct] = useState<any>(null);
     const [loading, setLoading] = useState<boolean>(true);
     // ... existing state and effects
     
     // Existing code for fetching product data
     
     return (
       <div className="product-page">
         {/* Product hero section */}
         <section className="product-hero">
           {/* Product gallery left side */}
           <div className="product-gallery">
             {/* Existing gallery code */}
           </div>
           
           {/* Product info right side */}
           <div className="product-info">
             <h1 className="product-title">{product.title}</h1>
             
             {/* Add ReviewStars component here */}
             {product && (
               <ReviewStars 
                 productId={product.id} 
                 className="mb-4" 
                 showEmpty={false}
               />
             )}
             
             <div className="product-price">
               {/* Existing price code */}
             </div>
             
             {/* Rest of product info */}
           </div>
         </section>
         
         {/* Product details section */}
         <section className="product-details">
           {/* Existing tabs or details structure */}
           
           {/* Add a tab or section for reviews */}
           <div id="product-reviews" className="product-reviews-section mt-8">
             <h2 className="text-2xl font-heading font-bold mb-4">Customer Reviews</h2>
             {product && (
               <div className="review-widget-container">
                 {/* 
                 Note: The full ReviewsWidget component will be added in a future task.
                 This is a placeholder to establish the layout position.
                 */}
                 <div className="review-widget-placeholder p-4 border border-gray-200 rounded-md">
                   <p className="text-center text-gray-500">
                     Reviews will appear here once the Judge.me integration is complete.
                   </p>
                 </div>
               </div>
             )}
           </div>
         </section>
       </div>
     );
   };

   export default ProductPage;
   ```

3. If the product page uses a separate component for the product information section, update that component instead:
   ```tsx
   // src/components/product/ProductHeroShowcase.tsx (if it exists)
   import React from 'react';
   import { ReviewStars } from '../judgeMe';
   // ... other imports

   interface ProductHeroShowcaseProps {
     product: any;
     // ... other props
   }

   const ProductHeroShowcase: React.FC<ProductHeroShowcaseProps> = ({
     product,
     // ... other props
   }) => {
     return (
       <div className="product-hero-showcase">
         <h1 className="product-title">{product.title}</h1>
         
         {/* Add ReviewStars component */}
         <ReviewStars 
           productId={product.id} 
           className="mb-4" 
           showEmpty={false}
         />
         
         {/* Rest of component */}
       </div>
     );
   };

   export default ProductHeroShowcase;
   ```

4. If the product page uses tabs for different sections, add a reviews tab:
   ```tsx
   // src/components/product/ProductDetailSections.tsx (if it exists)
   import React, { useState } from 'react';
   // ... other imports

   interface ProductDetailSectionsProps {
     product: any;
     // ... other props
   }

   const ProductDetailSections: React.FC<ProductDetailSectionsProps> = ({
     product,
     // ... other props
   }) => {
     const [activeTab, setActiveTab] = useState('description');
     
     return (
       <div className="product-detail-sections">
         {/* Tab navigation */}
         <div className="tabs">
           <button
             className={`tab ${activeTab === 'description' ? 'active' : ''}`}
             onClick={() => setActiveTab('description')}
           >
             Description
           </button>
           <button
             className={`tab ${activeTab === 'specifications' ? 'active' : ''}`}
             onClick={() => setActiveTab('specifications')}
           >
             Specifications
           </button>
           {/* Add reviews tab */}
           <button
             className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
             onClick={() => setActiveTab('reviews')}
           >
             Reviews
           </button>
         </div>
         
         {/* Tab content */}
         <div className="tab-content">
           {activeTab === 'description' && (
             <div className="description-content">
               {/* Existing description content */}
             </div>
           )}
           
           {activeTab === 'specifications' && (
             <div className="specifications-content">
               {/* Existing specifications content */}
             </div>
           )}
           
           {activeTab === 'reviews' && (
             <div className="reviews-content">
               <h3>Customer Reviews</h3>
               <div className="review-widget-placeholder p-4">
                 <p className="text-center text-gray-500">
                   Reviews will appear here once the Judge.me integration is complete.
                 </p>
               </div>
             </div>
           )}
         </div>
       </div>
     );
   };

   export default ProductDetailSections;
   ```

5. Update the product type definition to include Judge.me review data:
   ```typescript
   // src/types/shopify.ts
   export interface ShopifyProduct {
     id: string;
     title: string;
     handle: string;
     // Existing fields...
     
     // Add Judge.me fields
     reviewCount?: number;
     reviewRating?: number;
   }
   ```

## Progress
- Integrated ReviewStars component in ProductHeroShowcase to display star ratings (2025-05-08T00:03:52-06:00)
- Added full ReviewWidget component in ProductDetailSections as a dedicated section
- Created custom CSS styles for Judge.me components to match SillaVida design standards
- Ensured proper styling with standardized colors (#111827 for backgrounds, #4b7cae for interactive elements)
- Added conditional rendering to hide widgets when no reviews exist
- Implementation completed

## Dependencies
- TASK-107 (Create Judge.me Script Manager Service)
- TASK-108 (Create useJudgeMe React Hook)
- TASK-109 (Implement Global Judge.me Script Initialization)
- TASK-110 (Create Judge.me UI Components)

## Test Status
- Status: Not Started
- Test Files: None

## Notes
- This implementation is designed to be non-invasive, adding review functionality without disrupting the existing product page layout
- The ReviewStars component is conditionally rendered based on product data availability
- The full reviews widget integration is prepared but will be completed in a future task
- The implementation adapts to the application's existing component structure, whether it uses a monolithic product page or separate components
- Consider performance implications of adding Judge.me reviews to product pages, especially for users on slow connections

## Next Steps
- Create integration documentation
