"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { api, getApiErrorMessage } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';

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

// Shape returned by GET /products/{slug}/reviews
// Actual response: { success, data: { stats: ReviewStats, reviews: ApiReview[] }, meta: {...} }
interface ApiReview {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
  verified?: boolean;
}

interface ReviewStats {
  total: number;
  average: number;
  breakdown: Record<string, number>;
}

interface ApiReviewsResponse {
  stats: ReviewStats;
  reviews: ApiReview[];
}

const REVIEWS_PER_PAGE = 4;

/** Convert API review to local Review shape */
function apiReviewToReview(r: ApiReview): Review {
  return {
    id: r.id,
    author: r.customer_name,
    rating: r.rating,
    date: new Date(r.created_at).toLocaleDateString('en-PK', {
      day: 'numeric', month: 'short', year: 'numeric',
    }),
    comment: r.comment,
    verified: r.verified ?? true,
    helpful: 0,
  };
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
function ReviewFormModal({ onClose, onSubmit, isSubmitting }: {
  onClose: () => void;
  onSubmit: (review: { author: string; email: string; rating: number; comment: string }) => void;
  isSubmitting?: boolean;
}) {
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [rating,  setRating]  = useState(5);
  const [comment, setComment] = useState('');
  const [error,   setError]   = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim())    return setError('Please enter your name.');
    if (!email.trim())   return setError('Please enter your email.');
    if (!/\S+@\S+\.\S+/.test(email)) return setError('Please enter a valid email address.');
    if (!comment.trim()) return setError('Please write a review comment.');
    if (rating < 1)      return setError('Please select a star rating.');
    onSubmit({ author: name.trim(), email: email.trim(), rating, comment: comment.trim() });
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
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Your Email *</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="ahmed@example.com"
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
            <button type="button" onClick={onClose} disabled={isSubmitting}
              className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 py-2.5 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition disabled:opacity-60 flex items-center justify-center gap-2">
              {isSubmitting ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProductDetailsSection({
  product,
}: {
  product?: LegacyProduct;
}) {
  // Derive slug and numeric id from the product prop so we can pass them
  // to the related/recommended child sections without a separate prop-drilling chain.
  const productSlug = (product as LegacyProduct & { slug?: string })?.slug;
  const productId   = product?.productId !== undefined ? Number(product.productId)
    : product?.id !== undefined ? Number(product.id)
    : undefined;

  const [showBottomBar, setShowBottomBar] = useState(false);
  const [quantity, setQuantity]           = useState(1);
  const [activeTab, setActiveTab]         = useState<"description"|"ingredients"|"reviews"|"howToUse">("description");

  // ── Three-tier variant selection ─────────────────────────────────────────────
  // Tier 1 — Rich: variants have attributes (Weight/Volume/Size/… + optional Form)
  // Tier 2 — Named flat: variants have no attributes but have a non-blank name
  // Tier 3 — Price-only: variants have neither (e.g. Ginger Oil — price+unit only)
  const richVariants = ((product as unknown as { variants?: Array<{
    id: number; name: string; price: number; is_default?: boolean;
    attributes?: Record<string, string>; unit?: string; final_price?: number;
  }> })?.variants ?? []);

  // Auto-detect the primary dimension key (Weight, Volume, Size, Qty, …).
  // "Form" is reserved as the secondary key; any OTHER non-empty attribute key is primary.
  const primaryKey: string | undefined = (() => {
    for (const v of richVariants) {
      const attrs = v.attributes;
      if (!attrs || Array.isArray(attrs)) continue;
      const keys = Object.keys(attrs).filter(k => k !== 'Form');
      if (keys.length > 0) return keys[0];
    }
    return undefined;
  })();

  const weightOptions = primaryKey
    ? Array.from(
        new Set(richVariants.map(v => {
          const attrs = v.attributes;
          if (!attrs || Array.isArray(attrs)) return undefined;
          return attrs[primaryKey];
        }).filter(Boolean) as string[])
      ).sort((a, b) => Number(a) - Number(b))
    : [];

  const formOptions = Array.from(
    new Set(richVariants.map(v => {
      const attrs = v.attributes;
      if (!attrs || Array.isArray(attrs)) return undefined;
      return attrs.Form;
    }).filter(Boolean) as string[])
  );

  const variantUnit = richVariants[0]?.unit ?? '';
  const hasRichVariants = weightOptions.length > 0;

  // Tier 2: named flat variants (no attributes, but name is populated)
  const hasNamedVariants = !hasRichVariants && richVariants.some(v => v.name?.trim());
  // Tier 3: price-only variants (no attributes, no names)
  const hasPriceOnlyVariants = !hasRichVariants && !hasNamedVariants && richVariants.length > 0;

  const [selectedWeight, setSelectedWeight] = useState<string>(weightOptions[0] ?? '');
  const [selectedForm,   setSelectedForm]   = useState<string>(formOptions[0]   ?? '');
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number>(0);
  const [selectedSize,   setSelectedSize]   = useState(product?.sizes?.[0] || '');

  // Price-only label helper: "PKR 300 / ml"
  const priceOnlyLabel = (v: typeof richVariants[number]) =>
    `PKR ${(v.final_price ?? v.price).toLocaleString()}${variantUnit ? ' / ' + variantUnit : ''}`;

  // Matched variant for price and variantId
  const matchedVariant = hasRichVariants
    ? richVariants.find(v => {
        const attrs = v.attributes;
        if (!attrs || Array.isArray(attrs)) return false;
        return primaryKey
          && attrs[primaryKey] === selectedWeight
          && (formOptions.length === 0 || attrs.Form === selectedForm);
      })
    : (hasNamedVariants || hasPriceOnlyVariants)
    ? richVariants[selectedVariantIdx]
    : richVariants.find(v => v.name === selectedSize);

  // final_price is authoritative — includes any additional charge from admin.
  const displayedPrice: number =
    matchedVariant?.final_price ??
    matchedVariant?.price ??
    product?.price ?? 0;

  // Display label for cart/WhatsApp
  const selectedLabel = hasRichVariants
    ? [selectedWeight ? `${selectedWeight}${variantUnit ? ' ' + variantUnit : ''}` : '', selectedForm].filter(Boolean).join(' / ')
    : hasNamedVariants
    ? (matchedVariant?.name ?? '')
    : hasPriceOnlyVariants
    ? priceOnlyLabel(matchedVariant ?? richVariants[0])
    : selectedSize;

  // Reviews state — driven by real API
  const [allReviews, setAllReviews]         = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError]     = useState('');
  const [currentPage, setCurrentPage]       = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState<Set<number>>(new Set());

  const sectionRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const router = useRouter();

  const isWishlisted = productId !== undefined ? isInWishlist(productId) : false;

  useEffect(() => {
    if (!productSlug) return;
    setReviewsLoading(true);
    setReviewsError('');
    api.get<ApiResponse<ApiReviewsResponse>>(`/products/${productSlug}/reviews`)
      .then(res => {
        // res.data is { stats, reviews } — not a flat array
        const reviews = res.data?.reviews;
        setAllReviews(Array.isArray(reviews) ? reviews.map(apiReviewToReview) : []);
      })
      .catch(err => setReviewsError(getApiErrorMessage(err)))
      .finally(() => setReviewsLoading(false));
  }, [productSlug]);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current)
        setShowBottomBar(window.scrollY >= sectionRef.current.offsetTop - 300);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Derived review calculations — safe when reviews array is empty
  const totalPages  = Math.ceil(allReviews.length / REVIEWS_PER_PAGE) || 1;
  const pagedReviews = allReviews.slice((currentPage - 1) * REVIEWS_PER_PAGE, currentPage * REVIEWS_PER_PAGE);
  const avgRating   = allReviews.length > 0
    ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
    : 0;
  const dist: Record<number,number> = { 5:0,4:0,3:0,2:0,1:0 };
  allReviews.forEach(r => { const b = Math.round(r.rating); dist[b] = (dist[b]||0)+1; });

  // ─── handlers ──────────────────────────────────────────────────────────────
  const cartPayload = () => ({
    id: productId!,
    // Find matching variant id from product sizes
    variantId: (product as unknown as { variants?: Array<{ id: number; name: string }> })
      ?.variants?.find(v => v.name === selectedSize)?.id
      ?? (product as unknown as { variants?: Array<{ id: number; name: string }> })
      ?.variants?.[0]?.id,
    img: product?.img || "/images/placeholder.jpg",
    nameEn: product?.nameEn || "Product",
    nameUr: product?.nameUr || "",
    price: displayedPrice,
    size: selectedLabel,
    category: product?.category || "Herbal Oils",
  });

  const handleAddToCart = async () => {
    if (!productId) return toast.error("Failed to add item to cart!");
    try {
      for (let i = 0; i < quantity; i++) await addToCart(cartPayload());
      toast.success(`Added ${quantity} × ${product?.nameEn} (${selectedLabel}) to cart!`);
    } catch { /* error already toasted by context */ }
  };

  const handleBuyNow = async () => {
    if (!productId) return toast.error("Failed to add item to cart!");
    try {
      for (let i = 0; i < quantity; i++) await addToCart(cartPayload());
      toast.success("Added to cart! Redirecting…", { autoClose: 1500 });
      router.push("/cart");
    } catch { /* error already toasted by context */ }
  };

  const toggleWishlist = async () => {
    if (!productId) return;
    const wishlistPayload = {
      ...cartPayload(),
      productId: Number(productId),
      variantId: (product as unknown as { variants?: Array<{ id: number; is_default?: boolean }> })
        ?.variants?.find(v => v.is_default)?.id
        ?? (product as unknown as { variants?: Array<{ id: number }> })?.variants?.[0]?.id,
      oldPrice: product?.oldPrice ?? undefined,
      rating: product?.rating,
      reviews: product?.reviews,
      inStock: true,
    };
    if (isWishlisted) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(wishlistPayload);
    }
  };

  const handleWhatsAppOrder = () => {
    const total = displayedPrice * quantity;
    const msg = `🌟 *New Order Request* 🌟\n\n*Product:* ${product?.nameEn}\n*Price:* PKR ${displayedPrice.toLocaleString()}\n*Size:* ${selectedSize}\n*Quantity:* ${quantity}\n*Total:* PKR ${total.toLocaleString()}\n\nPlease provide Full Name, Address & Phone.\n_Placed via Pansari Inn website_`;
    window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  const handleSubmitReview = async ({ author, email, rating, comment }: { author: string; email: string; rating: number; comment: string }) => {
    if (!productSlug) {
      toast.error('Cannot submit review — product identifier missing.');
      return;
    }
    setIsSubmittingReview(true);
    try {
      const res = await api.post<ApiResponse<ApiReview>>(`/products/${productSlug}/reviews`, {
        name: author,
        email,
        rating,
        comment,
      });
      const submitted = apiReviewToReview(res.data);
      setAllReviews(prev => [submitted, ...prev]);
      setShowReviewForm(false);
      setCurrentPage(1);
      setActiveTab('reviews');
      toast.success('Review submitted successfully! Thank you.');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleHelpful = (reviewId: number) => {
    if (helpfulClicked.has(reviewId)) return;
    setHelpfulClicked(prev => new Set(prev).add(reviewId));
    setAllReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r));
  };

  type TabId = "description" | "ingredients" | "reviews" | "howToUse";
  const tabs: { id: TabId; label: string }[] = [
    { id: "description",  label: "Description" },
    ...(product?.ingredients && product.ingredients.length > 0 ? [{ id: "ingredients" as TabId, label: "Ingredients" }] : []),
    { id: "reviews",      label: reviewsLoading ? "Reviews" : `Reviews (${allReviews.length})` },
    ...(product?.how_to_use?.steps && product.how_to_use.steps.length > 0 ? [{ id: "howToUse" as TabId, label: "How to Use" }] : []),
  ];

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      {showReviewForm && (
        <ReviewFormModal
          onClose={() => setShowReviewForm(false)}
          onSubmit={handleSubmitReview}
          isSubmitting={isSubmittingReview}
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
              {product?.benefits && product.benefits.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Benefits</h3>
                  <ul className="space-y-2">
                    {product.benefits.map((b: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <FaCheckCircle className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {product?.key_features && product.key_features.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {product.key_features.map((feat: any, i: number) => {
                    const iconMap: Record<string, React.ReactNode> = {
                      leaf: <FaLeaf className="w-5 h-5" />,
                      shield: <FaShieldAlt className="w-5 h-5" />,
                      check: <FaCheckCircle className="w-5 h-5" />,
                      bolt: <FaBolt className="w-5 h-5" />,
                    };
                    const colorMap: Record<string, { bg: string, text: string }> = {
                      green: { bg: "bg-green-50", text: "text-green-700" },
                      blue: { bg: "bg-blue-50", text: "text-blue-700" },
                      amber: { bg: "bg-amber-50", text: "text-amber-700" },
                      purple: { bg: "bg-purple-50", text: "text-purple-700" },
                    };
                    const colorScheme = colorMap[feat.color] || colorMap.green;
                    const iconNode = iconMap[feat.icon] || iconMap.leaf;
                    return (
                      <div key={i} className={`flex items-center gap-2 p-3 ${colorScheme.bg} rounded-xl`}>
                        <div className={`flex-shrink-0 ${colorScheme.text}`}>{iconNode}</div>
                        <div>
                          <p className="font-semibold text-gray-900 text-xs">{feat.title}</p>
                          <p className="text-gray-500 text-[10px] mt-0.5">{feat.sub}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Ingredients ── */}
          {activeTab === "ingredients" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Ingredients</h2>
              {product?.ingredients && product.ingredients.length > 0 ? (
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                  <ul className="space-y-3 divide-y divide-gray-200">
                    {product.ingredients.map((item: any, i: number) => (
                      <li key={i} className="flex flex-col sm:flex-row sm:gap-4 pt-3 first:pt-0">
                        <span className="font-semibold text-gray-900 text-xs sm:min-w-[140px]">{item.label}:</span>
                        <span className="text-gray-500 text-xs">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 text-xs italic">No ingredient details available for this product.</p>
              )}
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

              {/* Reviews loading skeleton */}
              {reviewsLoading && (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
                      <div className="flex gap-3 mb-3">
                        <div className="w-9 h-9 bg-gray-200 rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-28 bg-gray-200 rounded" />
                          <div className="h-3 w-20 bg-gray-200 rounded" />
                        </div>
                      </div>
                      <div className="h-3 w-full bg-gray-200 rounded mb-1.5" />
                      <div className="h-3 w-3/4 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              )}

              {/* Reviews error */}
              {!reviewsLoading && reviewsError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                  {reviewsError}
                </div>
              )}

              {/* Empty state */}
              {!reviewsLoading && !reviewsError && allReviews.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                  <div className="text-4xl mb-3">⭐</div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">No reviews yet</h3>
                  <p className="text-xs text-gray-400 mb-4">Be the first to review this product.</p>
                  <button onClick={() => setShowReviewForm(true)}
                    className="px-5 py-2 bg-green-700 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition">
                    Write a Review
                  </button>
                </div>
              )}

              {/* Rating summary + review cards */}
              {!reviewsLoading && !reviewsError && allReviews.length > 0 && (
                <>
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
                          const pct   = allReviews.length > 0 ? (count / allReviews.length) * 100 : 0;
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
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
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
                  )}
                  <p className="text-center text-[11px] text-gray-400">
                    Page {currentPage} of {totalPages} · {allReviews.length} total reviews
                  </p>
                </>
              )}
            </div>
          )}

          {/* ── How to Use ── */}
          {activeTab === "howToUse" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">How to Use</h2>
              {product?.how_to_use?.steps && product.how_to_use.steps.length > 0 ? (
                <>
                  <ol className="space-y-3">
                    {product.how_to_use.steps.map((step: string, i: number) => (
                      <li key={i} className="flex gap-3 items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-green-700 text-white rounded-full flex items-center justify-center text-xs font-bold">{i+1}</span>
                        <span className="text-gray-600 text-sm pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                  {product.how_to_use.notes && product.how_to_use.notes.length > 0 && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                      <p className="font-semibold text-amber-900 mb-2 text-xs flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                        Important Notes
                      </p>
                      <ul className="space-y-1 text-[11px] text-amber-700">
                        {product.how_to_use.notes.map((n: string, i: number) => (
                          <li key={i}>• {n}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-xs italic">No directions available for this product.</p>
              )}
              <DirectionToUse />
            </div>
          )}
        </div>

        <VideoProductsSection productSlug={productSlug} />

        <RecommendedProductsSection productId={productId} />

        {/* ── Sticky Bottom Bar ── */}
        {showBottomBar && product && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
            <div className="max-w-[1600px] mx-auto px-[4%]">

              {/* ── Mobile bottom bar ── */}
              <div className="flex md:hidden flex-col py-2 gap-2">
                <div className="flex items-center gap-2">

                  {/* Thumbnail */}
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                    <Image
                      src={product.img || "/images/placeholder.jpg"}
                      alt={product.nameEn}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>

                  {/* ── Name + price + variant selectors ── */}
                  <div className="flex-1 min-w-0">
                    {/* Issue 4: English name always shown; Urdu name only when real and distinct */}
                    <p className="text-xs font-bold text-gray-900 truncate">{product.nameEn}</p>
                    {product.nameUr && product.nameUr !== product.nameEn && (
                      <p
                        className="text-[10px] text-gray-400 truncate leading-tight"
                        style={{ fontFamily: '"Noto Nastaliq Urdu", "Traditional Arabic", system-ui, sans-serif' }}
                      >
                        {product.nameUr}
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                      {/* Price — always reflects displayedPrice which is driven by selected variant */}
                      <span className="text-sm font-bold text-green-700">
                        PKR {(displayedPrice * quantity).toLocaleString()}
                      </span>

                      {/* Variant selector — rich (weight/form), named, price-only, or simple sizes */}
                      {hasRichVariants ? (
                        weightOptions.slice(0, 3).map(w => (
                          <button
                            key={w}
                            onClick={() => {
                              setSelectedWeight(w);
                              const available = richVariants
                                .filter(v => {
                                  const attrs = v.attributes;
                                  return attrs && !Array.isArray(attrs) && primaryKey && attrs[primaryKey] === w;
                                })
                                .map(v => (v.attributes as Record<string,string>)?.Form)
                                .filter(Boolean) as string[];
                              if (formOptions.length > 0 && !available.includes(selectedForm)) {
                                setSelectedForm(available[0] ?? formOptions[0]);
                              }
                            }}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border-2 transition ${
                              selectedWeight === w
                                ? 'bg-green-700 text-white border-green-700'
                                : 'text-gray-700 border-gray-300 hover:border-green-600'
                            }`}
                          >
                            {w}{variantUnit ? ` ${variantUnit}` : ''}
                          </button>
                        ))
                      ) : (hasNamedVariants || hasPriceOnlyVariants) ? (
                        richVariants.slice(0, 3).map((v, idx) => {
                          const label = hasNamedVariants
                            ? `${v.name}${variantUnit ? ' ' + variantUnit : ''}`
                            : priceOnlyLabel(v);
                          return (
                            <button
                              key={v.id ?? idx}
                              onClick={() => setSelectedVariantIdx(idx)}
                              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border-2 transition ${
                                selectedVariantIdx === idx
                                  ? 'bg-green-700 text-white border-green-700'
                                  : 'text-gray-700 border-gray-300 hover:border-green-600'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })
                      ) : (
                        product.sizes?.slice(0, 3).map((s: string) => (
                          <button
                            key={s}
                            onClick={() => setSelectedSize(s)}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border-2 transition ${
                              selectedSize === s
                                ? 'bg-green-700 text-white border-green-700'
                                : 'text-gray-700 border-gray-300 hover:border-green-600'
                            }`}
                          >
                            {s}
                          </button>
                        ))
                      )}

                      {/* Form selector row (rich variants only) */}
                      {hasRichVariants && formOptions.length > 0 && formOptions.map(f => {
                        const available = richVariants
                          .filter(v => {
                            const attrs = v.attributes;
                            return attrs && !Array.isArray(attrs) && primaryKey && attrs[primaryKey] === selectedWeight;
                          })
                          .map(v => (v.attributes as Record<string,string>)?.Form) as string[];
                        const disabled = !available.includes(f);
                        return (
                          <button
                            key={f}
                            onClick={() => !disabled && setSelectedForm(f)}
                            disabled={disabled}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border-2 transition ${
                              selectedForm === f
                                ? 'bg-green-700 text-white border-green-700'
                                : disabled
                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                : 'text-gray-700 border-gray-300 hover:border-green-600'
                            }`}
                          >
                            {f}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quantity stepper */}
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity === 1}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-sm disabled:opacity-40">−</button>
                    <span className="w-7 text-center text-xs font-bold">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)}
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-sm">+</button>
                  </div>
                </div>

                {/* Action buttons row */}
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

              {/* ── Desktop bottom bar ── */}
              <div className="hidden md:flex items-center justify-between gap-4 py-3">

                {/* Left: thumbnail + name + price */}
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
                    {/* Issue 4: English name always; Urdu only when real and distinct */}
                    <h3 className="font-bold text-gray-900 text-sm truncate">{product.nameEn}</h3>
                    {product.nameUr && product.nameUr !== product.nameEn && (
                      <p
                        className="text-[11px] text-gray-400 truncate leading-tight"
                        style={{ fontFamily: '"Noto Nastaliq Urdu", "Traditional Arabic", system-ui, sans-serif' }}
                      >
                        {product.nameUr}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      {/* Price reflects selected variant via displayedPrice */}
                      <span className="text-base font-bold text-green-700">
                        PKR {displayedPrice.toLocaleString()}
                      </span>
                      {product.oldPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          PKR {product.oldPrice.toLocaleString()}
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <FaStar className="w-3 h-3 text-yellow-400" />
                        <span className="text-[11px] text-gray-500">{product.rating || 4.8}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: variant selectors + qty + action buttons */}
                <div className="flex items-center gap-2.5">

                  {/* Variant selector — rich (weight/form), named, price-only, or simple sizes */}
                  {hasRichVariants ? (
                    <div className="flex items-center gap-1.5">
                      {weightOptions.slice(0, 3).map(w => (
                        <button
                          key={w}
                          onClick={() => {
                            setSelectedWeight(w);
                            const available = richVariants
                              .filter(v => {
                                const attrs = v.attributes;
                                return attrs && !Array.isArray(attrs) && primaryKey && attrs[primaryKey] === w;
                              })
                              .map(v => (v.attributes as Record<string,string>)?.Form)
                              .filter(Boolean) as string[];
                            if (formOptions.length > 0 && !available.includes(selectedForm)) {
                              setSelectedForm(available[0] ?? formOptions[0]);
                            }
                          }}
                          className={`px-3 py-2 text-sm font-semibold rounded-lg border-2 transition ${
                            selectedWeight === w
                              ? 'bg-green-700 text-white border-green-700'
                              : 'text-gray-700 border-gray-300 hover:border-green-600'
                          }`}
                        >
                          {w}{variantUnit ? ` ${variantUnit}` : ''}
                        </button>
                      ))}
                      {formOptions.map(f => {
                        const available = richVariants
                          .filter(v => {
                            const attrs = v.attributes;
                            return attrs && !Array.isArray(attrs) && primaryKey && attrs[primaryKey] === selectedWeight;
                          })
                          .map(v => (v.attributes as Record<string,string>)?.Form) as string[];
                        const disabled = !available.includes(f);
                        return (
                          <button
                            key={f}
                            onClick={() => !disabled && setSelectedForm(f)}
                            disabled={disabled}
                            className={`px-3 py-2 text-sm font-semibold rounded-lg border-2 transition ${
                              selectedForm === f
                                ? 'bg-green-700 text-white border-green-700'
                                : disabled
                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                : 'text-gray-700 border-gray-300 hover:border-green-600'
                            }`}
                          >
                            {f}
                          </button>
                        );
                      })}
                    </div>
                  ) : (hasNamedVariants || hasPriceOnlyVariants) ? (
                    <div className="flex items-center gap-1.5">
                      {richVariants.slice(0, 3).map((v, idx) => {
                        const label = hasNamedVariants
                          ? `${v.name}${variantUnit ? ' ' + variantUnit : ''}`
                          : priceOnlyLabel(v);
                        return (
                          <button
                            key={v.id ?? idx}
                            onClick={() => setSelectedVariantIdx(idx)}
                            className={`px-3 py-2 text-sm font-semibold rounded-lg border-2 transition ${
                              selectedVariantIdx === idx
                                ? 'bg-green-700 text-white border-green-700'
                                : 'text-gray-700 border-gray-300 hover:border-green-600'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    // Simple-size path — unchanged
                    (product.sizes?.length ?? 0) > 0 && (
                      <div className="flex gap-2">
                        {product.sizes?.slice(0, 3).map((s: string) => (
                          <button
                            key={s}
                            onClick={() => setSelectedSize(s)}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 transition ${
                              selectedSize === s
                                ? 'bg-green-700 text-white border-green-700'
                                : 'text-gray-700 border-gray-300 hover:border-green-600'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )
                  )}

                  {/* Quantity stepper */}
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity === 1}
                      className="px-3 py-2 hover:bg-gray-100 text-sm disabled:opacity-40">−</button>
                    <span className="px-4 py-2 border-x border-gray-300 font-semibold text-sm min-w-[40px] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 hover:bg-gray-100 text-sm">+</button>
                  </div>

                  {/* Action buttons */}
                  <button onClick={toggleWishlist}
                    className="p-2.5 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition">
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
