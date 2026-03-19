import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Custom hook for infinite scrolling using IntersectionObserver.
 * 
 * @param {Function} callback - The function to call when the loader becomes visible.
 * @param {boolean} hasMore - Boolean indicating if there are more items to load.
 * @returns {Object} { loaderRef, isIntersecting }
 */
export function useInfiniteScroll(callback, hasMore = true) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef(null);
  
  // The element to observe
  const loaderRef = useCallback(
    (node) => {
      // If there's an existing observer, disconnect it
      if (observerRef.current) observerRef.current.disconnect();

      // If no more items to load, don't observe
      if (!hasMore) return;

      // Create a new IntersectionObserver
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setIsIntersecting(true);
            callback();
          } else {
            setIsIntersecting(false);
          }
        },
        { threshold: 1.0 } // Trigger when 100% of the loader is visible
      );

      // Start observing the provided node
      if (node) {
        observerRef.current.observe(node);
      }
    },
    [callback, hasMore]
  );

  return { loaderRef, isIntersecting };
}
