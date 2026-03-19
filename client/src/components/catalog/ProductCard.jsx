import React from 'react';

/**
 * Presentation component for a single product.
 */
export function ProductCard({ product }) {
  if (!product) return null;

  return (
    <div className="flex flex-col gap-3 group cursor-pointer">
      <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden rounded-md">
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80'} 
          alt={product.title || 'Product Image'} 
          className="object-cover w-full h-full transition-transform duration-slow group-hover:scale-105"
          loading="lazy"
        />
        {product.isNew && (
          <div className="absolute top-2 left-2 bg-white text-zinc-900 text-xs font-semibold px-2 py-1 rounded">
            NEW
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-zinc-900">{product.title || 'Classic Oxford Shirt'}</h3>
        <p className="text-sm text-zinc-500 mt-0.5">${product.price || '89.00'}</p>
      </div>
    </div>
  );
}
