"use client";

import { useState, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import SafeImage from '@/components/SafeImage';
import { FaStar } from 'react-icons/fa';
import ProductDetailsModal from '@/components/Desktop/components/ProductDetailsModal';
import type { Product } from '@/types/product';

export default function MobileProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/${product.slug ?? product.nameEn.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const handleQuickAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-transform h-full"
        onClick={handleCardClick}
      >
        {/* Fixed-height image */}
        <div className="relative w-full h-36 flex-shrink-0 bg-gray-50">
          {product.sale && (
            <span className="absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
              {product.sale}
            </span>
          )}
          <SafeImage
            src={product.img}
            alt={product.nameEn}
            fill
            className="object-contain p-2"
            sizes="50vw"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
          />
        </div>

        {/* Content — flex-col so price+button always at bottom */}
        <div className="flex flex-col flex-1 p-2.5 overflow-hidden">

          {/* Text — fixed height via line-clamp */}
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug mb-1">
              {product.nameEn}
            </h3>
            <p className="text-[12px] text-gray-400 line-clamp-1 mb-1 overflow-hidden max-w-full">
              {product.nameUr}
            </p>
            
            <div className="flex items-center gap-1 mb-1">
              <FaStar className="w-2.5 h-2.5 text-yellow-400 flex-shrink-0" />
              <span className="text-[10px] text-gray-500">{product.rating} · {product.reviews} reviews</span>
            </div>
          </div>

          {/* Price + button — always at bottom */}
          <div className="flex items-center justify-between mt-1.5 flex-shrink-0">
            <div className="min-w-0">
              <span className="text-sm font-bold text-gray-900 block leading-tight">
                PKR {product.price.toLocaleString()}
              </span>
              {product.oldPrice !== null && product.oldPrice !== undefined && (
                <span className="text-[10px] text-gray-400 line-through">
                  PKR {product.oldPrice.toLocaleString()}
                </span>
              )}
            </div>
            <button
              onClick={handleQuickAdd}
              className="w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center hover:bg-green-800 active:scale-95 transition-all flex-shrink-0 ml-1"
              aria-label="Add to cart"
            >
              <span className="text-base font-bold leading-none">+</span>
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ProductDetailsModal product={product} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
