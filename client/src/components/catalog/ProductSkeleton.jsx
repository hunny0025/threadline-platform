import React from 'react';

/**
 * Skeleton loader component for a single product card.
 */
export function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-3 group animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[3/4] bg-zinc-200 dark:bg-zinc-800 rounded-md overflow-hidden">
        {/* Shimmer effect inside */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] animate-[shimmer_1.5s_infinite]"></div>
      </div>
      
      {/* Text Skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
      </div>
    </div>
  );
}
