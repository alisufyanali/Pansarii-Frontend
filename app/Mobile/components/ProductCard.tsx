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
        className={`w-full rounded-[18px] overflow-hidden flex flex-col bg-white cursor-pointer transition-all duration-300 h-full ${className}`}
        style={{ 
          border: isHovered ? '2px solid #197B33' : '2px solid #E5E7EB'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
        role="article"
        aria-label={`View details for ${name}`}
      >
        
        {/* Image Section with bottom border */}
        <div className="relative w-full h-[200px] border-b border-gray-200 bg-gray-50">
          <div className="relative w-full h-full">
            <Image
              src={displayImage}
              alt={name}
              fill
              className="object-cover transition-all duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Sale Badge */}
          {(sale || discountPercentage) && (
            <div className="absolute top-3 right-3 w-[68px] h-[23px] rounded-[60px] bg-[#F83A3A] text-white text-xs flex items-center justify-center font-medium z-10">
              {sale || `-${discountPercentage}% OFF`}
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md z-10 ${
              isInWishlistCheck 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
            aria-label={isInWishlistCheck ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FaHeart className="w-4 h-4" />
          </button>
        </div>

        {/* Product Details - All content centered */}
        <div className="flex-1 bg-white p-4 flex flex-col justify-between items-center">
          
          {/* Text Content - Centered */}
          <div className="w-full text-center">
            <h3 className="text-[17px] font-medium truncate text-center">{name}</h3>
            {nameUr && (
              <p className="text-[17px] font-medium truncate text-center text-gray-600">{nameUr}</p>
            )}
            {description && (
              <p className="text-sm text-[#197B33] truncate text-center">{description}</p>
            )}

            {/* Features */}
            {features && features.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center mt-1">
                {features.slice(0, 2).map((feature, index) => (
                  <span key={index} className="text-xs text-gray-500">
                    {feature}
                    {index < Math.min(features.length, 2) - 1 && " • "}
                  </span>
                ))}
                {features.length > 2 && (
                  <span className="text-xs text-gray-400">
                    +{features.length - 2} more
                  </span>
                )}
              </div>
            )}

            {/* Rating & Reviews - Centered */}
            {(rating || reviews > 0) && (
              <div className="flex items-center justify-center gap-4 mt-2 text-sm font-medium flex-wrap">
                {rating && (
                  <div className="flex items-center gap-1 text-yellow-400">
                    <FaStar aria-hidden="true" /> 
                    <span>{rating}</span>
                  </div>
                )}
                {rating && reviews > 0 && (
                  <span className="text-gray-300" aria-hidden="true">|</span>
                )}
                {reviews > 0 && (
                  <div className="flex items-center gap-1 text-green-600">
                    <FaCheckCircle aria-hidden="true" /> 
                    <span>{reviews} Reviews</span>
                  </div>
                )}
              </div>
            )}

            {/* Price - Centered */}
            <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
              <p className="text-[17px] font-bold text-gray-900">
                {currency} {formattedPrice}
              </p>
              {formattedOldPrice && (
                <p className="text-sm text-gray-500 line-through">
                  {currency} {formattedOldPrice}
                </p>
              )}
            </div>
          </div>

          {/* Quick Add Button - Centered with icon on right */}
          <div className="w-full flex justify-center">
            <button 
              onClick={handleQuickAdd}
              className="w-full h-[50px] mt-3 rounded-[57px] border border-gray-300 bg-[#50B46B] text-white flex items-center justify-center font-medium hover:bg-[#146128] transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-base"
              aria-label={`Quick add ${name} to cart`}
            >
              <span className="flex-1 text-center">Quick Add</span>
              <FaShoppingCart className="mr-6 w-5 h-5" aria-hidden="true" />
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