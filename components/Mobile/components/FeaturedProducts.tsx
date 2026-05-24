"use client";

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaStar, FaCheckCircle } from 'react-icons/fa';
import { bestSellers } from '@/data/products';
import ProductDetailsModal from '@/components/Desktop/components/ProductDetailsModal';
import type { Product } from '@/types/product';

export default function MobileFeaturedProducts() {
  const router      = useRouter();
  const sliderRef   = useRef<HTMLDivElement>(null);
  const isHovering  = useRef(false);
  const [modal, setModal] = useState<Product | null>(null);

  const products = bestSellers.slice(0, 10);

  // Auto-slide every 3s — only horizontal, never scrolls the page
  useEffect(() => {
    const t = setInterval(() => {
      if (isHovering.current) return;
      const el = sliderRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      if (atEnd) {
        el.scrollLeft = 0;
      } else {
        const card = el.querySelector('.feat-card') as HTMLElement;
        const step = card ? card.offsetWidth + 12 : 260;
        el.scrollLeft += step;
      }
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-4">

      {/* Header — no buttons */}
      <div className="px-4 mb-3">
        <h2 className="text-base font-bold text-gray-900">Featured Products</h2>
      </div>

      {/* Slider — 1 full + half peeking */}
      <div
        ref={sliderRef}
        className="flex gap-3 overflow-x-auto no-scrollbar pl-4 pr-8"
        onMouseEnter={() => { isHovering.current = true;  }}
        onMouseLeave={() => { isHovering.current = false; }}
        onTouchStart={() => { isHovering.current = true;  }}
        onTouchEnd={() => {
          setTimeout(() => { isHovering.current = false; }, 2000);
        }}
      >
        {products.map(product => (
          <div
            key={product.id}
            className="feat-card flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
            style={{ width: '65vw' }}
            onClick={() => router.push(`/products/${product.nameEn.toLowerCase().replace(/\s+/g, '-')}`)}
          >
            <div className="flex items-center p-3 gap-3">

              {/* Image */}
              <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                <img
                  src={product.img}
                  alt={product.nameEn}
                  className="w-full h-full object-contain p-1.5"
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
                <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                  {product.nameUr}
                </p>

                {/* Rating + Reviews */}
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

                {/* Price */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-bold text-gray-900">
                      PKR {product.price.toLocaleString()}
                    </span>
                    {product.oldPrice && (
                      <span className="text-[10px] text-gray-400 line-through">
                        PKR {product.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); setModal(product); }}
                    className="w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center text-base font-bold active:scale-95 transition-all flex-shrink-0 ml-2"
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
