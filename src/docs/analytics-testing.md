# SillaVida Analytics and Testing Documentation

This document provides an overview of the analytics tracking and testing infrastructure implemented for the SillaVida e-commerce website.

## Table of Contents

1. [Analytics Implementation](#analytics-implementation)
2. [Testing Infrastructure](#testing-infrastructure)
3. [Accessibility Testing](#accessibility-testing)
4. [Analytics Dashboard](#analytics-dashboard)
5. [Running Tests](#running-tests)

## Analytics Implementation

### Google Analytics 4 Setup

The SillaVida website uses Google Analytics 4 for tracking user interactions and e-commerce events. The implementation includes:

- **Enhanced E-commerce Tracking**: Tracks product impressions, clicks, detail views, add to cart, checkout, and purchase events.
- **Custom Events**: Tracks custom events for user engagement and site performance.
- **User Consent Management**: Implements a consent banner to comply with privacy regulations.

### Configuration

Analytics configuration is stored in `src/config/analytics.ts`. The following environment variables are used:

```
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ECOMMERCE_TRACKING=true
VITE_ANALYTICS_DEBUG=false
```

### Usage in Components

To use analytics tracking in React components, import the `useAnalytics` hook:

```tsx
import useAnalytics from '../hooks/useAnalytics';

const MyComponent = () => {
  const { trackEvent, ecommerce } = useAnalytics();
  
  // Track custom event
  const handleClick = () => {
    trackEvent('button_click', { button_name: 'example' });
  };
  
  // Track e-commerce event
  const handleAddToCart = (product) => {
    ecommerce.addToCart({
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: 1
      }]
    });
  };
  
  return (
    // Component JSX
  );
};
```

## Testing Infrastructure

### Unit Testing

Unit tests are implemented using Jest and React Testing Library. The setup includes:

- **Jest Configuration**: Located in `jest.config.js`
- **Test Utilities**: Located in `src/tests/test-utils.tsx`
- **Component Tests**: Located in `src/components/__tests__/`

To run unit tests:

```bash
npm test
```

### End-to-End Testing

End-to-end tests are implemented using Cypress. The setup includes:

- **Cypress Configuration**: Located in `cypress.config.ts`
- **Custom Commands**: Located in `cypress/support/commands.ts`
- **E2E Tests**: Located in `cypress/e2e/`

To run end-to-end tests:

```bash
npm run test:e2e
```

To open the Cypress test runner:

```bash
npm run test:e2e:open
```

## Accessibility Testing

Accessibility tests are implemented using axe-core with Cypress. The setup includes:

- **Accessibility Tests**: Located in `cypress/e2e/accessibility.cy.ts`
- **Custom Commands**: Located in `cypress/support/commands.ts`

To run accessibility tests:

```bash
npm run test:a11y
```

## Analytics Dashboard

The SillaVida admin panel includes an analytics dashboard that displays key metrics and visualizations:

- **Sales Overview**: Displays sales data over time
- **Traffic Sources**: Shows the distribution of traffic sources
- **Top Products**: Lists the best-selling products
- **Conversion Rate**: Displays the conversion rate over time
- **Key Performance Indicators**: Shows important metrics like total sales, orders, visitors, and conversion rate

The dashboard is implemented in `src/components/admin/AnalyticsDashboard.tsx` and can be accessed from the admin panel.

## Running Tests

### Prerequisites

Before running tests, make sure you have the following:

1. Node.js installed (v16 or later)
2. All dependencies installed (`npm install`)
3. Environment variables configured

### Running Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Running End-to-End Tests

```bash
# Start the development server
npm run dev

# In a separate terminal, run Cypress tests
npm run test:e2e

# Or open the Cypress test runner
npm run test:e2e:open
```

### Running Accessibility Tests

```bash
# Start the development server
npm run dev

# In a separate terminal, run accessibility tests
npm run test:a11y
```

## Best Practices

1. **Always track important user interactions**: Use the `trackEvent` function to track important user interactions.
2. **Use enhanced e-commerce tracking**: Use the `ecommerce` object to track e-commerce events.
3. **Respect user privacy**: Always check if analytics tracking is enabled and if the user has given consent.
4. **Write tests for critical components**: Ensure that critical components have unit tests.
5. **Test the checkout flow**: Ensure that the checkout flow is tested end-to-end.
6. **Check accessibility**: Ensure that the website is accessible to all users.
