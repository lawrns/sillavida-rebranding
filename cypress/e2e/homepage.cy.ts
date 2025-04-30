/**
 * Homepage End-to-End Tests
 * 
 * This file contains tests for the homepage of the SillaVida website.
 * It tests navigation, UI elements, and basic functionality.
 */

describe('Homepage', () => {
  beforeEach(() => {
    // Visit the homepage before each test
    cy.visit('/');
  });
  
  it('should load the homepage successfully', () => {
    // Check if the page title contains SillaVida
    cy.title().should('include', 'SillaVida');
    
    // Check if the main navigation is visible
    cy.get('nav').should('be.visible');
    
    // Check if the hero section is visible
    cy.get('[data-testid="hero-section"]').should('be.visible');
  });
  
  it('should navigate to product categories', () => {
    // Click on the "Productos" link in the navigation
    cy.get('nav').contains('Productos').click();
    
    // Check if the URL changed to the products page
    cy.url().should('include', '/productos');
    
    // Check if product categories are displayed
    cy.get('[data-testid="product-categories"]').should('be.visible');
  });
  
  it('should show featured products', () => {
    // Check if featured products section is visible
    cy.get('[data-testid="featured-products"]').should('be.visible');
    
    // Check if at least one product card is displayed
    cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);
    
    // Check if product cards have the necessary information
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="product-title"]').should('be.visible');
      cy.get('[data-testid="product-price"]').should('be.visible');
      cy.get('[data-testid="add-to-cart-button"]').should('be.visible');
    });
  });
  
  it('should track page view analytics event', () => {
    // Create a spy on the gtag function
    cy.window().then((win) => {
      win.gtag = cy.spy().as('gtag');
    });
    
    // Reload the page to trigger analytics
    cy.reload();
    
    // Check if page_view event was triggered
    cy.get('@gtag').should('be.calledWith', 'event', 'page_view');
  });
  
  it('should pass basic accessibility tests', () => {
    // Inject axe-core
    cy.injectAxe();
    
    // Run accessibility tests
    cy.checkA11y(null, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
      includedImpacts: ['critical', 'serious'],
    });
  });
});
