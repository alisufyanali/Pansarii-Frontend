"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductDetailsModal from "./ProductDetailsModal";

// EXACT SAME interface as ProductCard
interface Product {
  id?: string | number;
  img: string;
  nameEn: string;
  nameUr: string;
  description?: string;
  rating: number;
  reviews: number;
  price: number;
  oldPrice?: number | null; // Must match exactly
  sale?: string | null; // Add null here too
  additionalImages?: string[];
  sizes?: string[];
  benefits?: string[];
  features?: (string | { text: string; hasCheck?: boolean })[];
  infoLines?: string[];
  points?: number;
  hoverimg: string;
  [key: string]: any;
}

interface ProductCard2Props {
  product: Product;
}

export default function ProductCard2({ product }: ProductCard2Props) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  // Handle entire card click (navigates to product details page)
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Navigate to product details page with product ID or slug
    const productSlug = product.nameEn.toLowerCase().replace(/\s+/g, '-');
    router.push(`/product/${productSlug}`);
    
    // Alternative: if you want to use ID instead
    // router.push(`/product/${product.id || productSlug}`);
  };

  const handleQuickView = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div 
        className="featured-card w-full max-w-[320px] h-auto rounded-lg overflow-hidden flex flex-col bg-white relative group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick} // Add click handler here
      >
        {/* Image Section */}
        <div className="w-full aspect-[4/3] relative flex-shrink-0 overflow-hidden">
          <img
            src={isHovered ? product.hoverimg : product.img}
            alt={product.nameEn}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          />
          
          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
          
          {/* Add to Cart Button - CENTERED in image div */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <button
              onClick={handleQuickView} // Renamed for clarity
              className="flex items-center justify-between px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-[#1E7B4D] hover:bg-green-700"
              style={{ minWidth: "180px" }}
            >
              <span className="text-white font-medium text-sm">
                Quick View
              </span>
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.4 5m13.8-5h-5.8m0 0l1.4 5m-9.2-5h5.8M9 13l-1.4 5m9.2-5l1.4 5m-9.2 0h7.2" 
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 bg-[#F3F3F3] p-4 flex flex-col justify-between items-center text-center min-h-[140px] border-t-0">
          <div className="w-full">
            {/* Product Names */}
            <div className="mb-2">
              <p className="text-[17px] font-medium leading-tight">{product.nameEn}</p>
              <p className="text-[17px] font-medium leading-tight">{product.nameUr}</p>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center justify-center gap-3 mb-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                {/* Star Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.376-2.455a1 1 0 00-1.176 0l-3.376 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.048 9.384c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
                <span>{product.rating}</span>
              </div>

              <div className="flex items-center gap-1">
                {/* Green Circle with White Tick */}
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-2 w-2 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>{product.reviews} Reviews</span>
              </div>
            </div>
          </div>

          {/* Price - Fixed to handle null properly */}
          <div className="w-full">
            <div className="flex items-center justify-center gap-2">
              <p className="text-[17px] font-bold">PKR {product.price}</p>
              {product.oldPrice !== null && product.oldPrice !== undefined && (
                <p className="text-sm text-gray-500 line-through">PKR {product.oldPrice}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {isModalOpen && (
        <ProductDetailsModal 
          product={product} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}