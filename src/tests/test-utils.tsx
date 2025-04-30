/**
 * Test Utilities
 * 
 * This file provides utility functions and wrappers for testing React components.
 * It includes a custom render function that wraps components with necessary providers.
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// Define the types for the custom render function
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  initialEntries?: string[];
}

// Create a custom render function that includes the router
function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  // Set up the initial route if provided
  if (options?.route) {
    window.history.pushState({}, 'Test page', options.route);
  }
  
  // Create a wrapper with all the providers we need
  const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <BrowserRouter>
        {children}
      </BrowserRouter>
    );
  };
  
  // Return the render result and user event
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllTheProviders, ...options })
  };
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override the render method
export { customRender as render };
