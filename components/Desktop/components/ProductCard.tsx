"use client";

import SafeImage from '@/components/SafeImage';
import { FaStar, FaCheckCircle, FaShoppingCart } from "react-icons/fa";
import { useState, MouseEvent } from "react";
import ProductDetailsModal from "./ProductDetailsModal";
import { useRouter } from "next/navigation";
import { Product } from '@/types/product';

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/products/${product.slug ?? product.nameEn.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const handleQuickAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const displayImage = isHovered && product.hoverImg ? product.hoverImg : product.img;

  return (
    <>
      <div
        className={`w-full h-full rounded-2xl overflow-hidden flex flex-col bg-white cursor-pointer transition-all duration-300 border-2 ${isHovered ? 'border-green-700' : 'border-gray-200'
          }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Fixed-height image */}
        <div className="relative w-full h-44 flex-shrink-0 border-b border-gray-100">
          <div className="absolute inset-y-0 left-1/4 w-1/2">
            <SafeImage
              src={displayImage}
              alt={product.nameEn}
              fill
              className="object-contain transition-all duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"
              loading={priority ? "eager" : "lazy"}
              priority={priority}
            />
          </div>
          {product.sale && (
            <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-500 text-white text-[11px] font-medium rounded-full">
              {product.sale}
            </span>
          )}
        </div>

        {/* Content — flex-col so button always sticks to bottom */}
        <div className="flex-1 flex flex-col p-3">

          {/* Text block — fixed height via line-clamp */}
          <div className="flex-1 text-center space-y-1">
            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{product.nameEn}</p>
            <p
              className="text-sm font-medium text-gray-700 line-clamp-1"
              style={{ fontFamily: '"Noto Nastaliq Urdu", "Traditional Arabic", system-ui, sans-serif' }}
            >
              {product.nameUr}
            </p>
            <p className="text-xs text-green-700 line-clamp-1">{product.description}</p>

            <div className="flex items-center justify-center gap-2 text-xs font-medium pt-0.5">
              <span className="flex items-center gap-1 text-yellow-500">
                <FaStar size={11} /> {product.rating}
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1 text-green-600">
                <FaCheckCircle size={11} /> {product.reviews}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 pt-0.5">
              <span className="text-sm font-bold text-gray-900">PKR {product.price}</span>
              {product.oldPrice !== null && product.oldPrice !== undefined && (
                <span className="text-xs text-gray-400 line-through">PKR {product.oldPrice}</span>
              )}
            </div>
          </div>

          {/* Quick Add — always at bottom */}
          <button
            onClick={handleQuickAdd}
            className="mt-3 w-full h-10 rounded-full bg-green-600 text-white flex items-center justify-center gap-2 text-sm font-medium hover:bg-green-700 transition-colors flex-shrink-0"
          >
            <span>Quick Add</span>
            <FaShoppingCart size={14} />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <ProductDetailsModal product={product} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
