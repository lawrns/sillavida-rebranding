---
title: Integrate Judge.me Reviews Component
type: task
status: completed
created: 2025-04-24T22:09:00
updated: 2025-04-24T17:00:40-06:00
id: TASK-056
priority: high
memory_types: [procedural, semantic]
dependencies: [TASK-055]
tags: [reviews, judge.me, integration]
---

# Integrate Judge.me Reviews Component

## Description
Integrate the Judge.me app for customer reviews into the SillaVida product pages, customizing the component to match the "Vida" theme and premium experience. This task focuses on implementing the Judge.me reviews component, styling it to match the SillaVida design system, and renaming the reviews section to "Experiencias Vida" to align with the brand messaging.

## Objectives
- Integrate Judge.me reviews component into product pages
- Customize the component to match SillaVida design system
- Rename reviews section to "Experiencias Vida" to align with branding
- Implement proper placement of review widgets on product pages
- Create custom styling for review components
- Ensure responsive design across all device sizes
- Maintain visual consistency with SillaVida brand guidelines

## Steps
1. Install Judge.me app from Shopify App Store
   ```
   # This is done through the Shopify Admin interface
   1. Go to Shopify Admin > Apps
   2. Click "Add apps"
   3. Search for "Judge.me Product Reviews"
   4. Click "Add app"
   5. Follow the installation instructions
   ```

2. Enable Judge.me app embed in theme
   ```
   1. From Shopify admin, go to Online Store > Themes
   2. Find the theme you want and click "Customize"
   3. Go to "App embeds" and enable "Judge.me"
   4. Click "Save"
   ```

3. Create a custom CSS file for Judge.me styling
   ```css
   /* assets/judge-me-custom.css */
   
   /* Main container styling */
   .jdgm-widget {
     font-family: 'Open Sans', sans-serif;
     margin-bottom: 3rem;
   }
   
   /* Section header styling */
   .experiencias-vida-header {
     margin-bottom: 2rem;
   }
   
   .experiencias-vida-header h2 {
     font-family: 'Montserrat', sans-serif;
     font-weight: 600;
     font-size: 2rem;
     color: #1E5959; /* SillaVida teal */
     margin-bottom: 0.5rem;
   }
   
   .experiencias-vida-header p {
     color: #333333;
     max-width: 800px;
     margin: 0 auto;
   }
   
   /* Star ratings styling */
   .jdgm-star {
     color: #C87D55 !important; /* SillaVida terracotta */
   }
   
   .jdgm-star.jdgm-star--empty {
     color: #E8DED1 !important; /* SillaVida beige */
   }
   
   /* Preview badge styling */
   .jdgm-prev-badge {
     margin-bottom: 1rem;
   }
   
   .jdgm-prev-badge__text {
     font-family: 'Open Sans', sans-serif;
     font-size: 0.9rem;
   }
   
   /* Reviews list styling */
   .jdgm-rev-widg {
     border: 1px solid #E8DED1; /* SillaVida beige */
     border-radius: 8px;
     padding: 2rem;
     background-color: #FFFFFF;
   }
   
   .jdgm-rev__header {
     border-bottom: 1px solid #E8DED1; /* SillaVida beige */
     padding-bottom: 1rem;
   }
   
   .jdgm-rev__author {
     font-family: 'Montserrat', sans-serif;
     font-weight: 600;
     color: #1E5959; /* SillaVida teal */
   }
   
   .jdgm-rev__timestamp {
     color: #666666;
   }
   
   .jdgm-rev__body {
     padding: 1rem 0;
     line-height: 1.6;
   }
   
   .jdgm-rev__title {
     font-family: 'Montserrat', sans-serif;
     font-weight: 600;
     color: #1E5959; /* SillaVida teal */
   }
   
   /* Form styling */
   .jdgm-form-wrapper {
     margin-top: 2rem;
     border: 1px solid #E8DED1; /* SillaVida beige */
     border-radius: 8px;
     padding: 2rem;
     background-color: #FFFFFF;
   }
   
   .jdgm-form__title {
     font-family: 'Montserrat', sans-serif;
     font-weight: 600;
     font-size: 1.5rem;
     color: #1E5959; /* SillaVida teal */
     margin-bottom: 1.5rem;
   }
   
   .jdgm-form__input {
     border: 1px solid #E8DED1; /* SillaVida beige */
     border-radius: 4px;
     padding: 0.75rem;
     font-family: 'Open Sans', sans-serif;
   }
   
   .jdgm-form__submit-btn {
     background-color: #1E5959; /* SillaVida teal */
     color: #FFFFFF;
     font-family: 'Montserrat', sans-serif;
     font-weight: 600;
     padding: 0.75rem 1.5rem;
     border-radius: 4px;
     border: none;
     cursor: pointer;
     transition: background-color 0.2s;
   }
   
   .jdgm-form__submit-btn:hover {
     background-color: #164242; /* Darker teal */
   }
   
   /* Pagination styling */
   .jdgm-paginate__page {
     border: 1px solid #E8DED1; /* SillaVida beige */
     color: #1E5959; /* SillaVida teal */
   }
   
   .jdgm-paginate__page.jdgm-curt {
     background-color: #1E5959; /* SillaVida teal */
     color: #FFFFFF;
     border-color: #1E5959;
   }
   
   /* Responsive styling */
   @media (max-width: 768px) {
     .jdgm-rev-widg {
       padding: 1rem;
     }
     
     .jdgm-form-wrapper {
       padding: 1rem;
     }
     
     .experiencias-vida-header h2 {
       font-size: 1.5rem;
     }
   }
   ```

4. Create a custom liquid snippet for the Experiencias Vida section
   ```liquid
   <!-- snippets/experiencias-vida.liquid -->
   
   <div class="experiencias-vida-section">
     <div class="experiencias-vida-header">
       <h2>Experiencias Vida</h2>
       <p>Descubre cómo nuestras sillas han transformado la vida diaria de nuestros clientes, mejorando su bienestar y productividad.</p>
     </div>
     
     <div class="experiencias-vida-content">
       <!-- Judge.me widgets will be inserted here -->
       <div class="jdgm-widget jdgm-review-widget" data-id="{{ product.id }}">
         {% include 'judgeme_widgets', widget_type: 'judgeme_review_widget', concierge_install: false, product: product %}
       </div>
     </div>
   </div>
   ```

5. Add the custom CSS to theme.liquid
   ```liquid
   <!-- layout/theme.liquid -->
   
   <!-- Add this before the closing </head> tag -->
   {{ 'judge-me-custom.css' | asset_url | stylesheet_tag }}
   ```

6. Modify product-template.liquid to include the Experiencias Vida section
   ```liquid
   <!-- sections/product-template.liquid -->
   
   <!-- Add this where you want the reviews to appear, typically after product description -->
   <div id="experiencias-vida">
     {% include 'experiencias-vida' %}
   </div>
   ```

7. Configure Judge.me settings in the Shopify admin
   ```
   1. Go to Shopify Admin > Apps > Judge.me
   2. Navigate to "Widgets" section
   3. Configure the following settings:
      - Set widget title to "Experiencias Vida"
      - Customize review form fields
      - Set star color to match SillaVida terracotta (#C87D55)
      - Enable photo/video reviews if desired
      - Configure email settings for review collection
   4. Save settings
   ```

8. Create a custom JavaScript file for additional functionality
   ```javascript
   // assets/judge-me-custom.js
   
   document.addEventListener('DOMContentLoaded', function() {
     // Wait for Judge.me widgets to load
     const checkJudgemeLoaded = setInterval(function() {
       if (window.jdgm && document.querySelector('.jdgm-widget')) {
         clearInterval(checkJudgemeLoaded);
         customizeJudgemeWidgets();
       }
     }, 500);
     
     function customizeJudgemeWidgets() {
       // Rename elements to match "Vida" branding
       const elements = {
         '.jdgm-form__title': 'Comparte tu Experiencia Vida',
         '.jdgm-write-rev-link': 'Escribe tu Experiencia Vida',
         '.jdgm-rev-widg__title': 'Experiencias Vida',
         '.jdgm-rev__replier-name': 'Equipo SillaVida',
         '.jdgm-form-dynamic__row-rating .jdgm-form-dynamic__rating-fieldset__legend': '¿Cómo calificarías tu experiencia?',
         '.jdgm-form-dynamic__row-title .jdgm-form-dynamic__title-fieldset__legend': 'Título de tu experiencia',
         '.jdgm-form-dynamic__row-body .jdgm-form-dynamic__body-fieldset__legend': 'Comparte tu experiencia en detalle'
       };
       
       // Replace text in elements
       Object.keys(elements).forEach(selector => {
         const elements = document.querySelectorAll(selector);
         elements.forEach(el => {
           el.textContent = elements[selector];
         });
       });
       
       // Add custom filter labels
       const filterLabels = document.querySelectorAll('.jdgm-histogram__frequency-label');
       if (filterLabels.length > 0) {
         const labels = ['Excelente', 'Muy Bueno', 'Bueno', 'Regular', 'Necesita Mejorar'];
         filterLabels.forEach((label, index) => {
           if (index < labels.length) {
             label.textContent = labels[index];
           }
         });
       }
       
       // Add smooth scrolling to review form
       const writeReviewLinks = document.querySelectorAll('.jdgm-write-rev-link');
       writeReviewLinks.forEach(link => {
         link.addEventListener('click', function(e) {
           e.preventDefault();
           const formElement = document.querySelector('.jdgm-form-wrapper');
           if (formElement) {
             formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
           }
         });
       });
     }
   });
   ```

9. Add the custom JavaScript to theme.liquid
   ```liquid
   <!-- layout/theme.liquid -->
   
   <!-- Add this before the closing </body> tag -->
   {{ 'judge-me-custom.js' | asset_url | script_tag }}
   ```

10. Test the integration on product pages
    ```
    1. Navigate to a product page on your store
    2. Verify that the "Experiencias Vida" section appears correctly
    3. Test submitting a review
    4. Check responsive behavior on different screen sizes
    5. Verify that all custom styling is applied correctly
    ```

11. Create a dedicated reviews page (optional)
    ```liquid
    <!-- templates/page.reviews.liquid -->
    
    <div class="page-width">
      <div class="experiencias-vida-header">
        <h1>Todas las Experiencias Vida</h1>
        <p>Descubre lo que nuestros clientes dicen sobre cómo las sillas SillaVida han transformado su bienestar y productividad.</p>
      </div>
      
      <div class="experiencias-vida-all-reviews">
        {% include 'judgeme_all_reviews' %}
      </div>
    </div>
    ```

12. Add the reviews page to navigation (optional)
    ```
    1. Go to Shopify Admin > Online Store > Navigation
    2. Edit the main menu
    3. Add a link to the reviews page
    4. Save changes
    ```

## Progress
- [x] Step 1
- [x] Step 2
- [x] Step 3
- [x] Step 4
- [x] Step 5
- [x] Step 6
- [x] Step 7
- [x] Step 8
- [x] Step 9
- [x] Step 10
- [x] Step 11
- [x] Step 12

## Dependencies
- TASK-055: Implement Enhanced Product Pages with Shopify Integration

## Test Status
- Status: Completed
- Test Files: None

## Notes
- Judge.me is a Shopify app that needs to be installed from the Shopify App Store
- The implementation should rename the reviews section to "Experiencias Vida" to align with the SillaVida branding
- The component should be styled to match the SillaVida design system using the color palette (teal #1E5959, beige #E8DED1, sage #7D9D8C, terracotta #C87D55)
- Judge.me offers various widgets that can be placed throughout the site, but this task focuses on the product page integration
- The implementation should maintain visual consistency with the SillaVida brand guidelines
- Judge.me has built-in functionality for collecting reviews via email, which should be configured according to SillaVida's preferences
- Consider adding a dedicated reviews page to showcase all customer experiences in one place
- Test the integration thoroughly to ensure it works correctly with the Shopify backend

## Next Steps
- Review the implementation for any remaining tasks or issues
- Verify that all dependencies are completed and up-to-date
- Update the task status to "Completed" according to the Aegis Framework rules
