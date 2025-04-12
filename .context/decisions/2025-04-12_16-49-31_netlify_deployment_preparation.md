---
title: Netlify Deployment Preparation Decisions
type: decision
status: active
created: 2025-04-12T16:49:31-06:00
updated: 2025-04-12T16:49:31-06:00
id: DEC-012
priority: medium
memory_types: [procedural, semantic]
dependencies: [TASK-025]
tags: [deployment, netlify, production, configuration]
---

# Netlify Deployment Preparation Decisions

## Context

As part of TASK-025 (Prepare and Deploy to Netlify), we need to make several decisions regarding the deployment configuration, environment variables, and deployment process for the Silla Vida e-commerce application.

## Problem Statement

Deploying a React application with Shopify integration to Netlify requires careful consideration of several factors:

1. How to configure the build settings for optimal performance
2. How to handle environment variables securely
3. How to ensure proper routing for a single-page application
4. How to implement security headers
5. How to optimize caching for static assets
6. How to check for and fix hardcoded URLs that might break in production

## Decision Details

### 1. Build Configuration

We have decided to use the following build configuration in the `netlify.toml` file:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18 (LTS)

This configuration aligns with the Vite build process and ensures that the application is built correctly for production.

### 2. Environment Variables

We have decided to:

- Store sensitive environment variables (like API keys) in the Netlify UI rather than in the `netlify.toml` file
- Document all required environment variables in a dedicated guide
- Ensure that all environment variables are prefixed with `VITE_` to make them available at runtime

### 3. Routing Configuration

We have decided to implement the following routing configuration:

- Add a redirect rule in `netlify.toml` to handle client-side routing: `/* /index.html 200`
- This ensures that all routes are handled by the React Router and prevents 404 errors when users navigate directly to a route

### 4. Security Headers

We have decided to implement the following security headers:

- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Content-Security-Policy: A policy that allows necessary resources while restricting others

These headers enhance the security of the application by preventing common web vulnerabilities.

### 5. Caching Strategy

We have decided to implement the following caching strategy:

- Cache static assets (JS, CSS, images) with a long TTL: `Cache-Control: public, max-age=31536000, immutable`
- Do not cache HTML and JSON files: `Cache-Control: public, max-age=0, must-revalidate`

This strategy ensures that static assets are cached efficiently while allowing for updates to the application.

### 6. Hardcoded URLs Check

We have decided to:

- Create a comprehensive guide for checking hardcoded URLs
- Provide commands for automatically finding potential hardcoded URLs
- List specific files that should be checked for hardcoded URLs
- Provide guidance on how to fix hardcoded URLs

### 7. Pre-deployment Checklist

We have decided to create a comprehensive pre-deployment checklist that covers:

- Critical functionality to test
- Environment variables to configure
- Build settings to verify
- Post-deployment verification steps

## Alternatives Considered

### Alternative Build Tools

We considered using other build tools like Create React App, but decided to stick with Vite as it's already being used in the project and provides better performance.

### Alternative Deployment Platforms

We considered other deployment platforms like Vercel and GitHub Pages, but decided to use Netlify because:

- It provides excellent support for single-page applications
- It has a robust CDN for global distribution
- It offers easy configuration of environment variables
- It provides automatic HTTPS

### Alternative Caching Strategies

We considered not implementing specific caching headers and relying on Netlify's defaults, but decided to be explicit about caching to ensure optimal performance.

## Impact and Risks

### Positive Impact

- Improved performance through optimized build and caching
- Enhanced security through security headers
- Better developer experience through clear documentation
- Reduced risk of deployment issues through comprehensive pre-deployment checklist

### Potential Risks

- Environment variables might not be set correctly, leading to runtime errors
- Hardcoded URLs might be missed, causing issues in production
- Security headers might be too restrictive, blocking legitimate resources

## Mitigation Strategies

- Create comprehensive documentation for environment variables
- Implement automated checks for hardcoded URLs
- Test the application thoroughly after deployment
- Monitor the application for any issues after deployment

## Implementation Plan

1. Complete TASK-024 (Fix Cart Functionality) before proceeding with deployment
2. Run the hardcoded URL check and fix any issues
3. Copy the `netlify.toml` file to the root of the project
4. Create a production build of the application
5. Set up a new site in Netlify and configure environment variables
6. Deploy the application
7. Verify that all functionality works correctly in production

## Review and Validation

The deployment configuration and process will be reviewed and validated by:

- Testing the application thoroughly after deployment
- Verifying that all functionality works correctly in production
- Checking for any console errors or performance issues
- Monitoring the application for any issues after deployment
