/**
 * Cypress Custom Commands
 * 
 * This file contains custom commands that extend Cypress functionality.
 * These commands can be used in your test files.
 */

// Add TypeScript definitions for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login with email and password
       * @example cy.login('user@example.com', 'password')
       */
      login(email: string, password: string): Chainable<Element>;
      
      /**
       * Custom command to add a product to the cart
       * @example cy.addToCart('ergonomic-chair')
       */
      addToCart(productId: string): Chainable<Element>;
      
      /**
       * Custom command to check if analytics event was triggered
       * @example cy.checkAnalyticsEvent('view_item')
       */
      checkAnalyticsEvent(eventName: string): Chainable<Element>;
      
      /**
       * Custom command to check accessibility
       * @example cy.checkA11y()
       */
      checkA11y(options?: any): Chainable<Element>;
      
      /**
       * Custom command to tab through elements
       * @example cy.tab()
       */
      tab(): Chainable<Element>;
    }
  }
}

// Login command
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});

// Add to cart command
Cypress.Commands.add('addToCart', (productId) => {
  cy.visit(`/products/${productId}`);
  cy.get('button').contains('Agregar al Carrito').click();
  cy.get('[data-testid="cart-count"]').should('be.visible');
});

// Check analytics event command
Cypress.Commands.add('checkAnalyticsEvent', (eventName) => {
  cy.window().then((win) => {
    // Create a spy on the gtag function if it doesn't exist yet
    if (!win.gtag) {
      win.gtag = cy.spy().as('gtag');
    } else if (!cy.spy) {
      // If gtag exists but isn't a spy yet, make it a spy
      win.gtag = cy.spy(win, 'gtag').as('gtag');
    }
    
    // Check if the event was triggered
    cy.get('@gtag').should('be.calledWith', 'event', eventName);
  });
});

// Tab command to simulate pressing the Tab key
Cypress.Commands.add('tab', () => {
  cy.focused().trigger('keydown', { keyCode: 9, which: 9, key: 'Tab' });
});

// Import and register axe-core commands
import 'cypress-axe';

// Extend checkA11y command to include custom configuration
Cypress.Commands.add('checkA11y', (options = {}) => {
  const defaultOptions = {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa'],
    },
    includedImpacts: ['critical', 'serious'],
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  cy.injectAxe();
  cy.checkA11y(null, mergedOptions);
});
