---
title: Hero Slider Image Paths Decision
type: decision
status: completed
created: 2025-04-12T17:11:56-06:00
updated: 2025-04-12T17:11:56-06:00
id: DEC-015
priority: high
memory_types: [procedural, semantic]
dependencies: [TASK-025]
tags: [hero-slider, images, hardcoded-urls, deployment]
---

# Hero Slider Image Paths Decision

## Context
During the preparation for Netlify deployment (TASK-025), it was discovered that running the hardcoded URL check script (netlify-deployment/check-hardcoded-urls.js) caused an issue with the hero slider component. The hero slider was no longer displaying images after the script was run.

## Problem Statement
1. The HeroSlider component uses hardcoded image paths like "/images/gamer2.png", "/images/—Pngtree—single comfort noise style sofa_4372281.png", and "/images/bundle.png"
2. The hardcoded URL check script might have flagged these paths as potential issues and modified them
3. This modification caused the hero slider images to no longer display properly

## Decision Details

### Maintain Hardcoded Image Paths
- Decision: Do not run the hardcoded URL check script for image paths in the HeroSlider component
- Implementation: Keep the original hardcoded image paths in the HeroSlider component
- Rationale: The image paths are relative to the public directory and are valid in both development and production environments

## Alternatives Considered
- Using environment variables for image paths
  - Rejected because relative paths to the public directory are standard practice and work correctly in both development and production
- Modifying the hardcoded URL check script to ignore image paths
  - Considered for future implementation, but not necessary for the current deployment

## Impact and Risks
- Positive impact: Hero slider will display images correctly in both development and production
- Reduced risk of visual issues in the production environment
- No negative impact on deployment or performance

## Implementation Plan
1. Do not run the hardcoded URL check script as part of TASK-025
2. Ensure that the original image paths in the HeroSlider component are preserved
3. Verify that the hero slider displays images correctly before deployment

## Related Decisions
- DEC-014: Task Transition Decision - TASK-024 to Active Status

## Follow-up Actions
1. Consider modifying the hardcoded URL check script to better distinguish between problematic hardcoded URLs and valid relative paths
2. Document this decision in the deployment process to avoid similar issues in future deployments

## Notes
- Relative paths to the public directory (e.g., "/images/...") are standard practice in React applications
- These paths work correctly in both development and production environments
- The hardcoded URL check script should focus on absolute URLs and environment-specific URLs rather than relative paths
