import { shopifyClient } from './shopify';
import type { ShopifyProduct } from '../types/shopify';

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
 * Fetch hero slide metaobjects from Shopify
 * @returns Array of hero slide metaobjects sorted by display order
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
      console.error('No metaobjects found or invalid response structure');
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
          // Add extra debug logging to understand the structure
          console.log('Original variant data from Shopify:', productReference.variants?.edges);

          product = {
            id: productReference.id,
            handle: productReference.handle,
            title: productReference.title,
            description: productReference.description,
            featuredImage: productReference.featuredImage,
            priceRange: productReference.priceRange,
            variants: productReference.variants ? productReference.variants.edges.map((edge: any) => edge.node) : []
          };
          
          // Log the transformed product data
          console.log('Transformed product data:', product);
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
    console.error('Error fetching hero slides:', error);
    return [];
  }
}

/**
 * Get theme configuration based on theme color
 * @param themeColor Theme color name (teal, sage, terracotta)
 * @returns Theme configuration object
 */
export function getSlideTheme(themeColor: string) {
  const themes: Record<string, any> = {
    teal: {
      bg: "from-teal-dark via-teal to-teal-dark",
      accent: "bg-teal-light/20",
      text: "text-beige-light",
      button: "bg-teal hover:bg-teal-light",
      gradient: "from-white via-white to-beige-extralight"
    },
    sage: {
      bg: "from-sage-dark via-sage to-sage-dark",
      accent: "bg-sage-light/20",
      text: "text-beige-light",
      button: "bg-sage hover:bg-sage-light",
      gradient: "from-white via-white to-beige-extralight"
    },
    terracotta: {
      bg: "from-terracotta-dark via-terracotta to-terracotta-dark",
      accent: "bg-terracotta-light/20",
      text: "text-beige-light",
      button: "bg-terracotta hover:bg-terracotta-light",
      gradient: "from-white via-white to-beige-extralight"
    }
  };

  return themes[themeColor.toLowerCase()] || themes.teal;
}
