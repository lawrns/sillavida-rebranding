import {
  createStorefrontClient,
  type StorefrontClientProps,
} from '@shopify/hydrogen-react';

const storefrontConfig: StorefrontClientProps = {
  storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN,
  publicStorefrontToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  apiVersion: '2024-01',
};

const client = createStorefrontClient(storefrontConfig);

export const shopifyClient = {
  async query({ data }: { data: { query: string; variables?: any } }) {
    try {
      const response = await fetch(
        client.getStorefrontApiUrl(),
        {
          method: 'POST',
          headers: client.getPublicTokenHeaders(),
          body: JSON.stringify(data),
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      
      if (json.errors) {
        throw new Error(json.errors[0].message);
      }
      
      return json;
    } catch (error) {
      console.error('Shopify query error:', error);
      throw error;
    }
  }
};

export async function getProducts() {
  const query = `
    query Products {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyClient.query({
    data: { query },
  });

  return response.data.products.edges.map((edge: any) => edge.node);
}

export async function getProduct(handle: string) {
  const query = `
    query Product($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
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
              availableForSale
            }
          }
        }
      }
    }
  `;

  const response = await shopifyClient.query({
    data: {
      query,
      variables: {
        handle,
      },
    },
  });

  return response.data.product;
}