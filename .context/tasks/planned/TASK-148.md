---
title: Console Debug Cleanup and Production Logging
type: task
status: planned
created: 2025-06-02T11:48:33
updated: 2025-06-02T11:48:33
id: TASK-148
priority: medium
memory_types: [procedural, semantic]
dependencies: [TASK-146, TASK-147]
tags: [cleanup, logging, production-ready, debugging]
---

# Console Debug Cleanup and Production Logging

## Description
Clean up console.log statements and debug code across 50+ files, standardize logging using the existing logger utility, and ensure production-ready logging practices. This task improves code professionalism and prevents sensitive information leakage in production.

## Objectives
- Remove or replace 50+ console.log statements with proper logging
- Standardize logging using existing src/utils/logger.ts utility
- Remove temporary TODO/FIXME/DEBUG comments
- Implement production-safe logging practices
- Preserve essential error logging while removing debug noise
- Maintain Judge.me debugging tools in development mode only

## Steps
1. **Phase 3A: Audit and Categorize Console Statements**
   - Review all 50 files with console statements identified in audit
   - Categorize by type: debug, analytics, error, Judge.me integration
   - Identify which should be removed vs replaced with logger utility

2. **Phase 3B: Update Core Application Logging**
   - HomePage.tsx: Replace analytics console.log with logger.analytics.track
   - ProductPage.tsx: Update product interaction logging
   - CartPage.tsx: Standardize cart operation logging
   - AccountButton.tsx: Clean authentication logging
   - ProductHeroShowcase.tsx: Remove debug console statements

3. **Phase 3C: Clean Judge.me Integration Logging**
   - JudgeMeDebugger.tsx: Keep console.log (development debugging tool)
   - JudgeMeLoader.tsx: Replace with logger.debug for integration status
   - JudgeMeScriptTag.tsx: Use logger for script loading events
   - ReactSafeJudgeMeWidget.tsx: Standardize widget initialization logging

4. **Phase 3D: Update Shopify Integration Logging**
   - shopify.ts: Already uses logger - verify consistency
   - customerAuth.ts: Standardize authentication logging
   - apiCache.ts: Use logger for cache operations

5. **Phase 3E: Clean Utility and Business Logic**
   - analytics.ts: Replace console.log with logger.analytics methods
   - business/productAdapters.ts: Remove debug console statements
   - errorHandler.ts: Ensure proper error logging practices

6. **Phase 3F: Remove Development Comments**
   - Remove TODO/FIXME/HACK comments that are no longer relevant
   - Keep actionable TODOs, remove outdated ones
   - Clean up temporary DEBUG comments

7. **Phase 3G: Implement Production Logging Strategy**
   - Ensure logger.ts properly filters logs in production
   - Verify sensitive data (tokens, user info) is never logged
   - Test that error logging works correctly in production builds

## Progress
- No progress yet

## Dependencies
- TASK-146 (Dead Code Removal) - reduces files to clean
- TASK-147 (Legacy Color Cleanup) - ensures clean foundation

## Test Status
- Status: Not Started
- Test Files: Test that production builds have clean console output

## Notes
**Priority: Medium - Can be done after TASK-105 if needed**

Findings from audit:
- 50+ files contain console.log statements
- Many are legitimate (Judge.me debugging, analytics tracking)
- Some are temporary debug statements that should be removed
- Project already has excellent logger.ts utility that should be used consistently

**Logging Strategy:**
- Keep: Essential error logging, Judge.me debugging tools (dev mode)
- Replace: Analytics tracking, business logic debugging
- Remove: Temporary debug statements, redundant logging

**Judge.me Considerations:**
- JudgeMeDebugger is intentionally verbose for troubleshooting
- Keep console.log in development debugging components
- Replace in production components with logger utility

**Production Safety:**
- Verify no API tokens or sensitive data in logs
- Ensure logger properly filters in production mode
- Test production builds have clean console output

**Impact Estimation:**
- Code Quality: Significant improvement
- Bundle Size: Minimal reduction
- Security: Improved (no sensitive data leakage)
- Time Required: 2-3 hours
- Risk Level: LOW (logging changes only)

## Next Steps
- Start with analytics.ts (replace console.log with logger.analytics)
- Update core page components (HomePage, ProductPage, CartPage)
- Clean Judge.me integration files (preserve debugging tools)
- Test production build console output
