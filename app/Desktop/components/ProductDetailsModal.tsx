"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaStar, FaCheckCircle, FaShoppingCart, FaTimes, FaMinus, FaPlus } from "react-icons/fa";
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

function ToastPortal() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(
    <ToastContainer
      style={{ zIndex: 99999 }}
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
    />,
    document.body
  );
}

export default function ProductDetailsModal({ product, onClose }: ProductDetailsModalProps) {
  const [selectedImage, setSelectedImage] = useState<string>(product.img);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '15ml');
  const [quantity, setQuantity] = useState<number>(1);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const modalContentRef = useRef<HTMLDivElement>(null);
  
  const { addToCart } = useCart();

  useEffect(() => {
    const checkMobile = () => { setIsMobile(window.innerWidth < 768); };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleAddToCart = (): void => {
    if (!product.id) {
      toast.error('Failed to add item to cart!');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        img: product.img,
        nameEn: product.nameEn,
        nameUr: product.nameUr,
        price: product.price,
        size: selectedSize,
      });
    }
    toast.success(`Added ${quantity} × ${product.nameEn} to cart!`);
  };

  const handleBuyNow = (): void => {
    if (!product.id) {
      toast.error('Failed to add item to cart!');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        img: product.img,
        nameEn: product.nameEn,
        nameUr: product.nameUr,
        price: product.price,
        size: selectedSize,
      });
    }
    toast.success('Added to cart! Redirecting...', { autoClose: 1500, pauseOnHover: false });
    setTimeout(() => {
      onClose();
      window.location.href = '/cart';
    }, 1600);
  };

  return (
    <>
      <ToastPortal />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-0">
        {/* Backdrop with blur */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

        {/* Modal Content - Auto-sized on mobile, centered */}
        <div
          ref={modalContentRef}
          className="relative bg-white rounded-none md:rounded-xl shadow-2xl w-auto max-w-[95vw] md:max-w-5xl max-h-[90vh] md:max-h-[95vh] overflow-y-auto overflow-x-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-20 w-7 h-7 md:w-9 md:h-9 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <FaTimes className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-700" />
          </button>

          {/* Content - Column on mobile, Row on desktop */}
          <div className="flex flex-col md:flex-row min-h-full md:min-h-0">

            {/* Left — Image (Full width on mobile) */}
            <div className="w-full md:w-2/5 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-100 flex-shrink-0">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50">
                {product.sale && (
                  <div className="absolute top-1 right-1 md:top-3 md:right-3 z-10 px-1.5 py-0.5 md:px-3 md:py-1.5 bg-red-500 text-white rounded-full text-[9px] md:text-sm font-semibold">
                    {product.sale}
                  </div>
                )}
                <img
                  src={selectedImage}
                  alt={product.nameEn}
                  className="w-full h-full object-contain p-2 md:p-4"
                />
              </div>

              {/* Thumbnail Images */}
              {product.additionalImages && product.additionalImages.length > 0 && (
                <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
                  {[product.img, ...product.additionalImages].map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded overflow-hidden border ${
                        selectedImage === image ? 'border-green-600 ring-2 ring-green-200' : 'border-gray-200'
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right — Info (Full width on mobile) */}
            <div className="w-full md:w-3/5 p-4 md:p-6 overflow-y-auto">
              <div className="space-y-3 md:space-y-4">
                {/* Title */}
                <div>
                  <h1 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight">{product.nameEn}</h1>
                  <p className="text-gray-600 text-sm md:text-base mt-1">{product.nameUr}</p>
                  {product.description && (
                    <p className="text-green-700 text-xs md:text-sm mt-2 line-clamp-2 md:line-clamp-none">{product.description}</p>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <FaStar className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                    <span className="font-semibold text-gray-900 text-sm md:text-base">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                    <span className="text-gray-600 text-sm md:text-base">{product.reviews} Reviews</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-2xl md:text-4xl font-bold text-gray-900">PKR {product.price.toLocaleString()}</span>
                  {product.oldPrice && (
                    <span className="text-gray-500 line-through text-sm md:text-base">PKR {product.oldPrice.toLocaleString()}</span>
                  )}
                </div>

                {/* Benefits */}
                {product.benefits && product.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.benefits.slice(0, 3).map((benefit, index) => (
                      <span key={index} className="px-2 py-1 md:px-3 md:py-1 bg-green-50 text-green-700 rounded-full text-xs md:text-sm font-medium">
                        {benefit}
                      </span>
                    ))}
                  </div>
                )}

                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-2">Size</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg border text-sm md:text-base font-medium transition-all ${
                            selectedSize === size ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 hover:border-green-600'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features - Hide on mobile or show compact */}
                {product.features && product.features.length > 0 && !isMobile && (
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-2">Features</h3>
                    <div className="space-y-1.5">
                      {product.features.slice(0, 4).map((feature, index) => {
                        const featureText = typeof feature === 'string' ? feature.replace('✓', '').trim() : feature.text?.replace('✓', '').trim();
                        return (
                          <div key={index} className="flex items-center gap-2 text-gray-700 text-sm">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                            <span className="line-clamp-1">{featureText}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="pt-3 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-2">Quantity</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 md:px-4 md:py-2 text-gray-600 hover:bg-gray-100">
                        <FaMinus className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      </button>
                      <span className="px-4 md:px-6 py-2 border-x border-gray-300 min-w-[50px] md:min-w-[60px] text-center font-semibold text-base md:text-lg">
                        {quantity}
                      </span>
                      <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 md:px-4 md:py-2 text-gray-600 hover:bg-gray-100">
                        <FaPlus className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      </button>
                    </div>
                    <div>
                      <div className="text-gray-600 text-xs md:text-sm">Total:</div>
                      <div className="font-bold text-xl md:text-2xl text-gray-900">PKR {(product.price * quantity).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-200">
                <div className="flex gap-2 md:gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 md:py-3.5 px-4 rounded-lg hover:bg-green-700 transition-all text-sm md:text-base"
                  >
                    <FaShoppingCart className="w-4 h-4 md:w-4 md:h-4" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-gray-900 font-semibold py-3 md:py-3.5 px-4 rounded-lg hover:bg-amber-600 transition-all text-sm md:text-base"
                  >
                    <AiOutlineShopping className="w-4 h-4 md:w-4 md:h-4" />
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}