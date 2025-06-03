---
title: Complete Legacy Color System Cleanup
type: task
status: planned
created: 2025-06-02T11:48:33
updated: 2025-06-02T11:48:33
id: TASK-147
priority: high
memory_types: [procedural, semantic]
dependencies: [TASK-146]
tags: [cleanup, color-migration, legacy-removal, pre-testing]
---

# Complete Legacy Color System Cleanup

## Description
Complete the monochromatic color migration by removing all remaining legacy theme files and updating components with legacy color references. This ensures 100% completion of the color migration and eliminates 34+ remaining legacy color references that could cause visual inconsistencies.

## Objectives
- Remove 3 legacy theme files (548 total lines)
- Update 4 critical product components with legacy color references
- Eliminate all --color-teal, --color-sage, --color-terracotta, --color-beige variables
- Complete the monochromatic migration to 100%
- Reduce CSS bundle by 17.6KB
- Ensure visual consistency across all components

## Steps
1. **Phase 2A: Remove Legacy Theme Files (IMMEDIATE)**
   - Delete src/styles/sillavida-original-theme.css (161 lines, already commented out)
   - Delete src/styles/dark-mode.css (212 lines, not implemented)
   - Delete src/styles/theme-switcher.css (175 lines, already commented out)
   - Remove import references from index.css if any exist

2. **Phase 2B: Update Product Components with Legacy Colors**
   - Update src/components/product/ProductComparison.css (10+ var(--color-teal) references)
     - Replace var(--color-teal) with #000000 or hsl(var(--primary))
     - Update hover states and focus states
   - Update src/components/product/ProductView360.css (8 legacy color references)
     - Replace --color-beige-extralight, --color-terracotta with monochromatic equivalents
   - Update src/components/product/ProductSectionNav.css (3 var(--color-teal) references)
     - Use consistent navigation color scheme
   - Update src/components/product/ProductDetailSections.css (legacy color references)

3. **Phase 2C: Verify Monochromatic Palette Usage**
   - Ensure all components use approved monochromatic colors:
     - #000000 (Pure Black) - Primary text, buttons, focus states
     - #333333 (Dark Gray) - Secondary elements, hover states
     - #666666 (Medium Gray) - Muted text, borders, disabled states
     - #999999 (Light Gray) - Placeholder text, subtle elements
     - #E5E5E5 (Border Gray) - Dividers, form borders
     - #F5F5F5 (Background Gray) - Light backgrounds, loading states
     - #FFFFFF (Pure White) - Primary backgrounds, button text

4. **Phase 2D: CSS Variable Cleanup**
   - Remove all legacy color variable definitions
   - Ensure design tokens consistency
   - Update shadows.css if it references legacy colors

5. **Phase 2E: Visual Verification**
   - Test product pages render correctly with new colors
   - Verify navigation maintains proper contrast
   - Check hover and focus states work properly
   - Ensure no broken color references remain

## Progress
- No progress yet

## Dependencies
- TASK-146 (Dead Code Removal) - ensures clean foundation

## Test Status
- Status: Not Started
- Test Files: Visual regression testing required

## Notes
**CRITICAL: Must complete before TASK-105**

This task completes the monochromatic migration started in TASK-134 through TASK-145:
- 12 main migration tasks completed (83%)
- This addresses the remaining 17% of legacy color references
- Found 34 instances of deprecated color variables across 12 files
- 3 entire theme files can be safely removed

**Alignment with Previous Migration:**
The comprehensive audit found these remaining legacy references that weren't caught in the main migration:
- ProductComparison.css: Most critical (10+ references)
- ProductView360.css: Secondary impact (8 references)  
- ProductSectionNav.css: Navigation impact (3 references)
- Legacy theme files: No longer needed

**Impact Estimation:**
- CSS Bundle Reduction: -17.6KB (548 lines removed)
- Migration Completion: 83% → 100%
- Visual Consistency: Complete monochromatic transformation
- Risk Level: LOW (only color updates, no logic changes)
- Time Required: 2-3 hours

## Next Steps
- Start with legacy theme file removal (immediate wins)
- Update ProductComparison.css (highest legacy color usage)
- Test critical product pages after each component update
- Verify no visual regressions in product navigation
