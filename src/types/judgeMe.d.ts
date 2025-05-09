/**
 * Type definitions for Judge.me integration
 */

declare global {
  interface Window {
    jdgm?: {
      SHOP_DOMAIN?: string;
      PLATFORM?: string;
      renderWidgets: (container?: HTMLElement) => void;
      renderWidget: (widget: HTMLElement) => void;
      refreshWidgets: () => void;
      getProductReviews: (
        productId: string | number, 
        callback: (data: any) => void, 
        page?: number, 
        perPage?: number
      ) => void;
      getReviewCount: (
        productId: string | number, 
        callback: (count: number) => void
      ) => void;
      getAverageRating: (
        productId: string | number, 
        callback: (rating: number) => void
      ) => void;
      [key: string]: any;
    };
  }
}

export interface JudgeMeReviewData {
  html?: string;
  featured?: string;
  reviews?: Array<JudgeMeReview>;
  pagination?: {
    page: number;
    pages: number;
    per_page: number;
    count: number;
  };
}

export interface JudgeMeReview {
  id: number;
  rating: number;
  title: string;
  body: string;
  created_at: string;
  reviewer: {
    name: string;
    email?: string;
    verified_buyer?: boolean;
  };
  product: {
    id: number;
    handle: string;
    title: string;
  };
  pictures?: Array<{
    urls: {
      compact?: string;
      original?: string;
      small?: string;
    }
  }>;
  curated?: boolean;
  featured?: boolean;
}

export interface JudgeMeWidgetOptions {
  productId?: string | number;
  container?: HTMLElement;
  shopDomain?: string;
  platform?: string;
}
