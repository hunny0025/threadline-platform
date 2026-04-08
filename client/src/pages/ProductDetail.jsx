import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, PackageOpen } from 'lucide-react';
import { ImageGallery } from '../components/pdp/ImageGallery';
import { ProductInfo } from '../components/pdp/ProductInfo';
import { StickyAddToCart } from '../components/pdp/StickyAddToCart';
import { UserReviewGallery } from '../components/pdp/UserReviewGallery';
import { CompleteTheLook } from '../components/pdp/CompleteTheLook';
import { useSectionReveal } from '../hooks/useSectionReveal';
import { useProduct } from '../hooks/useProducts';
import { ProductSkeleton } from '../components/catalog/ProductSkeleton';
import { ErrorFallback, EmptyState } from '../components/ui/ErrorBoundary';

/* ── Fallback gallery images (used when API product has no images) ─ */
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
  'https://images.unsplash.com/photo-1515347619362-e6fd0289eb13?w=800&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
];

/**
 * Map the raw API product to the shape expected by child components.
 */
function mapProduct(raw) {
  if (!raw) return null;

  const images =
    raw.images && raw.images.length > 0 ? raw.images : FALLBACK_IMAGES;

  // Extract unique sizes & colors from variants (if populated)
  const sizes = raw.variants
    ? [...new Set(raw.variants.map((v) => v.size))].filter(Boolean)
    : ['M', 'L'];

  const colors = raw.variants
    ? [...new Set(raw.variants.map((v) => v.color))].filter(Boolean)
    : [];

  return {
    id: raw._id || raw.id,
    title: raw.name || 'Untitled Product',
    price: raw.basePrice?.toFixed(2) ?? '0.00',
    image: images[0],
    images,
    sizes,
    colors,
    color: colors[0] || null,
    fabric: raw.fabricWeight || null,
    fit: raw.fitType || null,
    occasion: raw.occasion || null,
    description: raw.description || '',
    isNew:
      raw.createdAt &&
      Date.now() - new Date(raw.createdAt).getTime() < 7 * 86400000,
    lowStock: false,
    category: raw.category || null,
  };
}

/* ── Loading skeleton for PDP ─────────────────────────────────── */
function PDPSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-6 md:mb-8">
        <div className="h-4 w-12 bg-zinc-100 rounded animate-pulse" />
        <div className="h-4 w-4 bg-zinc-50 rounded animate-pulse" />
        <div className="h-4 w-16 bg-zinc-100 rounded animate-pulse" />
        <div className="h-4 w-4 bg-zinc-50 rounded animate-pulse" />
        <div className="h-4 w-32 bg-zinc-100 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-6 lg:gap-12">
        {/* Image skeleton */}
        <div className="aspect-[3/4] bg-zinc-100 rounded-xl animate-pulse" />

        {/* Info skeleton */}
        <div className="flex flex-col gap-5 py-4">
          <div className="h-5 w-24 bg-zinc-100 rounded-full animate-pulse" />
          <div className="h-8 w-3/4 bg-zinc-100 rounded animate-pulse" />
          <div className="h-7 w-28 bg-zinc-100 rounded animate-pulse" />
          <div className="h-16 w-full bg-zinc-50 rounded animate-pulse" />
          <div className="flex gap-3 mt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-9 h-9 rounded-full bg-zinc-100 animate-pulse" />
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-11 w-14 rounded-lg bg-zinc-100 animate-pulse" />
            ))}
          </div>
          <div className="h-14 w-full bg-zinc-200 rounded-xl animate-pulse mt-3" />
        </div>
      </div>
    </div>
  );
}

/* ── Page Component ─────────────────────────────────────────── */
export function ProductDetail() {
  const { id } = useParams();

  // Fetch product from API via SWR
  const { product: rawProduct, isLoading, isError, error, mutate } = useProduct(id);
  const product = mapProduct(rawProduct);

  // CTA visibility tracking for sticky mobile bar
  const ctaRef = useRef(null);
  const [ctaVisible, setCtaVisible] = useState(true);

  useEffect(() => {
    const node = ctaRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setCtaVisible(entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [product]); // re-observe when product loads

  // Section reveal animations
  const galleryReveal = useSectionReveal({ delay: 0 });
  const infoReveal    = useSectionReveal({ delay: 120 });
  const metaReveal    = useSectionReveal({ delay: 200, threshold: 0.1 });
  const ctlReveal     = useSectionReveal({ delay: 250, threshold: 0.1 });
  const socialReveal  = useSectionReveal({ delay: 300, threshold: 0.1 });

  // ── Loading state ──────────────────────────────────────────
  if (isLoading) {
    return <PDPSkeleton />;
  }

  // ── Error state ────────────────────────────────────────────
  if (isError) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ErrorFallback error={error} onReset={() => mutate()} />
      </div>
    );
  }

  // ── Empty / 404 state ──────────────────────────────────────
  if (!product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={PackageOpen}
          title="Product not found"
          description="This product doesn't exist or may have been removed."
          action={
            <Link
              to="/catalog"
              className="text-sm font-medium text-violet-600 hover:text-violet-800 underline transition-colors"
            >
              Browse catalog
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 pb-28 md:pb-10">
        {/* ── Breadcrumb ────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
          <ol className="flex items-center gap-1.5 text-sm text-zinc-500">
            <li>
              <Link to="/" className="hover:text-violet-600 transition-colors">Home</Link>
            </li>
            <li><ChevronRight size={14} className="text-zinc-400" /></li>
            <li>
              <Link to="/catalog" className="hover:text-violet-600 transition-colors">Catalog</Link>
            </li>
            <li><ChevronRight size={14} className="text-zinc-400" /></li>
            <li className="text-zinc-900 font-medium truncate max-w-[200px]">
              {product.title}
            </li>
          </ol>
        </nav>

        {/* ── Main PDP Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-6 lg:gap-12">
          {/* Left: Image Gallery */}
          <div ref={galleryReveal.ref} style={galleryReveal.style}>
            <div className="lg:sticky lg:top-24">
              <ImageGallery images={product.images} />
            </div>
          </div>

          {/* Right: Product Info */}
          <div ref={infoReveal.ref} style={infoReveal.style}>
            <ProductInfo product={product} ref={ctaRef} />
          </div>
        </div>

        {/* ── Complete The Look Section ────────────────────── */}
        <div ref={ctlReveal.ref} style={ctlReveal.style}>
          <CompleteTheLook productId={product.id} />
        </div>

        {/* ── Extra Details Section (below fold) ────────────── */}
        <div ref={metaReveal.ref} style={metaReveal.style}>
          <section className="mt-12 lg:mt-20 border-t border-zinc-200 pt-8 lg:pt-12">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight mb-6">
              Product Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-zinc-50 rounded-xl p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Materials</h3>
                <p className="text-sm text-zinc-700 leading-relaxed">
                  Premium {product.fabric?.toLowerCase() || 'cotton'} sourced from ethical suppliers.
                  Pre-washed for softness. Machine washable at 30°C.
                </p>
              </div>
              <div className="bg-zinc-50 rounded-xl p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Fit & Sizing</h3>
                <p className="text-sm text-zinc-700 leading-relaxed">
                  {product.fit || 'Regular'} fit through the body. Model is 6'1" wearing size M.
                  True to size — we recommend your usual size.
                </p>
              </div>
              <div className="bg-zinc-50 rounded-xl p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Sustainability</h3>
                <p className="text-sm text-zinc-700 leading-relaxed">
                  Part of our low-impact collection. Made with 30% recycled fibres
                  and shipped in fully recyclable packaging.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ── Social Proof / User Review Gallery ────────────── */}
        <div ref={socialReveal.ref} style={socialReveal.style}>
          <UserReviewGallery />
        </div>
      </div>

      {/* ── Sticky Mobile Add-to-Cart Bar ─────────────────── */}
      <StickyAddToCart product={product} isVisible={!ctaVisible} />
    </>
  );
}
