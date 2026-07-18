'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { newArrivalProducts } from '@/data/newproducts';
import ProductCard from '@/components/Desktop/components/ProductCard';
import {
  FaTag, FaPercent, FaFire, FaClock, FaShoppingCart,
  FaGift, FaBolt, FaCheckCircle, FaFilter, FaTimes, FaLeaf,
  FaTruck, FaShieldAlt, FaChevronDown, FaChevronUp,
} from 'react-icons/fa';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { api, getApiErrorMessage } from '@/lib/axios';

// ─── Types ─────────────────────────────────────────────────────────────────────
type OfferType = 'discount' | 'bogo' | 'flash' | 'seasonal' | 'bundle' | 'freeship' | string;

interface Offer {
  id: string;
  type: OfferType;
  title: string;
  titleUr?: string;
  description: string;
  discount: string;
  code?: string;
  validUntil: string;
  minPurchase?: number;
  maxDiscount?: number;
  featured?: boolean;
  usageLeft?: number;
  totalUsage?: number;
  perks?: string[];
  color: string;
  bgColor: string;
  gradient: string;
}

interface ApiOfferItem {
  id: string | number;
  code?: string;
  description?: string;
  discount_type: string;
  discount_value: number;
  min_purchase_amount?: number;
  end_date?: string;
  title?: string;
}

// Map API item → display Offer
function mapApiOffer(o: ApiOfferItem): Offer {
  const typeMap: Record<string, { color: string; bgColor: string; gradient: string }> = {
    percentage: { color: 'text-green-600',  bgColor: 'bg-green-50',  gradient: 'from-green-500 to-emerald-500'  },
    fixed:      { color: 'text-blue-600',   bgColor: 'bg-blue-50',   gradient: 'from-blue-500 to-indigo-500'    },
    freeship:   { color: 'text-cyan-600',   bgColor: 'bg-cyan-50',   gradient: 'from-cyan-500 to-blue-500'      },
    bogo:       { color: 'text-purple-600', bgColor: 'bg-purple-50', gradient: 'from-purple-500 to-pink-500'    },
    flash:      { color: 'text-red-600',    bgColor: 'bg-red-50',    gradient: 'from-red-500 to-orange-500'     },
    seasonal:   { color: 'text-emerald-600',bgColor: 'bg-emerald-50',gradient: 'from-emerald-500 to-teal-500'  },
    bundle:     { color: 'text-rose-600',   bgColor: 'bg-rose-50',   gradient: 'from-rose-500 to-pink-500'      },
  };
  const style = typeMap[o.discount_type] ?? typeMap.percentage;
  const discountLabel =
    o.discount_type === 'percentage' ? `${o.discount_value}%` :
    o.discount_type === 'freeship'   ? 'FREE' :
    o.discount_type === 'bogo'       ? 'BOGO' :
    `PKR ${o.discount_value.toLocaleString()}`;

  return {
    id:          String(o.id),
    type:        o.discount_type,
    title:       o.title ?? o.code ?? `${discountLabel} OFF`,
    titleUr:     undefined,
    description: o.description ?? '',
    discount:    discountLabel,
    code:        o.code,
    validUntil:  o.end_date ?? '',
    minPurchase: o.min_purchase_amount,
    ...style,
  };
}

const typeLabels: Record<string, string> = {
  all: 'All', flash: 'Flash Sale', seasonal: 'Seasonal', bogo: 'BOGO',
  bundle: 'Bundles', discount: 'Discount', freeship: 'Free Shipping',
  percentage: 'Discount', fixed: 'Fixed Off',
};

const typeIcons: Record<string, React.ReactNode> = {
  flash: <FaBolt className="w-3 h-3" />,
  seasonal: <FaLeaf className="w-3 h-3" />,
  bogo: <FaGift className="w-3 h-3" />,
  bundle: <FaShoppingCart className="w-3 h-3" />,
  freeship: <FaTruck className="w-3 h-3" />,
  discount: <FaPercent className="w-3 h-3" />,
  percentage: <FaPercent className="w-3 h-3" />,
  fixed: <FaTag className="w-3 h-3" />,
};

// ─── CountdownTimer ────────────────────────────────────────────────────────────
function CountdownTimer({ validUntil }: { validUntil: string }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = new Date(validUntil).getTime() - Date.now();
      if (diff <= 0) return;
      setTime({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [validUntil]);
  return (
    <div className="flex items-center gap-1.5">
      {(['d', 'h', 'm', 's'] as const).map((label, i) => (
        <div key={label} className="text-center">
          <div className="bg-black/30 backdrop-blur-sm text-white text-xs font-mono font-bold px-1.5 py-0.5 rounded min-w-[24px]">
            {String([time.d, time.h, time.m, time.s][i]).padStart(2, '0')}
          </div>
          <div className="text-[9px] text-white/60 mt-0.5">{label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── OfferCard ─────────────────────────────────────────────────────────────────
function OfferCard({ offer, copiedCode, onCopy }: { offer: Offer; copiedCode: string | null; onCopy: (code: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const usagePct = offer.usageLeft && offer.totalUsage
    ? Math.round(((offer.totalUsage - offer.usageLeft) / offer.totalUsage) * 100) : null;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
      <div className={`h-1.5 bg-gradient-to-r ${offer.gradient}`} />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${offer.bgColor} ${offer.color}`}>
            {typeIcons[offer.type]} {typeLabels[offer.type]}
          </div>
          <div className={`text-2xl font-black ${offer.color}`}>{offer.discount}{offer.type !== 'bogo' && offer.type !== 'freeship' ? ' OFF' : ''}</div>
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-0.5">{offer.title}</h3>
        <p className="text-xs text-gray-400 mb-2">{offer.titleUr}</p>
        <p className="text-sm text-gray-600 mb-3 leading-relaxed flex-1">{offer.description}</p>
        {usagePct !== null && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{offer.usageLeft} uses left</span><span>{usagePct}% claimed</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${offer.gradient} rounded-full`} style={{ width: `${usagePct}%` }} />
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1"><FaClock className="w-3 h-3 text-gray-300" />Until {new Date(offer.validUntil).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          {offer.minPurchase && <span className="flex items-center gap-1"><FaShoppingCart className="w-3 h-3 text-gray-300" />Min PKR {offer.minPurchase.toLocaleString()}</span>}
          {offer.maxDiscount && <span className="flex items-center gap-1"><FaTag className="w-3 h-3 text-gray-300" />Max PKR {offer.maxDiscount.toLocaleString()} off</span>}
        </div>
        {offer.perks && (
          <div className="mb-4">
            <button onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 mb-2">
              {expanded ? <FaChevronUp className="w-3 h-3" /> : <FaChevronDown className="w-3 h-3" />}
              {expanded ? 'Hide perks' : 'Show perks'}
            </button>
            {expanded && (
              <ul className="space-y-1.5">
                {offer.perks.map((perk, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                    <FaCheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> {perk}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div className="mt-auto space-y-2">
          {offer.code && (
            <div className="flex items-center justify-between bg-gray-50 border border-dashed border-gray-300 rounded-xl px-3 py-2.5">
              <div>
                <p className="text-[10px] text-gray-400 leading-none mb-0.5">Promo Code</p>
                <span className="font-mono font-bold text-gray-900 text-sm tracking-widest">{offer.code}</span>
              </div>
              <button onClick={() => onCopy(offer.code!)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${copiedCode === offer.code ? 'bg-green-100 text-green-700' : 'bg-gray-900 text-white hover:bg-gray-700'}`}>
                {copiedCode === offer.code ? <><FiCheck className="w-3 h-3" /> Copied!</> : <><FiCopy className="w-3 h-3" /> Copy</>}
              </button>
            </div>
          )}
          <Link href="/shop" className={`block w-full py-2.5 text-center rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${offer.gradient} hover:opacity-90 transition`}>
            Shop Now →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Featured Banner ───────────────────────────────────────────────────────────
function FeaturedBanner({ offer, copiedCode, onCopy }: { offer: Offer; copiedCode: string | null; onCopy: (code: string) => void }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${offer.gradient} p-6 sm:p-8 text-white`}>
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/10 -translate-x-1/3 translate-y-1/3 pointer-events-none" />
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <FaFire className="w-3 h-3" /> FEATURED DEAL
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-1">{offer.title}</h2>
          <p className="text-sm text-white/70 mb-2">{offer.titleUr}</p>
          <p className="text-sm text-white/90 max-w-lg mb-4 leading-relaxed">{offer.description}</p>
          {offer.perks && (
            <div className="flex flex-wrap gap-2 mb-5">
              {offer.perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full text-xs">
                  <FaCheckCircle className="w-3 h-3" /> {perk}
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            {offer.code && (
              <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2.5">
                <span className="font-mono font-black text-lg tracking-widest">{offer.code}</span>
                <button onClick={() => onCopy(offer.code!)}
                  className="flex items-center gap-1 bg-white text-gray-900 hover:bg-gray-100 transition px-2.5 py-1 rounded-lg text-xs font-semibold">
                  {copiedCode === offer.code ? <><FiCheck className="w-3 h-3" /> Copied</> : <><FiCopy className="w-3 h-3" /> Copy</>}
                </button>
              </div>
            )}
            <Link href="/shop" className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 transition px-5 py-2.5 rounded-xl text-sm font-bold">
              Shop the Deal →
            </Link>
          </div>
        </div>
        <div className="text-center flex-shrink-0 bg-white/10 rounded-2xl px-8 py-6">
          <div className="text-6xl sm:text-7xl font-black">{offer.discount}</div>
          {offer.type !== 'bogo' && offer.type !== 'freeship' && <div className="text-xl font-bold text-white/80">OFF</div>}
          {offer.minPurchase && <div className="text-xs text-white/60 mt-1">Min. PKR {offer.minPurchase.toLocaleString()}</div>}
          <div className="mt-4">
            <div className="text-xs text-white/60 mb-2 flex items-center justify-center gap-1"><FaClock className="w-3 h-3" /> Ends in:</div>
            <CountdownTimer validUntil={offer.validUntil} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page Skeleton ─────────────────────────────────────────────────────────────
function OffersPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="bg-white border-b h-24" />
      <div className="max-w-[1920px] mx-auto px-[4%] py-8 space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => <div key={i} className="h-52 bg-gray-200 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => <div key={i} className="h-72 bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    api.get<{ success: boolean; data: ApiOfferItem[] }>('/offers')
      .then((res) => setOffers((res.data ?? []).map(mapApiOffer)))
      .catch((err) => setFetchError(getApiErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const featuredOffers = offers.filter((o) => o.featured);
  const filteredOffers = filter === 'all' ? offers : offers.filter((o) => o.type === filter);
  const saleProducts = newArrivalProducts.filter((p) => p.sale).slice(0, 5);

  if (isLoading) return <OffersPageSkeleton />;

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🏷️</div>
          <p className="text-red-500 text-sm mb-4">{fetchError}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sticky header */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-[4%] py-4 sm:py-5">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div>
              <h1 className="text-xl sm:text-2xl 2xl:text-3xl font-bold text-gray-900">Special Offers & Deals</h1>
              <p className="text-sm text-gray-500">Exclusive savings on Pansari Inn's finest herbal products</p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="bg-red-50 px-3 py-1.5 rounded-lg text-center">
                <div className="text-red-600 font-bold text-sm">{filteredOffers.length}</div>
                <div className="text-xs text-red-400">Active Deals</div>
              </div>
            </div>
          </div>
          {/* Filter tabs — desktop */}
          <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1">
            {Object.entries(typeLabels).map(([type, label]) => (
              <button key={type} onClick={() => setFilter(type as typeof filter)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                  filter === type ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>
                {type !== 'all' && typeIcons[type]} {label}
              </button>
            ))}
          </div>
          {/* Filter — mobile */}
          <button onClick={() => setShowMobileFilter(true)}
            className="sm:hidden w-full flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-200">
            <div className="flex items-center gap-2"><FaFilter className="w-4 h-4" /> Filter</div>
            <span className="text-gray-400">{typeLabels[filter]}</span>
          </button>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileFilter(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filter Offers</h3>
              <button onClick={() => setShowMobileFilter(false)} className="p-1.5 hover:bg-gray-100 rounded-full"><FaTimes className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2">
              {Object.entries(typeLabels).map(([type, label]) => (
                <button key={type} onClick={() => { setFilter(type as typeof filter); setShowMobileFilter(false); }}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${filter === type ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
                  {type !== 'all' && typeIcons[type]} {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1920px] mx-auto px-[4%] py-6 sm:py-10 space-y-12">

        {/* Featured banners */}
        {featuredOffers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <FaFire className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Featured Deals</h2>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {featuredOffers.map((offer) => (
                <FeaturedBanner key={offer.id} offer={offer} copiedCode={copiedCode} onCopy={copyCode} />
              ))}
            </div>
          </div>
        )}

        {/* Trust strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: <FaShieldAlt className="w-5 h-5 text-green-600" />, title: '100% Authentic', desc: 'Verified herbal ingredients', bg: 'bg-green-50' },
            { icon: <FaTruck className="w-5 h-5 text-blue-600" />, title: 'Fast Delivery', desc: 'Nationwide in 2–4 days', bg: 'bg-blue-50' },
            { icon: <FaGift className="w-5 h-5 text-purple-600" />, title: 'Free Gift Wrap', desc: 'On orders over PKR 2,000', bg: 'bg-purple-50' },
            { icon: <FaCheckCircle className="w-5 h-5 text-amber-600" />, title: 'Easy Returns', desc: '7-day return policy', bg: 'bg-amber-50' },
          ].map((item, i) => (
            <div key={i} className={`${item.bg} rounded-xl p-4 flex items-center gap-3`}>
              <div className="flex-shrink-0">{item.icon}</div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* All Offers */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {filter === 'all' ? 'All Offers' : typeLabels[filter]}
              <span className="ml-2 text-base font-normal text-gray-400">({filteredOffers.length})</span>
            </h2>
          </div>
          {filteredOffers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} copiedCode={copiedCode} onCopy={copyCode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🏷️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No offers in this category</h3>
              <button onClick={() => setFilter('all')} className="mt-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition font-medium">View All Offers</button>
            </div>
          )}
        </div>

        {/* On-sale products */}
        {saleProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Products On Sale Now</h2>
              <Link href="/shop" className="text-sm text-[#197B33] font-semibold hover:underline">View All →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {saleProducts.map((product) => (
                <div key={product.id} className="w-full"><ProductCard product={product} /></div>
              ))}
            </div>
          </div>
        )}

        {/* How to use */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 text-center">How to Use Promo Codes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { n: '01', title: 'Browse & Add', desc: 'Find your favourite products and add them to your cart.' },
              { n: '02', title: 'Go to Checkout', desc: 'Head to checkout when you\'re ready to place your order.' },
              { n: '03', title: 'Enter Code', desc: 'Paste your promo code in the discount field and apply.' },
              { n: '04', title: 'Enjoy Savings!', desc: 'Discount applied instantly. Complete your payment and done!' },
            ].map((item) => (
              <div key={item.n} className="text-center">
                <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-black mx-auto mb-3">{item.n}</div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{item.title}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-6">* Offers cannot be combined unless stated. Terms & conditions apply.</p>
        </div>

      </div>
    </div>
  );
}
