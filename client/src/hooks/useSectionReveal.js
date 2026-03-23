/* eslint-env browser */
import { useRef, useState, useEffect } from 'react';

/**
 * Custom hook for cubic-Bezier section entrance animations.
 * Uses IntersectionObserver to trigger a one-shot reveal when the
 * element scrolls into the viewport.
 *
 * @param {Object}  options
 * @param {number}  options.threshold  - Visibility ratio to trigger (0–1). Default 0.15
 * @param {string}  options.ease       - CSS transition-timing-function. Default natural cubic-bezier
 * @param {number}  options.duration   - Transition duration in ms. Default 600
 * @param {number}  options.translateY - Starting translateY offset in px. Default 32
 * @param {number}  options.delay      - Transition delay in ms. Default 0
 *
 * @returns {{ ref: React.RefObject, isRevealed: boolean, style: Object }}
 */
export function useSectionReveal({
  threshold = 0.15,
  ease = 'cubic-bezier(0.22, 0.61, 0.36, 1)',
  duration = 600,
  translateY = 32,
  delay = 0,
} = {}) {
  const ref = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(node);
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  const style = {
    opacity: isRevealed ? 1 : 0,
    transform: isRevealed ? 'translateY(0)' : `translateY(${translateY}px)`,
    transition: `opacity ${duration}ms ${ease} ${delay}ms, transform ${duration}ms ${ease} ${delay}ms`,
    willChange: 'opacity, transform',
  };

  return { ref, isRevealed, style };
}
