/**
 * Cypress E2E Support File
 * 
 * This file is loaded automatically before your test files.
 * This is a great place to put global configuration and behavior that modifies Cypress.
 */

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests in the command log
const app = window.top;
if (app && !app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Cypress.on('uncaught:exception', (err, runnable) => {
//   // returning false here prevents Cypress from failing the test
//   return false;
// });
