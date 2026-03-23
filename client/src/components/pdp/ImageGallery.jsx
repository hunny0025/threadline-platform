import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * PDP image gallery — large hero image with a horizontal thumbnail strip.
 *
 * @param {{ images: string[] }} props
 */
export function ImageGallery({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Fallback gallery
  const gallery = images.length > 0
    ? images
    : [
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
        'https://images.unsplash.com/photo-1515347619362-e6fd0289eb13?w=800&q=80',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      ];

  return (
    <div className="flex flex-col gap-3">
      {/* ── Hero Image ──────────────────────────────────────── */}
      <div className="relative aspect-[3/4] bg-zinc-100 rounded-xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={gallery[activeIndex]}
            alt={`Product view ${activeIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.43, 0.13, 0.23, 0.96] }}
            draggable={false}
          />
        </AnimatePresence>

        {/* Image counter pill */}
        <span className="absolute bottom-3 right-3 bg-black/50 backdrop-blur text-white text-xs font-medium px-2.5 py-1 rounded-full">
          {activeIndex + 1} / {gallery.length}
        </span>
      </div>

      {/* ── Thumbnail Strip ─────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {gallery.map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`
              relative flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden
              transition-all duration-200 ring-offset-2
              ${activeIndex === i
                ? 'ring-2 ring-violet-500 opacity-100'
                : 'ring-1 ring-zinc-200 opacity-60 hover:opacity-90'
              }
            `}
            aria-label={`View image ${i + 1}`}
            aria-pressed={activeIndex === i}
          >
            <img
              src={src}
              alt={`Thumbnail ${i + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              draggable={false}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
