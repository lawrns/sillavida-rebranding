/**
 * Type definitions for Judge.me integration
 * These types represent the structure of the global Judge.me objects and API
 */

/**
 * Judge.me global namespace interface
 * This represents the window.jdgm object that becomes available after script loading
 */
export interface JudgeMeGlobal {
  initialized: boolean;
  widgetIds: string[];
  getReviews: (options: JudgeMeGetReviewsOptions) => Promise<JudgeMeReviewsResponse>;
  renderWidget: (selector: string) => void;
  renderBadges: () => void;
  getProductReviewCount: (productId: string | number) => Promise<number>;
  getAverageRating: (productId: string | number) => Promise<number>;
  [key: string]: any; // Allow for other properties that might be present
}

/**
 * Options for the getReviews method
 */
export interface JudgeMeGetReviewsOptions {
  productId?: string | number;
  productHandle?: string;
  productSku?: string;
  limit?: number;
  offset?: number;
  sort?: 'created_at' | 'rating' | 'pictures' | 'helpful_count';
  direction?: 'asc' | 'desc';
  withPictures?: boolean;
  featuredOnly?: boolean;
  verifiedOnly?: boolean;
}

/**
 * Structure of the response from getReviews
 */
export interface JudgeMeReviewsResponse {
  reviews: JudgeMeReview[];
  count: number;
  hasNextPage: boolean;
  pagination: {
    current: number;
    total: number;
  };
}

/**
 * Structure of a review object
 */
export interface JudgeMeReview {
  id: number;
  rating: number;
  title: string;
  body: string;
  reviewerName: string;
  reviewerEmail?: string;
  verified: boolean;
  featured: boolean;
  productId: number | string;
  productHandle: string;
  productTitle: string;
  createdAt: string;
  updatedAt: string;
  pictures: JudgeMePicture[];
  helpfulCount: number;
  curated: boolean;
}

/**
 * Structure of a review picture
 */
export interface JudgeMePicture {
  id: number;
  urls: {
    small: string;
    medium: string;
    large: string;
  };
}

/**
 * Function to check if the Judge.me global object exists
 */
export function hasJudgeMeGlobal(): boolean {
  return typeof window !== 'undefined' && 'jdgm' in window;
}

/**
 * Safely get the Judge.me global object
 */
export function getJudgeMeGlobal(): JudgeMeGlobal | null {
  if (hasJudgeMeGlobal()) {
    return (window as any).jdgm as JudgeMeGlobal;
  }
  return null;
}

/**
 * Available widget types that can be rendered by Judge.me
 */
export enum JudgeMeWidgetType {
  REVIEW_WIDGET = 'review-widget',
  STAR_RATING = 'star-rating',
  VERIFIED_BADGE = 'verified-badge',
  FEATURED_CAROUSEL = 'featured-carousel',
  REVIEW_CAROUSEL = 'review-carousel',
  ALL_REVIEWS = 'all-reviews',
}

/**
 * Configuration options for a Judge.me widget
 */
export interface JudgeMeWidgetConfig {
  type: JudgeMeWidgetType;
  productId?: string | number;
  productHandle?: string;
  showIfEmpty?: boolean;
  className?: string;
  containerClassName?: string;
  loadingClassName?: string;
}
