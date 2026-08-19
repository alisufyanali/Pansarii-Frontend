'use client';

import { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaStar, FaSearch, FaCheckCircle, FaUser, FaTimes, FaImage } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageBanner from '@/components/PageBanner';
import {
  getSiteReviews,
  submitSiteReview,
  type SiteReview,
  type ReviewSortOption,
} from '@/lib/reviews';
import { isAxiosError } from '@/lib/axios';

// ─── Constants ────────────────────────────────────────────────────────────────

const PER_PAGE = 10;

const SORT_OPTIONS: { value: ReviewSortOption; label: string }[] = [
  { value: 'newest',         label: 'Newest First'     },
  { value: 'oldest',         label: 'Oldest First'     },
  { value: 'highest_rating', label: 'Highest Rating'   },
  { value: 'lowest_rating',  label: 'Lowest Rating'    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-PK', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarDisplay({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5';
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(i => (
        <FaStar
          key={i}
          className={`${cls} ${i <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
        />
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Select rating">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          aria-label={`${i} star${i !== 1 ? 's' : ''}`}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
        >
          <FaStar
            className={`w-7 h-7 transition-colors ${
              i <= (hover || value) ? 'text-yellow-400' : 'text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-full bg-gray-200 rounded mt-2" />
              <div className="h-3 w-2/3 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: SiteReview }) {
  return (
    <article className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <FaUser className="w-4 h-4 text-green-700" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + badges */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 text-sm">{review.customer_name}</span>
            {review.verified && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full font-medium">
                <FaCheckCircle className="w-2.5 h-2.5" /> Verified
              </span>
            )}
          </div>

          {/* Stars + date */}
          <div className="flex items-center gap-3 mb-2">
            <StarDisplay rating={review.rating} />
            <span className="text-xs text-gray-400">{fmt(review.created_at)}</span>
          </div>

          {/* Product reference */}
          {review.product?.name && (
            <p className="text-[11px] text-green-700 font-medium mb-2">
              {review.product.name}
            </p>
          )}

          {/* Comment */}
          <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>

          {/* Review image */}
          {review.image && (
            <div className="mt-3">
              <Image
                src={review.image}
                alt="Review image"
                width={120}
                height={120}
                className="rounded-lg object-cover border border-gray-100"
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
}) {
  if (total <= 1) return null;

  // Show at most 7 page buttons, with ellipsis when needed
  const pages: (number | '…')[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push('…');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push('…');
    pages.push(total);
  }

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-8" aria-label="Pagination">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"
        aria-label="Previous page"
      >
        <FiChevronLeft className="w-4 h-4 text-gray-600" />
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            aria-current={p === current ? 'page' : undefined}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium border transition ${
              p === current
                ? 'bg-green-700 text-white border-green-700'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"
        aria-label="Next page"
      >
        <FiChevronRight className="w-4 h-4 text-gray-600" />
      </button>
    </nav>
  );
}

// ─── Review Form Modal ────────────────────────────────────────────────────────

interface ReviewFormData {
  name: string;
  email: string;
  order_number: string;
  rating: number;
  comment: string;
  image: File | null;
}

interface FormErrors {
  name?: string;
  email?: string;
  order_number?: string;
  rating?: string;
  comment?: string;
}

function ReviewFormModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<ReviewFormData>({
    name: '', email: '', order_number: '', rating: 0, comment: '', image: null,
  });
  const [errors, setErrors]         = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim())                              e.name         = 'Name is required.';
    if (!form.email.trim())                             e.email        = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email))         e.email        = 'Enter a valid email address.';
    if (!form.order_number.trim())                      e.order_number = 'Order number is required.';
    if (form.rating === 0)                              e.rating       = 'Please select a star rating.';
    if (!form.comment.trim())                           e.comment      = 'Review text is required.';
    else if (form.comment.trim().length < 10)           e.comment      = 'Review must be at least 10 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5 MB.');
      return;
    }
    setForm(prev => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setForm(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await submitSiteReview({
        reviewer_name:  form.name.trim(),
        reviewer_email: form.email.trim(),
        order_number:   form.order_number.trim(),
        rating:         form.rating,
        comment:        form.comment.trim(),
        image:          form.image,
      });
      toast.success('Thank you! Your review has been submitted.');
      onSuccess();
      onClose();
    } catch (err) {
      // Map Laravel 422 field-level errors to inline form errors
      if (
        isAxiosError(err) &&
        err.response?.status === 422 &&
        (err.response.data as { errors?: Record<string, string[]> })?.errors
      ) {
        const apiErrors = (err.response.data as { errors: Record<string, string[]> }).errors;
        const fieldMap: FormErrors = {};

        // order_number-related backend error messages
        if (apiErrors.order_number) {
          const msg = apiErrors.order_number[0];
          // Normalise known messages to user-friendly strings
          if (/not found|doesn.t exist|no order|no delivered/i.test(msg)) {
            fieldMap.order_number = "We couldn't find a delivered order with this number. Only delivered orders can be reviewed.";
          } else if (/already.*review|review.*already|duplicate/i.test(msg)) {
            fieldMap.order_number = 'A review has already been submitted for this order.';
          } else {
            fieldMap.order_number = msg;
          }
        }

        // email-related backend error (order email mismatch)
        if (apiErrors.email) {
          const msg = apiErrors.email[0];
          if (/match|order|associated/i.test(msg)) {
            fieldMap.email = "The email doesn't match this order. Please use the email associated with this order.";
          } else {
            fieldMap.email = msg;
          }
        }

        // Any other field errors (name, rating, comment)
        (Object.keys(apiErrors) as Array<keyof FormErrors>).forEach(key => {
          if (key !== 'order_number' && key !== 'email' && apiErrors[key]?.[0]) {
            (fieldMap as Record<string, string>)[key] = apiErrors[key][0];
          }
        });

        if (Object.keys(fieldMap).length > 0) {
          setErrors(prev => ({ ...prev, ...fieldMap }));
          // Also show a toast so the error is visible regardless of scroll position
          const firstMsg = fieldMap.order_number || fieldMap.email || Object.values(fieldMap)[0];
          if (firstMsg) toast.error(firstMsg);
          return;
        }
      }

      // Handle 422 with top-level `message` but no `errors` key
      // (e.g. { success: false, message: "No delivered order found..." })
      if (isAxiosError(err) && err.response?.status === 422) {
        const msg = (err.response.data as { message?: string })?.message;
        if (msg) {
          // Map order-related messages to the order_number field
          if (/order|delivered|not found/i.test(msg)) {
            setErrors(prev => ({ ...prev, order_number: msg }));
          }
          toast.error(msg);
          return;
        }
      }

      // Fallback for unexpected errors
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = (id: keyof ReviewFormData) => ({
    id,
    name: id,
    value: form[id] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [id]: e.target.value }));
      if (errors[id as keyof FormErrors]) setErrors(prev => ({ ...prev, [id]: undefined }));
    },
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100 z-10">
          <h2 className="text-base font-bold text-gray-900">Write a Review</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 hover:bg-gray-100 rounded-full transition"
          >
            <FaTimes className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-5">

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...field('name')}
              placeholder="Ahmed Khan"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                errors.name ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...field('email')}
              placeholder="your@email.com"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                errors.email ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* Order Number */}
          <div>
            <label htmlFor="order_number" className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
              Order Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...field('order_number')}
              placeholder="e.g. ORD-12345"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                errors.order_number ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            <p className="mt-1 text-[11px] text-gray-400">
              Enter the order number from your purchase confirmation.
            </p>
            {errors.order_number && <p className="mt-0.5 text-xs text-red-500">{errors.order_number}</p>}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
              Rating <span className="text-red-500">*</span>
            </label>
            <StarPicker
              value={form.rating}
              onChange={v => { setForm(prev => ({ ...prev, rating: v })); setErrors(prev => ({ ...prev, rating: undefined })); }}
            />
            {form.rating > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][form.rating]}
              </p>
            )}
            {errors.rating && <p className="mt-1 text-xs text-red-500">{errors.rating}</p>}
          </div>

          {/* Review */}
          <div>
            <label htmlFor="comment" className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={4}
              value={form.comment}
              onChange={e => {
                setForm(prev => ({ ...prev, comment: e.target.value }));
                if (errors.comment) setErrors(prev => ({ ...prev, comment: undefined }));
              }}
              placeholder="Share your experience with this product…"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                errors.comment ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.comment
                ? <p className="text-xs text-red-500">{errors.comment}</p>
                : <span />
              }
              <span className="text-[11px] text-gray-400">{form.comment.length} chars</span>
            </div>
          </div>

          {/* Image upload (optional) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
              Photo <span className="text-gray-400 font-normal normal-case">(optional, max 5 MB)</span>
            </label>
            {imagePreview ? (
              <div className="relative inline-block">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={100}
                  height={100}
                  className="rounded-lg object-cover border border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  aria-label="Remove image"
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                >
                  <FaTimes className="w-2.5 h-2.5" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="review-image"
                className="flex items-center gap-2 w-fit cursor-pointer px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-green-400 hover:text-green-600 transition"
              >
                <FaImage className="w-4 h-4" />
                Choose image
                <input
                  ref={fileRef}
                  id="review-image"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Submitting…
                </>
              ) : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main page (wrapped in Suspense for useSearchParams) ─────────────────────

export default function ReviewsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <div className="h-40 bg-green-700" />
          <div className="max-w-5xl mx-auto px-[4%] py-8">
            <ReviewSkeleton />
          </div>
        </div>
      }
    >
      <ReviewsContent />
    </Suspense>
  );
}

function ReviewsContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  // Read state from URL so deep-links and back-button work
  const pageParam  = Number(searchParams.get('page')  ?? 1);
  const sortParam  = (searchParams.get('sort')  ?? 'newest') as ReviewSortOption;
  const searchTerm = searchParams.get('search') ?? '';

  const [reviews,     setReviews]     = useState<SiteReview[]>([]);
  const [total,       setTotal]       = useState(0);
  const [totalPages,  setTotalPages]  = useState(1);
  const [isLoading,   setIsLoading]   = useState(true);
  const [showForm,    setShowForm]    = useState(false);

  // Local search input (debounced before writing to URL)
  const [searchInput, setSearchInput] = useState(searchTerm);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchReviews = useCallback(async (
    page: number,
    sort: ReviewSortOption,
    search: string,
    signal?: AbortSignal,
  ) => {
    setIsLoading(true);
    try {
      const res = await getSiteReviews(
        { page, per_page: PER_PAGE, sort, ...(search ? { search } : {}) },
        { signal },
      );
      setReviews(res.data);
      setTotal(res.meta.total);
      setTotalPages(res.meta.last_page);
    } catch (err) {
      if ((err as { name?: string }).name === 'AbortError' || (err as { name?: string }).name === 'CanceledError') return;
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchReviews(pageParam, sortParam, searchTerm, controller.signal);
    return () => controller.abort();
  }, [pageParam, sortParam, searchTerm, fetchReviews]);

  // ── URL helpers ────────────────────────────────────────────────────────────
  const pushParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === '' || (k === 'page' && v === '1')) params.delete(k);
      else params.set(k, v);
    });
    router.push(`/reviews?${params.toString()}`);
  }, [router, searchParams]);

  const handlePageChange = (p: number) => {
    pushParams({ page: String(p) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (sort: ReviewSortOption) => {
    pushParams({ sort, page: null });
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushParams({ search: value, page: null });
    }, 400);
  };

  const handleFormSuccess = () => {
    // Refresh first page after a new review is submitted
    pushParams({ page: null });
    if (pageParam === 1) {
      fetchReviews(1, sortParam, searchTerm);
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const from = total === 0 ? 0 : (pageParam - 1) * PER_PAGE + 1;
  const to   = Math.min(pageParam * PER_PAGE, total);

  return (
    <div className="min-h-screen bg-gray-50">

      <PageBanner
        icon={<FaStar className="w-7 h-7" />}
        title="Customer Reviews"
        description="Real experiences from our valued customers"
      >
        {/* Write a Review button in banner */}
        <button
          onClick={() => setShowForm(true)}
          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-green-700 font-semibold text-sm rounded-lg hover:bg-green-50 transition shadow-sm"
        >
          <FaStar className="w-3.5 h-3.5" />
          Write a Review
        </button>
      </PageBanner>

      <div className="max-w-5xl mx-auto px-[4%] py-8">

        {/* Controls bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">

          {/* Search */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="search"
              placeholder="Search by reviewer name…"
              value={searchInput}
              onChange={e => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          {/* Sort */}
          <select
            value={sortParam}
            onChange={e => handleSortChange(e.target.value as ReviewSortOption)}
            aria-label="Sort reviews"
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition sm:w-48"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Write a Review (desktop-only duplicate for easy access) */}
          <button
            onClick={() => setShowForm(true)}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition whitespace-nowrap"
          >
            <FaStar className="w-3.5 h-3.5" />
            Write a Review
          </button>
        </div>

        {/* Result count */}
        {!isLoading && (
          <p className="text-sm text-gray-500 mb-4">
            {total === 0
              ? 'No reviews found'
              : `Showing ${from}–${to} of ${total} review${total !== 1 ? 's' : ''}`}
          </p>
        )}

        {/* Review list */}
        {isLoading ? (
          <ReviewSkeleton />
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <FaStar className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900 mb-1">No reviews found</h3>
            <p className="text-sm text-gray-500 mb-5">
              {searchTerm
                ? `No results for "${searchTerm}"`
                : 'Be the first to share your experience!'}
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition"
            >
              <FaStar className="w-3.5 h-3.5" />
              Write a Review
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && (
          <Pagination current={pageParam} total={totalPages} onChange={handlePageChange} />
        )}
      </div>

      {/* Review form modal */}
      {showForm && (
        <ReviewFormModal
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
