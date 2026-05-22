"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  FaShoppingCart, FaStar, FaHeart, FaRegHeart, FaCheckCircle,
  FaLeaf, FaShieldAlt, FaBolt, FaWhatsapp, FaUser, FaThumbsUp,
  FaChevronLeft, FaChevronRight, FaTimes,
} from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishList";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VideoProductsSection from "./ProductDetails/VideoProductsSection";
import RecommendedProductsSection from "./ProductDetails/RecommendedProductsSection";
import DirectionToUse from "../components/directiontouse";
import type { LegacyProduct } from '@/types/product';
import { getAuthToken, getStoredUser } from '@/lib/axios';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  helpful: number;
}

const REVIEWS_PER_PAGE = 4;

function generateSeedReviews(): Review[] {
  const authors  = ["Ahmad Raza","Fatima Khan","Usman Ali","Sana Malik","Bilal Ahmed","Zainab Hassan","Omar Farooq","Ayesha Siddiqui","Haris Mahmood","Nida Shah","Tariq Mehmood","Rabia Noor"];
  const comments = [
    "This product exceeded my expectations! The quality is outstanding and it works exactly as described.",
    "Excellent Ayurvedic product. I appreciate that it's 100% natural. My skin feels rejuvenated and healthier.",
    "The delivery was fast and packaging was secure. The product itself is pure and authentic.",
    "I was skeptical at first but this product has proven to be worth every penny.",
    "As someone with sensitive skin, I'm always cautious. This product didn't cause any irritation.",
    "Traditional Ayurveda at its best! The herbal fragrance is pleasant and the results speak for themselves.",
    "Quality is top-notch. You can tell it's made with care and attention to detail.",
    "Sustainable packaging and pure ingredients. Love the company's commitment to quality.",
    "Perfect for daily use. It has become an essential part of my skincare routine.",
    "Worth the investment. The purity and effectiveness justify every rupee spent.",
    "Absolutely love this product. Used it for two weeks and the difference is clear.",
    "Great product, fast delivery. Will definitely recommend to friends and family.",
  ];
  const dates   = ["2 days ago","1 week ago","2 weeks ago","3 weeks ago","1 month ago","2 months ago","3 months ago","4 months ago","5 months ago","6 months ago","7 months ago","8 months ago"];
  const ratings = [5,4.5,5,4,5,4.5,5,4,5,4.5,5,4];

  return Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    author: authors[i],
    rating: ratings[i],
    date: dates[i],
    comment: comments[i],
    verified: i % 3 !== 0,
    helpful: Math.floor(Math.random() * 50),
  }));
}

// ─── Stars ───────────────────────────────────────────────────────────────────
function Stars({ rating, size = "sm", interactive = false, onRate }: {
  rating: number; size?: "sm" | "lg";
  interactive?: boolean; onRate?: (r: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const cls = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <FaStar key={i}
          className={`${cls} transition-colors ${
            i <= (interactive ? (hover || rating) : rating)
              ? "text-yellow-400" : "text-gray-200"
          } ${interactive ? "cursor-pointer" : ""}`}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate?.(i)}
        />
      ))}
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="w-full bg-white animate-pulse">
      <div className="max-w-[1600px] mx-auto px-[4%] py-8 space-y-4">
        <div className="flex gap-4 border-b pb-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-5 w-24 bg-gray-200 rounded" />)}
        </div>
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded w-48" />
          {[...Array(4)].map((_, i) => <div key={i} className="h-4 bg-gray-200 rounded w-full" />)}
        </div>
      </div>
    </div>
  );
}

// ─── Review Form Modal ────────────────────────────────────────────────────────
function ReviewFormModal({ onClose, onSubmit }: {
  onClose: () => void;
  onSubmit: (review: { author: string; rating: number; comment: string }) => void;
}) {
  const [name, setName]       = useState('');
  const [rating, setRating]   = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError]     = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim())    return setError('Please enter your name.');
    if (!comment.trim()) return setError('Please write a review comment.');
    if (rating < 1)      return setError('Please select a star rating.');
    onSubmit({ author: name.trim(), rating, comment: comment.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Write a Review</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition">
            <FaTimes className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Your Name *</label>
            <input value={name} onChange={e => { setName(e.target.value); setError(''); }}
              placeholder="Ahmed Khan"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-600 transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Rating *</label>
            <div className="flex items-center gap-2">
              <Stars rating={rating} size="lg" interactive onRate={r => { setRating(r); setError(''); }} />
              <span className="text-xs text-gray-500 ml-1">{rating}/5</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Your Review *</label>
            <textarea value={comment} onChange={e => { setComment(e.target.value); setError(''); }}
              rows={4} placeholder="Share your experience with this product..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-600 transition" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2.5 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition">
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProductDetailsSection({ product }: { product?: LegacyProduct }) {
  const productDetailsBanner1 = "/images/productdetailsbanner1.png";
  const productDetailsBanner2 = "/images/productdetailsbanner2.png";

  const [showBottomBar, setShowBottomBar] = useState(false);
  const [selectedSize, setSelectedSize]   = useState(product?.sizes?.[0] || "15ml");
  const [quantity, setQuantity]           = useState(1);
  const [activeTab, setActiveTab]         = useState<"description"|"ingredients"|"reviews"|"howToUse">("description");
  const [isLoggedIn, setIsLoggedIn]       = useState(false);
  const [isLoading, setIsLoading]         = useState(true);

  // Reviews state
  const [allReviews, setAllReviews]       = useState<Review[]>([]);
  const [currentPage, setCurrentPage]     = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState<Set<number>>(new Set());

  const sectionRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  const productId = product?.productId || product?.id;
  const isWishlisted = productId ? isInWishlist(productId) : false;

  useEffect(() => {
    const token = getAuthToken();
    const user = getStoredUser();
    setIsLoggedIn(!!(token && user));
    // Load reviews: start with seed + any saved
    const saved = localStorage.getItem(`reviews-${productId}`);
    const userReviews: Review[] = saved ? JSON.parse(saved) : [];
    setAllReviews([...userReviews, ...generateSeedReviews()]);
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, [productId]);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current)
        setShowBottomBar(window.scrollY >= sectionRef.current.offsetTop - 300);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) return <Skeleton />;

  const totalPages  = Math.ceil(allReviews.length / REVIEWS_PER_PAGE);
  const pagedReviews = allReviews.slice((currentPage - 1) * REVIEWS_PER_PAGE, currentPage * REVIEWS_PER_PAGE);
  const avgRating   = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
  const dist: Record<number,number> = { 5:0,4:0,3:0,2:0,1:0 };
  allReviews.forEach(r => { const b = Math.round(r.rating); dist[b] = (dist[b]||0)+1; });

  // ─── handlers ──────────────────────────────────────────────────────────────
  const cartPayload = () => ({
    id: productId!,
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
    toast.success("Added to cart! Redirecting…", { autoClose: 1500 });
    setTimeout(() => { window.location.href = "/cart"; }, 1600);
  };

  const toggleWishlist = () => {
    if (!productId) return;
    if (!isLoggedIn) {
      toast.warning("Please login to add to wishlist");
      setTimeout(() => { window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname); }, 1500);
      return;
    }
    if (isWishlisted) { removeFromWishlist(productId); toast.info("Removed from wishlist"); }
    else { addToWishlist({ ...cartPayload(), oldPrice: product?.oldPrice ?? undefined, rating: product?.rating, reviews: product?.reviews, inStock: true }); toast.success("Added to wishlist!"); }
  };

  const handleWhatsAppOrder = () => {
    const total = (product?.price || 0) * quantity;
    const msg = `🌟 *New Order Request* 🌟\n\n*Product:* ${product?.nameEn}\n*Price:* PKR ${(product?.price||0).toLocaleString()}\n*Size:* ${selectedSize}\n*Quantity:* ${quantity}\n*Total:* PKR ${total.toLocaleString()}\n\nPlease provide Full Name, Address & Phone.\n_Placed via Pansari Inn website_`;
    window.open(`https://wa.me/923001234567?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  const handleSubmitReview = ({ author, rating, comment }: { author: string; rating: number; comment: string }) => {
    const newReview: Review = {
      id: Date.now(),
      author,
      rating,
      date: "Just now",
      comment,
      verified: false,
      helpful: 0,
    };
    const updated = [newReview, ...allReviews];
    setAllReviews(updated);
    // Persist user reviews to localStorage (separate from seed)
    const saved = JSON.parse(localStorage.getItem(`reviews-${productId}`) || '[]');
    localStorage.setItem(`reviews-${productId}`, JSON.stringify([newReview, ...saved]));
    setShowReviewForm(false);
    setCurrentPage(1);
    setActiveTab("reviews");
    toast.success("Review submitted successfully! Thank you.");
  };

  const handleHelpful = (reviewId: number) => {
    if (helpfulClicked.has(reviewId)) return;
    setHelpfulClicked(prev => new Set(prev).add(reviewId));
    setAllReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r));
  };

  type TabId = "description" | "ingredients" | "reviews" | "howToUse";
  const tabs: { id: TabId; label: string }[] = [
    { id: "description",  label: "Description"                   },
    { id: "ingredients",  label: "Ingredients"                   },
    { id: "reviews",      label: `Reviews (${allReviews.length})`},
    { id: "howToUse",     label: "How to Use"                    },
  ];

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      {showReviewForm && (
        <ReviewFormModal
          onClose={() => setShowReviewForm(false)}
          onSubmit={handleSubmitReview}
        />
      )}

      <div ref={sectionRef} className="w-full bg-white">

        {/* ── Tab Section ── */}
        <div className="max-w-[1600px] mx-auto px-[4%] py-6">

          {/* Tab Nav */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex gap-1 sm:gap-6 overflow-x-auto -mb-px" style={{ scrollbarWidth: 'none' }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-2 sm:px-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                    activeTab === tab.id
                      ? "text-green-700 border-green-700"
                      : "text-gray-500 border-transparent hover:text-green-600 hover:border-green-300"
                  }`}>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* ── Description ── */}
          {activeTab === "description" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Product Description</h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                {product?.description || "Experience the power of pure Ayurvedic wellness with our premium herbal product."}
              </p>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Benefits</h3>
                <ul className="space-y-2">
                  {(product?.benefits?.length ? product.benefits : [
                    "100% Natural & Organic ingredients",
                    "Clinically tested for safety and efficacy",
                    "Free from harmful chemicals and preservatives",
                  ]).map((b: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <FaCheckCircle className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: <FaLeaf className="w-5 h-5 text-green-700" />,      title: "100% Natural", sub: "Organic ingredients", bg: "bg-green-50"  },
                  { icon: <FaShieldAlt className="w-5 h-5 text-blue-700" />,  title: "Safe & Tested", sub: "Quality assured",    bg: "bg-blue-50"   },
                  { icon: <FaCheckCircle className="w-5 h-5 text-amber-700" />, title: "Certified",  sub: "Ayurvedic formula",  bg: "bg-amber-50"  },
                  { icon: <FaBolt className="w-5 h-5 text-purple-700" />,     title: "Fast Results", sub: "Visible in days",    bg: "bg-purple-50" },
                ].map((card, i) => (
                  <div key={i} className={`flex items-center gap-2 p-3 ${card.bg} rounded-xl`}>
                    <div className="flex-shrink-0">{card.icon}</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-xs">{card.title}</p>
                      <p className="text-gray-500 text-[10px] mt-0.5">{card.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Ingredients ── */}
          {activeTab === "ingredients" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Ingredients</h2>
              <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                <ul className="space-y-3 divide-y divide-gray-200">
                  {[
                    { label: "Main Extract",  value: "Pure herbal extract (100% organic)"    },
                    { label: "Base Oil",      value: "Cold-pressed carrier oil"               },
                    { label: "Preservative",  value: "Natural vitamin E (tocopherol)"         },
                    { label: "Essential Oils",value: "Therapeutic grade aromatics"            },
                  ].map((item, i) => (
                    <li key={i} className="flex flex-col sm:flex-row sm:gap-4 pt-3 first:pt-0">
                      <span className="font-semibold text-gray-900 text-xs sm:min-w-[140px]">{item.label}:</span>
                      <span className="text-gray-500 text-xs">{item.value}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-gray-400 mt-4 italic border-t border-gray-200 pt-3">
                  * All ingredients are sourced from certified organic farms and processed using traditional Ayurvedic methods.
                </p>
              </div>
            </div>
          )}

          {/* ── Reviews ── */}
          {activeTab === "reviews" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Customer Reviews</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Real reviews from verified customers</p>
                </div>
                <button onClick={() => setShowReviewForm(true)}
                  className="px-4 py-2 bg-green-700 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition self-start sm:self-auto">
                  Write a Review
                </button>
              </div>

              {/* Rating summary */}
              <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-4xl font-black text-gray-900">{avgRating.toFixed(1)}</div>
                    <Stars rating={Math.round(avgRating)} size="lg" />
                    <p className="text-gray-400 text-xs mt-1.5">{allReviews.length} reviews</p>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    {[5,4,3,2,1].map(stars => {
                      const count = dist[stars] || 0;
                      const pct   = (count / allReviews.length) * 100;
                      return (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-[11px] text-gray-500 w-10 flex-shrink-0">{stars} stars</span>
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-600 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[11px] text-gray-400 w-4 text-right flex-shrink-0">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Review cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pagedReviews.map(review => (
                  <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaUser className="w-4 h-4 text-green-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-900 text-xs">{review.author}</span>
                          {review.verified && (
                            <span className="flex items-center gap-1 text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                              <FaCheckCircle className="w-2.5 h-2.5" /> Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Stars rating={review.rating} />
                          <span className="text-gray-400 text-[11px]">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-xs leading-relaxed flex-1">{review.comment}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <button
                        onClick={() => handleHelpful(review.id)}
                        className={`flex items-center gap-1.5 text-[11px] transition ${helpfulClicked.has(review.id) ? 'text-green-700' : 'text-gray-400 hover:text-green-700'}`}>
                        <FaThumbsUp className="w-3 h-3" />
                        Helpful ({review.helpful})
                      </button>
                      <span className="text-[10px] text-gray-300">Report</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition">
                  <FaChevronLeft className="w-3 h-3 text-gray-500" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium border transition ${
                      p === currentPage ? 'bg-green-700 text-white border-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition">
                  <FaChevronRight className="w-3 h-3 text-gray-500" />
                </button>
              </div>
              <p className="text-center text-[11px] text-gray-400">Page {currentPage} of {totalPages} · {allReviews.length} total reviews</p>
            </div>
          )}

          {/* ── How to Use ── */}
          {activeTab === "howToUse" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">How to Use</h2>
              <ol className="space-y-3">
                {[
                  "Take 2–3 drops of the product on your palm.",
                  "Gently massage into the affected area in circular motions.",
                  "Leave it on for at least 30 minutes or overnight for best results.",
                  "Rinse with lukewarm water (if applicable).",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-700 text-white rounded-full flex items-center justify-center text-xs font-bold">{i+1}</span>
                    <span className="text-gray-600 text-sm pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="font-semibold text-amber-900 mb-2 text-xs flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                  Important Notes
                </p>
                <ul className="space-y-1 text-[11px] text-amber-700">
                  {["For external use only","Do a patch test before first use","Avoid contact with eyes","Store in a cool, dry place","Keep out of reach of children"].map((n, i) => (
                    <li key={i}>• {n}</li>
                  ))}
                </ul>
              </div>
              <DirectionToUse />
            </div>
          )}
        </div>

        <VideoProductsSection />
        
        <RecommendedProductsSection />

        {/* ── Sticky Bottom Bar ── */}
        {showBottomBar && product && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
            <div className="max-w-[1600px] mx-auto px-[4%]">

              {/* Mobile */}
              <div className="flex md:hidden flex-col py-2 gap-2">
                <div className="flex items-center gap-2">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                    <Image
                      src={product.img || "/images/placeholder.jpg"}
                      alt={product.nameEn}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{product.nameEn}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-bold text-green-700">PKR {((product.price||0)*quantity).toLocaleString()}</span>
                      {product.sizes?.slice(0,3).map((s: string) => (
                        <button key={s} onClick={() => setSelectedSize(s)}
                          className={`px-1.5 py-0.5 text-[10px] rounded border transition ${selectedSize===s ? "bg-green-700 text-white border-green-700" : "text-gray-600 border-gray-300"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                    <button onClick={() => setQuantity(q => Math.max(1,q-1))} disabled={quantity===1}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-sm disabled:opacity-40">−</button>
                    <span className="w-7 text-center text-xs font-bold">{quantity}</span>
                    <button onClick={() => setQuantity(q => q+1)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-sm">+</button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  <button onClick={toggleWishlist}
                    className="flex items-center justify-center h-10 border border-gray-300 rounded-lg hover:bg-red-50 transition">
                    {isWishlisted ? <FaHeart className="w-4 h-4 text-red-500" /> : <FaRegHeart className="w-4 h-4 text-gray-500" />}
                  </button>
                  <button onClick={handleWhatsAppOrder}
                    className="flex items-center justify-center h-10 bg-[#25D366] text-white rounded-lg hover:bg-[#1da851] transition">
                    <FaWhatsapp className="w-4 h-4" />
                  </button>
                  <button onClick={handleAddToCart}
                    className="flex items-center justify-center gap-1 h-10 border-2 border-green-700 text-green-700 rounded-lg text-xs font-bold hover:bg-green-50 transition">
                    <FaShoppingCart className="w-3 h-3" /> Cart
                  </button>
                  <button onClick={handleBuyNow}
                    className="flex items-center justify-center h-10 bg-green-700 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition">
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Desktop */}
              <div className="hidden md:flex items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                    <Image
                      src={product.img || "/images/placeholder.jpg"}
                      alt={product.nameEn}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm truncate">{product.nameEn}</h3>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-base font-bold text-green-700">PKR {(product.price||0).toLocaleString()}</span>
                      {product.oldPrice && <span className="text-xs text-gray-400 line-through">PKR {product.oldPrice.toLocaleString()}</span>}
                      <div className="flex items-center gap-1">
                        <FaStar className="w-3 h-3 text-yellow-400" />
                        <span className="text-[11px] text-gray-500">{product.rating||4.8}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  {(product.sizes?.length ?? 0) > 0 && (
                    <div className="flex gap-1.5">
                      {product.sizes?.slice(0,3).map((s: string) => (
                        <button key={s} onClick={() => setSelectedSize(s)}
                          className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition ${selectedSize===s ? "bg-green-700 text-white border-green-700" : "text-gray-700 border-gray-300 hover:border-green-700"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button onClick={() => setQuantity(q => Math.max(1,q-1))} disabled={quantity===1}
                      className="px-3 py-2 hover:bg-gray-100 text-sm disabled:opacity-40">−</button>
                    <span className="px-4 py-2 border-x border-gray-300 font-semibold text-sm min-w-[40px] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => q+1)} className="px-3 py-2 hover:bg-gray-100 text-sm">+</button>
                  </div>
                  <button onClick={toggleWishlist} className="p-2.5 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition">
                    {isWishlisted ? <FaHeart className="w-4 h-4 text-red-500" /> : <FaRegHeart className="w-4 h-4 text-gray-500" />}
                  </button>
                  <button onClick={handleAddToCart}
                    className="flex items-center gap-2 px-4 py-2.5 border-2 border-green-700 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-50 transition">
                    <FaShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                  </button>
                  <button onClick={handleBuyNow}
                    className="px-4 py-2.5 bg-green-700 text-white rounded-lg text-xs font-semibold hover:bg-green-600 transition">
                    Buy Now
                  </button>
                  <button onClick={handleWhatsAppOrder}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-[#25D366] text-white rounded-lg text-xs font-semibold hover:bg-[#1da851] transition">
                    <FaWhatsapp className="w-3.5 h-3.5" /> WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        nav::-webkit-scrollbar { display: none; }
        nav { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}
