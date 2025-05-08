---
title: Implement Automated Visual Regression Suite
type: task
status: planned
created: 2025-05-06T14:03:22-06:00
updated: 2025-05-06T14:03:22-06:00
id: TASK-103
priority: high
memory_types: [procedural, semantic]
dependencies: [TASK-101, TASK-102]
tags: [testing, ci, visual]
---

# Implement Automated Visual Regression Suite

## Description
Set up an automated visual regression pipeline (e.g., Playwright + @playwright/test or Percy) to capture screenshots of key pages/components after Hbada re-theme. Fail builds when unintended visual diffs occur.

## Objectives
- Integrate visual regression tool into CI workflow (GitHub Actions).
- Capture baseline snapshots across breakpoints.
- Provide PR previews with visual diffs.
- Document process for adding new snapshots.

## Steps
1. Evaluate Playwright vs Percy; select free/open-source friendly option.
2. Add config to project with jest/playwright.
3. Script snapshot capture of Home, Product, Cart, Checkout, and 3 random collection pages.
4. Store baseline in repo or remote storage.
5. Add GitHub Action to run snapshots on PRs.
6. Configure threshold and diff output.
7. Train team on updating baselines.

## Progress
- No progress yet

## Dependencies
- TASK-101, TASK-102

## Test Status
- Status: Not Started
- Test Files: None

## Notes
Choose device widths 375, 768, 1280 for coverage.

## Next Steps
- Evaluate Playwright vs Percy.
