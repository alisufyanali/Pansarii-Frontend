"use client";

import Image from 'next/image';
import { FaStar, FaCheckCircle, FaShoppingCart } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductDetailsModal from "./ProductDetailsModal";
import type { Product } from "@/types/product";

export default function ProductCard2({ product }: { product: Product }) {
  const [isHovered,   setIsHovered]   = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/products/${product.nameEn.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const handleQuickView = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="w-full h-full rounded-xl overflow-hidden flex flex-col bg-white cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-300 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Fixed-height image */}
        <div className="relative w-full h-44 flex-shrink-0 overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src={isHovered ? (product.hoverImg ?? product.img) : product.img}
              alt={product.nameEn}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

          {/* Quick View button — appears on hover */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <button
              onClick={handleQuickView}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-700 text-white text-xs font-medium shadow-lg
                         translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
            >
              Quick View
              <FaShoppingCart size={12} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-3 bg-gray-50 text-center">

          <div className="flex-1 space-y-1">
            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{product.nameEn}</p>
            <p
              className="text-sm font-medium text-gray-700 line-clamp-1"
              style={{ fontFamily: '"Noto Nastaliq Urdu", "Traditional Arabic", system-ui, sans-serif' }}
            >
              {product.nameUr}
            </p>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-600 pt-0.5">
              <span className="flex items-center gap-1 text-yellow-500">
                <FaStar size={11} /> {product.rating}
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1 text-green-600">
                <FaCheckCircle size={11} /> {product.reviews}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-2 flex-shrink-0">
            <span className="text-sm font-bold text-gray-900">PKR {product.price}</span>
            {product.oldPrice !== null && product.oldPrice !== undefined && (
              <span className="text-xs text-gray-400 line-through">PKR {product.oldPrice}</span>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ProductDetailsModal product={product} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
