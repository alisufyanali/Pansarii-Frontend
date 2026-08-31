/**
 * lib/products.ts
 * API service functions for products and categories.
 * Falls back to static data if API is unavailable.
 */

import { cache } from 'react';

import { api, isAxiosError } from './axios';
import type { ApiProduct, ApiCategory } from '@/types/product';
import { allProducts, bestSellers } from '@/data/products';
import { apiProductToLegacy } from '@/types/product';
import type { Product } from '@/types/product';
import type { ApiResponse, PaginatedResponse, PaginatedMeta } from '@/types/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductsResponse {
  data: ApiProduct[];
  meta: PaginatedMeta;
}

export interface ProductsParams {
  search?: string;
  category_id?: number;
  health_concern_id?: number;
  featured?: boolean;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function getProducts(params?: ProductsParams, options?: { signal?: AbortSignal }): Promise<ProductsResponse> {
  try {
    const res = await api.get<PaginatedResponse<ApiProduct>>('/products', params as Record<string, unknown>, { signal: options?.signal });
    return { data: res.data, meta: res.meta };
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[products] API unavailable, using static fallback:', isAxiosError(err) ? err.message : err);
    }
    // Fallback to static data when the API is unreachable.
    // We do NOT derive a slug from the product name here — name-derived slugs
    // (e.g. "moringa-leaf-powder") differ from real API slugs (e.g. "moringapowder")
    // and would generate broken navigation links on every ProductCard.
    // slug is intentionally omitted (undefined via spread) so the navigation guard
    // (if (!product.slug) return) safely prevents routing to a guaranteed 404.
    const legacyProducts = allProducts as Product[];
    return {
      data: legacyProducts.map(p => ({
        id: Number(p.id),
        name: p.nameEn,
        // No slug — offline cards are non-navigable rather than broken.
        // ProductCard's guard: `if (!product.slug) return` catches this cleanly.
        slug: undefined as unknown as string,
        price: p.price,
        sale_price: p.oldPrice ?? null,
        thumbnail: p.img,
        description: p.description,
        category: { id: 0, name: p.category || 'Uncategorized', slug: p.category?.toLowerCase() || 'uncategorized' },
        variants: [],
        rating: p.rating,
        reviews_count: p.reviews,
        featured: p.isBestSeller,
      })),
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: legacyProducts.length,
        total: legacyProducts.length,
        from: 1,
        to: legacyProducts.length,
      },
    };
  }
}

export interface HomepageCategorySection {
  category: ApiCategory;
  products: ApiProduct[];
}

export async function getHomepageCategoryProducts(): Promise<HomepageCategorySection[]> {
  const res = await api.get<ApiResponse<HomepageCategorySection[]>>(
    '/homepage/category-products',
  );
  return res.data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await api.get<ApiResponse<ApiProduct[]>>('/products/featured');
    return res.data.map(apiProductToLegacy);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[products] Featured API unavailable, using static fallback:', isAxiosError(err) ? err.message : err);
    }
    return bestSellers as Product[];
  }
}

// ─── Build-time sleep helper ──────────────────────────────────────────────────
// Used only in server-side fetch retry loops (never in client components).
// Resolves after `ms` milliseconds using a Promise-wrapped timer.
function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

// ─── Build-time vs runtime retry policy ──────────────────────────────────────
// At build time (static generation) a 429 from the API blocks the whole build
// worker for the duration of the backoff. Build-time failures are not
// user-facing — a failed fetch just falls back to ISR on the first real visit.
// So we use a much shorter policy during builds:
//   • Max 2 attempts instead of 5
//   • 429 wait capped at 10s (not the full Retry-After which can be 45-60s)
//   • Exponential back-off capped at 4s (not 16s)
// At runtime (SSR / ISR) we keep the original aggressive retry policy.
const IS_BUILD = process.env.NEXT_PHASE === 'phase-production-build';
const BUILD_MAX_ATTEMPTS   = 2;
const RUNTIME_MAX_ATTEMPTS = 5;
const BUILD_MAX_WAIT_MS    = 10_000;   // 10s max wait per retry during build
const BUILD_429_WAIT_MS    = 10_000;   // ignore Retry-After; just wait 10s

// ─── Per-request deduplication via React cache() ─────────────────────────────
// React's cache() memoises calls with identical arguments within a single
// render pass (which includes both generateMetadata and the page component
// for the same request). This means the real network call fires ONCE per
// slug per page — halving API calls during static generation and eliminating
// the 429 storms caused by duplicate fetches.
export const getProductBySlug = cache(async (slug: string): Promise<ApiProduct | null> => {
  const maxAttempts = IS_BUILD ? BUILD_MAX_ATTEMPTS : RUNTIME_MAX_ATTEMPTS;
  let lastErr: unknown;
  let last429 = false;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await api.get<ApiResponse<ApiProduct>>(`/products/${slug}`);
      return res.data;
    } catch (err) {
      lastErr = err;
      const status = isAxiosError(err) ? err.response?.status : undefined;

      // 404 — product genuinely doesn't exist, stop immediately.
      if (status === 404) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[products] Product "${slug}" not found in API (404).`);
        }
        return null;
      }

      const isLastAttempt = attempt === maxAttempts;
      let delayMs: number;

      if (status === 429) {
        last429 = true;
        // Rate-limited — at runtime respect Retry-After; at build time use
        // a short fixed cap so one slow product doesn't block the whole build.
        const retryAfter = isAxiosError(err)
          ? Number(err.response?.headers?.['retry-after'] ?? 0)
          : 0;
        const runtimeWait = retryAfter > 0 ? retryAfter * 1000 : 60_000;
        delayMs = IS_BUILD ? BUILD_429_WAIT_MS : runtimeWait;
        console.warn(
          `[products] Product "${slug}" rate-limited (429), attempt ${attempt}/${maxAttempts}.`,
          `Waiting ${Math.round(delayMs / 1000)}s before retry.`,
        );
      } else {
        last429 = false;
        // Network error, timeout, or 5xx — exponential back-off.
        // Runtime: 2s, 4s, 8s, 16s. Build: 2s, 4s (capped lower).
        const expWait = Math.min(2_000 * 2 ** (attempt - 1), 16_000);
        delayMs = IS_BUILD ? Math.min(expWait, BUILD_MAX_WAIT_MS) : expWait;
        console.error(
          `[products] Product "${slug}" fetch failed (status=${status ?? 'network'}, attempt ${attempt}/${maxAttempts}).`,
          isAxiosError(err) ? `${err.code ?? ''} ${err.message}` : err,
          isLastAttempt ? '— giving up.' : `— waiting ${delayMs / 1000}s.`,
        );
      }

      if (!isLastAttempt) {
        await sleep(delayMs);
      }
    }
  }

  // At build time: a rate-limited product should NOT crash the build worker.
  // Return null so the page falls back to static data or ISR on first visit.
  // At runtime: re-throw so the caller can surface the error properly.
  if (IS_BUILD && last429) {
    console.warn(
      `[products] Product "${slug}" still rate-limited after ${maxAttempts} attempts at build time — skipping (will be served via ISR on first visit).`,
    );
    return null;
  }

  // All attempts exhausted — throw so the caller can distinguish a transient
  // failure from a confirmed 404.
  throw lastErr;
});

// ─── Related products ─────────────────────────────────────────────────────────

/**
 * Fetch products related to the given slug.
 * Calls GET /products/{slug}/related which returns products sharing the same
 * category or at least one health concern, prioritised by overlap depth.
 * Falls back to a same-category getProducts() call when the endpoint is absent.
 */
export async function getRelatedProducts(
  slug: string,
  options?: { signal?: AbortSignal },
): Promise<Product[]> {
  try {
    const res = await api.get<ApiResponse<ApiProduct[]>>(
      `/products/${slug}/related`,
      undefined,
      { signal: options?.signal },
    );
    return (res.data ?? []).map(p => ({
      ...apiProductToLegacy(p),
      inStock: p.variants?.some(v => v.stock > 0) ?? true,
    }));
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[products] Related products API unavailable, using fallback:', isAxiosError(err) ? err.message : err);
    }
    // Fallback: pull the first page of all products and return up to 10
    // (we don't know the category client-side without the full ApiProduct, so
    // we return a generic sample — acceptable degraded behaviour)
    try {
      const fallback = await getProducts({ per_page: 10, page: 1 }, options);
      return fallback.data
        .filter(p => p.slug !== slug)
        .slice(0, 10)
        .map(p => ({ ...apiProductToLegacy(p), inStock: p.variants?.some(v => v.stock > 0) ?? true }));
    } catch {
      return (bestSellers as Product[]).slice(0, 10);
    }
  }
}

// ─── Recommended products ────────────────────────────────────────────────────

/**
 * Fetch recommended / best-selling products.
 * Calls GET /products/recommended?exclude_id={id} which returns featured
 * products ordered by units_sold or rating desc.
 * Falls back to the static bestSellers array.
 */
export async function getRecommendedProducts(
  excludeId?: number,
  options?: { signal?: AbortSignal },
): Promise<Product[]> {
  try {
    const params: Record<string, unknown> = { per_page: 10 };
    if (excludeId !== undefined) params.exclude_id = excludeId;
    const res = await api.get<ApiResponse<ApiProduct[]>>(
      '/products/recommended',
      params,
      { signal: options?.signal },
    );
    return (res.data ?? []).map(p => ({
      ...apiProductToLegacy(p),
      inStock: p.variants?.some(v => v.stock > 0) ?? true,
    }));
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[products] Recommended products API unavailable, using static fallback:', isAxiosError(err) ? err.message : err);
    }
    return (bestSellers as Product[])
      .filter(p => excludeId === undefined || Number(p.id) !== excludeId)
      .slice(0, 10);
  }
}

// ─── Health concerns ──────────────────────────────────────────────────────────

export interface ApiHealthConcern {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  products_count?: number;
}

export async function getHealthConcerns(): Promise<ApiHealthConcern[]> {
  try {
    const res = await api.get<{ success: boolean; data: ApiHealthConcern[] }>('/health-concerns');
    return res.data;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[products] Health concerns API unavailable:', isAxiosError(err) ? err.message : err);
    }
    return [];
  }
}

export async function getCategories(): Promise<ApiCategory[]> {
  try {
    const res = await api.get<{ success: boolean; data: ApiCategory[] }>('/categories');
    return res.data;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[products] Categories API unavailable, using static fallback:', isAxiosError(err) ? err.message : err);
    }
    // Build category list from static products
    const cats = Array.from(new Set(allProducts.map(p => p.category).filter(Boolean)));
    return cats.map((name, i) => ({
      id: i + 1,
      name: name!,
      slug: name!.toLowerCase().replace(/\s+/g, '-'),
      products_count: allProducts.filter(p => p.category === name).length,
    }));
  }
}

let categoriesPromise: Promise<ApiCategory[]> | null = null;
let categoriesCacheTime = 0;
const CACHE_TTL = 60000; // 60 seconds

export const getCategoriesCached = async () => {
  const now = Date.now();
  if (categoriesPromise && (now - categoriesCacheTime) < CACHE_TTL) {
    return categoriesPromise;
  }
  categoriesCacheTime = now;
  categoriesPromise = getCategories();
  return categoriesPromise;
};

export async function getVideoProducts(): Promise<ApiProduct[]> {
  const res = await api.get<ApiResponse<ApiProduct[]>>('/products/with-video');
  return res.data ?? [];
}

export interface VideoProductCardData {
  id: string | number;
  video: string;
  topImage: string;
  productImage: string;
  nameEn: string;
  nameUr: string;
  price: number;
  oldPrice?: number;
  sale?: string;
  views?: string;
  slug?: string;
}

export const DEFAULT_VIDEO_PRODUCTS: VideoProductCardData[] = (allProducts as Product[])
  .slice(0, 2)
  .map(p => ({
    id: p.id,
    video: '/images/review.mp4',
    topImage: p.img,
    productImage: p.img,
    nameEn: p.nameEn,
    nameUr: p.nameUr,
    price: p.price,
    oldPrice: p.oldPrice ?? undefined,
    sale: p.sale ?? undefined,
    views: '860',
    slug: p.slug ?? undefined,
  }));

export function mapApiProductToVideoCard(p: ApiProduct): VideoProductCardData {
  const legacy = apiProductToLegacy(p);
  return {
    id: p.id,
    video: p.video || '/images/review.mp4',
    topImage: legacy.img,
    productImage: legacy.img,
    nameEn: legacy.nameEn,
    nameUr: legacy.nameUr,
    price: legacy.price,
    oldPrice: legacy.oldPrice ?? undefined,
    sale: legacy.sale ?? undefined,
    views: p.reviews_count ? String(p.reviews_count) : undefined,
    slug: p.slug,
  };
}
