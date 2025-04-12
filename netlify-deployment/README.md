# Netlify Deployment for Silla Vida

This directory contains documentation and configuration files for deploying the Silla Vida e-commerce application to Netlify.

## Overview

Netlify is a web hosting and automation platform that offers continuous deployment from Git, global CDN distribution, and many other features that make it ideal for hosting modern web applications like Silla Vida.

## Files in this Directory

- **README.md** - This file, providing an overview of the deployment process
- **pre-deployment-checklist.md** - A comprehensive checklist of items to verify before deployment
- **netlify.toml** - Configuration file for Netlify build settings, redirects, and headers
- **hardcoded-urls-check.md** - Guide for identifying and fixing hardcoded URLs that might break in production
- **environment-variables-guide.md** - Instructions for setting up environment variables in Netlify

## Deployment Process

The deployment process for Silla Vida to Netlify involves the following steps:

1. **Preparation**
   - Complete all development tasks, especially TASK-024 (Fix Cart Functionality)
   - Run through the pre-deployment checklist
   - Check for hardcoded URLs and fix any issues
   - Prepare environment variables

2. **Configuration**
   - Copy the `netlify.toml` file to the root of the project
   - Set up environment variables in Netlify UI

3. **Deployment**
   - Connect the repository to Netlify
   - Configure build settings
   - Trigger the initial build and deployment

4. **Verification**
   - Test the deployed application
   - Verify all functionality works correctly
   - Check for any console errors or performance issues

## Prerequisites

Before deploying to Netlify, ensure you have:

- A Netlify account
- Access to the GitHub repository
- Shopify API credentials (store domain and storefront access token)

## Important Notes

- The deployment should only be done after fixing the cart functionality (TASK-024)
- Environment variables must be properly configured in Netlify
- The application should be thoroughly tested after deployment
- Consider setting up a staging environment before deploying to production

## Helpful Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#netlify)
- [Shopify Storefront API Documentation](https://shopify.dev/docs/api/storefront)
