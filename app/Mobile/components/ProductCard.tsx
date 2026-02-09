// app/Mobile/components/ProductCard.tsx
"use client";

import Image from "next/image";

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  features: string[];
  price: number;
  currency?: string;
  onAddToCart?: (id: string) => void;
  className?: string;
}

export default function ProductCard({
  id,
  image,
  name,
  features,
  price,
  currency = "PKR",
  onAddToCart,
  className = ""
}: ProductCardProps) {
  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  // Format price with comma separators
  const formattedPrice = price.toLocaleString('en-PK');

  return (
    <div className={`bg-white rounded-xl shadow border border-gray-100 overflow-hidden ${className}`}>
      {/* Product Image */}
      <div className="aspect-square bg-gray-50 p-3 flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
      
      {/* Product Details */}
      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 h-10">
          {name}
        </h3>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {features.slice(0, 3).map((feature, index) => (
            <span key={index} className="text-xs text-gray-500">
              {feature}
              {index < features.slice(0, 3).length - 1 && " • "}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {currency} {formattedPrice}
            </span>
          </div>
          <button
            onClick={handleAddClick}
            className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors active:scale-95"
            aria-label={`Add ${name} to cart`}
          >
            <span className="text-white text-lg font-bold">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}