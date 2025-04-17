---
title: Fix "Más Vendidos" Navbar Link Route
type: task
status: active
created: 2025-04-17T16:32:42-06:00
updated: 2025-04-17T16:41:08-06:00
id: TASK-039
priority: high
memory_types: [procedural, semantic]
dependencies: []
tags: [bugfix, navbar, routing, ux]
---

# Fix "Más Vendidos" Navbar Link Route

## Description
The "Más Vendidos" link in the navbar is currently not directing to the correct route. When users click on this link, they are taken to an incorrect URL instead of the intended Shopify collection page. This creates a confusing user experience and prevents users from accessing the "Más Vendidos" (Best Sellers) products.

The issue is in the Navbar.tsx component where the link is currently set to go to either `/category/${masVendidosHandle}` if masVendidosHandle exists, or to "/mas-vendidos" as a fallback. According to testing, the correct route should be "/category/mas-vendidos".

## Objectives
- Fix the "Más Vendidos" navbar link to direct to the correct route: "/category/mas-vendidos"
- Ensure consistent navigation behavior across desktop and mobile views
- Maintain the active state styling when on the "Más Vendidos" page

## Steps
1. Update the Navbar.tsx component to modify the "Más Vendidos" link route
2. Change the desktop navigation link to point to "/category/mas-vendidos"
3. Change the mobile navigation link to point to "/category/mas-vendidos"
4. Update the isActive function if necessary to ensure proper active state styling
5. Test the link in both desktop and mobile views to verify it directs to the correct page
6. Verify that the active state styling is applied correctly when on the "Más Vendidos" page

## Progress
- Task moved from planned to active status
- Examined the Navbar.tsx component to understand the current implementation
- Updated the desktop navigation link to point directly to "/category/mas-vendidos" instead of using the dynamic masVendidosHandle
- Updated the mobile navigation link to also point directly to "/category/mas-vendidos"
- Removed the conditional logic that was causing the incorrect route
- Simplified the isActive function call to check for the correct route

## Dependencies
- None

## Test Status
- Status: Not Started
- Test Files: None

## Notes
- The issue was identified when testing the navbar navigation
- The current implementation attempts to use the masVendidosHandle from the Shopify collections, but this approach is not working correctly
- A direct hardcoded route to "/category/mas-vendidos" is preferred for reliability
- This is a high-priority issue as it affects a main navigation element that users expect to work correctly

## Next Steps
- Test the fix to ensure proper navigation in both desktop and mobile views
- Verify that the active state styling is applied correctly when on the "Más Vendidos" page
- Consider updating other navigation links to use a similar direct approach if they have similar issues
