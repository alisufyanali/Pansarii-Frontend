"use client";

import { useState, useRef, useEffect } from "react";
import {
  FaStar,
  FaCheckCircle,
  FaShoppingCart,
  FaSearchPlus,
  FaSearchMinus,
  FaWhatsapp,
  FaHeart,
  FaRegHeart,
  FaBolt,
  FaTimes,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishList";
import { toast } from "react-toastify";

// Skeletal Loading Component for ProductDetails
function ProductDetailsSkeleton() {
  return (
    <div className="animate-pulse p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - Images Skeleton */}
        <div className="w-full md:w-1/2">
          <div className="bg-gray-200 rounded-xl w-full aspect-square" />
          <div className="flex gap-2 mt-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded w-12 h-12 flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="w-full md:w-1/2 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full" />
          ))}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 rounded-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
          <div className="h-10 bg-gray-200 rounded w-full" />
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>
      </div>
    </div>
  );
}

interface FeatureItem {
  text: string;
  icon?: string;
  hasCheck?: boolean;
}

interface ProductDetailsProps {
  product: {
    img: string;
    additionalImages?: string[];
    nameEn: string;
    nameUr: string;
    description: string;
    rating: number;
    reviews: number;
    price: number;
    oldPrice?: number;
    sale?: string;
    features?: FeatureItem[];
    sizes?: string[];
    points?: number;
    benefits?: string[];
    infoLines?: string[];
    productId?: string | number;
    category?: string;
  };
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(product.img);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "15ml");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Zoom state
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const additionalImages = product.additionalImages || [];
  const productId = product.productId;

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!(token && user));

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (productId && isLoggedIn) {
      setIsWishlisted(isInWishlist(productId));
    }
  }, [productId, isInWishlist, isLoggedIn]);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsZoomed(false);
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleImageHover = (e: React.MouseEvent): void => {
    if (!isZoomed || !imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const toggleZoom = () => setIsZoomed(!isZoomed);

  const handleAddToCart = () => {
    if (!productId) {
      toast.error("Failed to add item to cart!", { position: "top-right", autoClose: 3000, theme: "light" });
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: productId,
        img: selectedImage,
        nameEn: product.nameEn,
        nameUr: product.nameUr,
        price: product.price,
        size: selectedSize,
        category: product.category || "Herbal Oils",
      });
    }
    toast.success(`Added ${quantity} × ${product.nameEn} (${selectedSize}) to cart!`, {
      position: "top-right",
      autoClose: 3000,
      theme: "light",
    });
  };

  const handleBuyNow = () => {
    if (!productId) {
      toast.error("Failed to add item to cart!", { position: "top-right", autoClose: 3000, theme: "light" });
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: productId,
        img: selectedImage,
        nameEn: product.nameEn,
        nameUr: product.nameUr,
        price: product.price,
        size: selectedSize,
        category: product.category || "Herbal Oils",
      });
    }
    toast.success(
      <div>
        <p className="font-semibold">Added to cart! Redirecting...</p>
        <p className="text-sm">
          {product.nameEn} (×{quantity})
        </p>
      </div>,
      { position: "top-right", autoClose: 1500, theme: "light" }
    );
    setTimeout(() => {
      window.location.href = "/cart";
    }, 1600);
  };

  const handleWishlistToggle = () => {
    if (!productId) return;

    if (!isLoggedIn) {
      toast.warning(
        <div>
          <p className="font-semibold">Please login to add to wishlist</p>
          <p className="text-sm">Save your favorite products by logging in</p>
        </div>,
        { position: "top-right", autoClose: 3000, theme: "light" }
      );
      setTimeout(() => {
        window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname);
      }, 1500);
      return;
    }

    if (isWishlisted) {
      removeFromWishlist(productId);
      setIsWishlisted(false);
      toast.info("Removed from wishlist", { position: "top-right", autoClose: 2000, theme: "light" });
    } else {
      addToWishlist({
        id: productId,
        img: selectedImage,
        nameEn: product.nameEn,
        nameUr: product.nameUr,
        price: product.price,
        oldPrice: product.oldPrice,
        rating: product.rating,
        reviews: product.reviews,
        inStock: true,
        category: product.category || "Herbal Oils",
      });
      setIsWishlisted(true);
      toast.success("Added to wishlist!", { position: "top-right", autoClose: 2000, theme: "light" });
    }
  };

  const handleWhatsAppOrder = () => {
    const totalPrice = product.price * quantity;
    const message =
      `🌟 *New Order Request* 🌟\n\n` +
      `*Product:* ${product.nameEn}\n` +
      `*Price:* PKR ${product.price.toLocaleString()}\n` +
      `*Size:* ${selectedSize}\n` +
      `*Quantity:* ${quantity}\n` +
      `*Total:* PKR ${totalPrice.toLocaleString()}\n\n` +
      `*Customer Details:*\nPlease provide your:\n1. Full Name\n2. Delivery Address\n3. Phone Number\n\n` +
      `_This order was placed via Pansari Inn website_`;
    const whatsappUrl = `https://wa.me/923001234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* ─── Main Content ─── */}
      {/* pb-28 on mobile so sticky bar doesn't overlap content */}
      <div className="relative flex flex-col md:flex-row gap-4 md:gap-6 p-3 md:p-6 pb-28 md:pb-6">

        {/* ── Left Column – Images ── */}
        <div className="relative w-full md:w-1/2 flex flex-col gap-2">

          {/* Wishlist + Zoom buttons */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 left-2 z-10 bg-white rounded-full p-1.5 shadow-md"
          >
            {isWishlisted ? (
              <FaHeart className="text-red-500 text-base" />
            ) : (
              <FaRegHeart className="text-gray-400 text-base" />
            )}
          </button>

          <button
            onClick={toggleZoom}
            className="absolute top-2 right-2 z-10 bg-white rounded-full p-1.5 shadow-md"
          >
            {isZoomed ? (
              <FaSearchMinus className="text-[#197B33] text-base" />
            ) : (
              <FaSearchPlus className="text-gray-500 text-base" />
            )}
          </button>

          {/* Main Image */}
          <div className="relative w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-50 aspect-square">
            <div
              ref={imageRef}
              className={`w-full h-full cursor-${isZoomed ? "zoom-out" : "zoom-in"}`}
              onClick={toggleZoom}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleImageHover}
            >
              <img
                src={selectedImage}
                alt={product.nameEn}
                className="w-full h-full object-contain transition-transform duration-200"
                style={
                  isZoomed
                    ? {
                        transform: "scale(2)",
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }
                    : {}
                }
              />

              {/* Zoom badge */}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full pointer-events-none">
                {isZoomed ? "Zoom Active (2x)" : "Hover to zoom"}
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          {additionalImages.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {[product.img, ...additionalImages].map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageClick(image)}
                  className={`flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                    selectedImage === image
                      ? "border-[#197B33]"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right Column – Product Info ── */}
        <div className="w-full md:w-1/2">
          <div className="space-y-3">

            {/* Names */}
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">
                {product.nameEn}
              </h1>
              <p className="text-sm text-gray-500 font-urdu mt-0.5">{product.nameUr}</p>
            </div>

            {/* Benefits tags */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="text-[10px] bg-green-50 text-[#197B33] border border-green-200 px-2 py-0.5 rounded-full"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            )}

            {/* Rating */}
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 bg-[#197B33] text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                <FaStar className="text-yellow-300 text-xs" />
                {product.rating}
              </div>
              <span className="text-gray-500">{product.reviews} Reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl md:text-2xl font-bold text-[#197B33]">
                PKR {product.price.toLocaleString()}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-gray-400 line-through">
                  PKR {product.oldPrice.toLocaleString()}
                </span>
              )}
              {product.sale && (
                <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">
                  {product.sale}
                </span>
              )}
            </div>

            {/* Info Lines */}
            {product.infoLines && product.infoLines.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 space-y-1">
                {product.infoLines.map((line, index) => (
                  <p key={index} className="text-xs text-amber-800">{line}</p>
                ))}
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-1.5">
                {product.features.map((feature, index) => {
                  const hasCheck =
                    feature.hasCheck !== undefined
                      ? feature.hasCheck
                      : feature.text.startsWith("✓");
                  const featureText =
                    feature.hasCheck !== undefined
                      ? feature.text
                      : feature.text.replace("✓", "").trim();

                  return (
                    <div key={index} className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-0.5">
                        {feature.icon ? (
                          <img
                            src={feature.icon}
                            alt=""
                            className="w-4 h-4"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        ) : hasCheck ? (
                          <FaCheckCircle className="text-[#197B33] text-sm" />
                        ) : (
                          <span className="text-gray-400 text-sm">○</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">{featureText}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pansari Points */}
            {product.points && (
              <div className="bg-[#197B33]/10 border border-[#197B33]/20 rounded-lg px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaBolt className="text-[#197B33] text-sm" />
                  <span className="text-xs font-semibold text-[#197B33]">
                    Earn {product.points * quantity} Pansari Inn Points
                  </span>
                </div>
                <span className="text-xs text-[#197B33] font-bold">!</span>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1.5">Size</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 rounded-full border text-[11px] font-medium transition-all ${
                        selectedSize === size
                          ? "bg-[#197B33] text-white border-[#197B33]"
                          : "bg-white text-gray-700 border-gray-300 hover:border-[#197B33]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Subtotal */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1.5">Quantity</p>
              <div className="flex items-center gap-3 flex-wrap">
                {/* Stepper */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={decreaseQuantity}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-light"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-light"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">Subtotal:</span>
                  <span className="text-sm font-bold text-[#197B33]">
                    PKR {(product.price * quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Desktop-only Action Buttons ── */}
            <div className="hidden md:flex flex-col gap-2 pt-1">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-[#197B33] text-[#197B33] font-semibold text-sm py-2.5 rounded-lg hover:bg-[#197B33] hover:text-white transition-all"
                >
                  <FaShoppingCart className="text-sm" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#197B33] text-white font-semibold text-sm py-2.5 rounded-lg hover:bg-[#145d27] transition-all"
                >
                  <FaBolt className="text-sm" />
                  Buy it Now
                </button>
              </div>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold text-sm py-2.5 rounded-lg hover:bg-[#1ebe5c] transition-all"
              >
                <FaWhatsapp className="text-base" />
                Order on WhatsApp
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          Mobile Sticky Bottom Bar
          Shown only on mobile (md:hidden)
      ───────────────────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        {/* Subtotal strip */}
        <div className="flex items-center justify-between px-4 pt-2 pb-1">
          <div className="flex items-center gap-2">
            {/* Compact quantity stepper */}
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={decreaseQuantity}
                className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-base font-light"
              >
                −
              </button>
              <span className="w-8 text-center text-xs font-bold">{quantity}</span>
              <button
                onClick={increaseQuantity}
                className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-base font-light"
              >
                +
              </button>
            </div>
            <span className="text-xs text-gray-500">
              Total:{" "}
              <span className="font-bold text-[#197B33]">
                PKR {(product.price * quantity).toLocaleString()}
              </span>
            </span>
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlistToggle}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200"
          >
            {isWishlisted ? (
              <FaHeart className="text-red-500 text-sm" />
            ) : (
              <FaRegHeart className="text-gray-400 text-sm" />
            )}
          </button>
        </div>

        {/* Action buttons row */}
        <div className="flex gap-2 px-3 pb-3">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white border-2 border-[#197B33] text-[#197B33] font-semibold text-xs py-2.5 rounded-lg active:scale-95 transition-transform"
          >
            <FaShoppingCart className="text-xs" />
            Add to Cart
          </button>

          <button
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#197B33] text-white font-semibold text-xs py-2.5 rounded-lg active:scale-95 transition-transform"
          >
            <FaBolt className="text-xs" />
            Buy Now
          </button>

          <button
            onClick={handleWhatsAppOrder}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] text-white font-semibold text-xs py-2.5 rounded-lg active:scale-95 transition-transform"
          >
            <FaWhatsapp className="text-sm" />
            WhatsApp
          </button>
        </div>
      </div>
    </>
  );
}