"use client";

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFeaturedProducts } from '@/lib/products';
import type { Product } from '@/types/product';

const cardGradients = [
  'from-green-100 to-yellow-100',
  'from-orange-100 to-yellow-200',
  'from-purple-100 to-pink-100',
  'from-blue-100 to-cyan-100',
];

export default function MobileComboDeal() {
  const router    = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);
  const isTouch   = useRef(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getFeaturedProducts()
      .then(data => setProducts(data.slice(0, 8)))
      .catch(() => setProducts([]));
  }, []);

  // Auto-slide every 3s
  useEffect(() => {
    const t = setInterval(() => {
      if (isTouch.current) return;
      const el = sliderRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      if (atEnd) { el.scrollLeft = 0; }
      else {
        const card = el.querySelector('.combo-card') as HTMLElement;
        el.scrollLeft += (card ? card.offsetWidth + 12 : 180);
      }
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="mt-2">

      {/* Green banner header */}
      <div className="relative bg-green-700 px-5 pt-5 pb-16 overflow-hidden">
        {/* Wavy background lines */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {[40, 60, 80, 100, 120, 140].map((size, i) => (
            <div
              key={i}
              className="absolute rounded-full border-2 border-white/40"
              style={{ width: size * 3, height: size * 3, top: -20 + i * 10, left: -30 + i * 5 }}
            />
          ))}
        </div>

        {/* Title */}
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white leading-tight">
            Combo
          </h2>
          <h2 className="text-3xl font-black text-white/90 leading-tight border-2 border-white/60 rounded-lg px-2 inline-block mt-1">
            Deal
          </h2>
        </div>

        {/* Discount badge */}
        <div className="absolute top-4 right-4 z-10 bg-amber-400 rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-lg">
          <span className="text-white text-xs font-bold leading-tight">Discount</span>
          <span className="text-white text-xl font-black leading-tight">20%</span>
        </div>
      </div>

      {/* Cards — overlap the green banner */}
      <div className="px-4 -mt-10">
        <div
          ref={sliderRef}
          className="flex gap-3 overflow-x-auto no-scrollbar pb-2"
          onTouchStart={() => { isTouch.current = true; }}
          onTouchEnd={() => { setTimeout(() => { isTouch.current = false; }, 2000); }}
        >
      {products.map((product, i) => (
            <div
              key={product.id}
              className={`combo-card flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-transform shadow-lg`}
              style={{ width: 'calc((100vw - 44px) / 2.3)' }}
              onClick={() => router.push(`/products/${product.slug ?? product.nameEn.toLowerCase().replace(/\s+/g, '-')}`)}
            >
              {/* Top — gradient image area */}
              <div className={`relative bg-gradient-to-br ${cardGradients[i % cardGradients.length]} pt-3 min-h-[180px]`}>
                {/* Sale badge — top left, ribbon style */}
                <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-black px-2 py-1.5 rounded-br-xl rounded-tl-2xl leading-tight text-center z-10 min-w-[44px]">
                  Sale<br />{product.sale || '20%'}
                </div>

                {/* Buy 1 Get 1 — top right, hexagon-ish */}
                <div className="absolute top-2 right-2 bg-green-700 text-white text-[8px] font-bold w-11 h-11 rounded-full flex items-center justify-center text-center leading-tight z-10 shadow-md">
                  Buy 1<br />Get 1
                </div>

                {/* Product image — large, centered */}
                <div className="flex items-end justify-center h-40 px-4">
                  <img
                    src={product.img}
                    alt={product.nameEn}
                    className="w-full h-full object-contain drop-shadow-xl"
                  />
                </div>
              </div>

              {/* Bottom — white info area */}
              <div className="bg-white px-3 py-3">
                <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug text-center mb-2">
                  {product.nameEn}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-bold text-gray-900">PKR {product.price}</span>
                  {product.oldPrice && (
                    <span className="text-[10px] text-gray-400 line-through">PKR {product.oldPrice}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
