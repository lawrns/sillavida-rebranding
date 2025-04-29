/**
 * SillaVida Design System Implementation
 * 
 * This file provides utilities for implementing the design token system
 * and includes functionality to revert changes if needed.
 */

import { tokens } from './index';

// Flag to track if the design system is active
let designSystemActive = false;

/**
 * Initialize the design system by loading CSS variables
 * @param options Configuration options
 */
export function initializeDesignSystem(options: {
  useNewDesignSystem?: boolean;
  preserveOriginalStyles?: boolean;
} = {}) {
  const { 
    useNewDesignSystem = true,
    preserveOriginalStyles = true 
  } = options;
  
  // If already initialized with the same settings, do nothing
  if (designSystemActive === useNewDesignSystem) {
    return;
  }
  
  // Set the active state
  designSystemActive = useNewDesignSystem;
  
  // Get the design system stylesheet
  const designSystemStylesheet = document.getElementById('sillavida-design-system') as HTMLLinkElement;
  
  if (useNewDesignSystem) {
    // If the design system stylesheet doesn't exist, create it
    if (!designSystemStylesheet) {
      const link = document.createElement('link');
      link.id = 'sillavida-design-system';
      link.rel = 'stylesheet';
      link.href = '/src/styles/designSystem.css';
      
      // Add the stylesheet to the head
      document.head.appendChild(link);
      
      console.log('SillaVida Design System initialized');
    } else {
      // If it exists but is disabled, enable it
      designSystemStylesheet.disabled = false;
      console.log('SillaVida Design System enabled');
    }
    
    // If preserving original styles, don't disable them
    if (!preserveOriginalStyles) {
      // Disable original stylesheets (but don't remove them)
      disableOriginalStylesheets();
    }
  } else {
    // If reverting to original styles
    if (designSystemStylesheet) {
      // Disable the design system stylesheet
      designSystemStylesheet.disabled = true;
      console.log('SillaVida Design System disabled');
    }
    
    // Re-enable original stylesheets
    enableOriginalStylesheets();
  }
}

/**
 * Disable original stylesheets by adding a 'disabled' attribute
 */
function disableOriginalStylesheets() {
  const originalStylesheets = [
    'colors.css',
    'typography.css',
    'buttons.css',
    'shadows.css',
    'animations.css',
  ];
  
  originalStylesheets.forEach(stylesheet => {
    const links = document.querySelectorAll(`link[href*="${stylesheet}"]`);
    links.forEach(link => {
      (link as HTMLLinkElement).disabled = true;
    });
  });
  
  console.log('Original stylesheets disabled');
}

/**
 * Enable original stylesheets by removing the 'disabled' attribute
 */
function enableOriginalStylesheets() {
  const links = document.querySelectorAll('link[disabled]');
  links.forEach(link => {
    // Only enable links that aren't the design system
    if (link.id !== 'sillavida-design-system') {
      (link as HTMLLinkElement).disabled = false;
    }
  });
  
  console.log('Original stylesheets enabled');
}

/**
 * Check if the design system is active
 */
export function isDesignSystemActive(): boolean {
  return designSystemActive;
}

/**
 * Toggle the design system on/off
 * @param preserve Whether to preserve original styles when enabling
 */
export function toggleDesignSystem(preserve: boolean = true): boolean {
  initializeDesignSystem({ 
    useNewDesignSystem: !designSystemActive,
    preserveOriginalStyles: preserve
  });
  
  return designSystemActive;
}

/**
 * Revert all design system changes
 */
export function revertDesignSystem() {
  initializeDesignSystem({ useNewDesignSystem: false });
  console.log('Design system reverted to original styles');
  return false;
}

/**
 * Apply design tokens to a specific element
 * @param element The element to apply tokens to
 * @param tokenValues Object mapping CSS properties to token values
 */
export function applyTokensToElement(
  element: HTMLElement,
  tokenValues: Record<string, string>
) {
  Object.entries(tokenValues).forEach(([property, tokenPath]) => {
    // Get the token value using our utility functions
    const value = getTokenValue(tokenPath);
    
    if (value) {
      element.style.setProperty(property, value);
    }
  });
}

/**
 * Get a token value by path
 * @param path Path to the token (e.g. 'colors.primary', 'typography.fontSize.base')
 */
function getTokenValue(path: string): string | null {
  const parts = path.split('.');
  let current: any = tokens;
  
  for (const part of parts) {
    if (current[part] === undefined) {
      console.warn(`Token path "${path}" not found`);
      return null;
    }
    current = current[part];
  }
  
  return current;
}

// Export the tokens for direct access
export { tokens };
