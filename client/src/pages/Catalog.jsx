import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductGrid } from "../components/catalog/ProductGrid";
import { ProductCard } from "../components/catalog/ProductCard";
import { ProductSkeleton } from "../components/catalog/ProductSkeleton";
import { QuickLookPanel } from "../components/catalog/QuickLookPanel";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

const FILTER_OPTIONS = {
  size: ["XS", "S", "M", "L", "XL"],
  color: ["Black", "White", "Olive", "Navy", "Sand"],
  fabric: ["Cotton", "Linen", "Denim", "Wool", "Jersey"],
  fit: ["Slim", "Regular", "Relaxed", "Oversized"],
  occasion: ["Everyday", "Work", "Weekend", "Evening", "Travel"],
};

const FILTER_TITLES = {
  size: "Size",
  color: "Color",
  fabric: "Fabric",
  fit: "Fit",
  occasion: "Occasion",
};

const FILTER_KEYS = Object.keys(FILTER_OPTIONS);

const buildInitialFilters = () =>
  FILTER_KEYS.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

const normalizeFilterValues = (key, values = []) => {
  const allowed = new Set(FILTER_OPTIONS[key]);
  return [...new Set(values.filter((value) => allowed.has(value)))];
};

const filtersToSearchParams = (filters) => {
  const params = new URLSearchParams();

  FILTER_KEYS.forEach((key) => {
    filters[key].forEach((value) => {
      params.append(key, value);
    });
  });

  return params;
};

const parseFiltersFromSearchParams = (searchParams) => {
  return FILTER_KEYS.reduce((acc, key) => {
    const rawValues = searchParams.getAll(key);
    const expandedValues =
      rawValues.length === 1 && rawValues[0].includes(",")
        ? rawValues[0].split(",")
        : rawValues;

    acc[key] = normalizeFilterValues(
      key,
      expandedValues.map((value) => value.trim()).filter(Boolean),
    );
    return acc;
  }, buildInitialFilters());
};

const areFiltersEqual = (a, b) => {
  return FILTER_KEYS.every((key) => {
    if (a[key].length !== b[key].length) {
      return false;
    }

    return a[key].every((value) => b[key].includes(value));
  });
};

const getProductAttributes = (page, index) => {
  const seed = (page - 1) * 12 + index;
  const sizes = FILTER_OPTIONS.size.filter((_, i) => (seed + i) % 2 === 0);
  // Pick 2-3 colors for this product
  const colorStart = seed % FILTER_OPTIONS.color.length;
  const colors = [
    FILTER_OPTIONS.color[colorStart],
    FILTER_OPTIONS.color[(colorStart + 1) % FILTER_OPTIONS.color.length],
    ...(seed % 3 === 0 ? [FILTER_OPTIONS.color[(colorStart + 2) % FILTER_OPTIONS.color.length]] : []),
  ];

  return {
    color: FILTER_OPTIONS.color[seed % FILTER_OPTIONS.color.length],
    colors,
    fabric: FILTER_OPTIONS.fabric[seed % FILTER_OPTIONS.fabric.length],
    fit: FILTER_OPTIONS.fit[seed % FILTER_OPTIONS.fit.length],
    occasion: FILTER_OPTIONS.occasion[seed % FILTER_OPTIONS.occasion.length],
    sizes: sizes.length > 0 ? sizes : ["M"],
  };
};

function FilterSection({ title, isOpen, onToggle, children }) {
  return (
    <section className="border-b border-zinc-200 py-4">
      <button
        type="button"
        onClick={onToggle}
        className="group w-full flex items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-zinc-900 tracking-wide uppercase">
          {title}
        </span>
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-zinc-500 text-lg leading-none transition-all duration-200 group-hover:bg-zinc-100 group-hover:text-zinc-900 group-hover:scale-110">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && <div className="mt-4 flex flex-wrap gap-2">{children}</div>}
    </section>
  );
}

// Simulate an API call to fetch products
const fetchProducts = async (page, numItems = 12) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const items = Array.from({ length: numItems }).map((_, i) => ({
        ...getProductAttributes(page, i),
        id: `prod-${page}-${i}`,
        title: `Threadline Product ${page}-${i + 1}`,
        price: (Math.random() * 100 + 20).toFixed(2),
        image: `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80`,
        secondaryImage:
          i % 2 !== 0
            ? `https://images.unsplash.com/photo-1515347619362-e6fd0289eb13?w=800&q=80`
            : null,
        isNew: i % 4 === 0,
        lowStock: i % 5 === 0,
      }));
      resolve(items);
    }, 1500); // 1.5s delay to show loading skeletons
  });
};

function CatalogGridContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState(() =>
    parseFiltersFromSearchParams(searchParams),
  );
  const [openSections, setOpenSections] = useState(() =>
    FILTER_KEYS.reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}),
  );
  const [quickLookProduct, setQuickLookProduct] = useState(null);

  useEffect(() => {
    const parsedFilters = parseFiltersFromSearchParams(searchParams);
    setSelectedFilters((prev) =>
      areFiltersEqual(prev, parsedFilters) ? prev : parsedFilters,
    );
  }, [searchParams]);

  useEffect(() => {
    const nextParams = filtersToSearchParams(selectedFilters);
    const nextQuery = nextParams.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery !== currentQuery) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [selectedFilters, searchParams, setSearchParams]);

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

  const hasActiveFilters = useMemo(
    () => FILTER_KEYS.some((key) => selectedFilters[key].length > 0),
    [selectedFilters],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      return FILTER_KEYS.every((key) => {
        const selectedValues = selectedFilters[key];
        if (selectedValues.length === 0) {
          return true;
        }

        if (key === "size") {
          return selectedValues.some((size) => product.sizes?.includes(size));
        }

        return selectedValues.includes(product[key]);
      });
    });
  }, [products, selectedFilters]);

  const toggleFilter = (key, value) => {
    setSelectedFilters((prev) => {
      const hasValue = prev[key].includes(value);
      const nextValues = hasValue
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value];

      return {
        ...prev,
        [key]: nextValues,
      };
    });
  };

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters(buildInitialFilters());
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 xl:gap-12">
      <aside className="lg:sticky lg:top-24 h-fit border border-zinc-200 rounded-xl p-5 bg-white">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
          <h2 className="text-base font-semibold text-zinc-900 tracking-wide uppercase">
            Filters
          </h2>
          <button
            type="button"
            onClick={clearAllFilters}
            disabled={!hasActiveFilters}
            className="text-xs font-semibold text-red-600 transition-colors duration-200 hover:text-red-700 disabled:text-zinc-400 disabled:cursor-not-allowed"
          >
            Clear all
          </button>
        </div>

        <div className="mt-2">
          {FILTER_KEYS.map((key) => (
            <FilterSection
              key={key}
              title={FILTER_TITLES[key]}
              isOpen={openSections[key]}
              onToggle={() => toggleSection(key)}
            >
              {FILTER_OPTIONS[key].map((value) => {
                const isSelected = selectedFilters[key].includes(value);

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleFilter(key, value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      isSelected
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-500"
                    }`}
                    aria-pressed={isSelected}
                  >
                    {value}
                  </button>
                );
              })}
            </FilterSection>
          ))}
        </div>
      </aside>

      <div className="flex flex-col gap-8">
        {hasActiveFilters && (
          <p className="text-sm text-zinc-600">
            Showing {filteredProducts.length} result
            {filteredProducts.length === 1 ? "" : "s"} based on your filters.
          </p>
        )}

        <ProductGrid>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onQuickLook={setQuickLookProduct} />
          ))}

          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={`skeleton-${i}`} />
            ))}
        </ProductGrid>

        {!loading && filteredProducts.length === 0 && (
          <div className="border border-dashed border-zinc-300 rounded-xl p-8 text-center text-zinc-600">
            No products match the selected filters. Try removing one or two
            filters.
          </div>
        )}

        <div
          ref={loaderRef}
          className="h-10 w-full flex items-center justify-center text-zinc-500"
        >
          {loading
            ? "Loading more items..."
            : hasMore
              ? "Scroll down for more"
              : "You have reached the end."}
        </div>
      </div>

      {/* Quick Look Panel */}
      <QuickLookPanel
        product={quickLookProduct}
        isOpen={!!quickLookProduct}
        onClose={() => setQuickLookProduct(null)}
      />
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
          Explore our latest drops and essential pieces. Ethically sourced and
          minimally designed for the modern wardrobe.
        </p>
      </div>

      {/* Suspense Boundary wrapping the Product Grid */}
      <Suspense
        fallback={
          <div className="flex flex-col gap-8">
            <ProductGrid>
              {Array.from({ length: 12 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </ProductGrid>
          </div>
        }
      >
        <CatalogGridContent />
      </Suspense>
    </div>
  );
}
