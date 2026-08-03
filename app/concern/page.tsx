'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { FaLeaf, FaHeart, FaMoon, FaBolt, FaEye, FaShieldAlt, FaSmile, FaWind, FaBrain, FaFire, FaArrowRight, FaCheckCircle, FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import ProductCard from '@/components/Desktop/components/ProductCard';
import MobileProductCard from '@/components/Mobile/components/ProductCard';
import { getHealthConcerns, getProducts } from '@/lib/products';
import type { ApiHealthConcern } from '@/lib/products';
import type { Product } from '@/types/product';
import { apiProductToLegacy } from '@/types/product';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapApiProducts(data: Awaited<ReturnType<typeof getProducts>>['data']): Product[] {
  return data.map(p => ({
    ...apiProductToLegacy(p),
    inStock: p.variants?.some(v => v.stock > 0) ?? true,
  }));
}

// Static icon map — backend only returns name/slug, icons live client-side.
// Falls back to FaLeaf for any concern not in the map.
const CONCERN_ICONS: Record<string, React.ReactNode> = {
  hair:        <FaLeaf  className="w-6 h-6" />,
  skin:        <FaSmile className="w-6 h-6" />,
  sleep:       <FaMoon  className="w-6 h-6" />,
  energy:      <FaBolt  className="w-6 h-6" />,
  immunity:    <FaShieldAlt className="w-6 h-6" />,
  digestion:   <FaHeart className="w-6 h-6" />,
  stress:      <FaBrain className="w-6 h-6" />,
  joints:      <FaWind  className="w-6 h-6" />,
  hydration:   <FaWind  className="w-6 h-6" />,
  weight:      <FaFire  className="w-6 h-6" />,
  eye:         <FaEye   className="w-6 h-6" />,
  respiratory: <FaWind  className="w-6 h-6" />,
};

const CONCERN_GRADIENTS: Record<string, string> = {
  hair:        'from-emerald-500 to-teal-500',
  skin:        'from-pink-500 to-rose-500',
  sleep:       'from-indigo-500 to-violet-500',
  energy:      'from-amber-500 to-orange-500',
  immunity:    'from-green-500 to-emerald-500',
  digestion:   'from-orange-500 to-red-500',
  stress:      'from-purple-500 to-indigo-500',
  joints:      'from-cyan-500 to-blue-500',
  hydration:   'from-sky-500 to-cyan-500',
  weight:      'from-red-500 to-rose-500',
  eye:         'from-lime-500 to-green-500',
  respiratory: 'from-teal-500 to-cyan-500',
};

const CONCERN_BG: Record<string, string> = {
  hair:        'bg-emerald-50',
  skin:        'bg-pink-50',
  sleep:       'bg-indigo-50',
  energy:      'bg-amber-50',
  immunity:    'bg-green-50',
  digestion:   'bg-orange-50',
  stress:      'bg-purple-50',
  joints:      'bg-cyan-50',
  hydration:   'bg-sky-50',
  weight:      'bg-red-50',
  eye:         'bg-lime-50',
  respiratory: 'bg-teal-50',
};

const CONCERN_BORDER: Record<string, string> = {
  hair:        'border-emerald-200',
  skin:        'border-pink-200',
  sleep:       'border-indigo-200',
  energy:      'border-amber-200',
  immunity:    'border-green-200',
  digestion:   'border-orange-200',
  stress:      'border-purple-200',
  joints:      'border-cyan-200',
  hydration:   'border-sky-200',
  weight:      'border-red-200',
  eye:         'border-lime-200',
  respiratory: 'border-teal-200',
};

function concernGradient(slug: string)  { return CONCERN_GRADIENTS[slug] ?? 'from-green-500 to-emerald-500'; }
function concernBg(slug: string)        { return CONCERN_BG[slug]        ?? 'bg-green-50'; }
function concernBorder(slug: string)    { return CONCERN_BORDER[slug]    ?? 'border-green-200'; }
function concernIcon(slug: string)      { return CONCERN_ICONS[slug]     ?? <FaLeaf className="w-6 h-6" />; }

// ─── Skeletons ────────────────────────────────────────────────────────────────

function ConcernGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
          <div className="w-11 h-11 rounded-xl bg-gray-200 mb-3" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-1.5" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 animate-pulse">
            <div className="h-36 bg-gray-200 rounded-t-xl" />
            <div className="p-2.5 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-t-lg" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-8 bg-gray-200 rounded mt-2" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ByConcernPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50"><ConcernGridSkeleton /></div>}>
      <ByConcernContent />
    </Suspense>
  );
}

function ByConcernContent() {
  const [concerns, setConcerns]               = useState<ApiHealthConcern[]>([]);
  const [concernsLoading, setConcernsLoading] = useState(true);
  const [selected, setSelected]               = useState<ApiHealthConcern | null>(null);
  const [searchQuery, setSearchQuery]         = useState('');

  const [products, setProducts]               = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [totalProducts, setTotalProducts]     = useState(0);
  const [currentPage, setCurrentPage]         = useState(1);
  const [totalPages, setTotalPages]           = useState(1);
  const PER_PAGE = 20;

  // Load concern list once on mount
  useEffect(() => {
    getHealthConcerns()
      .then(data => setConcerns(data))
      .finally(() => setConcernsLoading(false));
  }, []);

  // Fetch products whenever selected concern or page changes
  const fetchProducts = useCallback(async (concernId: number, page: number, signal?: AbortSignal) => {
    setProductsLoading(true);
    try {
      const res = await getProducts(
        { health_concern_id: concernId, per_page: PER_PAGE, page },
        { signal },
      );
      setProducts(mapApiProducts(res.data));
      setTotalProducts(res.meta.total);
      setTotalPages(res.meta.last_page);
    } catch {
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!selected) return;
    const controller = new AbortController();
    fetchProducts(selected.id, currentPage, controller.signal);
    return () => controller.abort();
  }, [selected, currentPage, fetchProducts]);

  const handleSelect = (concern: ApiHealthConcern) => {
    if (selected?.id === concern.id) {
      setSelected(null);
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
      setCurrentPage(1);
      return;
    }
    setSelected(concern);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSelected(null);
    setProducts([]);
    setTotalProducts(0);
    setTotalPages(1);
    setCurrentPage(1);
  };

  const filteredConcerns = searchQuery
    ? concerns.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.description ?? '').toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : concerns;

  const from = totalProducts === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1;
  const to   = Math.min(currentPage * PER_PAGE, totalProducts);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1920px] mx-auto px-[4%] py-10 sm:py-14">
          <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
                <FaLeaf className="w-3 h-3" /> Natural Wellness Solutions
              </div>
              <h1 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-gray-900 leading-tight mb-3">
                Shop by{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                  Health Concern
                </span>
              </h1>
              <p className="text-base sm:text-lg text-gray-500 mb-2">
                Tell us what you&apos;re looking for — we&apos;ll recommend the right herbal solutions for your needs.
              </p>
              <p className="text-sm text-gray-400" dir="rtl">اپنی صحت کے مسئلے کے مطابق قدرتی مصنوعات دریافت کریں</p>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 lg:w-72 flex-shrink-0">
              {[
                { n: concernsLoading ? '…' : String(concerns.length), label: 'Health Concerns', color: 'text-green-700', bg: 'bg-green-50' },
                { n: selected ? String(totalProducts) + (productsLoading ? '' : '+') : '—',      label: 'Products',        color: 'text-blue-700',  bg: 'bg-blue-50'  },
                { n: '100%',                                                                       label: 'Natural',         color: 'text-amber-700', bg: 'bg-amber-50' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                  <div className={`font-black text-xl ${s.color}`}>{s.n}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-[4%] py-8 sm:py-12 space-y-12">

        {/* Concern selector */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Choose Your Concern</h2>
              <p className="text-sm text-gray-500">Click any concern to browse matching products</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                <input
                  type="text" placeholder="Search concern…"
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-48"
                />
              </div>
              {selected && (
                <button onClick={handleClear} className="text-sm text-gray-500 hover:text-gray-700 underline whitespace-nowrap">
                  Clear
                </button>
              )}
            </div>
          </div>

          {concernsLoading ? (
            <ConcernGridSkeleton />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {filteredConcerns.map(concern => {
                const isSelected = selected?.id === concern.id;
                const gradient   = concernGradient(concern.slug);
                const bg         = concernBg(concern.slug);
                const border     = concernBorder(concern.slug);
                return (
                  <button
                    key={concern.id}
                    onClick={() => handleSelect(concern)}
                    className={`w-full text-left rounded-2xl border-2 p-4 sm:p-5 transition-all duration-300 ${
                      isSelected
                        ? `${bg} ${border} shadow-md scale-[1.02]`
                        : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-3`}>
                      {concernIcon(concern.slug)}
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-0.5">{concern.name}</h3>
                    {concern.products_count !== undefined && (
                      <p className="text-xs text-gray-400">{concern.products_count} products</p>
                    )}
                    {isSelected && <div className="text-xs font-semibold text-green-600 mt-1">Viewing →</div>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected concern detail banner */}
        {selected && (
          <div className={`rounded-2xl ${concernBg(selected.slug)} border ${concernBorder(selected.slug)} p-6 sm:p-8 transition-all`}>
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${concernGradient(selected.slug)} flex items-center justify-center text-white flex-shrink-0`}>
                {concernIcon(selected.slug)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-black text-gray-900 mb-1">{selected.name}</h2>
                {selected.description && (
                  <p className="text-gray-700 leading-relaxed text-base">{selected.description}</p>
                )}
              </div>
              <Link
                href="/shop"
                className={`hidden sm:flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${concernGradient(selected.slug)} hover:opacity-90 transition flex-shrink-0`}
              >
                All Products <FaArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Products section — only shown when a concern is selected */}
        {selected && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Recommended for {selected.name}
                </h2>
                {!productsLoading && (
                  <p className="text-sm text-gray-500">
                    {totalProducts === 0
                      ? 'No products found'
                      : `Showing ${from}–${to} of ${totalProducts} products`}
                  </p>
                )}
              </div>
              <Link href="/shop" className="text-sm font-semibold text-[#197B33] hover:underline flex items-center gap-1">
                View All <FaArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {productsLoading ? (
              <ProductGridSkeleton />
            ) : products.length === 0 ? (
              /* Empty state */
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <FaLeaf className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
                <p className="text-sm text-gray-500 mb-5">
                  No products are listed under <span className="font-medium">{selected.name}</span> yet.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#197B33] text-white rounded-xl font-semibold text-sm hover:bg-[#156529] transition"
                >
                  Browse All Products <FaArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <>
                {/* Mobile grid */}
                <div className="grid grid-cols-2 gap-3 sm:hidden">
                  {products.map(product => (
                    <MobileProductCard key={product.id} product={product} />
                  ))}
                </div>
                {/* Desktop grid */}
                <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 2xl:gap-8">
                  {products.map(product => (
                    <div key={product.id} className="w-full">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 sm:mt-10 flex items-center justify-center gap-2">
                    <button
                      onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={currentPage === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 text-lg"
                    >‹</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-medium ${
                          currentPage === page
                            ? 'bg-[#197B33] text-white border-[#197B33]'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 text-lg"
                    >›</button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Why herbal CTA */}
        <div className="bg-green-700 rounded-2xl p-8 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <FaLeaf className="w-8 h-8 mx-auto mb-3 text-white/70" />
            <h2 className="text-xl font-bold mb-2">Why Choose Herbal Solutions?</h2>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              Pansari Inn sources only the purest natural ingredients — no synthetic additives, no harmful chemicals.
              Rooted in centuries of traditional wisdom, crafted to work with your body naturally.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { Icon: FaLeaf,        label: '100% Natural'  },
                { Icon: FaCheckCircle, label: 'Lab Tested'    },
                { Icon: FaShieldAlt,   label: 'Handcrafted'   },
                { Icon: FaCheckCircle, label: 'Certified Pure' },
              ].map(({ Icon, label }) => (
                <div key={label} className="bg-white/10 rounded-xl py-3 px-2 text-center">
                  <Icon className="w-4 h-4 mx-auto mb-1 text-white/80" />
                  <div className="text-xs font-semibold text-white/90">{label}</div>
                </div>
              ))}
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white text-green-700 hover:bg-gray-100 transition px-5 py-2.5 rounded-xl font-bold text-sm"
            >
              Shop All Products <FaArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
