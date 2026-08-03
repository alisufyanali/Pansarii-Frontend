/**
 * lib/reviews.ts
 * Homepage customer reviews + site-wide reviews API.
 */

import { api, isAxiosError } from './axios';
import type { PaginatedResponse, PaginatedMeta } from '@/types/api';

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface HomepageReviewProduct {
  id: number;
  name: string;
  slug?: string;
  thumbnail?: string | null;
}

export interface HomepageReview {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  product?: HomepageReviewProduct | null;
}

/** Card shape used by ReviewCard / mobile review UI */
export interface ReviewCardData {
  id: number;
  title: string;
  text: string;
  name: string;
  designation: string;
  img: string;
  rating: number;
  images?: string[];
  productName?: string;
  productImage?: string;
}

export const DEFAULT_REVIEWS: ReviewCardData[] = [
  {
    id: 1,
    title: 'Amazing Product Quality',
    text: "This apricot oil has transformed my skin completely. I've been using it for a month and my skin feels so hydrated and glowing.",
    name: 'Sarah Khan',
    designation: 'Beauty Blogger',
    img: '/images/product.png',
    rating: 5.0,
    images: ['/images/product.png'],
  },
  {
    id: 2,
    title: 'Best Purchase Ever',
    text: "The quality is outstanding. It's pure and natural just as described. Will definitely repurchase and recommend to friends.",
    name: 'Ali Ahmed',
    designation: 'Regular Customer',
    img: '/images/product.png',
    rating: 5.0,
  },
];

export function mapHomepageReviewToCard(review: HomepageReview): ReviewCardData {
  const productName  = review.product?.name;
  const productImage = review.product?.thumbnail || undefined;
  return {
    id:           review.id,
    title:        productName ?? 'Great Experience',
    text:         review.comment,
    name:         review.customer_name,
    designation:  productName ?? 'Verified Customer',
    img:          productImage ?? '/images/product.png',
    rating:       review.rating,
    images:       productImage ? [productImage] : undefined,
    productName,
    productImage,
  };
}

export async function getHomepageReviews(): Promise<HomepageReview[]> {
  const res = await api.get<{ success: boolean; data: HomepageReview[] }>('/homepage/reviews');
  return res.data ?? [];
}

// ─── Reviews page API ─────────────────────────────────────────────────────────

export type ReviewSortOption = 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating';

export interface SiteReview {
  id: number;
  customer_name: string;
  email?: string;
  rating: number;
  comment: string;
  created_at: string;
  verified?: boolean;
  image?: string | null;
  product?: HomepageReviewProduct | null;
}

export interface SiteReviewsParams {
  page?: number;
  per_page?: number;
  sort?: ReviewSortOption;
  search?: string;
}

export interface SiteReviewsResponse {
  data: SiteReview[];
  meta: PaginatedMeta;
}

export interface ReviewSubmitPayload {
  customer_name: string;
  email: string;
  rating: number;
  comment: string;
  image?: File | null;
}

/**
 * Fetch paginated, sortable, searchable reviews.
 * Calls GET /reviews with query params.
 * Returns an empty list (no throw) when the API is unreachable.
 */
export async function getSiteReviews(
  params?: SiteReviewsParams,
  options?: { signal?: AbortSignal },
): Promise<SiteReviewsResponse> {
  try {
    const res = await api.get<PaginatedResponse<SiteReview>>(
      '/reviews',
      params as Record<string, unknown> | undefined,
      { signal: options?.signal },
    );
    return { data: res.data, meta: res.meta };
  } catch (err) {
    // Re-throw aborts so the caller's AbortController cleanup works correctly
    if (options?.signal?.aborted) throw err;
    if (process.env.NODE_ENV === 'development') {
      console.warn('[reviews] API unavailable, using empty fallback:', isAxiosError(err) ? err.message : err);
    }
    return {
      data: [],
      meta: { current_page: 1, last_page: 1, total: 0, per_page: 10, from: 0, to: 0 },
    };
  }
}

/**
 * Submit a new site-wide review.
 * Sends multipart/form-data when an image is attached, plain JSON otherwise.
 */
export async function submitSiteReview(payload: ReviewSubmitPayload): Promise<void> {
  if (payload.image) {
    const form = new FormData();
    form.append('customer_name', payload.customer_name);
    form.append('email',         payload.email);
    form.append('rating',        String(payload.rating));
    form.append('comment',       payload.comment);
    form.append('image',         payload.image);
    await api.upload<unknown>('/reviews', form);
  } else {
    await api.post<unknown>('/reviews', {
      customer_name: payload.customer_name,
      email:         payload.email,
      rating:        payload.rating,
      comment:       payload.comment,
    });
  }
}
