// app/Mobile/components/ProductCard.tsx
"use client";

import Image from "next/image";
import { useState, MouseEvent } from "react";
import { FaStar, FaCheckCircle, FaShoppingCart, FaHeart } from "react-icons/fa";
import ProductDetailsModal from "../../Desktop/components/ProductDetailsModal";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishList";
import { toast } from "react-toastify";

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
  product,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isInWishlistCheck = isInWishlist(id);
  const displayImage = isHovered && hoverImg ? hoverImg : image;
  const formattedPrice = price.toLocaleString("en-PK");
  const formattedOldPrice = oldPrice ? oldPrice.toLocaleString("en-PK") : null;
  const discountPercentage = oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : null;

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const productSlug = name.toLowerCase().replace(/\s+/g, "-");
    router.push(`/product/${productSlug}`);
  };

  const handleQuickAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleAddClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (onAddToCart) {
      onAddToCart(id.toString());
    } else {
      addToCart({
        id,
        img: image,
        nameEn: name,
        nameUr: nameUr || name,
        price,
        size: "Standard",
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
          style: { background: "#15803d", color: "white" },
        }
      );
    }
  };

  const handleWishlistToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({ id, nameEn: name, nameUr: nameUr || name, price, img: image });
    toast.success(isInWishlistCheck ? "Removed from wishlist" : "Added to wishlist", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: true,
      closeButton: false,
    });
  };

  const fullProduct = product || {
    id,
    img: image,
    hoverImg,
    nameEn: name,
    nameUr: nameUr || name,
    description: description || features.join(" • "),
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
        className={`relative bg-white rounded-2xl overflow-hidden flex flex-col cursor-pointer h-full transition-all duration-300 ${className}`}
        style={{
          border: isHovered ? "1.5px solid #16a34a" : "1.5px solid #f0f0f0",
          boxShadow: isHovered
            ? "0 8px 24px rgba(22, 163, 74, 0.13)"
            : "0 2px 8px rgba(0,0,0,0.07)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Image Container */}
        <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <div className="relative w-full h-full p-3">
            <Image
              src={displayImage}
              alt={name}
              fill
              className="object-contain p-1 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </div>

          {/* Discount / Sale Badge */}
          {(sale || discountPercentage) && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              {sale || `-${discountPercentage}%`}
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
              isInWishlistCheck
                ? "bg-red-500 text-white scale-110"
                : "bg-white/90 text-gray-400 hover:text-red-400 hover:bg-red-50"
            }`}
            aria-label={isInWishlistCheck ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FaHeart className="w-3 h-3" />
          </button>

          {/* Quick View overlay — desktop only */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center">
            <button
              onClick={handleQuickAdd}
              className="px-4 py-1.5 bg-white text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-100 shadow-lg"
            >
              Quick View
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col flex-1 px-3 pt-2 pb-3 gap-1">
          {/* Name */}
          <h3 className="text-[13px] font-semibold text-gray-900 line-clamp-2 text-center leading-snug min-h-[36px]">
            {name}
          </h3>

          {/* Urdu name */}
          {nameUr && (
            <p className="text-[11px] text-gray-500 text-center line-clamp-1">{nameUr}</p>
          )}

          {/* Description */}
          {description && (
            <p className="text-[11px] text-green-700 text-center line-clamp-1 font-medium">
              {description}
            </p>
          )}

          {/* Features */}
          {features.length > 0 && (
            <div className="flex flex-wrap justify-center gap-x-1">
              {features.slice(0, 3).map((f, i) => (
                <span key={i} className="text-[10px] text-gray-400">
                  {f}
                  {i < Math.min(features.length, 3) - 1 && " •"}
                </span>
              ))}
            </div>
          )}

          {/* Rating & reviews */}
          {(rating > 0 || reviews > 0) && (
            <div className="flex items-center justify-center gap-2 text-[11px]">
              {rating > 0 && (
                <span className="flex items-center gap-0.5 text-yellow-400 font-medium">
                  <FaStar className="w-3 h-3" />
                  <span className="text-gray-700">{rating}</span>
                </span>
              )}
              {rating > 0 && reviews > 0 && (
                <span className="text-gray-200">|</span>
              )}
              {reviews > 0 && (
                <span className="flex items-center gap-0.5 text-green-600">
                  <FaCheckCircle className="w-3 h-3" />
                  <span className="text-gray-500">{reviews}</span>
                </span>
              )}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price row */}
          <div className="flex items-baseline justify-center gap-2 mt-1">
            <span className="text-[15px] font-bold text-gray-900">
              {currency} {formattedPrice}
            </span>
            {oldPrice && (
              <span className="text-[11px] text-gray-400 line-through">
                {currency} {formattedOldPrice}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleQuickAdd}
            className="mt-1 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-green-600 hover:bg-green-700 active:scale-95 transition-all text-white text-[13px] font-semibold shadow-sm"
          >
            <FaShoppingCart className="w-3.5 h-3.5" />
            Quick Add
          </button>
        </div>
      </div>

      {isModalOpen && (
        <ProductDetailsModal product={fullProduct} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}