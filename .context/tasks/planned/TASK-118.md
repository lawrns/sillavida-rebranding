---
title: Implement Judge.me Widget Initialization Handler
type: task
status: planned
created: 2025-05-09T13:14:07
updated: 2025-05-09T13:14:07
id: TASK-118
priority: high
memory_types: [procedural]
dependencies: [TASK-117]
tags: [judge-me, javascript, integration]
---

## Description
Judge.me widgets require explicit initialization within React's component lifecycle. We need to create proper initialization handlers to ensure widgets render correctly after React components mount.

## Objectives
- Create robust initialization for Judge.me widgets that works with React's lifecycle
- Ensure widgets re-initialize on component updates and route changes
- Fix the visibility issues with the UGC Media Grid and other widgets

## Steps
1. Create a useJudgeMeInitialization custom hook in the judgeMe components directory
2. Implement component-specific widget initialization for ReviewWidget and UGC Media Grid
3. Add observer pattern to detect when widgets are added to DOM and initialize them
4. Add debugging options to verify initialization sequence is working correctly

## Progress
Not started

## Dependencies
TASK-117

## Notes
Example implementation approach:
```tsx
// Inside ProductPage component
useEffect(() => {
  // Ensure this runs after the component fully mounts
  if (window.jdgm && typeof window.jdgm.renderWidgets === 'function') {
    // Small timeout ensures DOM is ready
    setTimeout(() => {
      window.jdgm.renderWidgets();
    }, 100);
  }
}, [product.id]); // Re-run when product changes
```

## Next Steps
Test initialization across different pages and navigation patterns
