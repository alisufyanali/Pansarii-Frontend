/**
 * lib/products.ts
 * API service functions for products and categories.
 * Falls back to static data if API is unavailable.
 */

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
    // Slugs are derived from product names (e.g. "Moringa Leaf Powder" → "moringa-leaf-powder").
    // These derived slugs match the static-data fallback path in /products/[slug]/page.tsx
    // (via findProductBySlug → toProductSlug), so product detail pages still render with
    // static data when the API is down. They will NOT match real API slugs (e.g. "moringapowder")
    // — that mismatch is acceptable offline degraded behaviour.
    const legacyProducts = allProducts as Product[];
    return {
      data: legacyProducts.map(p => ({
        id: Number(p.id),
        name: p.nameEn,
        // Derived slug — only valid for the static fallback path, not the live API.
        slug: p.nameEn.toLowerCase().replace(/\s+/g, '-'),
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

export async function getProductBySlug(slug: string): Promise<ApiProduct | null> {
  try {
    const res = await api.get<ApiResponse<ApiProduct>>(`/products/${slug}`);
    return res.data;
  } catch (err) {
    console.error(`[products] Product "${slug}" API unavailable:`, isAxiosError(err) ? err.message : err);
    return null;
  }
}

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
    const params = excludeId !== undefined ? { exclude_id: excludeId } : undefined;
    const res = await api.get<ApiResponse<ApiProduct[]>>(
      '/products/recommended',
      params as Record<string, unknown> | undefined,
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
    slug: p.slug ?? p.nameEn.toLowerCase().replace(/\s+/g, '-'),
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
