"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaStar, FaCheckCircle, FaShoppingCart, FaTimes, FaMinus, FaPlus } from "react-icons/fa";
import { AiOutlineShopping } from "react-icons/ai";
import { useCart } from "@/context/CartContext";
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

export default function ProductDetailsModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [selectedImage, setSelectedImage] = useState(product.img);
  const availableSizes = product.sizes?.length ? product.sizes : ['15ml', '30ml', '60ml', '120ml', '150ml'];
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]);
  const [quantity, setQuantity]         = useState(1);
  const [isMobile, setIsMobile]         = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Lock body scroll
  useEffect(() => {
    const y = window.scrollY;
    document.body.style.cssText = `position:fixed;top:-${y}px;width:100%;overflow:hidden`;
    return () => {
      document.body.style.cssText = '';
      window.scrollTo(0, y);
    };
  }, []);

  // Escape key
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  const cartPayload = () => ({
    id:     product.id!,
    img:    product.img,
    nameEn: product.nameEn,
    nameUr: product.nameUr,
    price:  product.price,
    size:   selectedSize,
  });

  const handleAddToCart = () => {
    if (!product.id) return toast.error('Failed to add item to cart!');
    for (let i = 0; i < quantity; i++) addToCart(cartPayload());
    toast.success(`Added ${quantity} × ${product.nameEn} to cart!`);
  };

  const handleBuyNow = () => {
    if (!product.id) return toast.error('Failed to add item to cart!');
    for (let i = 0; i < quantity; i++) addToCart(cartPayload());
    toast.success('Added to cart! Redirecting…', { autoClose: 1500, pauseOnHover: false });
    setTimeout(() => { onClose(); window.location.href = '/cart'; }, 1600);
  };

  // ── Mobile bottom-sheet ────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <ToastPortal />
        <div className="fixed inset-0 z-[9999] flex flex-col justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />

          {/* Sheet — slides up */}
          <div className="relative bg-white rounded-t-2xl shadow-2xl animate-slideUp flex flex-col max-h-[92dvh]">

            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-4 z-10 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition"
              aria-label="Close"
            >
              <FaTimes className="w-3.5 h-3.5 text-gray-600" />
            </button>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 px-4 pb-4">

              {/* Product image — centered, square */}
              <div className="relative w-40 h-40 mx-auto my-3 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                {product.sale && (
                  <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                    {product.sale}
                  </span>
                )}
                <img src={selectedImage} alt={product.nameEn} className="w-full h-full object-contain p-3" />
              </div>

              {/* Thumbnails */}
              {product.additionalImages && product.additionalImages.length > 0 && (
                <div className="flex gap-2 justify-center mb-3">
                  {[product.img, ...product.additionalImages].slice(0, 5).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`w-10 h-10 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${
                        selectedImage === img ? 'border-green-600' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Product info */}
              <div className="space-y-3">

                {/* Name + rating */}
                <div>
                  <h2 className="text-base font-bold text-gray-900 leading-snug">{product.nameEn}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{product.nameUr}</p>
                  {product.description && (
                    <p className="text-xs text-green-700 mt-1 line-clamp-2">{product.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <FaStar className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCheckCircle className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-sm text-gray-500">{product.reviews} Reviews</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-900">PKR {product.price.toLocaleString()}</span>
                  {product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">PKR {product.oldPrice.toLocaleString()}</span>
                  )}
                </div>

                {/* Size selector */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
                          selectedSize === size
                            ? 'bg-green-700 text-white border-green-700'
                            : 'border-gray-300 text-gray-700 hover:border-green-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Quantity</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
                      >
                        <FaMinus className="w-3 h-3 text-gray-600" />
                      </button>
                      <span className="w-10 text-center font-bold text-base border-x border-gray-300">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
                      >
                        <FaPlus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-base font-bold text-gray-900">PKR {(product.price * quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Action buttons — sticky at bottom */}
            <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-white flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition text-sm"
              >
                <FaShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-white font-semibold py-3 rounded-xl hover:bg-amber-600 transition text-sm"
              >
                <AiOutlineShopping className="w-4 h-4" />
                Buy Now
              </button>
            </div>

          </div>
        </div>
      </>
    );
  }

  // ── Desktop centered modal ─────────────────────────────────────────────────
  return (
    <>
      <ToastPortal />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <FaTimes className="w-4 h-4 text-gray-700" />
          </button>

          <div className="flex h-full overflow-y-auto max-h-[90vh]">

            {/* Left — Image */}
            <div className="w-2/5 p-6 border-r border-gray-100 flex-shrink-0">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
                {product.sale && (
                  <span className="absolute top-3 right-3 z-10 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold">
                    {product.sale}
                  </span>
                )}
                <img src={selectedImage} alt={product.nameEn} className="w-full h-full object-contain p-4" />
              </div>
              {product.additionalImages && product.additionalImages.length > 0 && (
                <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                  {[product.img, ...product.additionalImages].map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${
                        selectedImage === img ? 'border-green-600' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right — Info */}
            <div className="w-3/5 p-6 flex flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto">

                <div>
                  <h1 className="text-xl font-bold text-gray-900 leading-tight">{product.nameEn}</h1>
                  <p className="text-gray-500 text-sm mt-0.5">{product.nameUr}</p>
                  {product.description && (
                    <p className="text-green-700 text-sm mt-1">{product.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <FaStar className="w-4 h-4 text-yellow-400" />
                    <span className="font-semibold text-gray-900 text-sm">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 text-sm">{product.reviews} Reviews</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">PKR {product.price.toLocaleString()}</span>
                  {product.oldPrice && (
                    <span className="text-gray-400 line-through text-sm">PKR {product.oldPrice.toLocaleString()}</span>
                  )}
                </div>

                {product.benefits && product.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {product.benefits.slice(0, 3).map((b, i) => (
                      <span key={i} className="px-2.5 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">{b}</span>
                    ))}
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
                          selectedSize === size
                            ? 'bg-green-700 text-white border-green-700'
                            : 'border-gray-300 hover:border-green-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {product.features && product.features.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Features</p>
                    <div className="space-y-1.5">
                      {product.features.slice(0, 4).map((f, i) => {
                        const text = typeof f === 'string' ? f.replace('✓', '').trim() : f.text?.replace('✓', '').trim();
                        return (
                          <div key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0" />
                            <span className="line-clamp-1">{text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Quantity</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-100 transition">
                        <FaMinus className="w-3 h-3 text-gray-600" />
                      </button>
                      <span className="px-5 py-2 border-x border-gray-300 min-w-[50px] text-center font-bold">{quantity}</span>
                      <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 hover:bg-gray-100 transition">
                        <FaPlus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-xl font-bold text-gray-900">PKR {(product.price * quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 flex-shrink-0">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition"
                >
                  <FaShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-white font-semibold py-3 rounded-xl hover:bg-amber-600 transition"
                >
                  <AiOutlineShopping className="w-4 h-4" />
                  Buy Now
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
