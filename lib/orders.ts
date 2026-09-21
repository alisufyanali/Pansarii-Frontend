/**
 * lib/orders.ts
 * API service functions for orders (authentication required).
 */

import apiClient, { api } from './axios';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderItem {
  product_id: number;
  product_variant_id?: number;
  quantity: number;
  price: number;
  discount?: number;
}

export interface CreateOrderPayload {
  phone?: string;
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
  city?: string | null;
  billing_address?: string;
  shipping_address?: string;
  order_note?: string | null;
  account_created?: boolean;
  /**
   * Courier tracking payload — currently always null in the API response.
   */
  tracking?: unknown;
  created_at: string;
  items?: ApiOrderItem[];
  // ── Persisted locally for guest orders (not returned by API) ──────────────
  // Saved into sessionStorage at checkout so the confirmation page can display
  // customer name/email/phone/note without an extra API call.
  _customer_name?:  string;
  _customer_email?: string;
  _customer_phone?: string;
  _order_note?:     string;
  // ── Returned by API for authenticated orders ───────────────────────────────
  customer_name?:  string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
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

export type OrdersListResponse = PaginatedResponse<ApiOrder>;

// ─── API functions ────────────────────────────────────────────────────────────

export const createOrder = async (orderData: CreateOrderPayload): Promise<ApiOrder> => {
  const res = await apiClient.post<ApiResponse<ApiOrder>>(
    '/orders',
    orderData,
  );
  return res.data.data;
};

export interface CreateGuestOrderPayload {
  name: string;
  email: string;
  phone: string;
  shipping_address: string;
  billing_address?: string;
  city_id?: number;
  payment_method?: string;
  order_note?: string;
  shipping_charges?: number;
  invoice_discount?: number;
  items: OrderItem[];
}

export interface GuestOrderResult extends ApiOrder {
  account_created?: boolean;
}

export const createGuestOrder = async (payload: CreateGuestOrderPayload): Promise<GuestOrderResult> => {
  const raw = await apiClient.post<unknown>('/orders/guest', payload);
  const body = raw.data as
    | ApiResponse<GuestOrderResult>
    | GuestOrderResult
    | { success: boolean; data?: unknown; message?: string };

  if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
    console.debug('[createGuestOrder] raw response body:', body);
  }

  let order: GuestOrderResult;
  if (body && typeof body === 'object' && 'data' in body && body.data && typeof (body as ApiResponse<GuestOrderResult>).data === 'object' && ('id' in (body as ApiResponse<GuestOrderResult>).data || 'order_number' in (body as ApiResponse<GuestOrderResult>).data)) {
    order = (body as ApiResponse<GuestOrderResult>).data as GuestOrderResult;
  } else if (body && typeof body === 'object' && ('id' in (body as GuestOrderResult) || 'order_number' in (body as GuestOrderResult))) {
    order = body as GuestOrderResult;
  } else {
    console.warn('[createGuestOrder] unrecognised response shape — treating body as order directly:', body);
    order = body as GuestOrderResult;
  }

  if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
    console.debug('[createGuestOrder] resolved order.id=', order?.id, 'order_number=', order?.order_number);
  }

  return order;
};

export const trackOrder = async (orderNumber: string, emailOrPhone: string, kind: 'email' | 'phone' = 'email'): Promise<ApiOrder> => {
  const params: Record<string, string> = { order_number: orderNumber };
  if (kind === 'email') params.email = emailOrPhone;
  else params.phone = emailOrPhone;

  const res = await apiClient.get<
    | ApiResponse<ApiOrder>
    | ApiOrder
    | { success: boolean; data?: unknown; message?: string }
  >('/orders/track', { params });

  const body = res.data;

  if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
    console.debug('[trackOrder] raw body:', body, 'params=', params);
  }

  let order: ApiOrder;
  if (body && typeof body === 'object' && 'data' in body && body.data && typeof (body as ApiResponse<ApiOrder>).data === 'object' && ('id' in (body as ApiResponse<ApiOrder>).data || 'order_number' in (body as ApiResponse<ApiOrder>).data)) {
    order = (body as ApiResponse<ApiOrder>).data as ApiOrder;
  } else if (body && typeof body === 'object' && ('id' in (body as ApiOrder) || 'order_number' in (body as ApiOrder))) {
    order = body as ApiOrder;
  } else {
    console.warn('[trackOrder] unrecognised response shape — treating body as order directly:', body);
    order = body as ApiOrder;
  }

  return order;
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
  const res = await apiClient.get<ApiResponse<ApiOrder>>(`/orders/${id}`);
  return res.data.data;
};

export interface CancelOrderResult {
  order_number: string;
  status: string;
}

export const cancelOrder = async (
  id: number,
  reason: string,
  comment?: string,
): Promise<CancelOrderResult> => {
  const res = await apiClient.patch<ApiResponse<CancelOrderResult>>(
    `/orders/${id}/cancel`,
    { reason, ...(comment ? { comment } : {}) },
  );
  return res.data.data;
};
