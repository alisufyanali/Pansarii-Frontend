// app/Mobile/components/ProductCard.tsx
"use client";

import Image from "next/image";
import { useState, MouseEvent } from "react";
import { FaStar, FaCheckCircle, FaShoppingCart, FaHeart } from "react-icons/fa";
import ProductDetailsModal from "../../Desktop/components/ProductDetailsModal";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishList";
import { toast } from 'react-toastify';

interface ProductCardProps {
  id: string | number;
  image: string;
  hoverImg?: string;
  name: string;
  nameUr?: string;
  description?: string;
  features: string[];
  price: number;
  oldPrice?: number | null;
  sale?: string | null;
  rating?: number;
  reviews?: number;
  currency?: string;
  onAddToCart?: (id: string) => void;
  className?: string;
  // Full product object for modal
  product?: any;
}

export default function ProductCard({
  id,
  image,
  hoverImg,
  name,
  nameUr,
  description,
  features,
  price,
  oldPrice,
  sale,
  rating = 4.5,
  reviews = 0,
  currency = "PKR",
  onAddToCart,
  className = "",
  product
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const isInWishlistCheck = isInWishlist(id);

  // Determine which image to display
  const displayImage = isHovered && hoverImg ? hoverImg : image;

  // Format price with comma separators
  const formattedPrice = price.toLocaleString('en-PK');
  const formattedOldPrice = oldPrice ? oldPrice.toLocaleString('en-PK') : null;

  // Calculate discount percentage
  const discountPercentage = oldPrice 
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : null;

  // Handle card click - navigate to product details
  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productSlug = name.toLowerCase().replace(/\s+/g, '-');
    router.push(`/product/${productSlug}`);
  };

  // Handle quick add - open modal
  const handleQuickAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  // Handle add to cart from button
  const handleAddClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onAddToCart) {
      onAddToCart(id.toString());
    } else {
      // Default cart behavior
      addToCart({
        id: id,
        img: image,
        nameEn: name,
        nameUr: nameUr || name,
        price: price,
       
        size: 'Standard',
      });

      toast.success(
        <div className="flex items-center gap-2">
          <span className="text-xl">✓</span>
          <div>
            <div className="font-semibold">Added to cart!</div>
            <div className="text-xs opacity-90">{name}</div>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false,
          style: {
            background: '#15803d',
            color: 'white',
          }
        }
      );
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleWishlist({
      id: id,
      nameEn: name,
      nameUr: nameUr || name,
      price: price,
      img: image,
    });

    toast.success(
      isInWishlistCheck ? 'Removed from wishlist' : 'Added to wishlist',
      {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeButton: false,
      }
    );
  };

  // Prepare product object for modal
  const fullProduct = product || {
    id,
    img: image,
    hoverImg,
    nameEn: name,
    nameUr: nameUr || name,
    description: description || features.join(' • '),
    rating,
    reviews,
    price,
    oldPrice,
    sale,
    features,
  };

  return (
    <>
      <div 
        className={`bg-white rounded-xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 h-full relative group ${className}`}
        style={{ 
          border: isHovered ? '2px solid #197B33' : '2px solid #E5E7EB',
          boxShadow: isHovered ? '0 4px 12px rgba(25, 123, 51, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-50 border-b border-gray-100">
          <div className="relative w-full h-full p-3">
            <Image
              src={displayImage}
              alt={name}
              fill
              className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </div>

          {/* Sale Badge */}
          {(sale || discountPercentage) && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded-full text-[10px] font-bold shadow-md">
              {sale || `-${discountPercentage}%`}
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-md ${
              isInWishlistCheck 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
            aria-label={isInWishlistCheck ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FaHeart className="w-3 h-3" />
          </button>

          {/* Quick View on Hover - Desktop only */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center">
            <button
              onClick={handleQuickAdd}
              className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors shadow-lg"
            >
              Quick View
            </button>
          </div>
        </div>
        
        {/* Product Details */}
        <div className="p-3 flex flex-col flex-1">
          {/* Product Name */}
          <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 min-h-[40px] text-center">
            {name}
          </h3>

          {/* Urdu Name */}
          {nameUr && (
            <p className="text-xs text-gray-600 mb-1 text-center line-clamp-1">
              {nameUr}
            </p>
          )}

          {/* Description/Category */}
          {description && (
            <p className="text-xs text-green-700 mb-2 text-center line-clamp-1">
              {description}
            </p>
          )}
          
          {/* Features - Show first 3 */}
          <div className="flex flex-wrap gap-1 mb-2 justify-center">
            {features.slice(0, 3).map((feature, index) => (
              <span key={index} className="text-[10px] text-gray-500">
                {feature}
                {index < features.slice(0, 3).length - 1 && " • "}
              </span>
            ))}
          </div>

          {/* Rating & Reviews */}
          {(rating || reviews) && (
            <div className="flex items-center justify-center gap-2 mb-2 text-xs">
              {rating && (
                <div className="flex items-center gap-0.5 text-yellow-400">
                  <FaStar className="w-3 h-3" />
                  <span className="text-gray-700 font-medium">{rating}</span>
                </div>
              )}
              {rating && reviews && <span className="text-gray-300">|</span>}
              {reviews > 0 && (
                <div className="flex items-center gap-0.5 text-green-600">
                  <FaCheckCircle className="w-3 h-3" />
                  <span className="text-gray-600">{reviews}</span>
                </div>
              )}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1"></div>
          
          {/* Price & Add Button */}
          <div className="mt-auto">
            {/* Price */}
            <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
              <span className="text-base font-bold text-gray-900">
                {currency} {formattedPrice}
              </span>
              {oldPrice && (
                <span className="text-xs text-gray-500 line-through">
                  {currency} {formattedOldPrice}
                </span>
              )}
            </div>

            {/* Quick Add Button */}
            <button
              onClick={handleQuickAdd}
              className="w-full py-2 rounded-full bg-green-600 text-white flex items-center justify-center font-medium hover:bg-green-700 transition-all active:scale-95 shadow-sm text-sm"
            >
              <span className="flex-1 text-center">Quick Add</span>
              <FaShoppingCart className="mr-3 w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {isModalOpen && (
        <ProductDetailsModal 
          product={fullProduct} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}