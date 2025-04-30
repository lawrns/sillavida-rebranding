/**
 * Accessibility Tests
 * 
 * This file contains accessibility tests for the SillaVida website.
 * It uses axe-core to check for accessibility issues on key pages.
 */

describe('Accessibility Tests', () => {
  it('Homepage should be accessible', () => {
    cy.visit('/');
    cy.injectAxe();
    cy.checkA11y();
  });
  
  it('Product page should be accessible', () => {
    cy.visit('/productos/ergonomic');
    cy.injectAxe();
    cy.checkA11y();
  });
  
  it('Cart page should be accessible', () => {
    // Add a product to the cart first
    cy.visit('/productos/ergonomic');
    cy.get('[data-testid="add-to-cart-button"]').click();
    
    // Visit the cart page
    cy.visit('/carrito');
    cy.injectAxe();
    cy.checkA11y();
  });
  
  it('Checkout page should be accessible', () => {
    // Add a product to the cart first
    cy.visit('/productos/ergonomic');
    cy.get('[data-testid="add-to-cart-button"]').click();
    
    // Visit the checkout page
    cy.visit('/checkout');
    cy.injectAxe();
    cy.checkA11y();
  });
  
  it('Account page should be accessible', () => {
    cy.visit('/cuenta');
    cy.injectAxe();
    cy.checkA11y();
  });
  
  it('Should have proper focus management', () => {
    cy.visit('/');
    
    // Check if the skip link is the first focusable element
    cy.focused().should('have.attr', 'data-testid', 'skip-link');
    
    // Tab to the next element
    cy.tab();
    
    // Check if the next element is the logo or main navigation
    cy.focused().should('be.visible');
    
    // Continue tabbing through the page
    for (let i = 0; i < 10; i++) {
      cy.tab();
      cy.focused().should('be.visible');
    }
  });
  
  it('Should have proper color contrast', () => {
    cy.visit('/');
    cy.injectAxe();
    
    // Run only color contrast checks
    cy.checkA11y(undefined, {
      runOnly: {
        type: 'rule',
        values: ['color-contrast'],
      },
    });
  });
  
  it('Should have proper ARIA attributes', () => {
    cy.visit('/');
    cy.injectAxe();
    
    // Run only ARIA checks
    cy.checkA11y(undefined, {
      runOnly: {
        type: 'rule',
        values: [
          'aria-roles',
          'aria-valid-attr',
          'aria-valid-attr-value',
          'aria-hidden-body',
          'aria-hidden-focus',
        ],
      },
    });
  });
  
  it('Should have proper form labels', () => {
    cy.visit('/contacto');
    cy.injectAxe();
    
    // Run only form-related checks
    cy.checkA11y(undefined, {
      runOnly: {
        type: 'rule',
        values: [
          'label',
          'label-content-name-mismatch',
          'label-title-only',
          'form-field-multiple-labels',
        ],
      },
    });
  });
});
