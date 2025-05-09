# Judge.me Integration Documentation

> **Last Updated**: 2025-05-08T00:03:52-06:00  
> **Author**: Silla Vida Development Team

## Table of Contents

1. [Integration Overview](#integration-overview)
2. [Architecture](#architecture)
3. [Components](#components)
   - [ReviewStars](#reviewstars)
   - [ReviewWidget](#reviewwidget)
   - [JudgeMeContainer](#judgemecontainer)
4. [Implementation Guide](#implementation-guide)
5. [Styling](#styling)
6. [Troubleshooting](#troubleshooting)
7. [Future Enhancements](#future-enhancements)

## Integration Overview

The Judge.me integration enables product reviews and ratings on the Silla Vida website. This document provides comprehensive details about the implementation, components, and best practices for working with Judge.me in our application.

Judge.me is a third-party review platform that allows customers to leave reviews for products they've purchased. The integration loads the Judge.me script asynchronously and provides React components to display reviews and ratings.

## Architecture

The Judge.me integration follows a layered architecture pattern:

1. **Script Management Layer**: 
   - `JudgeMeScriptService` handles the loading and initialization of the Judge.me script.
   - Located in `src/services/judgeMe/JudgeMeScriptService.ts`

2. **State Management Layer**:
   - `JudgeMeContext` provides global state for Judge.me functionality.
   - Located in `src/context/JudgeMeContext.tsx`

3. **Hook Layer**:
   - `useJudgeMe` hook for accessing Judge.me functionality within components.
   - Located in `src/hooks/useJudgeMe.ts`

4. **Component Layer**:
   - Reusable UI components for displaying Judge.me data.
   - Located in `src/components/judgeMe/`

### Initialization Flow

1. The application initializes the Judge.me script in `main.tsx` via the `JudgeMeProvider`.
2. The `JudgeMeScriptService` asynchronously loads the Judge.me script.
3. Once loaded, the script exposes a global `jdgm` object for interacting with Judge.me.
4. The `JudgeMeContext` provides the script status and methods to components.
5. Components use the `useJudgeMe` hook to access Judge.me functionality.

## Components

### ReviewStars

The `ReviewStars` component displays a product's star rating and review count.

**File**: `src/components/judgeMe/ReviewStars.tsx`

**Props**:
```typescript
interface ReviewStarsProps {
  productId: string;
  containerClassName?: string;
  className?: string;
  showLoadingState?: boolean;
  showIfEmpty?: boolean;
}
```

**Usage Example**:
```tsx
import { ReviewStars } from '../components/judgeMe';

// Inside a component
<ReviewStars
  productId={product.id}
  containerClassName="flex items-center"
  showLoadingState={false}
/>
```

**Placement**:
The `ReviewStars` component is currently integrated in the `ProductHeroShowcase` component, displayed just below the product title.

### ReviewWidget

The `ReviewWidget` component displays the full reviews for a product.

**File**: `src/components/judgeMe/ReviewWidget.tsx`

**Props**:
```typescript
interface ReviewWidgetProps {
  productId: string;
  containerClassName?: string;
  className?: string;
  showLoadingState?: boolean;
  showIfEmpty?: boolean;
}
```

**Usage Example**:
```tsx
import { ReviewWidget } from '../components/judgeMe';

// Inside a component
<ReviewWidget
  productId={product.id}
  containerClassName="w-full"
  showIfEmpty={false}
/>
```

**Placement**:
The `ReviewWidget` component is currently integrated in the `ProductDetailSections` component as a dedicated reviews section at the bottom of the product details.

### JudgeMeContainer

The `JudgeMeContainer` is a base component used by other Judge.me components to handle loading states, errors, and script availability checks.

**File**: `src/components/judgeMe/JudgeMeContainer.tsx`

**Props**:
```typescript
interface JudgeMeContainerProps {
  children: React.ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  emptyComponent?: React.ReactNode;
  showLoadingState?: boolean;
  showIfEmpty?: boolean;
  containerClassName?: string;
}
```

**Usage Example**:
```tsx
import JudgeMeContainer from '../components/judgeMe/JudgeMeContainer';

// Inside a component
<JudgeMeContainer
  isLoading={isLoading}
  error={error}
  isEmpty={isEmpty}
  showLoadingState={true}
  containerClassName="w-full"
>
  {/* Your Judge.me content here */}
</JudgeMeContainer>
```

## Implementation Guide

### Adding Judge.me to a New Page

1. **Import the necessary components**:
   ```tsx
   import { ReviewStars, ReviewWidget } from '../components/judgeMe';
   ```

2. **Add the components to your page**:
   ```tsx
   // For star ratings
   <ReviewStars
     productId={product.id}
     containerClassName="flex items-center"
   />
   
   // For full reviews
   <ReviewWidget
     productId={product.id}
     containerClassName="w-full"
     showIfEmpty={false}
   />
   ```

3. **Customize the appearance** using the provided CSS classes in `src/components/judgeMe/JudgeMe.css`.

### Accessing Judge.me Script Directly

If you need to access Judge.me functionality directly:

```tsx
import { useJudgeMe } from '../hooks/useJudgeMe';

function MyComponent() {
  const { isLoading, isInitialized, jdgmObject } = useJudgeMe();
  
  // Access the jdgmObject to use Judge.me methods
  useEffect(() => {
    if (isInitialized && jdgmObject) {
      // Example: Manually render a widget
      jdgmObject.renderBadge();
    }
  }, [isInitialized, jdgmObject]);
  
  return (
    // Your component JSX
  );
}
```

## Styling

The Judge.me components are styled using a combination of Tailwind CSS and custom CSS classes. The styling follows Silla Vida's design system with the standardized colors:

- Dark backgrounds: `#111827` (dark blue-gray)
- Accent color: `#4b7cae` (blue) for interactive elements

Custom styles are defined in `src/components/judgeMe/JudgeMe.css` and target Judge.me's native CSS classes to ensure consistent styling.

### Customizing Styles

To customize the appearance of Judge.me components:

1. Add custom classes through the component props:
   ```tsx
   <ReviewStars
     productId={product.id}
     containerClassName="custom-container-class"
     className="custom-stars-class"
   />
   ```

2. Update the CSS in `src/components/judgeMe/JudgeMe.css` to add or modify styles.

## Troubleshooting

### Common Issues

#### Issue: Judge.me script fails to load

**Solution**: Check if the script URLs are correct in the `JudgeMeScriptService` and if there are any network errors in the console.

#### Issue: Reviews not displaying for a product

**Solutions**:
- Verify that the correct `productId` is being passed to the components.
- Check that the product has reviews in the Judge.me dashboard.
- Ensure the Judge.me script has initialized properly (check `isInitialized` state).

#### Issue: Custom styling not applying to Judge.me widgets

**Solutions**:
- Check if the CSS file is being imported in the right place.
- Verify that your CSS selectors have enough specificity to override Judge.me's default styles.
- Use browser dev tools to inspect the elements and see which styles are being applied.

### Debugging

For debugging Judge.me issues:

1. Use the browser console to check for any script loading errors.
2. Inspect the global `jdgm` object in the browser console to verify it's loaded correctly.
3. Add temporary console logs in the `JudgeMeContext` to track initialization status.

## Future Enhancements

### Additional Widget Integration

Future Judge.me integrations could include:

1. **Product Question & Answer Widget**: Add a Q&A section to product pages.
2. **Recently Reviewed Products Widget**: Display recently reviewed products on the homepage.
3. **Top-Rated Products Widget**: Showcase highest-rated products.

### Mobile Optimization

Improvements for mobile experience:

1. Responsive layout adjustments for small screens.
2. Touch-friendly review interfaces.
3. Performance optimizations for mobile devices.

### Review Analytics

Potential analytics enhancements:

1. Dashboard integration to track review metrics.
2. Integration with product analytics to correlate reviews with sales.
3. Customer sentiment analysis from review content.

---

## Changelog

- **2025-05-08**: Initial documentation created.
