"use client";

import Image from 'next/image';
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaLeaf,
  FaBoxOpen,
} from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishList";
import { toast } from "react-toastify";
import type { ProductFeature } from "@/types/product";
import { getAuthToken, getStoredUser } from '@/lib/axios';

function ProductDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6">
        <div className="lg:w-2/5">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 mb-3" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-16 h-16 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
        <div className="lg:w-3/5">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
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
    oldPrice?: number | null;
    sale?: string | null;
    features?: ProductFeature[];
    sizes?: string[];
    points?: number;
    benefits?: string[];
    infoLines?: string[];
    productId?: string | number;
    category?: string;
  };
}

const CollapsibleSection = ({
  title,
  icon,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="border-t border-gray-200">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold text-gray-900 text-sm">{title}</span>
      </div>
      {isOpen ? (
        <FaChevronUp className="w-4 h-4 text-gray-500" />
      ) : (
        <FaChevronDown className="w-4 h-4 text-gray-500" />
      )}
    </button>
    {isOpen && (
      <div className="px-4 pb-4 animate-slideDown">{children}</div>
    )}
  </div>
);

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState(product.img);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "15ml");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [showFeatures, setShowFeatures] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);

  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const additionalImages = product.additionalImages || [];
  const productId = product.productId;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    const user = getStoredUser();
    setIsLoggedIn(!!(token && user));
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (productId && isLoggedIn) setIsWishlisted(isInWishlist(productId));
  }, [productId, isInWishlist, isLoggedIn]);

  if (isLoading) return <ProductDetailsSkeleton />;

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsZoomed(false);
  };

  const handleImageHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !imageRef.current || isMobile) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    setZoomPosition({
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100,
    });
  };

  const handleAddToCart = () => {
    if (!productId) { toast.error("Failed to add item to cart!"); return; }
    for (let i = 0; i < quantity; i++) {
      addToCart({ id: productId, img: selectedImage, nameEn: product.nameEn, nameUr: product.nameUr, price: product.price, size: selectedSize, category: product.category || "Herbal Oils" });
    }
    toast.success(`Added ${quantity} × ${product.nameEn} (${selectedSize}) to cart!`);
  };

  const handleBuyNow = () => {
    if (!productId) { toast.error("Failed to add item to cart!"); return; }
    for (let i = 0; i < quantity; i++) {
      addToCart({ id: productId, img: selectedImage, nameEn: product.nameEn, nameUr: product.nameUr, price: product.price, size: selectedSize, category: product.category || "Herbal Oils" });
    }
    toast.success("Added to cart! Redirecting...");
    router.push("/cart");
  };

  const handleWishlistToggle = () => {
    if (!productId) return;
    if (!isLoggedIn) {
      toast.warning("Please login to add to wishlist");
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }
    if (isWishlisted) {
      removeFromWishlist(productId);
      setIsWishlisted(false);
      toast.info("Removed from wishlist");
    } else {
      addToWishlist({ id: productId, img: selectedImage, nameEn: product.nameEn, nameUr: product.nameUr, price: product.price, oldPrice: product.oldPrice ?? undefined, rating: product.rating, reviews: product.reviews, inStock: true, category: product.category || "Herbal Oils" });
      setIsWishlisted(true);
      toast.success("Added to wishlist!");
    }
  };

  const handleWhatsAppOrder = () => {
    const message = `🌟 *New Order Request* 🌟\n\n*Product:* ${product.nameEn}\n*Price:* PKR ${product.price.toLocaleString()}\n*Size:* ${selectedSize}\n*Quantity:* ${quantity}\n*Total:* PKR ${(product.price * quantity).toLocaleString()}\n\n_This order was placed via Pansari Inn website_`;
    window.open(`https://wa.me/923001234567?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

 
  const DesktopView = () => (
    <div className="flex flex-row gap-5 p-4 max-w-7xl mx-auto" >

      {/* ── LEFT: image column ── */}
      <div className="w-[38%] flex flex-col gap-2 min-h-0">
        {/* Wishlist + Zoom buttons */}
        <div className="relative flex-shrink-0">
          <button onClick={handleWishlistToggle}
            className={`absolute top-2 left-2 z-20 p-2 rounded-full shadow-md transition-all hover:scale-110 ${isWishlisted ? "bg-red-50 border border-red-200" : "bg-white/90 border border-gray-200"}`}>
            {isWishlisted ? <FaHeart className="w-4 h-4 text-red-500" /> : <FaRegHeart className="w-4 h-4 text-gray-600" />}
          </button>
          <button onClick={() => setIsZoomed(v => !v)}
            className="absolute top-2 right-2 z-20 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all border border-gray-200">
            {isZoomed ? <FaSearchMinus className="w-3.5 h-3.5 text-gray-700" /> : <FaSearchPlus className="w-3.5 h-3.5 text-gray-700" />}
          </button>

          {/* Main image */}
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 shadow-md"
            style={{ maxHeight: '55vh' }}>
            <div ref={imageRef} className="relative w-full h-full"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleImageHover}>
              <Image
                src={selectedImage}
                alt={product.nameEn}
                fill
                className="object-contain p-3 transition-transform duration-200"
                style={{ transform: isZoomed ? "scale(1.5)" : "scale(1)", transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }}
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              {/* % off badge — only on image */}
              {product.oldPrice && (
                <div className="absolute bottom-2 left-2 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
                  {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                </div>
              )}
              {isZoomed && (
                <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded">Zoom 2×</div>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnails — hidden scrollbar, horizontal scroll */}
        {additionalImages.length > 0 && (
          <div className="flex gap-2 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {[product.img, ...additionalImages].map((img, i) => (
              <button key={i} onClick={() => handleImageClick(img)}
                className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? "border-green-600 shadow-md" : "border-gray-200 hover:border-gray-400"}`}>
                <Image src={img} alt="" fill className="object-cover" sizes="56px" />
              </button>
            ))}
          </div>
        )}

      </div>

      {/* ── RIGHT: info column — scrollable internally ── */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pr-1" style={{ maxHeight: '90vh', scrollbarWidth: "none", msOverflowStyle: "none" }}>

        {/* Product names */}
        <h1 className="text-lg font-bold text-gray-900 leading-tight">{product.nameEn}</h1>
        <p className="text-xs text-gray-500 mt-0.5">{product.nameUr}</p>

        {/* Rating & reviews */}
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-600 flex-wrap">
          <FaStar className="w-3 h-3 text-yellow-400" />
          <span className="font-semibold text-gray-800">{product.rating}</span>
          <span className="text-gray-300">|</span>
          <FaCheckCircle className="w-3 h-3 text-green-500" />
          <span>{product.reviews} Reviews</span>
          {product.sale && <>
            <span className="text-gray-300">|</span>
            <span className="text-red-500 font-semibold">{product.sale}</span>
          </>}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
          <span className="text-xl font-bold text-gray-900">PKR {product.price.toLocaleString()}</span>
          {product.oldPrice && (
            <span className="text-xs text-gray-400 line-through">PKR {product.oldPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Info chips */}
        {(product.benefits?.length || product.infoLines?.length) ? (
          <div className="flex gap-1.5 overflow-x-auto mt-2 flex-shrink-0 pb-0.5" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {[...(product.benefits || []), ...(product.infoLines || [])].map((item, i) => (
              <span key={i} className="flex-shrink-0 px-2 py-0.5 border border-gray-200 rounded-full text-[11px] text-gray-600 whitespace-nowrap">
                {item}
              </span>
            ))}
          </div>
        ) : null}

        {/* Key features */}
        {product.features && product.features.length > 0 && (
          <div className="mt-2">
            <p className="text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-widest">Key Features</p>
            <div className="grid grid-cols-3 gap-1.5">
              {product.features.slice(0, 3).map((feature, i) => {
                const hasCheck = feature.hasCheck !== undefined ? feature.hasCheck : feature.text.startsWith("✓");
                const featureText = feature.hasCheck !== undefined ? feature.text : feature.text.replace("✓", "").trim();
                return (
                  <div key={i} className="flex items-start gap-1 p-1.5 bg-gray-50 rounded-lg">
                    <span className={`mt-0.5 flex-shrink-0 text-[11px] ${hasCheck ? "text-green-600" : "text-gray-400"}`}>
                      {hasCheck ? "✓" : "○"}
                    </span>
                    <span className="text-[11px] text-gray-700 leading-snug">{featureText}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Size */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-2">
            <p className="text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-widest">Size</p>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map(size => (
                <button key={size} onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 rounded-lg border text-xs font-medium transition-all ${selectedSize === size ? "bg-green-600 text-white border-green-600 shadow-sm" : "border-gray-300 text-gray-700 hover:border-green-500"}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="mt-2">
          <p className="text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-widest">Quantity</p>
          <div className="flex items-center border border-gray-300 rounded-lg w-fit">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold text-sm disabled:opacity-40" disabled={quantity === 1}>−</button>
            <span className="px-3 py-1 border-x border-gray-300 text-sm font-semibold min-w-[36px] text-center">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)}
              className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold text-sm">+</button>
          </div>
        </div>

        {/* Total */}
        <div className="mt-2">
          <p className="text-[10px] font-semibold text-gray-500 mb-0.5 uppercase tracking-widest">Total</p>
          <span className="text-lg font-bold text-gray-900">PKR {(product.price * quantity).toLocaleString()}</span>
        </div>

        {/* Action buttons */}
        <div className="mt-3 space-y-1.5">
          <div className="flex gap-2">
            <button onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-1.5 bg-green-700 text-white font-semibold py-2 rounded-lg hover:bg-green-800 transition-all shadow-sm text-sm">
              <FaShoppingCart className="w-3.5 h-3.5" />
              Add to Cart
            </button>
            <button onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-1.5 bg-amber-500 text-gray-900 font-semibold py-2 rounded-lg hover:bg-amber-600 transition-all shadow-sm text-sm">
              Buy Now
            </button>
          </div>
          <button onClick={handleWhatsAppOrder}
            className="w-full flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] font-semibold py-2 rounded-lg hover:bg-[#25D366] hover:text-white transition-all text-sm">
            <FaWhatsapp className="w-4 h-4" />
            Order on WhatsApp
          </button>
        </div>

        <div className="h-2 flex-shrink-0" />
      </div>
    </div>
  );

  /* ─────────────────────────────────────────────
     MOBILE VIEW — unchanged logic, same as before
  ───────────────────────────────────────────── */
  const MobileView = () => (
    <div className="space-y-3 p-3">
      {/* Images */}
      <div className="relative">
        <button onClick={handleWishlistToggle}
          className={`absolute top-2 left-2 z-20 p-2 rounded-full shadow-md ${isWishlisted ? "bg-red-50 border border-red-200" : "bg-white/90 border border-gray-200"}`}>
          {isWishlisted ? <FaHeart className="w-4 h-4 text-red-500" /> : <FaRegHeart className="w-4 h-4 text-gray-600" />}
        </button>
        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 shadow-md">
          <Image src={selectedImage} alt={product.nameEn} fill className="object-contain p-4" sizes="100vw" />
        </div>
      </div>
      {additionalImages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {[product.img, ...additionalImages].map((img, i) => (
            <button key={i} onClick={() => handleImageClick(img)}
              className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 ${selectedImage === img ? "border-green-600" : "border-gray-200"}`}>
              <Image src={img} alt="" fill className="object-cover" sizes="56px" />
            </button>
          ))}
        </div>
      )}

      {/* Names */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">{product.nameEn}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{product.nameUr}</p>
      </div>

      {/* Rating row */}
      <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
        <FaStar className="w-3.5 h-3.5 text-yellow-400" />
        <span className="font-semibold text-gray-800">{product.rating}</span>
        <span className="text-gray-300">|</span>
        <FaCheckCircle className="w-3.5 h-3.5 text-green-500" />
        <span>{product.reviews} Reviews</span>
        {product.sale && <><span className="text-gray-300">|</span><span className="text-red-500 font-semibold">{product.sale}</span></>}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-2xl font-bold text-gray-900">PKR {product.price.toLocaleString()}</span>
        {product.oldPrice && (
          <>
            <span className="text-sm text-gray-400 line-through">PKR {product.oldPrice.toLocaleString()}</span>
            <span className="text-xs text-red-500 font-semibold">Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%</span>
          </>
        )}
      </div>

      {/* Size */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Size</p>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map(size => (
              <button key={size} onClick={() => setSelectedSize(size)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${selectedSize === size ? "bg-green-600 text-white border-green-600" : "border-gray-300 text-gray-700"}`}>
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <p className="text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Quantity</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold text-sm" disabled={quantity === 1}>−</button>
            <span className="px-4 py-1.5 border-x border-gray-300 text-sm font-semibold min-w-[40px] text-center">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold text-sm">+</button>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Subtotal:</div>
            <div className="text-lg font-bold text-green-700">PKR {(product.price * quantity).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2 pt-1">
        <div className="flex gap-2">
          <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 bg-green-700 text-white font-semibold py-3 rounded-lg hover:bg-green-800 transition-all text-sm">
            <FaShoppingCart className="w-4 h-4" /> Add to Cart
          </button>
          <button onClick={handleBuyNow} className="flex-1 flex items-center justify-center bg-amber-500 text-gray-900 font-semibold py-3 rounded-lg hover:bg-amber-600 transition-all text-sm">
            Buy Now
          </button>
        </div>
        <button onClick={handleWhatsAppOrder} className="w-full flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] font-semibold py-3 rounded-lg hover:bg-[#25D366] hover:text-white transition-all text-sm">
          <FaWhatsapp className="w-5 h-5" /> Order on WhatsApp
        </button>
      </div>

      {/* Collapsible sections */}
      <div className="bg-white rounded-xl border border-gray-200 mt-2">
        {product.features && product.features.length > 0 && (
          <CollapsibleSection title="Key Features" icon={<FaLeaf className="w-4 h-4 text-green-600" />} isOpen={showFeatures} onToggle={() => setShowFeatures(!showFeatures)}>
            <div className="grid grid-cols-1 gap-2">
              {product.features.map((feature, i) => {
                const hasCheck = feature.hasCheck !== undefined ? feature.hasCheck : feature.text.startsWith("✓");
                const featureText = feature.hasCheck !== undefined ? feature.text : feature.text.replace("✓", "").trim();
                return (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className={`font-bold ${hasCheck ? "text-green-600" : "text-gray-400"}`}>{hasCheck ? "✓" : "○"}</span>
                    <span className="text-gray-700 text-sm">{featureText}</span>
                  </div>
                );
              })}
            </div>
          </CollapsibleSection>
        )}
        {product.benefits && product.benefits.length > 0 && (
          <CollapsibleSection title="Benefits" icon={<FaInfoCircle className="w-4 h-4 text-blue-600" />} isOpen={showBenefits} onToggle={() => setShowBenefits(!showBenefits)}>
            <div className="space-y-2">
              {product.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                  <span className="text-green-600 mt-0.5">•</span><span>{b}</span>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}
        {product.infoLines && product.infoLines.length > 0 && (
          <CollapsibleSection title="Product Details" icon={<FaBoxOpen className="w-4 h-4 text-purple-600" />} isOpen={showDetails} onToggle={() => setShowDetails(!showDetails)}>
            <div className="space-y-2">
              {product.infoLines.map((line, i) => (
                <div key={i} className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700">{line}</div>
              ))}
            </div>
          </CollapsibleSection>
        )}
        {product.points && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-2 bg-amber-50 p-3 rounded-lg">
              <FaBolt className="w-5 h-5 text-amber-600" />
              <span className="text-gray-800 text-sm font-medium">Earn {product.points * quantity} Pansari Inn Points</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      {isMobile ? <MobileView /> : <DesktopView />}

      <style jsx global>{`
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .animate-slideDown { animation: slideDown 0.2s ease-out; }
        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>
    </div>
  );
}
