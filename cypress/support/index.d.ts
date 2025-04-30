/// <reference types="cypress" />

declare namespace Cypress {
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
    checkA11y(context?: string | Node | null, options?: any): Chainable<Element>;
    
    /**
     * Custom command to inject axe-core
     * @example cy.injectAxe()
     */
    injectAxe(): Chainable<Element>;
    
    /**
     * Custom command to tab through elements
     * @example cy.tab()
     */
    tab(): Chainable<Element>;
  }
}
