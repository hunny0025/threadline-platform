import React, { useState, useEffect, useMemo, Suspense, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { PackageOpen, Search, SlidersHorizontal } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { ProductGrid } from "../components/catalog/ProductGrid";
import { ProductCard } from "../components/catalog/ProductCard";
import { ProductSkeleton } from "../components/catalog/ProductSkeleton";
import { QuickLookPanel } from "../components/catalog/QuickLookPanel";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { InlineError, EmptyState } from "../components/ui/ErrorBoundary";
import { useProducts, useCategories } from "../hooks/useProducts";

// ── Static filter definitions (kept client-side) ─────────────
const FILTER_OPTIONS = {
  fitType: ["slim", "regular", "oversized"],
  fabricWeight: ["light", "medium", "heavy"],
  gender: ["men", "women", "unisex"],
  occasion: ["casual", "formal", "party", "sports", "ethnic"],
};

const FILTER_TITLES = {
  fitType: "Fit",
  fabricWeight: "Fabric Weight",
  gender: "Gender",
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

const filtersToSearchParams = (filters, category) => {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  FILTER_KEYS.forEach((key) => {
    filters[key].forEach((value) => params.append(key, value));
  });
  return params;
};

const parseFiltersFromSearchParams = (searchParams) =>
  FILTER_KEYS.reduce((acc, key) => {
    const rawValues = searchParams.getAll(key);
    const expandedValues =
      rawValues.length === 1 && rawValues[0].includes(",")
        ? rawValues[0].split(",")
        : rawValues;
    acc[key] = normalizeFilterValues(
      key,
      expandedValues.map((v) => v.trim()).filter(Boolean),
    );
    return acc;
  }, buildInitialFilters());

const areFiltersEqual = (a, b) =>
  FILTER_KEYS.every(
    (key) =>
      a[key].length === b[key].length &&
      a[key].every((v) => b[key].includes(v)),
  );

// ── Sort options ─────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'name_asc',   label: 'Name: A → Z' },
];

// ── Filter sidebar section ──────────────────────────────────
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

// ── Main catalogue content ──────────────────────────────────
function CatalogGridContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState(() =>
    parseFiltersFromSearchParams(searchParams),
  );
  const [activeCategory, setActiveCategory] = useState(
    () => searchParams.get("category") || null,
  );
  const [openSections, setOpenSections] = useState(() => ({
    category: true,
    ...FILTER_KEYS.reduce((acc, k) => ({ ...acc, [k]: true }), {}),
  }));
  const [quickLookProduct, setQuickLookProduct] = useState(null);

  // ── Search state ───────────────────────────────────────
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("search") || "",
  );
  const debouncedSearch = useDebounce(searchInput, 300);

  // ── Price range state ──────────────────────────────────
  const [minPriceInput, setMinPriceInput] = useState(
    () => searchParams.get("minPrice") || "",
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    () => searchParams.get("maxPrice") || "",
  );
  const [minPrice, setMinPrice] = useState(
    () => searchParams.get("minPrice") || "",
  );
  const [maxPrice, setMaxPrice] = useState(
    () => searchParams.get("maxPrice") || "",
  );

  // ── Sort state ─────────────────────────────────────────
  const [sortBy, setSortBy] = useState(
    () => searchParams.get("sort") || "newest",
  );

  // ── Fetch categories from API ──────────────────────────
  const {
    categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  // ── Build API query params ─────────────────────────────
  const apiParams = useMemo(() => {
    const params = { page, limit: 12 };
    if (activeCategory) params.category = activeCategory;
    // Only send the first selected value for each single-value filter
    FILTER_KEYS.forEach((key) => {
      if (selectedFilters[key].length > 0) {
        params[key] = selectedFilters[key][0];
      }
    });
    // Text search
    if (debouncedSearch && debouncedSearch.trim().length >= 2) {
      params.search = debouncedSearch.trim();
    }
    // Price range
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    // Sort
    if (sortBy && sortBy !== 'newest') params.sort = sortBy;
    return params;
  }, [page, activeCategory, selectedFilters, debouncedSearch, minPrice, maxPrice, sortBy]);

  // ── Fetch products via SWR ─────────────────────────────
  const {
    products,
    pagination,
    isLoading,
    isError,
    error,
    mutate,
  } = useProducts(apiParams);

  // ── Sync URL ↔ local state ─────────────────────────────
  useEffect(() => {
    const parsedFilters = parseFiltersFromSearchParams(searchParams);
    setSelectedFilters((prev) =>
      areFiltersEqual(prev, parsedFilters) ? prev : parsedFilters,
    );
    const urlCat = searchParams.get("category") || null;
    setActiveCategory((prev) => (prev === urlCat ? prev : urlCat));

    const urlSearch = searchParams.get("search") || "";
    setSearchInput((prev) => (prev === urlSearch ? prev : urlSearch));

    const urlMin = searchParams.get("minPrice") || "";
    const urlMax = searchParams.get("maxPrice") || "";
    setMinPrice((prev) => (prev === urlMin ? prev : urlMin));
    setMaxPrice((prev) => (prev === urlMax ? prev : urlMax));
    setMinPriceInput((prev) => (prev === urlMin ? prev : urlMin));
    setMaxPriceInput((prev) => (prev === urlMax ? prev : urlMax));

    const urlSort = searchParams.get("sort") || "newest";
    setSortBy((prev) => (prev === urlSort ? prev : urlSort));
  }, [searchParams]);

  useEffect(() => {
    const nextParams = filtersToSearchParams(selectedFilters, activeCategory);
    if (debouncedSearch && debouncedSearch.trim().length >= 2)
      nextParams.set("search", debouncedSearch.trim());
    if (minPrice) nextParams.set("minPrice", minPrice);
    if (maxPrice) nextParams.set("maxPrice", maxPrice);
    if (sortBy && sortBy !== "newest") nextParams.set("sort", sortBy);
    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [selectedFilters, activeCategory, debouncedSearch, minPrice, maxPrice, sortBy, searchParams, setSearchParams]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedFilters, activeCategory, debouncedSearch, minPrice, maxPrice, sortBy]);

  // ── Filter helpers ─────────────────────────────────────
  const hasActiveFilters = useMemo(
    () =>
      FILTER_KEYS.some((key) => selectedFilters[key].length > 0) ||
      activeCategory !== null ||
      (debouncedSearch && debouncedSearch.trim().length >= 2) ||
      !!minPrice ||
      !!maxPrice,
    [selectedFilters, activeCategory, debouncedSearch, minPrice, maxPrice],
  );

  const toggleFilter = (key, value) => {
    setSelectedFilters((prev) => {
      const has = prev[key].includes(value);
      return {
        ...prev,
        [key]: has
          ? prev[key].filter((v) => v !== value)
          : [...prev[key], value],
      };
    });
  };

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const clearAllFilters = () => {
    setSelectedFilters(buildInitialFilters());
    setActiveCategory(null);
    setSearchInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
  };

  const handleCategoryChange = (id) =>
    setActiveCategory((prev) => (prev === id ? null : id));

  // Find active category label
  const activeCategoryLabel = useMemo(() => {
    const found = categories.find((c) => c._id === activeCategory);
    return found?.name || null;
  }, [activeCategory, categories]);

  const breadcrumbItems = useMemo(() => {
    const items = [{ label: "Catalog", href: "/catalog" }];
    if (activeCategoryLabel) items.push({ label: activeCategoryLabel });
    return items;
  }, [activeCategoryLabel]);

  const hasMore = pagination
    ? pagination.page < pagination.totalPages
    : false;

  // ── Map API product fields → card props ────────────────
  const mappedProducts = useMemo(
    () =>
      products.map((p) => ({
        id: p._id || p.id,
        title: p.name,
        price: p.basePrice?.toFixed(2) ?? "0.00",
        image:
          p.images?.[0] ||
          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
        secondaryImage: p.images?.[1] || null,
        isNew:
          p.createdAt &&
          Date.now() - new Date(p.createdAt).getTime() < 7 * 86400000,
        lowStock: false,
        sizes: p.variants
          ? [...new Set(p.variants.map((v) => v.size))].filter(Boolean)
          : [],
        color: p.variants?.[0]?.color || null,
        colors: p.variants
          ? [...new Set(p.variants.map((v) => v.color))].filter(Boolean)
          : [],
        fabric: p.fabricWeight,
        fit: p.fitType,
        occasion: p.occasion,
      })),
    [products],
  );

  return (
    <>
      <Breadcrumb items={breadcrumbItems} className="mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 xl:gap-12">
        {/* ── Sidebar ───────────────────────────────────────── */}
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
            {/* Category filter (from API) */}
            <FilterSection
              title="Category"
              isOpen={openSections.category !== false}
              onToggle={() => toggleSection("category")}
            >
              {categoriesLoading ? (
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-7 w-20 bg-zinc-100 rounded-full animate-pulse"
                    />
                  ))}
                </div>
              ) : categoriesError ? (
                <p className="text-xs text-red-500">Failed to load categories</p>
              ) : (
                categories.map((cat) => {
                  const isSelected = activeCategory === cat._id;
                  return (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => handleCategoryChange(cat._id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        isSelected
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-500"
                      }`}
                      aria-pressed={isSelected}
                    >
                      {cat.name}
                    </button>
                  );
                })
              )}
            </FilterSection>

            {/* Attribute filters */}
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
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${
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

            {/* Price Range filter */}
            <FilterSection
              title="Price Range"
              isOpen={openSections.price !== false}
              onToggle={() => toggleSection("price")}
            >
              <div className="flex items-center gap-2 w-full">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Min"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    onBlur={() => setMinPrice(minPriceInput)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setMinPrice(minPriceInput); }}
                    className="w-full pl-7 pr-2 py-2 text-xs rounded-lg border border-zinc-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all"
                    aria-label="Minimum price"
                  />
                </div>
                <span className="text-zinc-400 text-xs">—</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Max"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    onBlur={() => setMaxPrice(maxPriceInput)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setMaxPrice(maxPriceInput); }}
                    className="w-full pl-7 pr-2 py-2 text-xs rounded-lg border border-zinc-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all"
                    aria-label="Maximum price"
                  />
                </div>
              </div>
            </FilterSection>
          </div>
        </aside>

        {/* ── Product Grid ──────────────────────────────────── */}
        <div className="flex flex-col gap-8">
          {/* ── Search + Sort toolbar ─────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-zinc-300 bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all placeholder:text-zinc-400"
                aria-label="Search products"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  ×
                </button>
              )}
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2.5 text-sm rounded-lg border border-zinc-300 bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all cursor-pointer min-w-[180px]"
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">▾</span>
            </div>
          </div>

          {hasActiveFilters && !isLoading && (
            <p className="text-sm text-zinc-600">
              Showing {mappedProducts.length} result
              {mappedProducts.length === 1 ? "" : "s"} based on your filters.
              {pagination && (
                <span className="text-zinc-400 ml-1">
                  (Page {pagination.page} of {pagination.totalPages})
                </span>
              )}
            </p>
          )}

          {/* SWR Error */}
          {isError && (
            <InlineError error={error} onRetry={() => mutate()} />
          )}

          {/* Product grid */}
          {!isError && (
            <ProductGrid>
              {mappedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickLook={setQuickLookProduct}
                />
              ))}

              {/* Loading skeletons */}
              {isLoading &&
                Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={`skeleton-${i}`} />
                ))}
            </ProductGrid>
          )}

          {/* Empty state */}
          {!isLoading && !isError && mappedProducts.length === 0 && (
            <EmptyState
              icon={PackageOpen}
              title="No products found"
              description={
                hasActiveFilters
                  ? "No products match the selected filters. Try removing one or two filters."
                  : "We're still adding products to this collection. Check back soon!"
              }
              action={
                hasActiveFilters ? (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm font-medium text-violet-600 hover:text-violet-800 underline transition-colors"
                  >
                    Clear all filters
                  </button>
                ) : null
              }
            />
          )}

          {/* Pagination */}
          {!isError && pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-lg border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-zinc-500 px-3">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={!hasMore}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Quick Look Panel */}
        <QuickLookPanel
          product={quickLookProduct}
          isOpen={!!quickLookProduct}
          onClose={() => setQuickLookProduct(null)}
        />
      </div>
    </>
  );
}

// ── Page wrapper ────────────────────────────────────────────
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
