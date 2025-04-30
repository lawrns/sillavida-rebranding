/**
 * Checkout Flow End-to-End Tests
 * 
 * This file contains tests for the checkout flow of the SillaVida website.
 * It tests the complete purchase process from product selection to order confirmation.
 */

describe('Checkout Flow', () => {
  beforeEach(() => {
    // Clear any existing cart items
    cy.window().then((win) => {
      win.localStorage.removeItem('sillavida-cart');
    });
    
    // Visit the homepage
    cy.visit('/');
  });
  
  it('should complete the checkout process successfully', () => {
    // Find a product and add it to the cart
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart-button"]').click();
    });
    
    // Check if the cart indicator shows 1 item
    cy.get('[data-testid="cart-count"]').should('contain', '1');
    
    // Open the cart
    cy.get('[data-testid="cart-icon"]').click();
    
    // Check if the cart modal is visible
    cy.get('[data-testid="cart-modal"]').should('be.visible');
    
    // Check if the product is in the cart
    cy.get('[data-testid="cart-item"]').should('have.length', 1);
    
    // Proceed to checkout
    cy.get('[data-testid="checkout-button"]').click();
    
    // Check if redirected to the checkout page
    cy.url().should('include', '/checkout');
    
    // Fill in shipping information
    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="lastName"]').type('User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="phone"]').type('1234567890');
    cy.get('input[name="address"]').type('123 Test St');
    cy.get('input[name="city"]').type('Test City');
    cy.get('input[name="state"]').type('Test State');
    cy.get('input[name="zip"]').type('12345');
    
    // Continue to payment
    cy.get('button').contains('Continuar al Pago').click();
    
    // Check if payment section is visible
    cy.get('[data-testid="payment-section"]').should('be.visible');
    
    // Fill in payment information
    cy.get('input[name="cardNumber"]').type('4242424242424242');
    cy.get('input[name="cardExpiry"]').type('12/25');
    cy.get('input[name="cardCvc"]').type('123');
    cy.get('input[name="cardName"]').type('Test User');
    
    // Complete the order
    cy.get('button').contains('Completar Orden').click();
    
    // Check if redirected to the order confirmation page
    cy.url().should('include', '/confirmation');
    
    // Check if order confirmation message is displayed
    cy.get('[data-testid="order-confirmation"]').should('be.visible');
    cy.get('[data-testid="order-confirmation"]').should('contain', 'Gracias por tu compra');
    
    // Check if order number is displayed
    cy.get('[data-testid="order-number"]').should('be.visible');
    
    // Check if analytics events were tracked
    cy.window().then((win) => {
      expect(win.dataLayer).to.exist;
      
      // Find purchase event in dataLayer
      const purchaseEvent = win.dataLayer.find(event => 
        event && event[0] === 'event' && event[1] === 'purchase'
      );
      
      expect(purchaseEvent).to.exist;
    });
  });
  
  it('should validate required fields during checkout', () => {
    // Add a product to the cart
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart-button"]').click();
    });
    
    // Open the cart
    cy.get('[data-testid="cart-icon"]').click();
    
    // Proceed to checkout
    cy.get('[data-testid="checkout-button"]').click();
    
    // Try to continue without filling required fields
    cy.get('button').contains('Continuar al Pago').click();
    
    // Check if validation errors are displayed
    cy.get('[data-testid="form-error"]').should('be.visible');
    
    // Fill only some fields
    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="email"]').type('test@example.com');
    
    // Try to continue again
    cy.get('button').contains('Continuar al Pago').click();
    
    // Check if validation errors are still displayed
    cy.get('[data-testid="form-error"]').should('be.visible');
  });
  
  it('should update cart quantities and totals', () => {
    // Add a product to the cart
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart-button"]').click();
    });
    
    // Open the cart
    cy.get('[data-testid="cart-icon"]').click();
    
    // Get the initial price
    cy.get('[data-testid="cart-total"]').invoke('text').then((initialTotal) => {
      // Increase the quantity
      cy.get('[data-testid="increase-quantity"]').click();
      
      // Check if the quantity is updated
      cy.get('[data-testid="item-quantity"]').should('contain', '2');
      
      // Check if the total price is updated (should be double)
      cy.get('[data-testid="cart-total"]').invoke('text').should((newTotal) => {
        const initialValue = parseFloat(initialTotal.replace(/[^0-9.]/g, ''));
        const newValue = parseFloat(newTotal.replace(/[^0-9.]/g, ''));
        expect(newValue).to.be.closeTo(initialValue * 2, 0.01);
      });
      
      // Decrease the quantity
      cy.get('[data-testid="decrease-quantity"]').click();
      
      // Check if the quantity is updated
      cy.get('[data-testid="item-quantity"]').should('contain', '1');
      
      // Check if the total price is updated (should be back to initial)
      cy.get('[data-testid="cart-total"]').invoke('text').should((finalTotal) => {
        const initialValue = parseFloat(initialTotal.replace(/[^0-9.]/g, ''));
        const finalValue = parseFloat(finalTotal.replace(/[^0-9.]/g, ''));
        expect(finalValue).to.be.closeTo(initialValue, 0.01);
      });
    });
  });
});
