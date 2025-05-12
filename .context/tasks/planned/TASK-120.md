---
title: Technical Debt Reduction - Hard-coded Values Refactoring
type: task
status: planned
created: 2025-05-12T11:29:12
updated: 2025-05-12T11:29:12
id: TASK-120
priority: high
memory_types: [procedural, semantic]
dependencies: []
tags: [refactoring, technical-debt, code-quality]
---

# Technical Debt Reduction - Hard-coded Values Refactoring

## Description
This task involves conducting a systematic audit to identify and refactor hard-coded values throughout the codebase, particularly focusing on color values that should use design tokens from the Tailwind configuration. As noted in the CODEBASE_OVERVIEW.md, there are several components with hard-coded teal utility classes that need to be converted to semantic utilities.

## Objectives
- Identify all hard-coded color values in the codebase
- Replace hard-coded values with semantic Tailwind utility classes
- Ensure consistent use of design tokens across the application
- Improve maintainability and theme consistency
- Prepare the codebase for potential palette updates

## Steps
1. Create a script to scan the codebase for hard-coded color values (hex, RGB, HSL)
2. Identify components with hard-coded Tailwind utility classes (e.g., `text-teal-500`, `bg-[#1DDBA6]`)
3. Create a mapping of hard-coded values to semantic Tailwind utilities
4. Refactor each component to use semantic utilities
5. Update the Navbar.tsx component which contains teal utility classes
6. Update the Footer.tsx component which still uses teal colors/links
7. Update the HeroSlider.tsx component which uses teal for background overlay & CTA buttons
8. Test each refactored component to ensure visual consistency
9. Document the changes and update the style guide

## Progress
- No progress yet

## Dependencies
- None

## Test Status
- Status: Not Started
- Test Files: None

## Notes
From CODEBASE_OVERVIEW.md:
- "Palette update – swap teal variables for the clone-site red (#d71920) + black/white neutral scheme."
- "Class audit – search for text-teal, bg-[#1DDBA6], etc.; convert to semantic utilities."
- "Navbar.tsx (19 kB) - Contains teal utility classes that need palette swap."
- "Footer.tsx (7 kB) - Colors/links still teal."
- "HeroSlider.tsx (15 kB) - Background overlay & CTA buttons use teal."

## Next Steps
- Create a script to scan the codebase for hard-coded color values
- Begin with the Navbar.tsx component as it's a high-visibility element
