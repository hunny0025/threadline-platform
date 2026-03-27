import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ImageGallery } from '../components/pdp/ImageGallery';
import { ProductInfo } from '../components/pdp/ProductInfo';
import { StickyAddToCart } from '../components/pdp/StickyAddToCart';
import { UserReviewGallery } from '../components/pdp/UserReviewGallery';
import { useSectionReveal } from '../hooks/useSectionReveal';

/* ── Mock data generator (same pattern as Catalog.jsx) ──────── */
const SIZE_OPTIONS  = ['XS', 'S', 'M', 'L', 'XL'];
const COLOR_OPTIONS = ['Black', 'White', 'Olive', 'Navy', 'Sand'];
const FABRIC_OPTIONS = ['Cotton', 'Linen', 'Denim', 'Wool', 'Jersey'];
const FIT_OPTIONS    = ['Slim', 'Regular', 'Relaxed', 'Oversized'];
const OCCASION_OPTIONS = ['Everyday', 'Work', 'Weekend', 'Evening', 'Travel'];

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
  'https://images.unsplash.com/photo-1515347619362-e6fd0289eb13?w=800&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
  'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
];

function generateProduct(id) {
  // Derive a numeric seed from the id string
  const seed = id
    ? id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
    : 42;

  const sizes = SIZE_OPTIONS.filter((_, i) => (seed + i) % 2 === 0);
  const colorStart = seed % COLOR_OPTIONS.length;
  const colors = [
    COLOR_OPTIONS[colorStart],
    COLOR_OPTIONS[(colorStart + 1) % COLOR_OPTIONS.length],
    COLOR_OPTIONS[(colorStart + 2) % COLOR_OPTIONS.length],
  ];

  return {
    id,
    title: `Threadline Essential ${id?.replace(/-/g, ' ').replace(/prod/i, '').trim() || 'Classic'}`,
    price: (Math.abs(seed * 7) % 180 + 45).toFixed(2),
    image: GALLERY_IMAGES[0],
    images: GALLERY_IMAGES,
    sizes: sizes.length > 0 ? sizes : ['M', 'L'],
    colors,
    color: colors[0],
    fabric: FABRIC_OPTIONS[seed % FABRIC_OPTIONS.length],
    fit: FIT_OPTIONS[seed % FIT_OPTIONS.length],
    occasion: OCCASION_OPTIONS[seed % OCCASION_OPTIONS.length],
    isNew: seed % 3 === 0,
    lowStock: seed % 5 === 0,
  };
}

/* ── Page Component ─────────────────────────────────────────── */
export function ProductDetail() {
  const { id } = useParams();
  const product = generateProduct(id);

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
  }, []);

  // Section reveal animations
  const galleryReveal = useSectionReveal({ delay: 0 });
  const infoReveal    = useSectionReveal({ delay: 120 });
  const metaReveal    = useSectionReveal({ delay: 200, threshold: 0.1 });
  const socialReveal  = useSectionReveal({ delay: 300, threshold: 0.1 });

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 pb-28 md:pb-10">
        {/* ── Breadcrumb ──────────────────────────────────────── */}
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

        {/* ── Main PDP Grid ───────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6 lg:gap-12">
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

        {/* ── Extra Details Section (below fold) ──────────────── */}
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
                  {product.fit} fit through the body. Model is 6'1" wearing size M. 
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

        {/* ── Social Proof / User Review Gallery ──────────────── */}
        <div ref={socialReveal.ref} style={socialReveal.style}>
          <UserReviewGallery />
        </div>
      </div>

      {/* ── Sticky Mobile Add-to-Cart Bar ─────────────────────── */}
      <StickyAddToCart product={product} isVisible={!ctaVisible} />
    </>
  );
}
