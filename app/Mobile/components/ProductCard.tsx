// app/Mobile/components/MobileProductCard.tsx
"use client";

import { useState, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProductDetailsModal from '@/app/Desktop/components/ProductDetailsModal';

interface MobileProductCardProps {
  id: string;
  image: string;
  name: string;
  nameUr?: string;
  features: string[];
  price: number;
  oldPrice?: number;
  sale?: string;
  currency?: string;
  // Full product object for modal
  product?: any;
}

export default function MobileProductCard({ 
  id, 
  image, 
  name, 
  nameUr,
  features, 
  price, 
  oldPrice, 
  sale, 
  currency = 'PKR',
  product
}: MobileProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Handle card click - navigate to product details
  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productSlug = name.toLowerCase().replace(/\s+/g, '-');
    router.push(`/${productSlug}`);
  };

  // Handle add button click - open modal
  const handleAddClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  // Prepare full product object for modal
  const fullProduct = product || {
    id,
    img: image,
    nameEn: name,
    nameUr: nameUr || name,
    description: features.join(' • '),
    rating: 4.5,
    reviews: 0,
    price,
    oldPrice,
    sale,
    features: features.map(f => ({ text: f, hasCheck: true })),
  };

  return (
    <>
      <div 
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Image Section */}
        <div className="relative w-full h-36 bg-gray-50">
          {/* Sale Badge */}
          {sale && (
            <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
              {sale}
            </div>
          )}
          
          {/* Product Image */}
          <Image 
            src={image} 
            alt={name} 
            fill 
            className="object-contain p-2" 
            sizes="50vw"
            onError={(e) => { 
              (e.target as HTMLImageElement).src = '/images/product.png'; 
            }} 
          />
        </div>
        
        {/* Content Section */}
        <div className="p-2.5">
          {/* Product Name */}
          <h3 className="font-semibold text-xs text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]">
            {name}
          </h3>
          
          {/* Urdu Name (Optional) */}
          {nameUr && (
            <p className="text-[10px] text-gray-500 mb-1 line-clamp-1">
              {nameUr}
            </p>
          )}
          
          {/* Features */}
          <div className="flex flex-wrap gap-x-1 mb-2">
            {features.slice(0, 2).map((f, i) => (
              <span key={i} className="text-[10px] text-gray-400">
                {f}{i < Math.min(features.length, 2) - 1 && ' •'}
              </span>
            ))}
          </div>
          
          {/* Price & Add to Cart Button */}
          <div className="flex items-center justify-between">
            {/* Price Section */}
            <div>
              <span className="text-sm font-bold text-gray-900">
                {currency} {price.toLocaleString('en-PK')}
              </span>
              {oldPrice && (
                <span className="text-[10px] text-gray-400 line-through ml-1">
                  {currency} {oldPrice.toLocaleString('en-PK')}
                </span>
              )}
            </div>
            
            {/* Quick Add Button - Opens Modal */}
            <button 
              onClick={handleAddClick}
              className="w-7 h-7 rounded-full bg-[#197B33] flex items-center justify-center hover:bg-[#156529] active:scale-95 transition-all"
              aria-label="Quick add to cart"
            >
              <span className="text-white text-base font-bold leading-none">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Modal (Quick Add) */}
      {isModalOpen && (
        <ProductDetailsModal 
          product={fullProduct} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}

// Helper function to convert product data to MobileProductCard props
export function toMobileCardProps(product: any): any {
  return {
    id: String(product.id), 
    image: product.img ?? '/images/product.png', 
    name: product.nameEn,
    nameUr: product.nameUr,
    features: ([product.category, product.description] as (string | null | undefined)[])
      .filter((v): v is string => typeof v === 'string' && v.length > 0),
    price: product.price, 
    oldPrice: product.oldPrice ?? undefined,
    sale: product.sale ?? undefined, 
    currency: 'PKR',
    product: product, // Pass full product for modal
  };
}