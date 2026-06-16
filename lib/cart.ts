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
