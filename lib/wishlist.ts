/**
 * lib/wishlist.ts
 * API service functions for the wishlist (authenticated users only).
 */

import apiClient from './axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiWishlistItem {
  id: number;
  product_variant_id: number | null;
  created_at: string;
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    sale_price: number | null;
    thumbnail: string | null;
  };
  variant: {
    id: number;
    name: string;
    sku: string;
    price: number;
    sale_price: number | null;
    stock: number;
  } | null;
}

// ─── API functions ────────────────────────────────────────────────────────────

export const getWishlist = async (): Promise<ApiWishlistItem[]> => {
  const res = await apiClient.get<{ success: boolean; data: ApiWishlistItem[] }>('/wishlist');
  return res.data.data;
};

export const addToWishlistApi = async (
  productId: number,
  variantId?: number,
): Promise<{ id: number }> => {
  const res = await apiClient.post<{ success: boolean; message: string; data: { id: number } }>(
    '/wishlist',
    { product_id: productId, ...(variantId ? { product_variant_id: variantId } : {}) },
  );
  return res.data.data;
};

export const removeFromWishlistApi = async (wishlistId: number): Promise<void> => {
  await apiClient.delete(`/wishlist/${wishlistId}`);
};
