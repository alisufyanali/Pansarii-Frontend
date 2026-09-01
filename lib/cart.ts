/**
 * lib/cart.ts
 * API service functions for the cart (authenticated users only).
 */

import apiClient from './axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiCartItem {
  id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product: {
    id: number;
    name: string;
    slug: string;
    thumbnail: string | null;
  };
  variant: {
    id: number;
    name: string;
    sku: string;
  };
  /** Included in GET /api/cart response as of latest backend version */
  stock?: number;
  in_stock?: boolean;
}

/** Shape returned by POST /api/products/check-stock */
export interface StockCheckResult {
  variant_id: number;
  stock: number;
  in_stock: boolean;
}

// ─── API functions ────────────────────────────────────────────────────────────

export const getCart = async (): Promise<ApiCartItem[]> => {
  const res = await apiClient.get<{ success: boolean; data: ApiCartItem[] }>('/cart');
  return res.data.data;
};

export const addToCartApi = async (
  variantId: number,
  quantity: number,
): Promise<ApiCartItem> => {
  const res = await apiClient.post<{ success: boolean; message: string; data: ApiCartItem }>(
    '/cart',
    { product_variant_id: variantId, quantity },
  );
  return res.data.data;
};

export const updateCartItemApi = async (
  cartId: number,
  quantity: number,
): Promise<ApiCartItem> => {
  const res = await apiClient.patch<{ success: boolean; message: string; data: ApiCartItem }>(
    `/cart/${cartId}`,
    { quantity },
  );
  return res.data.data;
};

export const removeCartItemApi = async (cartId: number): Promise<void> => {
  await apiClient.delete(`/cart/${cartId}`);
};

export const clearCartApi = async (): Promise<void> => {
  await apiClient.delete('/cart');
};

/**
 * Check current stock levels for a list of variant IDs.
 * Used for guest cart validation (no backend cart record to check against).
 * POST /api/products/check-stock { variant_ids: [...] }
 */
export const checkStockApi = async (
  variantIds: number[],
): Promise<StockCheckResult[]> => {
  const res = await apiClient.post<{ success: boolean; data: StockCheckResult[] }>(
    '/products/check-stock',
    { variant_ids: variantIds },
  );
  return res.data.data ?? [];
};
