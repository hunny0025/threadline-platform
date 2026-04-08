import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronRight, ChevronLeft } from 'lucide-react';
import { ProductMiniCard } from './ProductMiniCard';
import { useRecommendations } from '../../hooks/useProducts';

/**
 * Map API recommendation data into the shape ProductMiniCard expects.
 */
function mapRecommendation(item) {
  return {
    id: item._id || item.id,
    title: item.name || 'Product',
    price: item.basePrice?.toFixed(2) ?? '0.00',
    image:
      item.images?.[0] ||
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
    sizes: ['M', 'L'],
    color: null,
  };
}

export function CompleteTheLook({ productId }) {
  // Fetch recommendations from API
  const { recommendations: apiRecs, isLoading, isError } = useRecommendations(productId);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [scrollContainer, setScrollContainer] = useState(null);

  // Map API data
  const recommendations = apiRecs.map(mapRecommendation);

  // Default-select all when data arrives
  useEffect(() => {
    if (recommendations.length > 0) {
      setSelectedIds(new Set(recommendations.map((item) => item.id)));
    }
  }, [apiRecs]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSelection = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAddSelectedToCart = () => {
    if (selectedIds.size === 0) return;
    const selected = recommendations.filter((p) => selectedIds.has(p.id));
    console.log(
      '🛒 Added multiple items to cart:',
      selected.map((p) => p.title),
    );
  };

  const scrollLeft = () =>
    scrollContainer?.scrollBy({ left: -300, behavior: 'smooth' });

  const scrollRight = () =>
    scrollContainer?.scrollBy({ left: 300, behavior: 'smooth' });

  // ── Loading state ─────────────────────────────────────────
  if (isLoading) {
    return (
      <section className="mt-12 lg:mt-20 border-t border-zinc-200 pt-8 lg:pt-12">
        <div className="mb-6">
          <div className="h-7 w-52 bg-zinc-100 rounded animate-pulse mb-2" />
          <div className="h-4 w-80 bg-zinc-50 rounded animate-pulse" />
        </div>
        <div className="flex gap-4 sm:gap-6 overflow-hidden pb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[170px] sm:w-[200px] aspect-[3/4] bg-zinc-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  // Don't render if there are no recommendations or there was an error
  if (isError || recommendations.length === 0) {
    return null;
  }

  const selectedTotal = recommendations
    .filter((p) => selectedIds.has(p.id))
    .reduce((sum, p) => sum + parseFloat(p.price), 0);

  return (
    <section className="mt-12 lg:mt-20 border-t border-zinc-200 pt-8 lg:pt-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Complete the Look
          </h2>
          <p className="text-zinc-500 mt-1 max-w-xl">
            Style it with these hand-picked recommendations to elevate your outfit.
          </p>
        </div>

        {/* Desktop Navigation Arrows */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={scrollLeft}
            className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={scrollRight}
            className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Strip */}
      <div
        ref={setScrollContainer}
        className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 px-1 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `.hide-scrollbar::-webkit-scrollbar { display: none; }`,
          }}
        />

        {recommendations.map((product) => (
          <ProductMiniCard
            key={product.id}
            product={product}
            isSelected={selectedIds.has(product.id)}
            onToggle={toggleSelection}
          />
        ))}
      </div>

      {/* Action Area */}
      <div className="bg-zinc-50 rounded-xl p-4 sm:p-5 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 border border-zinc-100 shadow-sm">
        <div className="text-center sm:text-left w-full sm:w-auto">
          <p className="text-zinc-900 font-medium">
            {selectedIds.size} {selectedIds.size === 1 ? 'item' : 'items'} selected
          </p>
          <p className="text-zinc-500 text-sm mt-0.5">
            Total:{' '}
            <span className="text-zinc-900 font-medium">
              ${selectedTotal.toFixed(2)}
            </span>
          </p>
        </div>

        <button
          onClick={handleAddSelectedToCart}
          disabled={selectedIds.size === 0}
          className={`
            w-full sm:w-auto px-6 py-3 rounded-xl font-medium tracking-wide transition-all duration-200 flex items-center justify-center gap-2
            ${
              selectedIds.size > 0
                ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-md enabled:active:scale-[0.98]'
                : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
            }
          `}
        >
          <ShoppingBag size={18} />
          Add {selectedIds.size === recommendations.length ? 'All ' : ''}to Cart
        </button>
      </div>
    </section>
  );
}
