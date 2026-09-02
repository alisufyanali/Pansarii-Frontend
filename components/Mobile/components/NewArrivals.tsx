"use client";

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaStar, FaCheckCircle } from 'react-icons/fa';
import { apiProductToLegacy } from '@/types/product';
import ProductDetailsModal from '@/components/Desktop/components/ProductDetailsModal';
import type { ApiProduct, Product } from '@/types/product';

interface MobileNewArrivalsProps {
  /**
   * Products from data.new_arrivals in the /api/homepage response.
   * undefined = loading (show skeleton), [] = none (render nothing).
   * Optional — defaults to undefined so legacy pages compile (shows skeleton).
   */
  products?: ApiProduct[] | undefined;
}

function NewArrivalsSkeleton() {
  return (
    <section className="py-4">
      {/* Header — matches real: flex justify-between with title + "View All" button */}
      <div className="px-4 mb-3 flex items-center justify-between">
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-3.5 w-14 bg-gray-200 rounded animate-pulse" />
      </div>
      {/* Slider — matches real: flex gap-3 overflow-x-auto no-scrollbar pl-4 pr-8 */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pl-4 pr-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="na-card flex-shrink-0 bg-white rounded-2xl border border-gray-100 animate-pulse"
            style={{ width: '65vw' }}
          >
            {/* Inner layout matches: flex items-center p-3 gap-3 */}
            <div className="flex items-center p-3 gap-3">
              {/* Product image: w-20 h-20 rounded-xl */}
              <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-xl" />
              {/* Text column */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                {/* Price row with add button */}
                <div className="flex items-center justify-between mt-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="w-7 h-7 bg-gray-200 rounded-full flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function MobileNewArrivals({ products }: MobileNewArrivalsProps) {
  const router     = useRouter();
  const sliderRef  = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);
  const [modal, setModal] = useState<Product | null>(null);

  // Auto-slide every 3 s — mirrors the mobile FeaturedProducts behaviour
  useEffect(() => {
    if (!products || products.length === 0) return;
    const t = setInterval(() => {
      if (isHovering.current) return;
      const el = sliderRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      if (atEnd) {
        el.scrollLeft = 0;
      } else {
        const card = el.querySelector('.na-card') as HTMLElement;
        const step = card ? card.offsetWidth + 12 : 260;
        el.scrollLeft += step;
      }
    }, 3000);
    return () => clearInterval(t);
  }, [products]);

  if (products === undefined) return <NewArrivalsSkeleton />;
  if (products.length === 0) return null;

  const legacyProducts: Product[] = products.map(apiProductToLegacy);

  return (
    <section className="py-4">

      {/* Header */}
      <div className="px-4 mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">
          New <span className="text-amber-500">Arrivals</span>
        </h2>
        <button
          type="button"
          onClick={() => router.push('/newarrival')}
          className="text-xs font-semibold text-green-700 hover:text-green-600 transition"
        >
          View All →
        </button>
      </div>

      {/* Horizontal slider */}
      <div
        ref={sliderRef}
        className="flex gap-3 overflow-x-auto no-scrollbar pl-4 pr-8"
        onMouseEnter={() => { isHovering.current = true; }}
        onMouseLeave={() => { isHovering.current = false; }}
        onTouchStart={() => { isHovering.current = true; }}
        onTouchEnd={() => { setTimeout(() => { isHovering.current = false; }, 2000); }}
      >
        {legacyProducts.map((product, index) => (
          <div
            key={product.id}
            className="na-card flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
            style={{ width: '65vw' }}
            onClick={() => { if (product.slug) router.push(`/${product.slug}`); }}
          >
            <div className="flex items-center p-3 gap-3">

              {/* Product image */}
              <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                <Image
                  src={product.img}
                  alt={product.nameEn}
                  fill
                  className="object-contain p-1.5"
                  sizes="80px"
                  loading={index < 2 ? 'eager' : 'lazy'}
                  priority={index < 2}
                  quality={60}
                />
                {product.sale && (
                  <span className="absolute top-1 left-1 text-[9px] font-bold bg-red-500 text-white px-1 py-0.5 rounded-full leading-none">
                    {product.sale}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 line-clamp-1">
                  {product.nameEn}
                </p>
                {product.nameUr && product.nameUr !== product.nameEn && (
                  <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                    {product.nameUr}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center gap-0.5">
                    <FaStar className="w-2.5 h-2.5 text-yellow-400" />
                    <span className="text-[11px] font-medium text-gray-700">{product.rating}</span>
                  </div>
                  <span className="text-gray-200 text-xs">|</span>
                  <div className="flex items-center gap-0.5">
                    <FaCheckCircle className="w-2.5 h-2.5 text-green-500" />
                    <span className="text-[11px] text-gray-500">{product.reviews} Reviews</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-bold text-gray-900">
                      PKR {product.price.toLocaleString()}
                    </span>
                    {product.oldPrice != null && (
                      <span className="text-[10px] text-gray-400 line-through">
                        PKR {product.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); setModal(product); }}
                    className="w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center text-base font-bold active:scale-95 transition-all flex-shrink-0 ml-2"
                    aria-label="Quick add"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {modal && (
        <ProductDetailsModal product={modal} onClose={() => setModal(null)} />
      )}
    </section>
  );
}
