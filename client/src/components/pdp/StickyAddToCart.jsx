import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Check, Loader2 } from 'lucide-react';
import { useCartContext } from '../CartContext';

/**
 * Sticky mobile add-to-cart bar — slides up when the main CTA
 * scrolls out of the viewport.
 *
 * @param {{ product: Object, variants: Array, isVisible: boolean }} props
 */
export function StickyAddToCart({ product, variants = [], isVisible }) {
  const { addItem } = useCartContext();
  const [addState, setAddState] = useState('idle'); // idle | loading | success

  if (!product) return null;

  const handleAdd = async () => {
    // Pick the first available variant as a quick-add fallback
    const variant =
      variants.length > 0
        ? variants[0]
        : null;

    const variantId = variant?._id || variant?.id;

    if (!variantId) {
      console.warn('No variant available for quick-add');
      return;
    }

    try {
      setAddState('loading');
      await addItem(variantId, 1);
      setAddState('success');
      setTimeout(() => setAddState('idle'), 2000);
    } catch (err) {
      console.error('Quick add to cart failed:', err);
      setAddState('idle');
    }
  };

  const buttonLabel = addState === 'loading' ? 'Adding…' : addState === 'success' ? 'Added!' : 'Add to Cart';

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
                onClick={handleAdd}
                disabled={addState === 'loading'}
                aria-label={buttonLabel}
                className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md ${
                  addState === 'success'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.97]'
                }`}
              >
                {addState === 'loading' ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : addState === 'success' ? (
                  <Check size={16} />
                ) : (
                  <ShoppingBag size={16} />
                )}
                {buttonLabel}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
