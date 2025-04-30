/**
 * SillaVida Design System Initialization
 * 
 * This file initializes the design system when the application loads.
 * It imports the necessary CSS files and sets up the design tokens.
 */

import { initializeDesignSystem } from './implementation';

/**
 * Initialize the design system
 * This function should be called when the application loads
 */
export function setupDesignSystem() {
  // Check if we should use the new design system
  // This could be controlled by a feature flag, local storage, or other means
  const useNewDesignSystem = localStorage.getItem('sillavida-use-design-system') === 'true';
  
  // Initialize the design system with the appropriate settings
  initializeDesignSystem({
    useNewDesignSystem,
    // By default, preserve original styles to avoid breaking changes
    preserveOriginalStyles: true
  });
  
  console.log(`SillaVida Design System ${useNewDesignSystem ? 'enabled' : 'disabled'}`);
  
  // Listen for changes to the design system preference
  window.addEventListener('design-system-change', (event: Event) => {
    const customEvent = event as CustomEvent<{ useNewDesignSystem: boolean }>;
    const { useNewDesignSystem } = customEvent.detail;
    
    // Update the design system
    initializeDesignSystem({
      useNewDesignSystem,
      preserveOriginalStyles: true
    });
    
    // Save the preference to local storage
    localStorage.setItem('sillavida-use-design-system', useNewDesignSystem.toString());
    
    console.log(`SillaVida Design System ${useNewDesignSystem ? 'enabled' : 'disabled'}`);
  });
}

/**
 * Toggle the design system
 * This function can be called from anywhere in the application
 */
export function toggleDesignSystemGlobally(useNewDesignSystem: boolean) {
  // Dispatch a custom event to notify the application
  window.dispatchEvent(new CustomEvent('design-system-change', {
    detail: { useNewDesignSystem }
  }));
}

/**
 * Export the initialization function as the default export
 * This makes it easy to import and call from the application entry point
 */
export default setupDesignSystem;
