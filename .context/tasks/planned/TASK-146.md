---
title: Critical Dead Code Removal and Bundle Optimization
type: task
status: planned
created: 2025-06-02T11:48:33
updated: 2025-06-02T11:48:33
id: TASK-146
priority: high
memory_types: [procedural, semantic]
dependencies: []
tags: [cleanup, dead-code, bundle-optimization, pre-testing]
---

# Critical Dead Code Removal and Bundle Optimization

## Description
Remove all identified dead code including unused components, development pages, and duplicate utilities to achieve immediate 25% bundle size reduction before proceeding with TASK-105 integration testing. This cleanup ensures a clean foundation for integration tests and eliminates potential conflicts.

## Objectives
- Remove 6 unused React components (390 lines)
- Remove 9 unrouted development pages (1,350 lines)  
- Remove duplicate utility files (153 lines)
- Move misplaced dependencies to appropriate sections
- Achieve 25% bundle size reduction with zero functionality loss
- Prepare clean codebase for TASK-105 integration testing

## Steps
1. **Phase 1A: Remove Unused Components (IMMEDIATE)**
   - Delete VidaIcons.tsx (never imported, 50 lines)
   - Delete VidaBenefits.tsx (never imported, 100 lines)
   - Delete ProductFeatures.tsx (never imported, 80 lines)
   - Delete BenefitTabs.tsx (never imported, 120 lines)
   - Delete ChairFeaturesComponent.tsx (never imported, 50 lines)
   - Delete ProductSpecifications.tsx (never imported, 60 lines)

2. **Phase 1B: Remove Unrouted Development Pages**
   - Delete AnimationDemoPage.tsx (150 lines)
   - Delete ProductCardDemo.tsx (58 lines)
   - Delete ShopifyApiTester.tsx (200 lines)
   - Delete ShopifyTest.tsx (100 lines)
   - Delete ShopifyTestPage.tsx (150 lines)
   - Delete TestPage.tsx (100 lines)
   - Delete ThemePreviewPage.tsx (200 lines)
   - Delete ThemeTestPage.tsx (150 lines)
   - Delete UiShowcasePage.tsx (300 lines)

3. **Phase 1C: Remove Duplicate Utilities**
   - Delete src/utils/imageOptimizer.js (keep TypeScript version)
   - Verify no imports reference the deleted JS version

4. **Phase 1D: Dependency Optimization**
   - Move @playwright/test from dependencies to devDependencies in package.json
   - Remove unused React imports from 20+ identified files

5. **Phase 1E: Verification**
   - Run npm run build to ensure no broken imports
   - Run npm run analyze to verify bundle size reduction
   - Test critical user flows remain functional

## Progress
- No progress yet

## Dependencies
- None (prerequisite for TASK-105)

## Test Status
- Status: Not Started
- Test Files: None required (removal only)

## Notes
**CRITICAL: Must complete before TASK-105**

This task provides immediate wins with zero risk:
- All removed files are confirmed unused via import analysis
- No functionality impact - only removes development artifacts
- Significant bundle optimization for production deployment
- Cleaner codebase for integration testing

**Impact Estimation:**
- Bundle Reduction: 25% (-1,893 lines, -60KB)
- Maintenance: Improved (fewer files to maintain)
- Risk Level: ZERO (only removing unused code)
- Time Required: 1-2 hours

## Next Steps
- Begin with unused component removal (highest impact, lowest risk)
- Verify each deletion with grep search to confirm no usage
- Run build after each phase to catch any missed dependencies
