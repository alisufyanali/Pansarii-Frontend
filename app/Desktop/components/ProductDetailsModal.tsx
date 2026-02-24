"use client";

import { useState, useEffect, useRef } from "react";
import { FaStar, FaCheckCircle, FaShoppingCart, FaTimes, FaBolt, FaSearchPlus, FaMinus, FaPlus } from "react-icons/fa";
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
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const imageRef = useRef<HTMLDivElement>(null);
  
  const { addToCart } = useCart();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    if (!isZoomed || !imageRef.current || isMobile) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  return (
    <>
      <ToastContainer />
      {/* Modal with Blurry Backdrop */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4">
        {/* Blurry Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-gray-200">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
            aria-label="Close modal"
          >
            <FaTimes className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
          </button>

          {/* Content Container - Stack on mobile, row on desktop */}
          <div className="h-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
            
            {/* Left Column - Images */}
            <div className="lg:w-2/5 p-3 sm:p-4 lg:border-r border-gray-100">
              {/* Main Image with Zoom */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 mb-2 sm:mb-3">
                {/* Sale Badge */}
                {product.sale && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                    {product.sale}
                  </div>
                )}
                
                <div 
                  ref={imageRef}
                  className="relative w-full h-full cursor-zoom-in"
                  onMouseEnter={() => !isMobile && setIsZoomed(true)}
                  onMouseLeave={() => !isMobile && setIsZoomed(false)}
                  onMouseMove={handleImageHover}
                >
                  <img
                    src={selectedImage}
                    alt={product.nameEn}
                    className="w-full h-full object-contain p-2 sm:p-4 transition-transform duration-200"
                    style={{
                      transform: isZoomed && !isMobile ? 'scale(1.5)' : 'scale(1)',
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }}
                  />
                  
                  {/* Zoom Indicator - Hide on mobile */}
                  {!isMobile && (
                    <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-black/60 text-white p-1.5 sm:p-2 rounded-full">
                      <FaSearchPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  )}
                  
                  {/* Zoom Preview - Hide on mobile */}
                  {isZoomed && !isMobile && (
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
                      Zoom Active (2x)
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Images - Horizontal scroll on mobile */}
              {product.additionalImages && product.additionalImages.length > 0 && (
                <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {[product.img, ...product.additionalImages].map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded overflow-hidden border ${
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

            {/* Right Column - Product Info (Scrollable) */}
            <div className="lg:w-3/5 p-4 sm:p-5 lg:p-6 overflow-y-auto">
              <div className="space-y-3 sm:space-y-4">
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 line-clamp-2">
                        {product.nameEn}
                      </h1>
                      <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1">{product.nameUr}</p>
                    </div>
                  </div>
                  
                  {product.description && (
                    <p className="text-green-700 text-xs sm:text-sm mt-1 sm:mt-2">{product.description}</p>
                  )}
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-1">
                    <FaStar className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span className="text-gray-600 text-xs sm:text-sm">{product.reviews} Reviews</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    PKR {product.price.toLocaleString()}
                  </span>
                  {product.oldPrice && (
                    <span className="text-gray-500 line-through text-xs sm:text-sm">
                      PKR {product.oldPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Benefits - Responsive grid */}
                {product.benefits && product.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {product.benefits.map((benefit, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-green-50 text-green-700 rounded text-[10px] sm:text-xs"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                )}

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-1.5 sm:mb-2">Size</h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
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

                {/* Features Grid - 2 columns on mobile, 2 on tablet */}
                {product.features && product.features.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-1.5 sm:mb-2">Key Features</h3>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 sm:gap-2">
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
                            className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                          >
                            <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                              hasCheck ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {hasCheck ? '✓' : '○'}
                            </div>
                            <span className="text-gray-700 text-[10px] sm:text-xs">
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
                      <div key={index} className="text-gray-600 text-[10px] sm:text-xs flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        {line}
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantity & Points */}
                <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-1.5 sm:mb-2">Quantity</h3>
                    <div className="flex flex-col xs:flex-row xs:items-center gap-3 sm:gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                        <button
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="px-2 sm:px-3 py-1.5 sm:py-2 text-gray-600 hover:bg-gray-100 font-bold"
                          aria-label="Decrease quantity"
                        >
                          <FaMinus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </button>
                        <span className="px-3 sm:px-4 py-1.5 sm:py-2 border-x border-gray-300 min-w-[40px] sm:min-w-[50px] text-center font-medium text-sm sm:text-base">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(q => q + 1)}
                          className="px-2 sm:px-3 py-1.5 sm:py-2 text-gray-600 hover:bg-gray-100 font-bold"
                          aria-label="Increase quantity"
                        >
                          <FaPlus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </button>
                      </div>
                      <div className="text-sm">
                        <div className="text-gray-700 text-xs sm:text-sm">Subtotal:</div>
                        <div className="font-bold text-base sm:text-lg lg:text-xl">PKR {(product.price * quantity).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  {product.points && (
                    <div className="flex items-center gap-1.5 sm:gap-2 text-amber-600 text-xs sm:text-sm">
                      <FaBolt className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Earn {product.points * quantity} Pansari Points</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons - Stack on mobile, row on tablet */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t">
                <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-[#197B33] text-white font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-[#146128] transition-colors shadow-sm hover:shadow text-sm sm:text-base"
                  >
                    <FaShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                    Add to Cart
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-amber-500 text-gray-900 font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-amber-600 transition-colors shadow-sm hover:shadow text-sm sm:text-base"
                  >
                    <AiOutlineShopping className="w-3 h-3 sm:w-4 sm:h-4" />
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