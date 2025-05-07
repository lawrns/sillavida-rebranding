---
title: Accessibility & SEO Audit Post Hbada Theme
type: task
status: planned
created: 2025-05-06T14:03:22-06:00
updated: 2025-05-06T14:03:22-06:00
id: TASK-104
priority: medium
memory_types: [procedural, semantic]
dependencies: [TASK-102]
tags: [accessibility, seo, audit]
---

# Accessibility & SEO Audit Post Hbada Theme

## Description
Validate that the Hbada re-theme meets WCAG 2.1 AA accessibility standards and does not regress on SEO metrics (core web vitals, structured data). Provide a remediation plan.

## Objectives
- Run automated audits (Lighthouse, axe-core) on key pages.
- Manually test keyboard navigation, focus states, and color contrast.
- Validate meta tags, OpenGraph, Schema.org, and canonical URLs.
- Report issues and create tickets for fixes.

## Steps
1. Configure Lighthouse CI for performance, accessibility, SEO categories.
2. Execute axe-core scans via Cypress or Playwright on key flows.
3. Record findings in markdown report stored in `.context/reports/`.
4. Create remediation sub-tasks for high-priority issues.
5. Update documentation with audit results.

## Progress
- No progress yet

## Dependencies
- TASK-102

## Test Status
- Status: Not Started
- Test Files: None

## Notes
Prioritise color-contrast fixes that may arise after palette swap.

## Next Steps
- Configure Lighthouse CI.
