"use client";

import Image from "next/image";
import { useState, MouseEvent } from "react";
import { FaStar, FaCheckCircle, FaHeart } from "react-icons/fa";
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
        className={`bg-white rounded-xl shadow border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-50 p-3 flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image
              src={displayImage}
              alt={name}
              fill
              className="object-contain p-2 transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Sale Badge */}
          {(sale || discountPercentage) && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded shadow-md">
              {sale || `-${discountPercentage}%`}
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              isInWishlistCheck 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
            aria-label={isInWishlistCheck ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FaHeart className="w-3.5 h-3.5" />
          </button>
        </div>
        
        {/* Product Details */}
        <div className="p-3">
          {/* Product Name */}
          <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 h-10">
            {name}
          </h3>

          {/* Urdu Name (optional) */}
          {nameUr && (
            <p className="text-xs text-gray-600 mb-1 line-clamp-1">
              {nameUr}
            </p>
          )}

          {/* Description (optional) */}
          {description && (
            <p className="text-xs text-green-700 mb-2 line-clamp-1">
              {description}
            </p>
          )}
          
          {/* Features */}
          <div className="flex flex-wrap gap-1 mb-2">
            {features.slice(0, 3).map((feature, index) => (
              <span key={index} className="text-xs text-gray-500">
                {feature}
                {index < features.slice(0, 3).length - 1 && " • "}
              </span>
            ))}
          </div>

          {/* Rating & Reviews */}
          {(rating || reviews > 0) && (
            <div className="flex items-center gap-2 mb-2 text-xs">
              {rating && (
                <div className="flex items-center gap-0.5 text-yellow-400">
                  <FaStar className="w-3 h-3" />
                  <span className="text-gray-700">{rating}</span>
                </div>
              )}
              {rating && reviews > 0 && <span className="text-gray-300">|</span>}
              {reviews > 0 && (
                <div className="flex items-center gap-0.5 text-green-600">
                  <FaCheckCircle className="w-3 h-3" />
                  <span className="text-gray-600">{reviews}</span>
                </div>
              )}
            </div>
          )}
          
          {/* Price and Add to Cart Button */}
          <div className="flex justify-between items-center">
            <div>
              {/* Price with old price if available */}
              <span className="text-lg font-bold text-gray-900">
                {currency} {formattedPrice}
              </span>
              {oldPrice && (
                <span className="text-xs text-gray-500 line-through ml-2">
                  {currency} {formattedOldPrice}
                </span>
              )}
            </div>
            
            {/* Add to Cart Button - Quick Add opens modal */}
            <button
              onClick={handleQuickAdd}
              className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors active:scale-95"
              aria-label={`Quick add ${name} to cart`}
            >
              <span className="text-white text-lg font-bold">+</span>
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