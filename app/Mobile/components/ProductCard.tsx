// app/Mobile/components/MobileProductCard.tsx
"use client";

import { useState, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProductDetailsModal from '@/app/Desktop/components/ProductDetailsModal';

// Same Product interface as Desktop
interface Product {
  id?: string | number;
  img: string;
  hoverImg?: string;
  nameEn: string;
  nameUr: string;
  description: string;
  rating: number;
  reviews: number;
  price: number;
  oldPrice?: number | null;
  sale?: string | null;
  [key: string]: any;
}

interface MobileProductCardProps {
  product: Product;
}

export default function MobileProductCard({ product }: MobileProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  // Handle card click - navigate to product details (same as desktop)
  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productSlug = product.nameEn.toLowerCase().replace(/\s+/g, '-');
    router.push(`/${productSlug}`);
  };

  // Handle quick add click - open modal (same as desktop)
  const handleQuickAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div 
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
        onClick={handleCardClick}
      >
        {/* Image Section */}
        <div className="relative w-full h-36 bg-gray-50">
          {/* Sale Badge - Same null checks as desktop */}
          {product.sale && product.sale !== null && product.sale !== undefined && (
            <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
              {product.sale}
            </div>
          )}
          
          {/* Product Image */}
          <Image 
            src={product.img} 
            alt={product.nameEn} 
            fill 
            className="object-contain p-2" 
            sizes="50vw"
            priority={false}
            loading="lazy"
          />
        </div>
        
        {/* Content Section */}
        <div className="p-2.5">
          {/* Product Name (English) */}
          <h3 className="font-semibold text-xs text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]">
            {product.nameEn}
          </h3>
          
          {/* Urdu Name */}
          <p className="text-[10px] text-gray-500 mb-1 line-clamp-1">
            {product.nameUr}
          </p>
          
          {/* Description */}
          <div className="flex flex-wrap gap-x-1 mb-2">
            <span className="text-[10px] text-gray-400 line-clamp-1">
              {product.description}
            </span>
          </div>
          
          {/* Price & Add to Cart Button */}
          <div className="flex items-center justify-between">
            {/* Price Section - Same null checks as desktop */}
            <div>
              <span className="text-sm font-bold text-gray-900">
                PKR {product.price.toLocaleString('en-PK')}
              </span>
              {product.oldPrice !== null && product.oldPrice !== undefined && (
                <span className="text-[10px] text-gray-400 line-through ml-1">
                  PKR {product.oldPrice.toLocaleString('en-PK')}
                </span>
              )}
            </div>
            
            {/* Quick Add Button - Opens Modal (same as desktop) */}
            <button 
              onClick={handleQuickAdd}
              className="w-7 h-7 rounded-full bg-[#197B33] flex items-center justify-center hover:bg-[#156529] active:scale-95 transition-all"
              aria-label="Quick add to cart"
            >
              <span className="text-white text-base font-bold leading-none">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Modal (for Quick Add) - Same as desktop */}
      {isModalOpen && (
        <ProductDetailsModal 
          product={product} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}

// Helper function to convert old prop format to new Product format
// This ensures backward compatibility with existing code
export function toMobileCardProps(product: any): { product: Product } {
  return {
    product: {
      id: product.id,
      img: product.img ?? '/images/product.png',
      hoverImg: product.hoverImg,
      nameEn: product.nameEn,
      nameUr: product.nameUr || product.nameEn,
      description: product.description || product.category || '',
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
      price: product.price,
      oldPrice: product.oldPrice ?? null,
      sale: product.sale ?? null,
      ...product, // Spread any additional properties
    }
  };
}