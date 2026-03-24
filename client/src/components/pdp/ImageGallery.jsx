import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useSwipeGallery } from '../../hooks/useSwipeGallery';
import './ImageGallery.css';

/* ── Cubic-bezier easings (design system) ───────────────────── */
const EASE_DEFAULT = [0.4, 0, 0.2, 1];
const EASE_OUT     = [0, 0, 0.2, 1];

/* ── Fallback gallery images ────────────────────────────────── */
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
  'https://images.unsplash.com/photo-1515347619362-e6fd0289eb13?w=800&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
  'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
];

/**
 * PDP Macro Zoom Image Gallery
 *
 * Features:
 *  - HD zoom-on-hover (desktop) via react-zoom-pan-pinch
 *  - Pinch-to-zoom (mobile)
 *  - Thumbnail filmstrip (desktop)
 *  - Dot indicator (mobile)
 *  - Swipe navigation (mobile)
 *  - Prev / Next arrows (desktop, on hover)
 *
 * @param {{ images: string[] }} props
 */
export function ImageGallery({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const heroRef = useRef(null);
  const filmstripRef = useRef(null);

  const gallery = images.length > 0 ? images : FALLBACK_IMAGES;
  const total = gallery.length;

  /* ── Navigation helpers ───────────────────────────────────── */
  const goTo = useCallback(
    (index) => {
      const next = (index + total) % total;
      setActiveIndex(next);
      setIsZoomed(false);

      // Scroll active thumbnail into view
      if (filmstripRef.current) {
        const thumb = filmstripRef.current.children[next];
        thumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    },
    [total],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  /* ── Mobile swipe ─────────────────────────────────────────── */
  useSwipeGallery({
    ref: heroRef,
    onSwipeLeft: goNext,
    onSwipeRight: goPrev,
  });

  /* ── Zoom handlers ────────────────────────────────────────── */
  const handleZoomChange = useCallback((ref) => {
    setIsZoomed(ref.state.scale > 1.05);
  }, []);

  return (
    <div className="flex flex-col">
      {/* ── Hero Image ──────────────────────────────────────── */}
      <div
        ref={heroRef}
        className={`pdp-gallery__hero ${isZoomed ? 'pdp-gallery__hero--zoomed' : ''}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_DEFAULT }}
            style={{ width: '100%', height: '100%' }}
          >
            <TransformWrapper
              initialScale={1}
              minScale={1}
              maxScale={3}
              centerOnInit
              wheel={{ step: 0.3 }}
              pinch={{ step: 5 }}
              doubleClick={{ mode: 'toggle', step: 2 }}
              onTransformed={handleZoomChange}
              onInit={(ref) => {
                // Reset zoom when image changes
                ref.resetTransform(0);
              }}
            >
              <TransformComponent
                wrapperStyle={{ width: '100%', height: '100%' }}
                contentStyle={{ width: '100%', height: '100%' }}
              >
                <img
                  src={gallery[activeIndex]}
                  alt={`Product view ${activeIndex + 1}`}
                  draggable={false}
                />
              </TransformComponent>
            </TransformWrapper>
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next arrows (desktop only, shown on hover) */}
        {total > 1 && (
          <>
            <button
              className="pdp-gallery__arrow pdp-gallery__arrow--prev"
              onClick={goPrev}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} strokeWidth={2} />
            </button>
            <button
              className="pdp-gallery__arrow pdp-gallery__arrow--next"
              onClick={goNext}
              aria-label="Next image"
            >
              <ChevronRight size={20} strokeWidth={2} />
            </button>
          </>
        )}

        {/* Image counter pill */}
        <span className="pdp-gallery__counter">
          {activeIndex + 1} / {total}
        </span>

        {/* Zoom hint (auto-fades after 3s) */}
        <span className="pdp-gallery__zoom-hint" key={`hint-${activeIndex === 0}`}>
          <ZoomIn size={13} /> Hover to zoom
        </span>
      </div>

      {/* ── Thumbnail Filmstrip (desktop) ───────────────────── */}
      <div className="pdp-gallery__filmstrip" ref={filmstripRef} role="tablist" aria-label="Product images">
        {gallery.map((src, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`pdp-gallery__thumb ${activeIndex === i ? 'pdp-gallery__thumb--active' : ''}`}
            role="tab"
            aria-selected={activeIndex === i}
            aria-label={`View image ${i + 1}`}
          >
            <img src={src} alt={`Thumbnail ${i + 1}`} loading="lazy" draggable={false} />
          </button>
        ))}
      </div>

      {/* ── Dot Indicator (mobile) ──────────────────────────── */}
      <div className="pdp-gallery__dots" role="tablist" aria-label="Image navigation">
        {gallery.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`pdp-gallery__dot ${activeIndex === i ? 'pdp-gallery__dot--active' : ''}`}
            role="tab"
            aria-selected={activeIndex === i}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
