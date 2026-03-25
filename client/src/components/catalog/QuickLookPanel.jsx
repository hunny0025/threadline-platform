import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag } from 'lucide-react';
import { SizeGuideModal } from './SizeGuideModal';

const COLOR_HEX_MAP = {
  Black: '#18181b',
  White: '#fafafa',
  Olive: '#6b7c3e',
  Navy: '#1e3a5f',
  Sand: '#c2b280',
};

/**
 * Quick-Look slide-in panel — slides from the right edge.
 * Shows product details, size/color selectors, and Add-to-Cart.
 */
export function QuickLookPanel({ product, isOpen, onClose }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Reset selections when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(null);
      setSelectedColor(product.color || null);
    }
  }, [product]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    console.log(`🛒 Added to cart: ${product.title} — Size: ${selectedSize}, Color: ${selectedColor}`);
  };

  return (
    <AnimatePresence>
      {isOpen && product && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide-in Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative z-10 w-full max-w-md h-full bg-white shadow-2xl flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Quick look"
          >
            {/* ── Header ─────────────────────────────────── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 shrink-0">
              <h2 className="text-base font-semibold text-zinc-900 tracking-tight font-display truncate pr-4">
                {product.title}
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-zinc-100 text-zinc-500 transition-colors shrink-0"
                aria-label="Close quick look"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            {/* ── Scrollable Content ─────────────────────── */}
            <div className="flex-1 overflow-y-auto">
              {/* Product Image */}
              <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden">
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.isNew && (
                    <span className="bg-white text-zinc-900 text-xs font-semibold px-2.5 py-1 rounded shadow-sm">
                      NEW
                    </span>
                  )}
                  {product.lowStock && (
                    <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-1 rounded shadow-sm">
                      LOW STOCK
                    </span>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="px-5 py-5 space-y-5">
                {/* Price */}
                <p className="text-xl font-semibold text-zinc-900 font-display">
                  ${product.price}
                </p>

                {/* ── Size Selector ──────────────────────── */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        Size
                      </p>
                      <button
                        className="text-xs text-violet-600 font-medium hover:underline"
                        onClick={() => setIsSizeGuideOpen(true)}
                      >
                        Size Guide
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => {
                        const isActive = selectedSize === size;
                        return (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`
                              min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium
                              transition-all duration-200 border
                              ${isActive
                                ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                                : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-900 hover:text-zinc-900'
                              }
                            `}
                            aria-pressed={isActive}
                            aria-label={`Size ${size}`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Color Selector ─────────────────────── */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2.5">
                      Color — <span className="normal-case font-medium text-zinc-700">{selectedColor}</span>
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {product.colors.map((color) => {
                        const hex = COLOR_HEX_MAP[color] || '#a1a1aa';
                        const isActive = selectedColor === color;
                        const isLight = color === 'White' || color === 'Sand';
                        return (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`
                              w-9 h-9 rounded-full transition-all duration-200
                              ${isLight ? 'border border-zinc-300' : ''}
                              ${isActive
                                ? 'ring-2 ring-offset-2 ring-zinc-900 scale-110'
                                : 'hover:scale-110'
                              }
                            `}
                            style={{ backgroundColor: hex }}
                            aria-pressed={isActive}
                            aria-label={`Color ${color}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Product Meta ────────────────────────── */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {product.fabric && (
                    <div className="text-sm">
                      <span className="text-zinc-400 block text-xs uppercase tracking-wider mb-0.5">Fabric</span>
                      <span className="text-zinc-800 font-medium">{product.fabric}</span>
                    </div>
                  )}
                  {product.fit && (
                    <div className="text-sm">
                      <span className="text-zinc-400 block text-xs uppercase tracking-wider mb-0.5">Fit</span>
                      <span className="text-zinc-800 font-medium">{product.fit}</span>
                    </div>
                  )}
                  {product.occasion && (
                    <div className="text-sm">
                      <span className="text-zinc-400 block text-xs uppercase tracking-wider mb-0.5">Occasion</span>
                      <span className="text-zinc-800 font-medium">{product.occasion}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Sticky Footer: Add to Cart ─────────────── */}
            <div className="shrink-0 border-t border-zinc-100 p-5 bg-white">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`
                  w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                  text-sm font-semibold transition-all duration-200
                  ${selectedSize
                    ? 'bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98] shadow-md'
                    : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  }
                `}
              >
                <ShoppingBag size={18} />
                {selectedSize ? 'Add to Cart' : 'Select a Size'}
              </button>

              {/* Size Guide Modal */}
              <SizeGuideModal
                isOpen={isSizeGuideOpen}
                onClose={() => setIsSizeGuideOpen(false)}
                onSelectSize={(size) => setSelectedSize(size)}
              />
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
