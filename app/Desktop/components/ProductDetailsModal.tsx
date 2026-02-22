"use client";

import { useState, useEffect, useRef } from "react";
import { FaStar, FaCheckCircle, FaShoppingCart, FaTimes, FaBolt, FaSearchPlus } from "react-icons/fa";
import { AiOutlineShopping } from "react-icons/ai";
import { useCart } from "../../context/CartContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Product {
  id?: string | number;
  img: string;
  nameEn: string;
  nameUr: string;
  description?: string;
  rating: number;
  reviews: number;
  price: number;
  oldPrice?: number | null;
  sale?: string | null;
  additionalImages?: string[];
  sizes?: string[];
  benefits?: string[];
  features?: (string | { text: string; hasCheck?: boolean })[];
  infoLines?: string[];
  points?: number;
  [key: string]: any;
}

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDetailsModal({ product, onClose }: ProductDetailsModalProps) {
  const [selectedImage, setSelectedImage] = useState<string>(product.img);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '15ml');
  const [quantity, setQuantity] = useState<number>(1);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  
  const { addToCart } = useCart();

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleAddToCart = (): void => {
    if (!product.id) {
      toast.error('Failed to add item to cart!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }

    console.log('🛒 Adding to cart from modal:', {
      id: product.id,
      nameEn: product.nameEn,
      size: selectedSize,
      quantity,
      price: product.price
    });

    // Add the product to cart with selected size and quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        img: product.img,
        nameEn: product.nameEn,
        nameUr: product.nameUr,
        price: product.price,
        size: selectedSize
      });
    }

    // Show success toast
    toast.success(`Added ${quantity} × ${product.nameEn} (${selectedSize}) to cart!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  const handleBuyNow = (): void => {
    // First add to cart
    if (!product.id) {
      toast.error('Failed to add item to cart!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        img: product.img,
        nameEn: product.nameEn,
        nameUr: product.nameUr,
        price: product.price,
        size: selectedSize
      });
    }

    // Show success toast with redirect message
    toast.success(
      <div>
        <div className="font-semibold">Added to cart! Redirecting...</div>
        <div className="text-sm opacity-90">{product.nameEn} (×{quantity})</div>
      </div>, 
      {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      }
    );

    // Then redirect to cart page after a short delay
    setTimeout(() => {
      onClose();
      window.location.href = '/cart';
    }, 1600);
  };

  const handleImageHover = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!isZoomed || !imageRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  return (
    <>
      {/* Modal with Blurry Backdrop */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Blurry Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden border border-gray-200">
          {/* Close Button - Moved to top-left to avoid overlap with discount badge */}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 z-20 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
            aria-label="Close modal"
          >
            <FaTimes className="w-4 h-4 text-gray-700" />
          </button>

          {/* Content Container */}
          <div className="h-full flex flex-col lg:flex-row">
            
            {/* Left Column - Images */}
            <div className="lg:w-2/5 p-4 border-r border-gray-100">
              {/* Main Image with Zoom */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 mb-3">
                {/* Sale Badge - Now positioned inside image area but away from close button */}
                {product.sale && (
                  <div className="absolute top-3 right-3 z-10 px-3 py-1.5 bg-red-500 text-white rounded-full text-sm font-semibold shadow-lg">
                    {product.sale}
                  </div>
                )}
                
                <div 
                  ref={imageRef}
                  className="relative w-full h-full cursor-zoom-in"
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleImageHover}
                >
                  <img
                    src={selectedImage}
                    alt={product.nameEn}
                    className="w-full h-full object-contain p-4 transition-transform duration-200"
                    style={{
                      transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }}
                  />
                  
                  {/* Zoom Indicator */}
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white p-2 rounded-full">
                    <FaSearchPlus className="w-4 h-4" />
                  </div>
                  
                  {/* Zoom Preview */}
                  {isZoomed && (
                    <div className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
                      Zoom Active (2x)
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              {product.additionalImages && product.additionalImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  {[product.img, ...product.additionalImages].map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`flex-shrink-0 w-12 h-12 rounded overflow-hidden border ${
                        selectedImage === image 
                          ? 'border-[#197B33] border-2' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Product Info */}
            <div className="lg:w-3/5 p-4 lg:p-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 2rem)' }}>
              <div className="space-y-4">
                {/* Header - Removed sale badge from here since it's now in image area */}
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">{product.nameEn}</h1>
                      <p className="text-gray-600 text-sm mt-1">{product.nameUr}</p>
                    </div>
                  </div>
                  
                  {product.description && (
                    <p className="text-green-700 text-sm mt-2">{product.description}</p>
                  )}
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <FaStar className="w-4 h-4 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 text-sm">{product.reviews} Reviews</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    PKR {product.price.toLocaleString()}
                  </span>
                  {product.oldPrice && (
                    <span className="text-gray-500 line-through text-sm">
                      PKR {product.oldPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Benefits */}
                {product.benefits && product.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.benefits.map((benefit, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                )}

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Size</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                            selectedSize === size
                              ? 'bg-[#197B33] text-white border-[#197B33] shadow-sm'
                              : 'border-gray-300 hover:border-[#197B33] hover:bg-gray-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features Grid */}
                {product.features && product.features.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Key Features</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {product.features.slice(0, 4).map((feature, index) => {
                        const featureText = typeof feature === 'string' 
                          ? feature.replace('✓', '').trim()
                          : feature.text?.replace('✓', '').trim();
                        
                        const hasCheck = typeof feature === 'string' 
                          ? feature.includes('✓')
                          : feature.text?.includes('✓') || feature.hasCheck;

                        return (
                          <div 
                            key={index} 
                            className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                          >
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                              hasCheck ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {hasCheck ? '✓' : '○'}
                            </div>
                            <span className="text-gray-700 text-xs">
                              {featureText}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quick Info */}
                {product.infoLines && product.infoLines.length > 0 && (
                  <div className="space-y-1">
                    {product.infoLines.slice(0, 3).map((line, index) => (
                      <div key={index} className="text-gray-600 text-xs flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        {line}
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantity & Points */}
                <div className="space-y-4 pt-2">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Quantity</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-100 font-bold"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300 min-w-[50px] text-center font-medium">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(q => q + 1)}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-100 font-bold"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-sm">
                        <div className="text-gray-700">Subtotal:</div>
                        <div className="font-bold text-lg">PKR {(product.price * quantity).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  {product.points && (
                    <div className="flex items-center gap-2 text-amber-600 text-sm">
                      <FaBolt className="w-4 h-4" />
                      <span>Earn {product.points * quantity} Pansari Points</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex gap-3">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#197B33] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#146128] transition-colors shadow-sm hover:shadow"
                  >
                    <FaShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-amber-600 transition-colors shadow-sm hover:shadow"
                  >
                    <AiOutlineShopping className="w-4 h-4" />
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}