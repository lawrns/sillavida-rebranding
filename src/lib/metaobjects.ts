import { shopifyClient } from './shopify';
import type { ShopifyProduct } from '../types/shopify';

/**
 * Metaobjects Library - Shopify Metaobjects API integration for dynamic content management.
 * 
 * This module provides functionality to fetch and transform Shopify Metaobjects,
 * specifically for hero slide content. It handles the complex GraphQL data structure
 * transformation and provides type-safe interfaces for component consumption.
 * 
 * Key Features:
 * - Hero slide metaobjects fetching with product references
 * - Automatic data structure transformation (edges/nodes to arrays)
 * - Theme configuration management
 * - Error handling with graceful fallbacks
 * 
 * @module metaobjects
 */

/**
 * Interface for hero slide metaobject data structure.
 * Represents a complete hero slide with product information and visual theming.
 * 
 * @interface HeroSlideMetaobject
 */
export interface HeroSlideMetaobject {
  id: string;
  handle: string;
  displayOrder: number;
  slideImage: {
    url: string;
    altText: string;
  };
  slideDetails: string;
  slideSubtitle: string;
  themeColor: string;
  productToFeature: ShopifyProduct;
}

/**
 * Fetches hero slide metaobjects from Shopify with complete product data.
 * 
 * Executes a complex GraphQL query to retrieve:
 * - Metaobject fields (title, subtitle, theme, etc.)
 * - Referenced product data (pricing, variants, images)
 * - Media references for slide images
 * 
 * Data Transformation:
 * - Converts Shopify's edges/nodes structure to simple arrays
 * - Flattens field references into accessible properties
 * - Filters out incomplete slides
 * - Sorts by display order
 * 
 * @async
 * @function getHeroSlides
 * @returns {Promise<HeroSlideMetaobject[]>} Array of hero slide metaobjects sorted by display order
 * @throws {Error} Returns empty array on API errors
 * 
 * @example
 * ```typescript
 * const slides = await getHeroSlides();
 * slides.forEach(slide => {
 *   console.log(slide.productToFeature.title);
 *   console.log(slide.slideImage.url);
 * });
 * ```
 */
export async function getHeroSlides(): Promise<HeroSlideMetaobject[]> {
  try {
    const response = await shopifyClient.query({
      data: {
        query: `
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
                          maxVariantPrice {
                            amount
                            currencyCode
                          }
                        }
                        variants(first: 10) {
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
        `
      }
    });

    if (!response?.data?.metaobjects?.edges) {
      return [];
    }

    const slides: HeroSlideMetaobject[] = response.data.metaobjects.edges
      .map((edge: any) => {
        const node = edge.node;
        const fields = node.fields.reduce((acc: any, field: any) => {
          acc[field.key] = field.value;
          if (field.reference) {
            acc[`${field.key}_reference`] = field.reference;
          }
          return acc;
        }, {});

        // Extract product data
        const productReference = fields.product_to_feature_reference;
        let product = null;

        if (productReference) {

          product = {
            id: productReference.id,
            handle: productReference.handle,
            title: productReference.title,
            description: productReference.description,
            featuredImage: productReference.featuredImage,
            priceRange: productReference.priceRange,
            variants: productReference.variants ? productReference.variants.edges.map((edge: any) => edge.node) : []
          };

        }

        // Extract image data
        const imageReference = fields.slide_image_reference;
        const slideImage = imageReference ? {
          url: imageReference.image.url,
          altText: imageReference.image.altText || ''
        } : null;

        return {
          id: node.id,
          handle: node.handle,
          displayOrder: parseInt(fields.display_order || '0', 10),
          slideImage: slideImage,
          slideDetails: fields.slide_details || '',
          slideSubtitle: fields.slide_subtitle || '',
          themeColor: fields.theme_color || 'teal',
          productToFeature: product
        };
      })
      .filter((slide: any) => slide.productToFeature && slide.slideImage) // Filter out slides with missing required data
      .sort((a: any, b: any) => a.displayOrder - b.displayOrder); // Sort by display order

    return slides;
  } catch (error) {
    return [];
  }
}

/**
 * Generates theme configuration for hero slides based on monochromatic design system.
 * 
 * As part of the SillaVida monochromatic migration, this function now returns
 * consistent black/white/gray theming regardless of the input color parameter.
 * This maintains API compatibility while implementing the new design system.
 * 
 * Theme Properties:
 * - bg: Background gradient classes
 * - accent: Accent background for badges/pills
 * - text: Primary text color
 * - button: Button styling classes
 * - gradient: Secondary gradient classes
 * 
 * @function getSlideTheme
 * @param {string} themeColor - Legacy theme color parameter (now ignored)
 * @returns {Object} Monochromatic theme configuration object
 * 
 * @example
 * ```typescript
 * const theme = getSlideTheme('any-color');
 * // Returns: { bg: 'from-white...', text: 'text-black', ... }
 * ```
 */
export function getSlideTheme(themeColor: string) {
  // All themes now use monochromatic colors regardless of themeColor
  const monochromaticTheme = {
    bg: "from-white via-white to-white",
    accent: "bg-black/10",
    text: "text-black",
    button: "bg-black hover:bg-black/90",
    gradient: "from-white via-white to-gray-50"
  };

  // Return the same monochromatic theme for all color variations
  return monochromaticTheme;
}
