import React, { useState, forwardRef } from 'react';
import { ShoppingBag, Heart, Share2, Truck, RotateCcw } from 'lucide-react';
import { SizeGuideModal } from '../catalog/SizeGuideModal';

const COLOR_HEX_MAP = {
  Black: '#18181b',
  White: '#fafafa',
  Olive: '#6b7c3e',
  Navy: '#1e3a5f',
  Sand: '#c2b280',
};

/**
 * PDP product info panel — title, price, selectors, metadata, and CTA.
 * The CTA button ref is forwarded so the parent can observe its visibility
 * to toggle the sticky mobile bar.
 */
export const ProductInfo = forwardRef(function ProductInfo({ product }, ctaRef) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(product?.color || null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    console.log(`🛒 Added to cart: ${product.title} — Size: ${selectedSize}, Color: ${selectedColor}`);
  };

  return (
    <div className="flex flex-col gap-6 py-2 lg:py-4">
      {/* ── Title & Price ───────────────────────────────────── */}
      <div>
        {product.isNew && (
          <span className="inline-block mb-2 bg-violet-100 text-violet-700 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            New Arrival
          </span>
        )}
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight leading-tight">
          {product.title}
        </h1>
        <p className="mt-2 text-xl sm:text-2xl font-semibold text-zinc-900 font-display">
          ${product.price}
        </p>
      </div>

      {/* ── Description ─────────────────────────────────────── */}
      <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-lg">
        Crafted with premium {product.fabric?.toLowerCase() || 'cotton'} for an effortlessly modern look.
        Designed for {product.occasion?.toLowerCase() || 'everyday'} wear with a {product.fit?.toLowerCase() || 'regular'} fit
        that flatters every silhouette.
      </p>

      {/* ── Color Selector ──────────────────────────────────── */}
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

      {/* ── Size Selector ───────────────────────────────────── */}
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
                    min-w-[44px] h-11 px-4 rounded-lg text-sm font-medium
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

      {/* ── CTA: Add to Cart ────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2" ref={ctaRef}>
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize}
          className={`
            flex-1 flex items-center justify-center gap-2 py-3.5 sm:py-4 rounded-xl
            text-sm sm:text-base font-semibold transition-all duration-200
            ${selectedSize
              ? 'bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98] shadow-md'
              : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
            }
          `}
        >
          <ShoppingBag size={18} />
          {selectedSize ? 'Add to Cart' : 'Select a Size'}
        </button>

        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`
            h-12 w-12 sm:h-auto sm:w-auto sm:px-4 flex items-center justify-center rounded-xl border transition-all duration-200
            ${isWishlisted
              ? 'bg-red-50 border-red-200 text-red-500'
              : 'bg-white border-zinc-300 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900'
            }
          `}
          aria-label="Add to wishlist"
          aria-pressed={isWishlisted}
        >
          <Heart size={18} className={isWishlisted ? 'fill-red-500' : ''} />
        </button>

        <button
          className="hidden sm:flex h-12 w-12 sm:h-auto sm:w-auto sm:px-4 items-center justify-center rounded-xl border border-zinc-300 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 transition-all duration-200"
          aria-label="Share product"
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* ── Product Meta ────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-200">
        {product.fabric && (
          <div className="text-sm py-2">
            <span className="text-zinc-400 block text-xs uppercase tracking-wider mb-0.5">Fabric</span>
            <span className="text-zinc-800 font-medium">{product.fabric}</span>
          </div>
        )}
        {product.fit && (
          <div className="text-sm py-2">
            <span className="text-zinc-400 block text-xs uppercase tracking-wider mb-0.5">Fit</span>
            <span className="text-zinc-800 font-medium">{product.fit}</span>
          </div>
        )}
        {product.occasion && (
          <div className="text-sm py-2">
            <span className="text-zinc-400 block text-xs uppercase tracking-wider mb-0.5">Occasion</span>
            <span className="text-zinc-800 font-medium">{product.occasion}</span>
          </div>
        )}
        {product.color && (
          <div className="text-sm py-2">
            <span className="text-zinc-400 block text-xs uppercase tracking-wider mb-0.5">Color</span>
            <span className="text-zinc-800 font-medium">{product.color}</span>
          </div>
        )}
      </div>

      {/* ── Trust Badges ────────────────────────────────────── */}
      <div className="flex flex-col gap-3 pt-2 border-t border-zinc-200">
        <div className="flex items-center gap-3 text-sm text-zinc-600">
          <Truck size={16} className="text-zinc-400 flex-shrink-0" />
          <span>Free shipping on orders over $100</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-zinc-600">
          <RotateCcw size={16} className="text-zinc-400 flex-shrink-0" />
          <span>30-day hassle-free returns</span>
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        onSelectSize={(size) => setSelectedSize(size)}
      />
    </div>
  );
});
