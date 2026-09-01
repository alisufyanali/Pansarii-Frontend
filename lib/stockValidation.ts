/**
 * lib/stockValidation.ts
 *
 * Shared stock-validation hook used by both the Cart page and Checkout page.
 *
 * Two flows:
 *  • Logged-in  — GET /api/cart already returns stock + in_stock on each item.
 *                 No extra API call needed; we just read those fields.
 *  • Guest      — POST /api/products/check-stock with all variant_ids in the
 *                 localStorage cart; apply the returned stock levels.
 *
 * In both cases the hook:
 *  1. Identifies items that are out-of-stock (in_stock = false) or
 *     over-stocked (quantity > available stock).
 *  2. Removes fully out-of-stock items from the cart.
 *  3. Clamps over-stocked items down to the available stock.
 *  4. Returns a per-item warning map so the UI can show an inline badge
 *     next to each affected line.
 *  5. Fires a single grouped toast summarising what changed.
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { getAuthToken } from '@/lib/axios';
import { getCart, checkStockApi } from '@/lib/cart';
import type { CartItem } from '@/context/CartContext';

// ─── Public types ─────────────────────────────────────────────────────────────

/** Per-item warning displayed inline on the cart/checkout line */
export type StockWarning =
  | { kind: 'removed'; message: string }       // item fully removed
  | { kind: 'reduced'; message: string };       // quantity clamped

export interface StockValidationResult {
  /** True while the validation API call is in flight */
  isValidating: boolean;
  /**
   * Map from `${item.id}-${item.size}` (the same key used throughout the cart)
   * to a warning object. Only present for affected items.
   */
  warnings: Map<string, StockWarning>;
  /**
   * Run validation now. Pass the current cartItems + the two cart-mutation
   * callbacks so the hook can apply adjustments directly.
   *
   * @param items        Current cartItems from useCart()
   * @param removeFromCart  From useCart()
   * @param updateQuantity  From useCart()
   * @returns            True when no problems were found (cart is clean)
   */
  validate: (
    items: CartItem[],
    removeFromCart: (id: string | number, size: string) => Promise<void>,
    updateQuantity: (id: string | number, size: string, qty: number) => Promise<void>,
  ) => Promise<boolean>;
  /** Clear all warnings (e.g. after user acknowledges) */
  clearWarnings: () => void;
}

// ─── Cart item key — mirrors the key used in cart/page.tsx ───────────────────
const itemKey = (item: Pick<CartItem, 'id' | 'size'>) => `${item.id}-${item.size}`;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCartStockValidation(): StockValidationResult {
  const [isValidating, setIsValidating] = useState(false);
  const [warnings, setWarnings] = useState<Map<string, StockWarning>>(new Map());

  // Prevent concurrent validate() calls
  const runningRef = useRef(false);

  const clearWarnings = useCallback(() => setWarnings(new Map()), []);

  const validate = useCallback(async (
    items: CartItem[],
    removeFromCart: (id: string | number, size: string) => Promise<void>,
    updateQuantity: (id: string | number, size: string, qty: number) => Promise<void>,
  ): Promise<boolean> => {
    if (items.length === 0) return true;
    if (runningRef.current) return true;

    runningRef.current = true;
    setIsValidating(true);

    try {
      // ── Build a stock-level map: variantId → { stock, in_stock } ──────────
      const stockMap = new Map<number, { stock: number; in_stock: boolean }>();

      if (getAuthToken()) {
        // Logged-in: GET /api/cart already includes stock + in_stock on each item.
        // Re-fetch to get the freshest snapshot (same endpoint the context uses).
        const apiItems = await getCart();
        for (const ai of apiItems) {
          if (ai.stock !== undefined && ai.in_stock !== undefined) {
            stockMap.set(ai.variant.id, { stock: ai.stock, in_stock: ai.in_stock });
          }
        }
      } else {
        // Guest: collect variant_ids and call the check-stock endpoint.
        const variantIds = items
          .map(i => i.variantId)
          .filter((id): id is number => typeof id === 'number');

        if (variantIds.length === 0) return true; // nothing to check

        const results = await checkStockApi(variantIds);
        for (const r of results) {
          stockMap.set(r.variant_id, { stock: r.stock, in_stock: r.in_stock });
        }
      }

      // ── Apply stock levels to each cart item ──────────────────────────────
      const newWarnings = new Map<string, StockWarning>();
      const removedNames: string[] = [];
      const reducedNames: string[] = [];

      // Process sequentially so mutations don't race
      for (const item of items) {
        if (!item.variantId) continue;

        const level = stockMap.get(item.variantId);
        if (!level) continue; // variant not found in response — leave as-is

        const key = itemKey(item);

        if (!level.in_stock || level.stock === 0) {
          // Fully out of stock — remove
          newWarnings.set(key, {
            kind: 'removed',
            message: 'Out of stock — removed from cart',
          });
          removedNames.push(item.nameEn);
          await removeFromCart(item.id, item.size);

        } else if (item.quantity > level.stock) {
          // Over-stocked — clamp
          newWarnings.set(key, {
            kind: 'reduced',
            message: `Only ${level.stock} available — quantity adjusted`,
          });
          reducedNames.push(`${item.nameEn} (→ ${level.stock})`);
          await updateQuantity(item.id, item.size, level.stock);
        }
      }

      setWarnings(newWarnings);

      // ── Single grouped toast ──────────────────────────────────────────────
      if (removedNames.length > 0 || reducedNames.length > 0) {
        const lines: string[] = [];
        if (removedNames.length > 0)
          lines.push(`Removed (out of stock): ${removedNames.join(', ')}`);
        if (reducedNames.length > 0)
          lines.push(`Quantity adjusted: ${reducedNames.join(', ')}`);

        toast.warning(lines.join('\n'), {
          autoClose: 6000,
          style: { whiteSpace: 'pre-line' },
        });

        return false; // cart had problems
      }

      return true; // all items are fine
    } catch {
      // Validation API failed — don't block the user; log silently
      if (process.env.NODE_ENV === 'development') {
        console.warn('[stockValidation] check failed — skipping');
      }
      return true; // optimistic: let the order attempt proceed
    } finally {
      setIsValidating(false);
      runningRef.current = false;
    }
  }, []);

  return { isValidating, warnings, validate, clearWarnings };
}
