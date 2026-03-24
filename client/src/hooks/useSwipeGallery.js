import { useRef, useEffect, useCallback } from 'react';

/**
 * useSwipeGallery — lightweight horizontal-swipe hook for image galleries.
 *
 * Attaches passive touch listeners on the given ref and fires callbacks
 * when the user swipes left or right beyond the threshold.
 *
 * @param {Object} options
 * @param {React.RefObject} options.ref          — element to listen on
 * @param {Function}        options.onSwipeLeft  — called on left swipe (→ next)
 * @param {Function}        options.onSwipeRight — called on right swipe (→ prev)
 * @param {number}          [options.threshold=50] — minimum px delta to trigger
 */
export function useSwipeGallery({ ref, onSwipeLeft, onSwipeRight, threshold = 50 }) {
  const startX = useRef(0);
  const startY = useRef(0);
  const isSwiping = useRef(false);

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    isSwiping.current = true;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (!isSwiping.current) return;
      isSwiping.current = false;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX.current;
      const deltaY = touch.clientY - startY.current;

      // Only trigger if horizontal movement dominates vertical
      if (Math.abs(deltaX) < threshold || Math.abs(deltaY) > Math.abs(deltaX)) return;

      if (deltaX < 0) {
        onSwipeLeft?.();
      } else {
        onSwipeRight?.();
      }
    },
    [onSwipeLeft, onSwipeRight, threshold],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, handleTouchStart, handleTouchEnd]);
}
