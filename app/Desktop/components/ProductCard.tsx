"use client";

import { FaStar, FaCheckCircle, FaShoppingCart } from "react-icons/fa";
import { useState, MouseEvent } from "react";
import ProductDetailsModal from "./ProductDetailsModal";
import { useRouter } from "next/navigation";

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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productSlug = product.nameEn.toLowerCase().replace(/\s+/g, '-');
    router.push(`/${productSlug}`);
  };

  const handleQuickAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const displayImage = isHovered && product.hoverImg 
    ? product.hoverImg 
    : product.img;

  return (
    <>
      <div 
        className="w-full rounded-[18px] overflow-hidden flex flex-col bg-white cursor-pointer transition-all duration-300 h-full"
        style={{ 
          border: isHovered ? '2px solid #197B33' : '2px solid #E5E7EB'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        
        {/* Image Section with bottom border */}
        <div className="relative w-full h-[180px] border-b border-gray-200">
          <img
            src={displayImage}
            alt={product.nameEn}
            className="w-full h-full object-cover transition-all duration-300"
          />

          {/* Sale Badge - Check for null/undefined */}
          {product.sale && product.sale !== null && product.sale !== undefined && (
            <div className="absolute top-2 right-2 w-[60px] h-[22px] rounded-[60px] bg-[#F83A3A] text-white text-[11px] flex items-center justify-center font-medium">
              {product.sale}
            </div>
          )}
        </div>

        {/* Product Details - All content centered */}
        <div className="flex-1 bg-white p-3 flex flex-col justify-between items-center">
          
          {/* Text Content - Centered */}
          <div className="w-full text-center">
            {/* English name - smaller */}
            <p className="text-[14px] font-medium truncate text-center text-gray-800">{product.nameEn}</p>
            
            {/* Urdu name - visible with proper font and spacing */}
            <p className="text-[16px] font-medium truncate text-center text-gray-900 mt-0.5 mb-1" style={{ fontFamily: 'system-ui, -apple-system, "Noto Nastaliq Urdu", "Traditional Arabic", sans-serif' }}>
              {product.nameUr}
            </p>
            
            {/* Description - smaller */}
            <p className="text-xs text-[#197B33] truncate text-center">{product.description}</p>

            {/* Rating & Reviews - Centered - smaller text */}
            <div className="flex items-center justify-center gap-3 mt-1 text-xs font-medium flex-wrap">
              <div className="flex items-center gap-1 text-yellow-400">
                <FaStar size={12} /> <span>{product.rating}</span>
              </div>|
              <div className="flex items-center gap-1 text-green-600">
                <FaCheckCircle size={12} /> <span>{product.reviews} Reviews</span>
              </div>
            </div>

            {/* Price - Centered with null check - smaller */}
            <div className="flex items-center justify-center gap-2 mt-1.5 flex-wrap">
              <p className="text-[15px] font-bold">PKR {product.price}</p>
              {product.oldPrice !== null && product.oldPrice !== undefined && (
                <p className="text-xs text-gray-500 line-through">PKR {product.oldPrice}</p>
              )}
            </div>
          </div>

          {/* Quick Add Button - Centered with icon on right - smaller height */}
          <div className="w-full flex justify-center">
            <button 
              onClick={handleQuickAdd}
              className="w-[100%] h-[42px] mt-2 rounded-[57px] border border-gray-300 bg-[#50B46B] text-white flex items-center font-medium text-sm hover:bg-[#146128] transition-colors"
            >
              <span className="flex-1 text-center">Quick Add</span>
              <FaShoppingCart className="mr-5" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Modal (for Quick Add) */}
      {isModalOpen && (
        <ProductDetailsModal 
          product={product} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}