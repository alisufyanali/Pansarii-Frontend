// app/Mobile/components/ProductCard.tsx
"use client";

import Image from "next/image";
import { FaStar, FaCheckCircle, FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import { useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import ProductDetailsModal from "../../Desktop/components/ProductDetailsModal"; // Import the modal

interface ProductCardProps {
  id: string;
  image: string;
  hoverImage?: string;
  name: string;
  nameUr?: string;
  features: string[];
  price: number;
  oldPrice?: number;
  rating?: number;
  reviews?: number;
  sale?: string;
  description?: string;
  inStock?: boolean;
  currency?: string;
  onAddToCart?: (id: string) => void;
  onToggleWishlist?: (id: string) => void;
  isInWishlist?: boolean;
  className?: string;
}

export default function ProductCard({
  id,
  image,
  hoverImage,
  name,
  nameUr,
  features,
  price,
  oldPrice,
  rating = 4.5,
  reviews = 0,
  sale,
  description,
  inStock = true,
  currency = "PKR",
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
  className = ""
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWishlist, setIsWishlist] = useState(isInWishlist);
  const router = useRouter();

  // Format price with comma separators
  const formattedPrice = price.toLocaleString('en-PK');
  const formattedOldPrice = oldPrice?.toLocaleString('en-PK');

  // Calculate discount percentage
  const discountPercentage = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  // Handle card click - navigate to product details
  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productSlug = name.toLowerCase().replace(/\s+/g, '-');
    router.push(`/product/${productSlug}`);
  };

  // Handle quick add click
  const handleQuickAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onAddToCart && inStock) {
      onAddToCart(id);
      
      // Optional: Show feedback
      const button = e.currentTarget;
      const originalText = button.innerHTML;
      button.innerHTML = 'Added!';
      setTimeout(() => {
        button.innerHTML = originalText;
      }, 1000);
    }
  };

  // Handle quick view click - opens modal
  const handleQuickView = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onToggleWishlist) {
      onToggleWishlist(id);
      setIsWishlist(!isWishlist);
    }
  };

  // Determine which image to display
  const displayImage = isHovered && hoverImage ? hoverImage : image;

  // Create product object in the format expected by ProductDetailsModal
  const modalProduct = {
    id: id,
    img: image,
    hoverImg: hoverImage,
    nameEn: name,
    nameUr: nameUr || name,
    description: description || features.join(' • '),
    rating: rating,
    reviews: reviews,
    price: price,
    oldPrice: oldPrice || null,
    sale: sale || null,
    inStock: inStock,
    features: features
  };

  return (
    <>
      <div 
        className={`w-full aspect-square bg-white rounded-xl overflow-hidden flex flex-col transition-all duration-300 cursor-pointer group ${className}`}
        style={{ 
          border: isHovered ? '2px solid #10B981' : '1px solid #E5E7EB',
          boxShadow: isHovered ? '0 10px 25px -5px rgba(0, 0, 0, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Image Section - Square proportion */}
        <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            src={displayImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
          
          {/* Sale Badge */}
          {sale && (
            <div className="absolute top-2 left-2 z-10">
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                {sale}
              </span>
            </div>
          )}
          
          {/* Discount Badge */}
          {oldPrice && discountPercentage > 0 && (
            <div className="absolute top-2 right-2 z-10">
              <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                -{discountPercentage}%
              </span>
            </div>
          )}

          {/* Out of Stock Badge */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <span className="px-3 py-1.5 bg-gray-800 text-white text-xs font-bold rounded-full">
                Out of Stock
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          {onToggleWishlist && (
            <button
              onClick={handleWishlistToggle}
              className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-md z-20"
              aria-label={isWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isWishlist ? (
                <FaHeart className="w-4 h-4 text-red-500 fill-red-500" />
              ) : (
                <FaRegHeart className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}

          {/* Quick View Button - Appears on Hover */}
          <button
            onClick={handleQuickView}
            className="absolute inset-x-0 bottom-0 py-2 bg-black/70 text-white text-xs font-medium text-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-20"
          >
            Quick View
          </button>
        </div>

        {/* Product Details */}
        <div className="flex-1 p-2 flex flex-col bg-white">
          {/* Title and Urdu Name */}
          <div className="text-center mb-1">
            <h3 className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-1">
              {name}
            </h3>
            {nameUr && (
              <p className="text-[10px] sm:text-xs text-gray-600 line-clamp-1 font-arabic">
                {nameUr}
              </p>
            )}
          </div>

          {/* Features / Tags */}
          {features.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mb-1">
              {features.slice(0, 2).map((feature, index) => (
                <span key={index} className="text-[8px] sm:text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                  {feature}
                </span>
              ))}
              {features.length > 2 && (
                <span className="text-[8px] sm:text-[10px] text-gray-500">+{features.length - 2}</span>
              )}
            </div>
          )}

          {/* Description */}
          {description && (
            <p className="text-[8px] sm:text-[10px] text-gray-500 text-center line-clamp-1 mb-1">
              {description}
            </p>
          )}

          {/* Rating & Reviews */}
          <div className="flex items-center justify-center gap-1 text-[8px] sm:text-[10px] mb-1">
            <div className="flex items-center gap-0.5">
              <FaStar className="w-2.5 h-2.5 text-yellow-400" />
              <span className="font-medium text-gray-700">{rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-0.5">
              <FaCheckCircle className="w-2.5 h-2.5 text-green-600" />
              <span className="text-gray-600">{reviews}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="font-bold text-green-700 text-xs sm:text-sm">
              {currency} {formattedPrice}
            </span>
            {oldPrice && (
              <span className="text-[8px] sm:text-[10px] text-gray-400 line-through">
                {currency} {formattedOldPrice}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleQuickAdd}
            disabled={!inStock}
            className={`w-full py-1.5 sm:py-2 bg-gradient-to-r from-green-600 to-green-500 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              inStock 
                ? 'hover:from-green-700 hover:to-green-600 active:scale-95' 
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <FaShoppingCart className="w-3 h-3" />
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Product Details Modal - Opens on Quick View */}
      {isModalOpen && (
        <ProductDetailsModal 
          product={modalProduct} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}