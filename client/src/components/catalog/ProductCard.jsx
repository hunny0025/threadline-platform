import React, { useState } from 'react';
import { Heart, Eye } from 'lucide-react';

/**
 * Presentation component for a single product.
 */
export function ProductCard({ product, onQuickLook }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) return null;

  return (
    <div className="flex flex-col gap-3 group cursor-pointer relative">
      <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden rounded-md">
        {/* Primary Image */}
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80'} 
          alt={product.title || 'Product Image'} 
          className={`object-cover w-full h-full transition-all duration-700 ease-in-out ${product.secondaryImage ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'}`}
          loading="lazy"
        />
        
        {/* Secondary Image */}
        {product.secondaryImage && (
          <img 
            src={product.secondaryImage} 
            alt={`${product.title || 'Product Image'} Alternate`} 
            className="absolute inset-0 object-cover w-full h-full opacity-0 transition-all duration-700 ease-in-out group-hover:opacity-100 group-hover:scale-105"
            loading="lazy"
          />
        )}
        
        {/* Badges Container */}
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1.5 z-10">
          {product.isNew && (
            <div className="bg-white text-zinc-900 text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:py-1 rounded shadow-sm">
              NEW
            </div>
          )}
          {product.lowStock && (
            <div className="bg-orange-100 text-orange-800 text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:py-1 rounded shadow-sm">
              LOW STOCK
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-2 right-2 p-1.5 sm:p-2 rounded-full bg-white/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white text-zinc-900 z-10 shadow-sm"
          aria-label="Add to wishlist"
        >
          <Heart 
            size={18} 
            className={`transition-colors duration-200 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-zinc-600'}`} 
          />
        </button>

        {/* Hover overlay: Quick Add / Sizes */}
        <div className="absolute bottom-0 left-0 right-0 p-3 pt-12 bg-gradient-to-t from-black/60 to-transparent translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out flex flex-col gap-2 z-10">
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex justify-center gap-1.5 pb-2">
              {product.sizes.map(size => (
                <button 
                  key={size}
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-white/95 backdrop-blur rounded text-[10px] sm:text-xs font-medium text-zinc-800 hover:bg-zinc-900 hover:text-white transition-colors shadow-sm"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    console.log(`Selected size ${size}`);
                  }}
                  aria-label={`Select size ${size}`}
                >
                  {size}
                </button>
               ))}
            </div>
          )}
          {onQuickLook && (
            <button 
              className="w-full bg-white/95 backdrop-blur text-zinc-900 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded shadow hover:bg-zinc-100 transition-colors flex items-center justify-center gap-1.5"
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                onQuickLook(product);
              }}
            >
              <Eye size={15} />
              Quick Look
            </button>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-zinc-900 line-clamp-1">{product.title || 'Classic Oxford Shirt'}</h3>
        <p className="text-sm text-zinc-500 mt-0.5">${product.price || '89.00'}</p>
      </div>
    </div>
  );
}
