# Shopify Metaobject Guide for Hero Slider

This guide explains how to set up and use Shopify Metaobjects for the dynamic hero slider on the Silla Vida website.

## What are Metaobjects?

Metaobjects are a Shopify feature that allows you to create custom content models beyond the standard product, collection, and page types. They're perfect for creating structured content like hero slides, testimonials, FAQs, and more.

## Setting Up the Hero Slide Metaobject Definition

Follow these steps to create the "Hero Slide" Metaobject definition in your Shopify admin:

### 1. Access Metaobjects in Shopify Admin

1. Log in to your Shopify admin
2. Go to **Settings** > **Custom data** > **Metaobjects**
3. Click **Add definition**

### 2. Create the Hero Slide Definition

1. Name: `Hero Slide`
2. API key: `hero_slide` (this will be generated automatically)
3. Description: `Slides for the homepage hero slider`
4. Click **Add field** to add the following fields:

| Field Name | Field Type | API Key | Description | Required |
|------------|------------|---------|-------------|----------|
| Display Order | Integer | `display_order` | Order in which slides appear (1, 2, 3, etc.) | Yes |
| Slide Image | File (image) | `slide_image` | Main image for the slide | Yes |
| Slide Subtitle | Single line text | `slide_subtitle` | Short subtitle displayed above the title | Yes |
| Slide Details | Multi-line text | `slide_details` | Comma-separated list of features to display as tags | Yes |
| Theme Color | Single line text | `theme_color` | Color theme for the slide (teal, sage, or terracotta) | Yes |
| Product to Feature | Product reference | `product_to_feature` | Product to display and link to | Yes |

5. Click **Save**

### 3. Create Hero Slide Entries

After creating the definition, you can add individual hero slides:

1. Go to **Content** > **Metaobjects** > **Hero Slide**
2. Click **Add Hero Slide**
3. Fill in the fields:
   - **Display Order**: Enter a number (e.g., 1 for the first slide)
   - **Slide Image**: Upload an image for the slide background
   - **Slide Subtitle**: Enter a short subtitle (e.g., "Invierte en tu bienestar")
   - **Slide Details**: Enter comma-separated features (e.g., "Soporte Lumbar, Ajuste Personalizado, Materiales Transpirables, 12 MSI")
   - **Theme Color**: Enter one of: teal, sage, or terracotta
   - **Product to Feature**: Search and select a product from your catalog
4. Click **Save**
5. Repeat for additional slides, incrementing the Display Order value

## Implementation Details

The website's hero slider component has been updated to:

1. Fetch Hero Slide Metaobjects from the Shopify Storefront API
2. Sort them by the Display Order field
3. Extract product data (title, price, image) from the Product reference
4. Parse the comma-separated Slide Details into feature tags
5. Apply the appropriate theme based on the Theme Color field
6. Display the slides in a carousel with navigation dots

## Troubleshooting

If slides aren't appearing:

1. Ensure you've created at least one Hero Slide Metaobject entry
2. Check that all required fields are filled out
3. Verify the Display Order is set correctly
4. Confirm the Product to Feature reference is valid
5. Check browser console for any API errors

## Best Practices

1. **Images**: Use high-quality, consistently sized images (recommended: 1200×800px)
2. **Features**: Keep feature text short (1-3 words each)
3. **Order**: Use sequential numbers for Display Order (1, 2, 3...)
4. **Themes**: Stick to the three supported themes: teal, sage, terracotta
5. **Testing**: After adding or editing slides, verify they appear correctly on the site

## Technical Reference

The implementation uses the following GraphQL query to fetch the Metaobjects:

```graphql
query GetHeroSlides {
  metaobjects(type: "hero_slide", first: 10) {
    edges {
      node {
        id
        handle
        fields {
          key
          value
          reference {
            ... on Product {
              id
              handle
              title
              description
              featuredImage {
                url
                altText
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
            ... on MediaImage {
              id
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
}
```
