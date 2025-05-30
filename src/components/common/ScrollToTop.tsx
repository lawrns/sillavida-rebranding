import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * Automatically scrolls to the top of the page when the route changes.
 * This provides a better user experience by ensuring users see the 
 * beginning of new pages rather than staying at their previous scroll position.
 * 
 * Only triggers on pathname changes, not search parameter changes (like pagination).
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes (not query parameters)
    // This allows pagination and other search parameter changes to maintain scroll position
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Smooth scroll animation
    });
  }, [pathname]);

  // This component doesn't render anything
  return null;
};

export default ScrollToTop;