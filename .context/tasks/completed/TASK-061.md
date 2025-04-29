---
title: Enhance Product Page Interactivity
type: task
status: completed
created: 2025-04-24T21:15:00
updated: 2025-04-24T18:41:51-06:00
id: TASK-061
priority: medium
memory_types: [procedural, semantic]
dependencies: [TASK-055, TASK-057]
tags: [product-page, ux, interactivity]
---

# Enhance Product Page Interactivity

## Description
Improve the product page user experience with enhanced interactive elements following the vertical layout design established in TASK-055 and TASK-057. This task focuses on adding interactive features that make the product exploration more engaging while maintaining the SillaVida design aesthetic.

## Objectives
- Add interactive product showcase with 360° view capabilities
- Create sticky "Add to Cart" button for better mobile UX
- Implement product comparison functionality
- Enhance image zoom and gallery navigation
- Add smooth scroll behavior for section navigation

## Steps
1. Implement 360° view functionality for product images
   ```javascript
   // src/components/product/ProductGallery360.jsx
   import React, { useState, useRef, useEffect } from 'react';
   import { motion } from 'framer-motion';
   
   const ProductGallery360 = ({ images, alt }) => {
     const [isDragging, setIsDragging] = useState(false);
     const [currentIndex, setCurrentIndex] = useState(0);
     const [startX, setStartX] = useState(0);
     const containerRef = useRef(null);
     
     // Calculate the index based on drag position
     const handleDrag = (e) => {
       if (!isDragging) return;
       
       const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
       const deltaX = clientX - startX;
       const containerWidth = containerRef.current.offsetWidth;
       
       // Calculate how many images to move based on drag distance
       const moveAmount = Math.floor((deltaX / containerWidth) * images.length);
       let newIndex = (currentIndex - moveAmount) % images.length;
       
       // Handle negative index
       if (newIndex < 0) newIndex = images.length + newIndex;
       
       setCurrentIndex(newIndex);
       setStartX(clientX);
     };
     
     // Start dragging
     const handleDragStart = (e) => {
       setIsDragging(true);
       setStartX(e.type.includes('touch') ? e.touches[0].clientX : e.clientX);
     };
     
     // End dragging
     const handleDragEnd = () => {
       setIsDragging(false);
     };
     
     // Add event listeners
     useEffect(() => {
       const container = containerRef.current;
       
       const handleMouseMove = (e) => handleDrag(e);
       const handleMouseUp = () => handleDragEnd();
       const handleTouchMove = (e) => handleDrag(e);
       const handleTouchEnd = () => handleDragEnd();
       
       if (isDragging) {
         window.addEventListener('mousemove', handleMouseMove);
         window.addEventListener('mouseup', handleMouseUp);
         window.addEventListener('touchmove', handleTouchMove);
         window.addEventListener('touchend', handleTouchEnd);
       }
       
       return () => {
         window.removeEventListener('mousemove', handleMouseMove);
         window.removeEventListener('mouseup', handleMouseUp);
         window.removeEventListener('touchmove', handleTouchMove);
         window.removeEventListener('touchend', handleTouchEnd);
       };
     }, [isDragging]);
     
     return (
       <div 
         ref={containerRef}
         className="product-gallery-360 relative w-full h-full cursor-grab"
         onMouseDown={handleDragStart}
         onTouchStart={handleDragStart}
         style={{ touchAction: 'pan-y' }}
       >
         <div className="360-indicator absolute top-4 right-4 bg-white bg-opacity-80 px-3 py-1 rounded-full text-sm font-medium z-10">
           <span>360°</span>
         </div>
         
         <motion.img
           src={images[currentIndex]}
           alt={`${alt} - 360° view ${currentIndex + 1} of ${images.length}`}
           className="w-full h-full object-contain"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.2 }}
           draggable="false"
         />
         
         <div className="instructions absolute bottom-4 left-0 right-0 text-center text-sm text-gray-600">
           Drag to rotate
         </div>
       </div>
     );
   };
   
   export default ProductGallery360;
   ```

2. Create sticky "Add to Cart" button for mobile
   ```javascript
   // src/components/product/StickyAddToCart.jsx
   import React, { useState, useEffect } from 'react';
   import { motion, AnimatePresence } from 'framer-motion';
   import { useCart } from '../../context/CartContext';
   
   const StickyAddToCart = ({ product, variant, quantity }) => {
     const [isVisible, setIsVisible] = useState(false);
     const { addItem } = useCart();
     
     // Check scroll position to determine visibility
     useEffect(() => {
       const handleScroll = () => {
         // Show sticky button when user scrolls past the original add to cart button
         const productInfo = document.querySelector('.product-info');
         const originalButton = document.querySelector('.add-to-cart-button');
         
         if (productInfo && originalButton) {
           const originalButtonBottom = originalButton.getBoundingClientRect().bottom;
           setIsVisible(originalButtonBottom < 0);
         }
       };
       
       window.addEventListener('scroll', handleScroll);
       return () => window.removeEventListener('scroll', handleScroll);
     }, []);
     
     const handleAddToCart = () => {
       addItem(variant.id, quantity);
     };
     
     return (
       <AnimatePresence>
         {isVisible && (
           <motion.div 
             className="sticky-add-to-cart fixed bottom-0 left-0 right-0 bg-white border-t border-beige p-3 z-50 md:hidden"
             initial={{ y: 100 }}
             animate={{ y: 0 }}
             exit={{ y: 100 }}
             transition={{ duration: 0.3, ease: 'easeOut' }}
           >
             <div className="container mx-auto flex items-center justify-between">
               <div className="product-info-compact">
                 <h3 className="text-sm font-semibold text-teal truncate">{product.title}</h3>
                 <p className="text-terracotta font-bold">${variant.price}</p>
               </div>
               
               <button 
                 className="bg-teal text-white px-4 py-2 rounded font-semibold"
                 onClick={handleAddToCart}
               >
                 Add to Cart
               </button>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
     );
   };
   
   export default StickyAddToCart;
   ```

3. Develop product comparison interface
   ```javascript
   // src/components/product/ProductComparison.jsx
   import React, { useState, useEffect } from 'react';
   import { motion, AnimatePresence } from 'framer-motion';
   import { useShopify } from '../../hooks/useShopify';
   
   const ProductComparison = ({ initialProducts = [] }) => {
     const [products, setProducts] = useState(initialProducts);
     const [isOpen, setIsOpen] = useState(false);
     const { getProductById } = useShopify();
     
     // Load product details if only IDs are provided
     useEffect(() => {
       const loadProducts = async () => {
         if (products.length > 0 && typeof products[0] === 'string') {
           const productDetails = await Promise.all(
             products.map(id => getProductById(id))
           );
           setProducts(productDetails.filter(p => p !== null));
         }
       };
       
       loadProducts();
     }, [initialProducts]);
     
     const addProduct = (product) => {
       if (!products.find(p => p.id === product.id)) {
         setProducts([...products, product]);
       }
     };
     
     const removeProduct = (productId) => {
       setProducts(products.filter(p => p.id !== productId));
     };
     
     const toggleComparison = () => {
       setIsOpen(!isOpen);
     };
     
     // Get all unique specification keys across products
     const getSpecKeys = () => {
       const keys = new Set();
       products.forEach(product => {
         if (product.specifications) {
           Object.keys(product.specifications).forEach(key => keys.add(key));
         }
       });
       return Array.from(keys);
     };
     
     const specKeys = getSpecKeys();
     
     return (
       <>
         {/* Comparison Button */}
         {products.length > 0 && (
           <motion.button
             className="fixed bottom-20 right-4 bg-teal text-white rounded-full p-3 shadow-md z-40"
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={toggleComparison}
           >
             <span className="sr-only">Compare Products</span>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M16 3H21V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               <path d="M8 21H3V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               <path d="M21 16V21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               <path d="M3 8V3H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
             <span className="absolute -top-2 -right-2 bg-terracotta text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
               {products.length}
             </span>
           </motion.button>
         )}
         
         {/* Comparison Drawer */}
         <AnimatePresence>
           {isOpen && (
             <motion.div
               className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsOpen(false)}
             >
               <motion.div
                 className="bg-white rounded-t-lg md:rounded-lg w-full md:w-auto md:max-w-4xl max-h-[80vh] overflow-auto"
                 initial={{ y: 100 }}
                 animate={{ y: 0 }}
                 exit={{ y: 100 }}
                 onClick={e => e.stopPropagation()}
               >
                 <div className="p-4 border-b border-beige sticky top-0 bg-white z-10">
                   <div className="flex items-center justify-between">
                     <h2 className="text-lg font-semibold text-teal">Compare Products</h2>
                     <button 
                       className="text-gray-500 hover:text-gray-700"
                       onClick={() => setIsOpen(false)}
                     >
                       <span className="sr-only">Close</span>
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                         <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                     </button>
                   </div>
                 </div>
                 
                 <div className="p-4">
                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                     {products.map(product => (
                       <div key={product.id} className="product-comparison-card relative">
                         <button 
                           className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10"
                           onClick={() => removeProduct(product.id)}
                         >
                           <span className="sr-only">Remove</span>
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                             <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                             <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                           </svg>
                         </button>
                         
                         <img 
                           src={product.featuredImage?.url || '/placeholder.jpg'} 
                           alt={product.title}
                           className="w-full h-40 object-contain mb-2"
                         />
                         
                         <h3 className="font-semibold text-sm mb-1">{product.title}</h3>
                         <p className="text-terracotta font-bold text-sm mb-2">${product.priceRange?.minVariantPrice?.amount || 'N/A'}</p>
                         
                         {/* Product specifications */}
                         <div className="text-xs space-y-1">
                           {specKeys.map(key => (
                             <div key={key} className="grid grid-cols-2">
                               <span className="text-gray-600">{key}:</span>
                               <span>{product.specifications?.[key] || 'N/A'}</span>
                             </div>
                           ))}
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </motion.div>
             </motion.div>
           )}
         </AnimatePresence>
       </>
     );
   };
   
   export default ProductComparison;
   ```

4. Enhance image zoom functionality
   ```javascript
   // src/components/product/ZoomableImage.jsx
   import React, { useState, useRef } from 'react';
   
   const ZoomableImage = ({ src, alt, zoomFactor = 2.5 }) => {
     const [isZoomed, setIsZoomed] = useState(false);
     const [position, setPosition] = useState({ x: 0, y: 0 });
     const imageRef = useRef(null);
     
     const handleMouseEnter = () => {
       // Only enable zoom on desktop
       if (window.innerWidth > 768) {
         setIsZoomed(true);
       }
     };
     
     const handleMouseLeave = () => {
       setIsZoomed(false);
     };
     
     const handleMouseMove = (e) => {
       if (!imageRef.current || !isZoomed) return;
       
       const { left, top, width, height } = imageRef.current.getBoundingClientRect();
       
       // Calculate relative position within the image (0 to 1)
       const x = (e.clientX - left) / width;
       const y = (e.clientY - top) / height;
       
       // Ensure values are within bounds
       const boundedX = Math.max(0, Math.min(1, x));
       const boundedY = Math.max(0, Math.min(1, y));
       
       setPosition({ x: boundedX, y: boundedY });
     };
     
     // For mobile devices - handle pinch zoom
     const handleTouchStart = (e) => {
       if (e.touches.length === 2) {
         // Implement pinch zoom logic here
       }
     };
     
     // Open fullscreen view on mobile tap
     const handleClick = () => {
       if (window.innerWidth <= 768) {
         // Open fullscreen view
         // This could be implemented as a modal with the image
       }
     };
     
     return (
       <div 
         className="zoomable-image-container relative overflow-hidden"
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
         onMouseMove={handleMouseMove}
         onTouchStart={handleTouchStart}
         onClick={handleClick}
       >
         <img 
           ref={imageRef}
           src={src} 
           alt={alt}
           className="w-full h-full object-contain transition-opacity duration-200"
           style={{ opacity: isZoomed ? 0.4 : 1 }}
         />
         
         {isZoomed && (
           <div 
             className="zoom-view absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
             style={{
               backgroundImage: `url(${src})`,
               backgroundPosition: `${position.x * 100}% ${position.y * 100}%`,
               backgroundSize: `${zoomFactor * 100}%`,
               backgroundRepeat: 'no-repeat'
             }}
           />
         )}
         
         {/* Mobile zoom indicator */}
         <div className="zoom-indicator absolute bottom-2 right-2 bg-white bg-opacity-80 rounded-full p-1 md:hidden">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M15 15L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2"/>
             <path d="M10 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
             <path d="M7 10H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
           </svg>
         </div>
       </div>
     );
   };
   
   export default ZoomableImage;
   ```

5. Implement smooth scroll section navigation
   ```javascript
   // src/components/product/ProductSectionNav.jsx
   import React, { useState, useEffect } from 'react';
   import { motion, AnimatePresence } from 'framer-motion';
   
   const ProductSectionNav = ({ sections }) => {
     const [activeSection, setActiveSection] = useState('');
     const [isSticky, setIsSticky] = useState(false);
     
     // Track scroll position to determine active section and sticky state
     useEffect(() => {
       const handleScroll = () => {
         // Check if nav should be sticky
         const productHero = document.querySelector('.product-hero');
         if (productHero) {
           const heroBottom = productHero.getBoundingClientRect().bottom;
           setIsSticky(heroBottom <= 0);
         }
         
         // Determine active section
         const sectionElements = sections.map(section => 
           document.getElementById(section.id)
         );
         
         // Find the section currently in view
         for (let i = sectionElements.length - 1; i >= 0; i--) {
           const section = sectionElements[i];
           if (section) {
             const rect = section.getBoundingClientRect();
             if (rect.top <= 100) {
               setActiveSection(sections[i].id);
               break;
             }
           }
         }
       };
       
       window.addEventListener('scroll', handleScroll);
       return () => window.removeEventListener('scroll', handleScroll);
     }, [sections]);
     
     // Scroll to section
     const scrollToSection = (sectionId) => {
       const section = document.getElementById(sectionId);
       if (section) {
         // Get the top position of the section
         const sectionTop = section.getBoundingClientRect().top;
         const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
         const targetPosition = scrollTop + sectionTop - 80; // Adjust for header height
         
         // Smooth scroll to the section
         window.scrollTo({
           top: targetPosition,
           behavior: 'smooth'
         });
       }
     };
     
     return (
       <AnimatePresence>
         {isSticky && (
           <motion.nav
             className="product-section-nav fixed top-0 left-0 right-0 bg-white border-b border-beige z-40"
             initial={{ y: -100 }}
             animate={{ y: 0 }}
             exit={{ y: -100 }}
             transition={{ duration: 0.3 }}
           >
             <div className="container mx-auto px-4">
               <ul className="flex overflow-x-auto py-3 space-x-6 no-scrollbar">
                 {sections.map(section => (
                   <li key={section.id}>
                     <button
                       className={`whitespace-nowrap text-sm font-medium pb-1 border-b-2 transition-colors ${
                         activeSection === section.id 
                           ? 'text-teal border-teal' 
                           : 'text-gray-500 border-transparent hover:text-teal'
                       }`}
                       onClick={() => scrollToSection(section.id)}
                     >
                       {section.label}
                     </button>
                   </li>
                 ))}
               </ul>
             </div>
           </motion.nav>
         )}
       </AnimatePresence>
     );
   };
   
   export default ProductSectionNav;
   ```

6. Test all interactive elements across devices
   - Create a testing plan for desktop, tablet, and mobile devices
   - Test touch interactions on various mobile devices
   - Verify performance metrics for all interactive elements
   - Conduct usability testing with real users if possible

## Progress
- [ ] Step 1
- [ ] Step 2
- [ ] Step 3
- [ ] Step 4
- [ ] Step 5
- [ ] Step 6

## Dependencies
- TASK-055: Implement Enhanced Product Pages with Shopify Integration
- TASK-057: Implement Enhanced Product Page Design

## Test Status
- Status: Not Started
- Test Files: None

## Notes
- All interactive elements must follow the SillaVida color palette and design guidelines
- Focus on performance optimization to ensure smooth interactions, especially for the 360° view
- Ensure all interactive elements are accessible and work with keyboard navigation
- Mobile experience should be prioritized for all interactive elements
- The implementation should enhance the product exploration experience without overwhelming users
- Consider using IntersectionObserver for the sticky elements to improve performance
- The product comparison feature should store selected products in localStorage for persistence
- For the 360° view, ensure high-quality images are available for all products
- The zoom functionality should load high-resolution images only when needed
- All animations should have reduced motion alternatives for accessibility
- The smooth scroll navigation should account for fixed headers in the layout

## Next Steps
- Research appropriate libraries for 360° view implementation
- Create prototype of sticky "Add to Cart" button
- Design comparison table layout
- Test image zoom functionality on various devices
- Implement section navigation with smooth scrolling
