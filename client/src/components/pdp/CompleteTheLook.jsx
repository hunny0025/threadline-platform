import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronRight, ChevronLeft } from 'lucide-react';
import { ProductMiniCard } from './ProductMiniCard';

// Mock data generator for recommendations
const SIZE_OPTIONS  = ['XS', 'S', 'M', 'L', 'XL'];
const COLOR_OPTIONS = ['Black', 'White', 'Olive', 'Navy', 'Sand'];

function generateRecommendations(baseId) {
  // Generate a few stable but varied products based on baseId
  const seed = baseId ? baseId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) : 42;
  
  const recommendations = [];
  for (let i = 1; i <= 5; i++) {
    const rSeed = seed + i * 13;
    recommendations.push({
      id: `rec-${rSeed}`,
      title: `Threadline Essential ${['T-Shirt', 'Chino', 'Jacket', 'Sweater', 'Sock'][rSeed % 5]}`,
      price: (Math.abs(rSeed * 7) % 180 + 45).toFixed(2),
      image: [
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
        'https://images.unsplash.com/photo-1515347619362-e6fd0289eb13?w=800&q=80',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
      ][rSeed % 5],
      sizes: ['M', 'L'], // default sizes for mock
      color: COLOR_OPTIONS[rSeed % COLOR_OPTIONS.length],
    });
  }
  return recommendations;
}

export function CompleteTheLook({ productId }) {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [scrollContainer, setScrollContainer] = useState(null);

  useEffect(() => {
    // Simulate API fetch
    const fetchRecs = async () => {
      // simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = generateRecommendations(productId);
      setRecommendations(data);
      // default select all
      setSelectedIds(new Set(data.map(item => item.id)));
    };
    fetchRecs();
  }, [productId]);

  const toggleSelection = (id) => {
    setSelectedIds(prev => {
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
    const selectedProducts = recommendations.filter(p => selectedIds.has(p.id));
    console.log("🛒 Added multiple items to cart:", selectedProducts.map(p => p.title));
    // Here you would typically dispatch to a global cart store Context/Redux
  };

  const scrollLeft = () => {
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (recommendations.length === 0) {
    return null; // or a skeleton loader
  }

  const selectedTotal = recommendations
    .filter(p => selectedIds.has(p.id))
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
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar { display: none; }
        `}} />
        
        {recommendations.map(product => (
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
            Total: <span className="text-zinc-900 font-medium">${selectedTotal.toFixed(2)}</span>
          </p>
        </div>
        
        <button
          onClick={handleAddSelectedToCart}
          disabled={selectedIds.size === 0}
          className={`
            w-full sm:w-auto px-6 py-3 rounded-xl font-medium tracking-wide transition-all duration-200 flex items-center justify-center gap-2
            ${selectedIds.size > 0 
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
