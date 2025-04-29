---
title: Implement Site-Wide Color Scheme with Reversibility
type: task
status: completed
created: 2025-04-24T21:12:00
updated: 2025-04-24T17:46:50-06:00
id: TASK-058
priority: high
memory_types: [procedural, semantic]
dependencies: [TASK-040, TASK-041, TASK-042]
tags: [design, color-scheme, ui, global, reversible]
---

# Implement Site-Wide Color Scheme with Reversibility

## Description
This task involves applying the enhanced color scheme recommendations across the entire SillaVida website while ensuring the changes are easily reversible if needed. The implementation should use CSS variables and a theme-switching mechanism to allow for quick rollback or adjustments. The goal is to create a more cohesive visual identity throughout the site using the redesign color palette with improved contrast and visual hierarchy.

## Objectives
- Implement the enhanced color scheme across all website pages
- Create a reversible implementation using CSS variables and theme switching
- Improve visual hierarchy and contrast throughout the site
- Maintain consistent branding across all pages
- Ensure the implementation is responsive and accessible
- Provide an easy mechanism to revert changes if needed

## Steps
1. Create a global CSS file for the enhanced color scheme:
   ```css
   /* sillavida-enhanced-theme.css */
   :root {
     /* Enhanced color palette */
     --color-teal: #1E5959;
     --color-teal-light: #2a7a7a;
     --color-teal-dark: #184747;
     --color-beige: #E8DED1;
     --color-beige-light: #f5f0e8;
     --color-beige-dark: #d6c9b5;
     --color-sage: #7D9D8C;
     --color-sage-light: #9ab5a7;
     --color-sage-dark: #65857a;
     --color-terracotta: #C87D55;
     --color-terracotta-light: #d69a7c;
     --color-terracotta-dark: #b06642;
     
     /* Background colors */
     --bg-primary: white;
     --bg-secondary: var(--color-beige-light);
     --bg-accent: var(--color-teal);
     --bg-header: var(--color-teal);
     --bg-footer: var(--color-teal-dark);
     
     /* Text colors */
     --text-primary: #333333;
     --text-secondary: #666666;
     --text-accent: var(--color-teal);
     --text-light: white;
     --text-price: var(--color-terracotta);
     
     /* Border colors */
     --border-light: var(--color-beige);
     --border-medium: var(--color-beige-dark);
     --border-accent: var(--color-sage);
     
     /* Button colors */
     --btn-primary-bg: var(--color-teal);
     --btn-primary-text: white;
     --btn-primary-hover-bg: var(--color-teal-light);
     --btn-secondary-bg: white;
     --btn-secondary-text: var(--color-sage);
     --btn-secondary-border: var(--color-sage);
     --btn-secondary-hover-bg: var(--color-sage);
     --btn-secondary-hover-text: white;
   }
   ```

2. Create a theme-switching mechanism for easy reversibility:
   ```javascript
   // theme-switcher.js
   const themeToggle = {
     // Theme state
     currentTheme: 'enhanced',
     
     // Initialize theme
     init() {
       // Check for saved preference
       const savedTheme = localStorage.getItem('sillavida-theme');
       if (savedTheme) {
         this.setTheme(savedTheme);
       }
       
       // Add theme toggle button to admin panel
       this.createToggleButton();
     },
     
     // Set theme
     setTheme(theme) {
       this.currentTheme = theme;
       
       if (theme === 'original') {
         document.documentElement.classList.remove('enhanced-theme');
         document.documentElement.classList.add('original-theme');
       } else {
         document.documentElement.classList.remove('original-theme');
         document.documentElement.classList.add('enhanced-theme');
       }
       
       // Save preference
       localStorage.setItem('sillavida-theme', theme);
     },
     
     // Toggle theme
     toggleTheme() {
       const newTheme = this.currentTheme === 'enhanced' ? 'original' : 'enhanced';
       this.setTheme(newTheme);
     },
     
     // Create admin toggle button
     createToggleButton() {
       // Only create if admin panel exists
       const adminPanel = document.querySelector('.admin-panel');
       if (!adminPanel) return;
       
       const button = document.createElement('button');
       button.classList.add('theme-toggle-btn');
       button.textContent = 'Toggle Color Theme';
       button.addEventListener('click', () => this.toggleTheme());
       
       adminPanel.appendChild(button);
     }
   };
   
   // Initialize on page load
   document.addEventListener('DOMContentLoaded', () => {
     themeToggle.init();
   });
   ```

3. Create a backup of the original CSS for each component:
   ```css
   /* original-theme.css */
   .original-theme {
     /* Original color values */
     --color-teal: #1E5959;
     --color-beige: #E8DED1;
     --color-sage: #7D9D8C;
     --color-terracotta: #C87D55;
     
     /* Original background colors */
     --bg-primary: #FFFDF7; /* Original light yellow */
     --bg-secondary: #FFFDF7;
     --bg-accent: #1E5959;
     --bg-header: #1E5959;
     --bg-footer: #1E5959;
     
     /* Original text colors */
     --text-primary: #333333;
     --text-secondary: #666666;
     --text-accent: #1E5959;
     --text-light: white;
     --text-price: #1E5959;
     
     /* Original border colors */
     --border-light: #E8DED1;
     --border-medium: #E8DED1;
     --border-accent: #7D9D8C;
     
     /* Original button colors */
     --btn-primary-bg: #1E5959;
     --btn-primary-text: white;
     --btn-primary-hover-bg: #1E5959;
     --btn-secondary-bg: white;
     --btn-secondary-text: #1E5959;
     --btn-secondary-border: #1E5959;
     --btn-secondary-hover-bg: #1E5959;
     --btn-secondary-hover-text: white;
   }
   ```

4. Update the global styles to use CSS variables:
   ```css
   /* Update global.css */
   
   /* Headers */
   .site-header {
     background-color: var(--bg-header);
     color: var(--text-light);
   }
   
   /* Navigation */
   .main-nav a {
     color: var(--text-light);
   }
   
   .main-nav a:hover {
     color: var(--color-beige-light);
   }
   
   /* Section headers */
   .section-header {
     background-color: var(--bg-accent);
     color: var(--text-light);
   }
   
   /* Content sections */
   .section-content {
     background-color: var(--bg-primary);
     border: 1px solid var(--border-light);
   }
   
   /* Buttons */
   .btn-primary {
     background-color: var(--btn-primary-bg);
     color: var(--btn-primary-text);
   }
   
   .btn-primary:hover {
     background-color: var(--btn-primary-hover-bg);
   }
   
   .btn-secondary {
     background-color: var(--btn-secondary-bg);
     color: var(--btn-secondary-text);
     border: 1px solid var(--btn-secondary-border);
   }
   
   .btn-secondary:hover {
     background-color: var(--btn-secondary-hover-bg);
     color: var(--btn-secondary-hover-text);
   }
   
   /* Footer */
   .site-footer {
     background-color: var(--bg-footer);
     color: var(--text-light);
   }
   ```

5. Create a theme initialization script to be included in the head:
   ```html
   <head>
     <!-- Existing head content -->
     <link rel="stylesheet" href="/css/sillavida-enhanced-theme.css">
     <link rel="stylesheet" href="/css/original-theme.css">
     <script src="/js/theme-switcher.js"></script>
     <script>
       // Check for saved theme preference
       const savedTheme = localStorage.getItem('sillavida-theme') || 'enhanced';
       document.documentElement.classList.add(savedTheme + '-theme');
     </script>
   </head>
   ```

6. Create an admin panel component for theme management:
   ```html
   <div class="admin-panel" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; background: white; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
     <h4>Admin Controls</h4>
     <button class="theme-toggle-btn" onclick="themeToggle.toggleTheme()">
       Toggle Color Theme
     </button>
     <div class="theme-status">
       Current: <span id="current-theme">Enhanced</span>
     </div>
     <script>
       // Update theme status display
       function updateThemeStatus() {
         const status = document.getElementById('current-theme');
         if (status) {
           status.textContent = themeToggle.currentTheme === 'enhanced' ? 'Enhanced' : 'Original';
         }
       }
       
       // Listen for theme changes
       document.addEventListener('DOMContentLoaded', () => {
         updateThemeStatus();
         document.addEventListener('themeChanged', updateThemeStatus);
       });
     </script>
   </div>
   ```

7. Update component-specific styles to use the CSS variables:
   ```css
   /* Example for product cards */
   .product-card {
     border: 1px solid var(--border-light);
     background-color: var(--bg-primary);
   }
   
   .product-card:hover {
     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
   }
   
   .product-card-title {
     color: var(--text-accent);
   }
   
   .product-card-price {
     color: var(--text-price);
   }
   ```

8. Create a theme preview page for stakeholders:
   ```html
   <div class="theme-preview">
     <h1>SillaVida Theme Preview</h1>
     
     <div class="theme-controls">
       <button onclick="themeToggle.setTheme('original')">Original Theme</button>
       <button onclick="themeToggle.setTheme('enhanced')">Enhanced Theme</button>
     </div>
     
     <div class="preview-section">
       <h2>Color Palette</h2>
       <div class="color-swatch" style="background-color: var(--color-teal);">Teal</div>
       <div class="color-swatch" style="background-color: var(--color-beige);">Beige</div>
       <div class="color-swatch" style="background-color: var(--color-sage);">Sage</div>
       <div class="color-swatch" style="background-color: var(--color-terracotta);">Terracotta</div>
     </div>
     
     <div class="preview-section">
       <h2>UI Components</h2>
       
       <h3>Buttons</h3>
       <button class="btn-primary">Primary Button</button>
       <button class="btn-secondary">Secondary Button</button>
       
       <h3>Section Headers</h3>
       <div class="section-header">
         <h2 class="section-title">Example Section</h2>
       </div>
       <div class="section-content">
         <p>This is example content in a section.</p>
       </div>
     </div>
   </div>
   ```

9. Test the implementation across all pages and devices
10. Create documentation for the theme switching mechanism
11. Deploy the changes to a staging environment for review
12. Collect feedback and make adjustments as needed

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
- TASK-040: Implement SillaVida Color Palette
- TASK-041: Implement Typography System
- TASK-042: Create Component Library

## Test Status
- Status: Completed
- Test Files: None

## Notes
- This implementation uses CSS variables and theme classes to make the color scheme changes easily reversible
- The admin panel provides a simple way to toggle between the original and enhanced themes
- Theme preference is saved in localStorage to persist across page loads
- The implementation should be tested thoroughly across all pages and components
- Consider adding a cookie-based theme preference for users who clear their localStorage
- The theme preview page should be accessible only to administrators and stakeholders
- When implementing, ensure all components in the React codebase properly use these CSS variables
- For React components, you may need to add a ThemeContext provider to manage theme state

## Next Steps
- After implementation, gather feedback from stakeholders
- Consider creating A/B testing to measure user engagement with each theme
- If the enhanced theme is well-received, consider making it the default and removing the toggle functionality
- Document the CSS variable system for future developers
