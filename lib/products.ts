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

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductsResponse {
  data: ApiProduct[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface ProductsParams {
  search?: string;
  category_id?: number;
  featured?: boolean;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function getProducts(params?: ProductsParams): Promise<ProductsResponse> {
  try {
    const res = await api.get<{
      success: boolean;
      data: ApiProduct[];
      meta: ProductsResponse['meta'];
    }>('/products', params as Record<string, unknown>);
    return { data: res.data, meta: res.meta };
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[products] API unavailable, using static fallback:', isAxiosError(err) ? err.message : err);
    }
    // Fallback to static data
    const legacyProducts = allProducts as Product[];
    return {
      data: legacyProducts.map(p => ({
        id: Number(p.id),
        name: p.nameEn,
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
  const res = await api.get<{ success: boolean; data: HomepageCategorySection[] }>(
    '/homepage/category-products',
  );
  return res.data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await api.get<{ success: boolean; data: ApiProduct[] }>('/products/featured');
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
    const res = await api.get<{ success: boolean; data: ApiProduct }>(`/products/${slug}`);
    return res.data;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[products] Product "${slug}" API unavailable:`, isAxiosError(err) ? err.message : err);
    }
    return null;
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

export async function getVideoProducts(): Promise<ApiProduct[]> {
  const res = await api.get<{ success: boolean; data: ApiProduct[] }>('/products/with-video');
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
