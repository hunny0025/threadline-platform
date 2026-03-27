import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export function ProductMiniCard({ product, isSelected, onToggle }) {
  if (!product) return null;

  return (
    <div className="flex flex-col gap-3 min-w-[140px] sm:min-w-[160px] max-w-[180px] snap-start group relative">
      <Link to={`/product/${product.id || 1}`} className="block relative aspect-[3/4] bg-zinc-100 overflow-hidden rounded-md group-hover:shadow-md transition-shadow">
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80'} 
          alt={product.title || 'Product Image'} 
          className="object-cover w-full h-full transition-transform duration-700 ease-in-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Toggle Selection Checkbox/Overlay */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle(product.id);
          }}
          className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm z-10 
            ${isSelected 
              ? 'bg-zinc-900 border-zinc-900 text-white' 
              : 'bg-white/80 backdrop-blur border border-zinc-300 text-transparent hover:bg-white hover:border-zinc-500'}`}
          aria-label={isSelected ? "Remove from bundle" : "Add to bundle"}
        >
          <Check size={14} className={isSelected ? 'opacity-100' : 'opacity-0'} strokeWidth={3} />
        </button>
      </Link>
      <div>
        <Link to={`/product/${product.id || 1}`}>
          <h4 className="text-xs sm:text-sm font-medium text-zinc-900 line-clamp-1 hover:underline">
            {product.title || 'Classic Shirt'}
          </h4>
        </Link>
        <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">${product.price || '89.00'}</p>
      </div>
    </div>
  );
}
