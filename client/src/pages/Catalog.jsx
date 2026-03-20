import React, { useState, useEffect, Suspense } from 'react';
import { ProductGrid } from '../components/catalog/ProductGrid';
import { ProductCard } from '../components/catalog/ProductCard';
import { ProductSkeleton } from '../components/catalog/ProductSkeleton';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

// Simulate an API call to fetch products
const fetchProducts = async (page, numItems = 12) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const items = Array.from({ length: numItems }).map((_, i) => ({
        id: `prod-${page}-${i}`,
        title: `Threadline Product ${page}-${i + 1}`,
        price: (Math.random() * 100 + 20).toFixed(2),
        image: `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80`,
        secondaryImage: i % 2 !== 0 ? `https://images.unsplash.com/photo-1515347619362-e6fd0289eb13?w=800&q=80` : null,
        isNew: i % 4 === 0,
        lowStock: i % 5 === 0,
        sizes: i % 3 !== 0 ? ['XS', 'S', 'M', 'L', 'XL'] : []
      }));
      resolve(items);
    }, 1500); // 1.5s delay to show loading skeletons
  });
};

function CatalogGridContent() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  // Initial fetch
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      const initialProducts = await fetchProducts(1);
      setProducts(initialProducts);
      setLoading(false);
    };
    loadInitial();
  }, []);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const newPage = page + 1;
    const newProducts = await fetchProducts(newPage);
    
    // Stop after 3 pages for demo
    if (newPage >= 4) {
      setHasMore(false);
    }
    
    setProducts((prev) => [...prev, ...newProducts]);
    setPage(newPage);
    setLoading(false);
  };

  const { loaderRef } = useInfiniteScroll(loadMore, hasMore);

  return (
    <div className="flex flex-col gap-8">
      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {/* Render skeletons while loading */}
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <ProductSkeleton key={`skeleton-${i}`} />
          ))}
      </ProductGrid>
      
      {/* Infinite Scroll trigger target */}
      <div 
        ref={loaderRef} 
        className="h-10 w-full flex items-center justify-center text-zinc-500"
      >
        {loading ? 'Loading more items...' : (hasMore ? 'Scroll down for more' : 'You have reached the end.')}
      </div>
    </div>
  );
}

export function Catalog() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-display font-semibold text-zinc-900 tracking-tight">
          Catalog
        </h1>
        <p className="mt-4 text-zinc-600 max-w-2xl font-body">
          Explore our latest drops and essential pieces. Ethically sourced and minimally designed for the modern wardrobe.
        </p>
      </div>

      {/* Suspense Boundary wrapping the Product Grid */}
      <Suspense fallback={
        <div className="flex flex-col gap-8">
          <ProductGrid>
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </ProductGrid>
        </div>
      }>
        <CatalogGridContent />
      </Suspense>
    </div>
  );
}
