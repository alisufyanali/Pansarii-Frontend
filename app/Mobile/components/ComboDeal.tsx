"use client";

import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { allProducts } from '@/app/Desktop/data/products';

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

  const products = allProducts
    .filter(p => p.category === 'Supplements' || p.sale)
    .slice(0, 8);

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
        <div className="absolute inset-0 opacity-20">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border-2 border-white/40"
              style={{
                width: `${120 + i * 60}px`,
                height: `${120 + i * 60}px`,
                top: `${-20 + i * 10}px`,
                left: `${-30 + i * 5}px`,
              }}
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
              className={`combo-card flex-shrink-0 rounded-2xl bg-gradient-to-b ${cardGradients[i % cardGradients.length]} overflow-hidden cursor-pointer active:scale-95 transition-transform shadow-md`}
              style={{ width: 'calc((100vw - 44px) / 2.3)' }}
              onClick={() => router.push(`/${product.nameEn.toLowerCase().replace(/\s+/g, '-')}`)}
            >
              {/* Sale badge + Buy 1 Get 1 */}
              <div className="relative pt-2 px-2">
                {/* Sale badge — top left */}
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-1 rounded-md leading-tight text-center z-10">
                  Sale<br />{product.sale || '20%'}
                </div>

                {/* Buy 1 Get 1 — top right */}
                <div className="absolute top-2 right-2 bg-green-700 text-white text-[8px] font-bold w-10 h-10 rounded-full flex items-center justify-center text-center leading-tight z-10">
                  Buy 1<br />Get 1
                </div>

                {/* Product image */}
                <div className="flex items-center justify-center h-32 pt-4">
                  <img
                    src={product.img}
                    alt={product.nameEn}
                    className="h-full w-auto object-contain drop-shadow-md"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="bg-white/80 px-3 py-2.5">
                <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug text-center mb-1.5">
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
