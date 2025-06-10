# Environment Variables Guide for Netlify Deployment

This guide explains how to set up and manage environment variables for the Silla Vida application when deploying to Netlify.

## Required Environment Variables

The following environment variables are required for the Silla Vida application to function correctly in production:

| Variable Name | Description | Example Value |
|---------------|-------------|---------------|
| `VITE_SHOPIFY_STORE_DOMAIN` | The domain of your Shopify store | `your-store.myshopify.com` |
| `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | The Storefront API access token | `your_storefront_access_token_here` |

## Setting Environment Variables in Netlify

There are two ways to set environment variables in Netlify:

### 1. Using the Netlify UI

1. Go to your Netlify dashboard and select your site
2. Navigate to **Site settings** > **Build & deploy** > **Environment**
3. Click on **Edit variables**
4. Add each environment variable with its name and value
5. Click **Save**

![Netlify Environment Variables UI](https://docs.netlify.com/images/configure-builds/environment-variables.png)

### 2. Using netlify.toml (Not Recommended for Sensitive Data)

You can also set environment variables in your `netlify.toml` file, but this is **not recommended for sensitive data** like API keys:

```toml
[build.environment]
  VITE_PUBLIC_SETTING = "value"
```

For sensitive data, always use the Netlify UI or Netlify CLI.

## Environment Variables and Build Process

When Netlify builds your site, it will inject these environment variables into the build process. Vite will replace any references to `import.meta.env.VARIABLE_NAME` in your code with the actual values.

### Example Usage in Code

```typescript
// src/lib/shopify.ts
const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Create a new client
const client = createStorefrontClient({
  domain,
  storefrontAccessToken,
});
```

## Environment-Specific Builds

If you need different environment variables for different environments (e.g., staging vs. production), you can use Netlify's deploy contexts:

1. Create a new site in Netlify for each environment
2. Set different environment variables for each site
3. Deploy to the appropriate site based on your needs

Alternatively, you can use Netlify's branch-based deployments and set different environment variables for each branch.

## Verifying Environment Variables

After deploying, you should verify that your environment variables are working correctly:

1. Check the Netlify deploy logs for any errors related to missing environment variables
2. Test functionality that depends on these variables (e.g., Shopify API calls)
3. Look for any console errors in the browser that might indicate missing or incorrect environment variables

## Troubleshooting

If you encounter issues with environment variables:

1. **Variables not available during build**: Make sure they're set in Netlify's UI before triggering a build
2. **Variables not available at runtime**: Ensure you're prefixing Vite environment variables with `VITE_`
3. **Changes not taking effect**: Remember that you need to redeploy your site after changing environment variables

## Security Considerations

- Never commit sensitive environment variables to your repository
- Use Netlify's environment variable UI for sensitive data
- Consider using Netlify's "sensitive variable" option which masks the values in logs
- Regularly rotate API keys and update the environment variables accordingly
