/**
 * lib/coupons.ts
 * Coupon validation (no auth required).
 */

import apiClient from './axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CouponResult {
  code: string;
  discount_type: 'percentage' | 'fixed' | 'freeship';
  discount_value: number;
  discount_amount: number;
  apply_to: string;
  product_id?: number;
  category_id?: number;
}

// ─── API function ─────────────────────────────────────────────────────────────

export const validateCoupon = async (
  code: string,
  amount: number,
  productId?: number,
): Promise<CouponResult> => {
  const res = await apiClient.post<{ success: boolean; message: string; data: CouponResult }>(
    '/coupons/validate',
    { code, amount, ...(productId ? { product_id: productId } : {}) },
  );
  return res.data.data;
};
