import React from 'react';

/**
 * A responsive grid component that supports 2 columns on mobile, 3 on tablet, and 4 on desktop.
 */
export function ProductGrid({ children }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
      {children}
    </div>
  );
}
