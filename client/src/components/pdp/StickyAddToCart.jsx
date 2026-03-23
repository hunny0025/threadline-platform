import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag } from 'lucide-react';

/**
 * Sticky mobile add-to-cart bar — slides up when the main CTA
 * scrolls out of the viewport.
 *
 * @param {{ product: Object, isVisible: boolean }} props
 */
export function StickyAddToCart({ product, isVisible }) {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
        >
          <div className="bg-white/90 backdrop-blur-md border-t border-zinc-200 shadow-lg px-4 py-3">
            <div className="flex items-center gap-3 max-w-lg mx-auto">
              {/* Product summary */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 truncate">
                  {product.title}
                </p>
                <p className="text-sm font-semibold text-zinc-600">
                  ${product.price}
                </p>
              </div>

              {/* CTA */}
              <button
                className="flex-shrink-0 flex items-center gap-2 bg-zinc-900 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 active:scale-[0.97] transition-all duration-200 shadow-md"
              >
                <ShoppingBag size={16} />
                Add to Cart
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
