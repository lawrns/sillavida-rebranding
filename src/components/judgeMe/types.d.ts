/**
 * Type definitions for Judge.me global objects
 */

interface JudgeMeGlobal {
  initialized: boolean;
  widgetIds: string[];
  getReviews: (options: any) => Promise<any>;
  renderWidget: (selector: string | Element | null) => void;
  renderBadges: () => void;
  getProductReviewCount: (productId: string | number) => Promise<number>;
  getAverageRating: (productId: string | number) => Promise<number>;
  [key: string]: any;
}

// Extend the Window interface to include the Judge.me global object
declare global {
  interface Window {
    jdgm: JudgeMeGlobal;
  }
}
