"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  FaShoppingCart, FaStar, FaHeart, FaRegHeart, FaCheckCircle,
  FaLeaf, FaShieldAlt, FaBolt, FaWhatsapp, FaUser, FaThumbsUp,
  FaImages, FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishList";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VideoProductsSection from "./ProductDetails/VideoProductsSection";
import RecommendedProductsSection from "./ProductDetails/RecommendedProductsSection";
import DirectionToUse from "../components/directiontouse";

// ─── Skeleton ────────────────────────────────────────────────────────────────
function ProductDetailsSectionSkeleton() {
  return (
    <div className="w-full bg-white animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
        <div className="flex gap-6 border-b pb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-5 w-20 bg-gray-200 rounded" />
          ))}
        </div>
        <div className="space-y-3">
          <div className="h-7 bg-gray-200 rounded w-48" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full" />
          ))}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

interface ProductDetailsSectionProps {
  product?: any;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const REVIEWS_PER_PAGE = 4;

function generateAllReviews(): Review[] {
  const authors = [
    "Ahmad Raza", "Fatima Khan", "Usman Ali", "Sana Malik", "Bilal Ahmed",
    "Zainab Hassan", "Omar Farooq", "Ayesha Siddiqui", "Haris Mahmood", "Nida Shah",
    "Tariq Mehmood", "Rabia Noor",
  ];
  const comments = [
    "This product exceeded my expectations! The quality is outstanding and it works exactly as described. I've been using it for a month and can see visible improvements.",
    "Excellent Ayurvedic product. I appreciate that it's 100% natural without any chemicals. My skin feels rejuvenated and healthier.",
    "The delivery was fast and packaging was secure. The product itself is pure and authentic. Will definitely purchase again.",
    "I was skeptical at first but this product has proven to be worth every penny. The texture is perfect and absorption is quick.",
    "As someone with sensitive skin, I'm always cautious. This product didn't cause any irritation and actually soothed my skin. Highly recommend!",
    "Traditional Ayurveda at its best! The herbal fragrance is pleasant and the results speak for themselves. My go-to product now.",
    "Quality is top-notch. You can tell it's made with care and attention to detail. The effects are noticeable within days.",
    "Sustainable packaging and pure ingredients. Love that the company is environmentally conscious while delivering premium quality.",
    "Perfect for daily use. It has become an essential part of my skincare routine. The natural glow it gives is incredible.",
    "Worth the investment. While it's priced higher than some alternatives, the purity and effectiveness justify every rupee spent.",
    "Absolutely love this product. Used it for two weeks and the difference is clear. Packaging is lovely too.",
    "Great product, fast delivery. Will definitely recommend to friends and family.",
  ];
  const dates = [
    "2 days ago", "1 week ago", "2 weeks ago", "3 weeks ago", "1 month ago",
    "2 months ago", "3 months ago", "4 months ago", "5 months ago", "6 months ago",
    "7 months ago", "8 months ago",
  ];
  const ratings = [5, 4.5, 5, 4, 5, 4.5, 5, 4, 5, 4.5, 5, 4];

  return Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    author: authors[i % authors.length],
    rating: ratings[i % ratings.length],
    date: dates[i % dates.length],
    comment: comments[i % comments.length],
    verified: i % 3 !== 0,
    helpful: Math.floor(Math.random() * 50),
  }));
}

const ALL_REVIEWS = generateAllReviews();

// ─── Star Renderer ────────────────────────────────────────────────────────────
function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "w-6 h-6" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={`${cls} ${i < rating ? "text-yellow-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProductDetailsSection({ product }: ProductDetailsSectionProps) {
  const productDetailsBanner1 = "/images/productdetailsbanner1.png";
  const productDetailsBanner2 = "/images/productdetailsbanner2.png";

  const [showBottomBar, setShowBottomBar] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "15ml");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "reviews" | "howToUse">("description");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(ALL_REVIEWS.length / REVIEWS_PER_PAGE);
  const pagedReviews = ALL_REVIEWS.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  const sectionRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  const productId = product?.productId || product?.id;
  const isWishlisted = productId ? isInWishlist(productId) : false;

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!(token && user));
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        setShowBottomBar(window.scrollY >= sectionRef.current.offsetTop - 300);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) return <ProductDetailsSectionSkeleton />;

  // ─── Cart / Wishlist handlers ─────────────────────────────────────────────
  const cartPayload = () => ({
    id: productId,
    img: product?.img || "/images/placeholder.jpg",
    nameEn: product?.nameEn || "Product",
    nameUr: product?.nameUr || "",
    price: product?.price || 0,
    size: selectedSize,
    category: product?.category || "Herbal Oils",
  });

  const handleAddToCart = () => {
    if (!productId) return toast.error("Failed to add item to cart!");
    for (let i = 0; i < quantity; i++) addToCart(cartPayload());
    toast.success(`Added ${quantity} × ${product?.nameEn} (${selectedSize}) to cart!`);
  };

  const handleBuyNow = () => {
    if (!productId) return toast.error("Failed to add item to cart!");
    for (let i = 0; i < quantity; i++) addToCart(cartPayload());
    toast.success("Added to cart! Redirecting...", { autoClose: 1500 });
    setTimeout(() => { window.location.href = "/cart"; }, 1600);
  };

  const toggleWishlist = () => {
    if (!productId) return;
    if (!isLoggedIn) {
      toast.warning("Please login to add to wishlist");
      setTimeout(() => {
        window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname);
      }, 1500);
      return;
    }
    if (isWishlisted) {
      removeFromWishlist(productId);
      toast.info("Removed from wishlist");
    } else {
      addToWishlist({ ...cartPayload(), oldPrice: product?.oldPrice, rating: product?.rating, reviews: product?.reviews, inStock: true });
      toast.success("Added to wishlist!");
    }
  };

  const handleWhatsAppOrder = () => {
    const total = (product?.price || 0) * quantity;
    const msg = `🌟 *New Order Request* 🌟\n\n*Product:* ${product?.nameEn}\n*Price:* PKR ${(product?.price || 0).toLocaleString()}\n*Size:* ${selectedSize}\n*Quantity:* ${quantity}\n*Total:* PKR ${total.toLocaleString()}\n\nPlease provide your Full Name, Delivery Address & Phone Number.\n_Placed via Pansari Inn website_`;
    window.open(`https://wa.me/923001234567?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  // ─── Review stats ─────────────────────────────────────────────────────────
  const avgRating = ALL_REVIEWS.reduce((s, r) => s + r.rating, 0) / ALL_REVIEWS.length;
  const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  ALL_REVIEWS.forEach((r) => {
    const bucket = Math.round(r.rating);
    dist[bucket] = (dist[bucket] || 0) + 1;
  });

  const tabs = [
    { id: "description", label: "Description" },
    { id: "ingredients", label: "Ingredients" },
    { id: "reviews", label: `Reviews (${ALL_REVIEWS.length})` },
    { id: "howToUse", label: "How to Use" },
  ];

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <div ref={sectionRef} className="w-full bg-white relative">
        <VideoProductsSection />

        {/* ── Tab Section ── */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
          {/* Tab Nav */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex gap-1 sm:gap-6 overflow-x-auto scrollbar-hide -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 px-2 sm:px-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                    activeTab === tab.id
                      ? "text-green-700 border-green-700"
                      : "text-gray-500 border-transparent hover:text-green-600 hover:border-green-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* ── Description Tab ── */}
          {activeTab === "description" && (
            <div className="space-y-5">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Product Description</h2>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {product?.description ||
                  "Experience the power of pure Ayurvedic wellness with our premium herbal product. Crafted using traditional methods and the finest natural ingredients, this product delivers authentic results you can trust."}
              </p>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Key Benefits</h3>
                <ul className="space-y-2">
                  {(product?.benefits?.length
                    ? product.benefits
                    : [
                        "100% Natural & Organic ingredients",
                        "Clinically tested for safety and efficacy",
                        "Free from harmful chemicals and preservatives",
                      ]
                  ).map((b: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <FaCheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4-card feature grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {[
                  { icon: <FaLeaf className="w-6 h-6 text-green-700" />, title: "100% Natural", sub: "Organic ingredients", bg: "bg-green-50" },
                  { icon: <FaShieldAlt className="w-6 h-6 text-blue-700" />, title: "Safe & Tested", sub: "Quality assured", bg: "bg-blue-50" },
                  { icon: <FaCheckCircle className="w-6 h-6 text-amber-700" />, title: "Certified", sub: "Ayurvedic formula", bg: "bg-amber-50" },
                  { icon: <FaBolt className="w-6 h-6 text-purple-700" />, title: "Fast Results", sub: "Visible in days", bg: "bg-purple-50" },
                ].map((card, i) => (
                  <div key={i} className={`flex items-center gap-2 p-3 sm:p-4 ${card.bg} rounded-xl`}>
                    <div className="flex-shrink-0">{card.icon}</div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight">{card.title}</p>
                      <p className="text-gray-600 text-[10px] sm:text-xs mt-0.5">{card.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Ingredients Tab ── */}
          {activeTab === "ingredients" && (
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ingredients</h2>
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                <ul className="space-y-3 divide-y divide-gray-200">
                  {[
                    { label: "Main Extract", value: "Pure herbal extract (100% organic)" },
                    { label: "Base Oil", value: "Cold-pressed carrier oil" },
                    { label: "Preservative", value: "Natural vitamin E (tocopherol)" },
                    { label: "Essential Oils", value: "Therapeutic grade aromatics" },
                  ].map((item, i) => (
                    <li key={i} className="flex flex-col sm:flex-row sm:gap-4 pt-3 first:pt-0">
                      <span className="font-semibold text-gray-900 text-sm sm:min-w-[140px]">{item.label}:</span>
                      <span className="text-gray-600 text-sm">{item.value}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 mt-4 italic border-t border-gray-200 pt-3">
                  * All ingredients are sourced from certified organic farms and processed using traditional Ayurvedic methods.
                </p>
              </div>
            </div>
          )}

          {/* ── Reviews Tab ── */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Customer Reviews</h2>
                  <p className="text-gray-500 text-sm mt-0.5">Read what our customers say about this product</p>
                </div>
                <button className="px-5 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition self-start sm:self-auto">
                  Write a Review
                </button>
              </div>

              {/* Rating Summary */}
              <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Overall */}
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-5xl font-black text-gray-900">{avgRating.toFixed(1)}</div>
                    <Stars rating={Math.round(avgRating)} size="lg" />
                    <p className="text-gray-500 text-sm mt-2">{ALL_REVIEWS.length} reviews</p>
                  </div>

                  {/* Distribution */}
                  <div className="sm:col-span-2 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = dist[stars] || 0;
                      const pct = (count / ALL_REVIEWS.length) * 100;
                      return (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-xs text-gray-600 w-12 flex-shrink-0">{stars} stars</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-600 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-5 text-right flex-shrink-0">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Reviews Grid — 4 per page */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pagedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow flex flex-col gap-3"
                  >
                    {/* Author Row */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaUser className="w-5 h-5 text-green-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-900 text-sm">{review.author}</span>
                          {review.verified && (
                            <span className="flex items-center gap-1 text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                              <FaCheckCircle className="w-2.5 h-2.5" />
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Stars rating={review.rating} />
                          <span className="text-gray-400 text-xs">{review.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Comment */}
                    <p className="text-gray-700 text-sm leading-relaxed flex-1">{review.comment}</p>

                    {/* Helpful */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-700 transition">
                        <FaThumbsUp className="w-3 h-3" />
                        Helpful ({review.helpful})
                      </button>
                      <button className="text-xs text-gray-400 hover:text-gray-600 transition">Report</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <FaChevronLeft className="w-3 h-3 text-gray-600" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium border transition ${
                      p === currentPage
                        ? "bg-green-700 text-white border-green-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <FaChevronRight className="w-3 h-3 text-gray-600" />
                </button>
              </div>

              <p className="text-center text-xs text-gray-400">
                Page {currentPage} of {totalPages} · {ALL_REVIEWS.length} total reviews
              </p>
            </div>
          )}

          {/* ── How to Use Tab ── */}
          {activeTab === "howToUse" && (
            <div className="space-y-5">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">How to Use</h2>

              <div>
                <h3 className="font-semibold text-base text-gray-900 mb-3">Usage Instructions</h3>
                <ol className="space-y-3">
                  {[
                    "Take 2–3 drops of the product on your palm.",
                    "Gently massage into the affected area in circular motions.",
                    "Leave it on for at least 30 minutes or overnight for best results.",
                    "Rinse with lukewarm water (if applicable).",
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="text-gray-700 text-sm pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="font-semibold text-amber-900 mb-2 text-sm">⚠️ Important Notes</p>
                <ul className="space-y-1 text-xs text-amber-800">
                  {[
                    "For external use only",
                    "Do a patch test before first use",
                    "Avoid contact with eyes",
                    "Store in a cool, dry place",
                    "Keep out of reach of children",
                  ].map((note, i) => (
                    <li key={i}>• {note}</li>
                  ))}
                </ul>
              </div>

              <DirectionToUse />
            </div>
          )}
        </div>

        {/* ── Banners ── */}
        <div className="w-full">
          <img src={productDetailsBanner1} alt="Banner 1" className="w-full h-auto object-cover" />
        </div>
        <div className="w-full">
          <img src={productDetailsBanner2} alt="Banner 2" className="w-full h-auto object-cover" />
        </div>

        <RecommendedProductsSection />

        {/* ─── Sticky Bottom Bar ─────────────────────────────────────────────── */}
        {showBottomBar && product && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">

              {/* ── Mobile layout ── */}
              <div className="flex md:hidden flex-col py-2 gap-2">
                {/* Product mini info */}
                <div className="flex items-center gap-2">
                  <img
                    src={product.img || "/images/placeholder.jpg"}
                    alt={product.nameEn}
                    className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{product.nameEn}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-green-700">
                        PKR {((product.price || 0) * quantity).toLocaleString()}
                      </span>
                      {/* Size pills */}
                      {product.sizes?.slice(0, 3).map((s: string) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-1.5 py-0.5 text-[10px] rounded border transition ${
                            selectedSize === s
                              ? "bg-green-700 text-white border-green-700"
                              : "text-gray-600 border-gray-300"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Qty stepper */}
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity === 1}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-sm disabled:opacity-40"
                    >−</button>
                    <span className="w-7 text-center text-xs font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-sm"
                    >+</button>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={toggleWishlist}
                    className="flex items-center justify-center h-10 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition"
                  >
                    {isWishlisted
                      ? <FaHeart className="w-4 h-4 text-red-500" />
                      : <FaRegHeart className="w-4 h-4 text-gray-500" />}
                  </button>

                  <button
                    onClick={handleWhatsAppOrder}
                    className="flex items-center justify-center h-10 bg-[#25D366] text-white rounded-lg hover:bg-[#1da851] transition"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-1 h-10 border-2 border-green-700 text-green-700 rounded-lg text-xs font-bold hover:bg-green-50 transition"
                  >
                    <FaShoppingCart className="w-3 h-3" />
                    Cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="flex items-center justify-center h-10 bg-green-700 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* ── Desktop layout ── */}
              <div className="hidden md:flex items-center justify-between gap-4 py-3">
                {/* Product info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src={product.img || "/images/placeholder.jpg"}
                    alt={product.nameEn}
                    className="w-14 h-14 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm truncate">{product.nameEn}</h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-lg font-bold text-green-700">
                        PKR {(product.price || 0).toLocaleString()}
                      </span>
                      {product.oldPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          PKR {product.oldPrice.toLocaleString()}
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <FaStar className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-gray-600">{product.rating || 4.8}</span>
                      </div>
                      {product.points && (
                        <div className="flex items-center gap-1 text-xs bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          <FaBolt className="w-2.5 h-2.5 text-amber-600" />
                          <span className="text-amber-700">{product.points * quantity} pts</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                  {/* Size */}
                  {product.sizes?.length > 0 && (
                    <div className="flex gap-1.5">
                      {product.sizes.slice(0, 3).map((s: string) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition ${
                            selectedSize === s
                              ? "bg-green-700 text-white border-green-700"
                              : "text-gray-700 border-gray-300 hover:border-green-700"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Qty */}
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity === 1}
                      className="px-3 py-2 hover:bg-gray-100 text-sm disabled:opacity-40"
                    >−</button>
                    <span className="px-4 py-2 border-x border-gray-300 font-semibold text-sm min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2 hover:bg-gray-100 text-sm"
                    >+</button>
                  </div>

                  {/* Wishlist */}
                  <button
                    onClick={toggleWishlist}
                    className="p-2.5 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition"
                  >
                    {isWishlisted
                      ? <FaHeart className="w-5 h-5 text-red-500" />
                      : <FaRegHeart className="w-5 h-5 text-gray-500" />}
                  </button>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center gap-2 px-4 py-2.5 border-2 border-green-700 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-50 transition"
                  >
                    <FaShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>

                  {/* Buy Now */}
                  <button
                    onClick={handleBuyNow}
                    className="px-5 py-2.5 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition"
                  >
                    Buy Now
                  </button>

                  {/* WhatsApp */}
                  <button
                    onClick={handleWhatsAppOrder}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-lg text-sm font-semibold hover:bg-[#1da851] transition"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}