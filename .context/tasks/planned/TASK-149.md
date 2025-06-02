---
title: Component Consolidation and Architecture Optimization
type: task
status: planned
created: 2025-06-02T11:48:33
updated: 2025-06-02T11:48:33
id: TASK-149
priority: medium
memory_types: [procedural, semantic]
dependencies: [TASK-105]
tags: [refactoring, component-architecture, code-duplication, post-testing]
---

# Component Consolidation and Architecture Optimization

## Description
Consolidate duplicate component patterns identified in the audit, particularly the 3 product card components and 3 promo banner components. This refactoring will reduce code duplication by ~40%, improve maintainability, and create reusable component patterns for future development.

## Objectives
- Consolidate 3 ProductCard components into 1 configurable base component
- Unify 3 Promo Banner components into 1 flexible banner system
- Consolidate 2 LazyImage components into single implementation
- Extract shared price formatting logic throughout codebase
- Reduce component code duplication by 40%
- Improve component reusability and maintainability
- Create consistent component API patterns

## Steps
1. **Phase 4A: Product Card Consolidation (HIGH IMPACT)**
   - Analyze ProductCard.tsx, ProductCardSimple.tsx, ShopifyProductCard.tsx
   - Create unified BaseProductCard component with composition pattern:
     ```typescript
     interface BaseProductCardProps {
       product: StandardProduct;
       variant: 'simple' | 'standard' | 'shopify';
       showDescription?: boolean;
       showHoverEffects?: boolean;
       actionButtons?: 'buy' | 'view' | 'both';
     }
     ```
   - Extract useProductCard hook for shared logic (price formatting, add-to-cart, analytics)
   - Migrate existing usage to new unified component
   - Remove old component files after verification

2. **Phase 4B: Promo Banner Unification (MEDIUM IMPACT)**
   - Analyze PromoBanner.tsx, ShippingPromoBanner.tsx, ShopifyPromoBanner.tsx
   - Create unified Banner component:
     ```typescript
     interface BannerProps {
       type: 'product' | 'shipping' | 'promotional';
       content: BannerContent;
       styling: BannerStyling;
     }
     ```
   - Extract useBannerLogic hook for price calculations and analytics
   - Update all banner usage sites
   - Remove duplicated banner components

3. **Phase 4C: LazyImage Consolidation (LOW IMPACT)**
   - Compare LazyImage.tsx vs common/LazyImage.tsx (85% feature overlap)
   - Create single LazyImage component with feature flags:
     ```typescript
     interface LazyImageProps {
       src: string;
       alt: string;
       optimization?: 'webp' | 'responsive' | 'none';
       placeholder?: 'blur' | 'spinner' | 'skeleton';
       errorFallback?: string | React.Component;
     }
     ```
   - Migrate all usage to consolidated component
   - Remove duplicate implementation

4. **Phase 4D: Price Formatting Migration**
   - Audit remaining components using inline price formatting
   - Migrate to existing priceFormatter.ts utility (getProductPriceDisplay)
   - Found in: Product cards, banner components, ProductHeroShowcase
   - Standardize price display format across application

5. **Phase 4E: Authentication Form Consolidation**
   - Unify FallbackLoginForm.tsx and FallbackRegisterForm.tsx (80% overlap)
   - Create shared AuthForm component:
     ```typescript
     interface AuthFormProps {
       type: 'login' | 'register';
       fields: FormField[];
       onSubmit: (data: FormData) => Promise<void>;
     }
     ```
   - Extract useAuthForm hook for validation and error handling
   - Update authentication flow to use unified form

6. **Phase 4F: CSS Pattern Extraction**
   - Extract 15+ repeated button patterns to utility classes
   - Standardize 12+ card layout patterns
   - Create reusable CSS utilities for common patterns:
     - .btn-primary, .btn-secondary (standardized button styles)
     - .card-base, .card-hover (standardized card patterns)
     - .loading-spinner (standardized loading pattern)

7. **Phase 4G: Testing and Validation**
   - Test all consolidated components maintain original functionality
   - Verify no visual regressions in product displays
   - Test cart functionality with new product cards
   - Validate analytics tracking continues to work
   - Run bundle analysis to confirm code reduction

## Progress
- No progress yet

## Dependencies
- TASK-105 (Shopify Integration Testing) - must complete integration testing first

## Test Status
- Status: Not Started
- Test Files: Update existing component tests after consolidation

## Notes
**Priority: Medium - Schedule after TASK-105 completion**

This task provides significant long-term benefits:
- **Maintainability**: Single source of truth for component patterns
- **Development Speed**: Reusable components accelerate feature development
- **Consistency**: Standardized component APIs and styling
- **Bundle Size**: ~15-20% reduction in component JavaScript

**Component Duplication Analysis:**
- ProductCard components: 70% structural overlap, 60% logic duplication
- Promo Banners: 65% structural overlap
- LazyImage: 85% feature overlap
- Auth Forms: 80% structural overlap

**Risk Assessment:**
- **Risk Level**: MEDIUM (requires careful testing of component changes)
- **Mitigation**: Gradual migration, preserve existing tests
- **Rollback**: Keep old components until new ones are fully validated

**Implementation Strategy:**
- Start with ProductCard (highest impact)
- Use composition pattern for flexibility
- Maintain backward compatibility during transition
- Extract shared logic to custom hooks
- Test each consolidation independently

**Expected Outcomes:**
- 40% reduction in component duplication
- Faster feature development with reusable components
- Better design system consistency
- Reduced maintenance burden
- Cleaner component architecture

## Next Steps
- Wait for TASK-105 completion to ensure integration stability
- Begin with ProductCard analysis and base component design
- Create useProductCard hook for shared functionality
- Implement gradual migration strategy
