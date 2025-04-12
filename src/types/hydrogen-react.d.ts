declare module '@shopify/hydrogen-react' {
  export interface StorefrontClientProps {
    storeDomain: string;
    publicStorefrontToken: string;
    apiVersion: string;
  }

  export function createStorefrontClient(props: StorefrontClientProps): {
    getStorefrontApiUrl: () => string;
    getPublicTokenHeaders: () => Record<string, string>;
  };
}
