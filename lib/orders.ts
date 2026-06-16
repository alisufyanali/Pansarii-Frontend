/**
 * lib/orders.ts
 * API service functions for orders (authentication required).
 */

import apiClient from './axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderItem {
  product_id: number;
  product_variant_id?: number;
  quantity: number;
  price: number;
  discount?: number;
}

export interface CreateOrderPayload {
  city_id?: number;
  shipping_address?: string;
  billing_address?: string;
  payment_method?: string;
  order_note?: string;
  invoice_discount?: number;
  shipping_charges?: number;
  items: OrderItem[];
}

export interface ApiOrder {
  id: number;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  payment_method: string;
  grand_total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  city?: string;
  created_at: string;
  shipping_address?: string;
  items?: ApiOrderItem[];
}

export interface ApiOrderItem {
  id: number;
  product_id: number;
  product_name: string;
  variant_name?: string;
  quantity: number;
  price: number;
  subtotal: number;
  thumbnail?: string;
}

export interface OrdersListResponse {
  success: boolean;
  data: ApiOrder[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// ─── API functions ────────────────────────────────────────────────────────────

export const createOrder = async (orderData: CreateOrderPayload): Promise<ApiOrder> => {
  const res = await apiClient.post<{ success: boolean; message: string; data: ApiOrder }>(
    '/orders',
    orderData,
  );
  return res.data.data;
};

export const getOrders = async (
  page = 1,
  perPage = 10,
): Promise<OrdersListResponse> => {
  const res = await apiClient.get<OrdersListResponse>('/orders', {
    params: { page, per_page: perPage },
  });
  return res.data;
};

export const getOrderById = async (id: number): Promise<ApiOrder> => {
  const res = await apiClient.get<{ success: boolean; data: ApiOrder }>(`/orders/${id}`);
  return res.data.data;
};
