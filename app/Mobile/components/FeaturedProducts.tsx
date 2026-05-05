"use client";

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaChevronLeft, FaChevronRight, FaStar, FaCheckCircle } from 'react-icons/fa';
import { bestSellers } from '@/app/Desktop/data/products';
import ProductDetailsModal from '@/app/Desktop/components/ProductDetailsModal';

export default function MobileFeaturedProducts() {
  const router    = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [modal,    setModal]    = useState<any>(null);

  const products = bestSellers.slice(0, 10);

  const checkScroll = () => {
    const el = sliderRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    return () => el.removeEventListener('scroll', checkScroll);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = sliderRef.current;
    if (!el) return;
    const card = el.querySelector('.feat-card') as HTMLElement;
    const step = card ? card.offsetWidth + 12 : 200;
    el.scrollBy({ left: dir === 'right' ? step : -step, behavior: 'smooth' });
  };

  return (
    <section className="px-4 py-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900">Featured Products</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canLeft}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              canLeft ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-300'
            }`}
          >
            <FaChevronLeft className="w-3 h-3" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canRight}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              canRight ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-300'
            }`}
          >
            <FaChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Horizontal scroll — 2 cards visible, 3rd peeking */}
      <div
        ref={sliderRef}
        className="flex gap-3 overflow-x-auto no-scrollbar pb-1"
      >
        {products.map(product => (
          <div
            key={product.id}
            className="feat-card flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-transform flex"
            style={{ width: 'calc((100vw - 32px - 12px) / 1.9)' }}
            onClick={() => router.push(`/${product.nameEn.toLowerCase().replace(/\s+/g, '-')}`)}
          >
            {/* Left — image */}
            <div className="relative w-24 flex-shrink-0 bg-gray-50">
              <img
                src={product.img}
                alt={product.nameEn}
                className="w-full h-full object-contain p-2"
              />
              {product.sale && (
                <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                  {product.sale}
                </span>
              )}
            </div>

            {/* Right — info */}
            <div className="flex-1 p-2.5 flex flex-col justify-between min-w-0">
              <div>
                <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug">
                  {product.nameEn}
                </p>
                <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                  {product.nameUr}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-1.5 text-[11px]">
                  <div className="flex items-center gap-0.5 text-yellow-400">
                    <FaStar className="w-2.5 h-2.5" />
                    <span className="text-gray-700 font-medium">{product.rating}</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <div className="flex items-center gap-0.5 text-green-600">
                    <FaCheckCircle className="w-2.5 h-2.5" />
                    <span className="text-gray-500">{product.reviews}</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mt-2">
                <div>
                  <span className="text-sm font-bold text-gray-900">PKR {product.price}</span>
                  {product.oldPrice && (
                    <span className="text-[10px] text-gray-400 line-through ml-1">PKR {product.oldPrice}</span>
                  )}
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setModal(product); }}
                  className="w-6 h-6 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold hover:bg-green-800 active:scale-95 transition-all"
                >
                  +
                </button>
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
