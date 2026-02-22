"use client";

import { FaStar, FaCheckCircle, FaShoppingCart } from "react-icons/fa";
import { useState, MouseEvent } from "react";
import ProductDetailsModal from "./ProductDetailsModal";
import { useRouter } from "next/navigation"; // Add this import

interface Product {
  id?: string | number;
  img: string;
  hoverImg?: string; // ADD: Hover image property
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
  const router = useRouter(); // Add router

  // Handle entire card click (navigates to product details page)
  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Navigate to product details page with product ID
    // You should add a slug or ID to your product for better URLs
    const productSlug = product.nameEn.toLowerCase().replace(/\s+/g, '-');
    router.push(`/product/${productSlug}`);
    
    // OR if you want to pass the entire product as query params:
    // router.push(`/product-details?product=${encodeURIComponent(JSON.stringify(product))}`);
  };

  const handleQuickAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  // Determine which image to display
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
        onClick={handleCardClick} // Add click handler here
      >
        
        {/* Image Section with bottom border */}
        <div className="relative w-full h-[200px] border-b border-gray-200">
          <img
            src={displayImage}
            alt={product.nameEn}
            className="w-full h-full object-cover transition-all duration-300"
          />

          {/* Sale Badge - Check for null/undefined */}
          {product.sale && product.sale !== null && product.sale !== undefined && (
            <div className="absolute top-3 right-3 w-[68px] h-[23px] rounded-[60px] bg-[#F83A3A] text-white text-xs flex items-center justify-center font-medium">
              {product.sale}
            </div>
          )}
        </div>

        {/* Product Details - All content centered */}
        <div className="flex-1 bg-white p-4 flex flex-col justify-between items-center">
          
          {/* Text Content - Centered */}
          <div className="w-full text-center">
            <p className="text-[17px] font-medium truncate text-center">{product.nameEn}</p>
            <p className="text-[17px] font-medium truncate text-center">{product.nameUr}</p>
            <p className="text-sm text-[#197B33] truncate text-center">{product.description}</p>

            {/* Rating & Reviews - Centered */}
            <div className="flex items-center justify-center gap-4 mt-1 text-sm font-medium flex-wrap">
              <div className="flex items-center gap-1 text-yellow-400">
                <FaStar /> <span>{product.rating}</span>
              </div>|
              <div className="flex items-center gap-1 text-green-600">
                <FaCheckCircle /> <span>{product.reviews} Reviews</span>
              </div>
            </div>

            {/* Price - Centered with null check */}
            <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
              <p className="text-[17px] font-bold">PKR {product.price}</p>
              {product.oldPrice !== null && product.oldPrice !== undefined && (
                <p className="text-sm text-gray-500 line-through">PKR {product.oldPrice}</p>
              )}
            </div>
          </div>

          {/* Quick Add Button - Centered with icon on right */}
          <div className="w-full flex justify-center">
            <button 
              onClick={handleQuickAdd}
              className="w-[100%] h-[50px] mt-3 rounded-[57px] border border-gray-300 bg-[#50B46B] text-white flex items-center font-medium hover:bg-[#146128] transition-colors"
            >
              <span className="flex-1 text-center">Quick Add</span>
              <FaShoppingCart className="mr-6" />
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