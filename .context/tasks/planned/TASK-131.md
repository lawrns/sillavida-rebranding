---
title: Legacy CSS Cleanup and Style System Consolidation
type: task
status: planned
created: 2025-05-12T11:29:12
updated: 2025-05-12T11:29:12
id: TASK-131
priority: medium
memory_types: [procedural, semantic]
dependencies: [TASK-120]
tags: [css, styling, refactoring]
---

# Legacy CSS Cleanup and Style System Consolidation

## Description
As noted in the CODEBASE_OVERVIEW.md, there are legacy CSS files in `styles/sillavida-original-theme.css` that can be deprecated after audit. This task involves auditing and removing legacy CSS, consolidating the style system, and ensuring consistent use of Tailwind utilities across the application.

## Objectives
- Audit legacy CSS files to identify used and unused styles
- Remove unused CSS
- Consolidate the style system
- Ensure consistent use of Tailwind utilities
- Improve overall CSS maintainability and performance

## Steps
1. Identify all legacy CSS files in the codebase
2. Audit the usage of styles from these files
3. Create a migration plan for used styles
4. Convert used styles to Tailwind utilities or components
5. Remove unused CSS
6. Update components to use the consolidated style system
7. Test all changes to ensure visual consistency
8. Document the changes and best practices
9. Update the style guide

## Progress
- No progress yet

## Dependencies
- TASK-120: Technical Debt Reduction - Hard-coded Values Refactoring

## Test Status
- Status: Not Started
- Test Files: None

## Notes
From CODEBASE_OVERVIEW.md:
- "Remove legacy CSS – files in `styles/sillavida-original-theme.css` can be deprecated after audit."

The project uses multiple CSS files:
- `src/index.css` (imported by Tailwind)
- `src/styles/hide-scrollbar.css`
- `src/styles/animations.css`
- `src/styles/product-page.css`
- `styles/sillavida-original-theme.css` (legacy)

## Next Steps
- Identify all legacy CSS files in the codebase
- Begin auditing the usage of styles from these files
