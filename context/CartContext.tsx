"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { toast } from 'react-toastify';
import { getAuthToken } from '@/lib/axios';
import {
  getCart,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
  clearCartApi,
  type ApiCartItem,
} from '@/lib/cart';

// ─── Dev logger ───────────────────────────────────────────────────────────────
const log = (...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development') console.log('[Cart]', ...args);
};

// ─── Local-cart item (guest / localStorage) ───────────────────────────────────
export interface CartItem {
  id: string | number;
  /** For logged-in users this maps to ApiCartItem.id */
  cartItemId?: number;
  /** variant ID — required for API calls */
  variantId?: number;
  img: string;
  nameEn: string;
  nameUr: string;
  price: number;
  oldPrice?: number;
  quantity: number;
  size: string;
  category?: string;
  rating?: number;
}

// ─── Context type ─────────────────────────────────────────────────────────────
interface CartContextType {
  cartItems: CartItem[];
  isCartLoading: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  updateQuantity: (id: string | number, size: string, newQuantity: number) => Promise<void>;
  removeFromCart: (id: string | number, size: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
  getItemCount: (id: string | number, size: string) => number;
  /** Called by AuthContext after login to merge guest cart → API */
  mergeGuestCart: () => Promise<void>;
  /** Re-fetch cart from API (used after login) */
  syncFromApi: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'pansari-cart';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readLocalCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    if (!items || items.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch { /* ignore */ }
}

function clearLocalCart(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}

/** Convert an API cart item to our unified CartItem shape */
function apiItemToCartItem(a: ApiCartItem): CartItem {
  return {
    id: a.product.id,
    cartItemId: a.id,
    variantId: a.variant.id,
    img: a.product.thumbnail || '/images/product.png',
    nameEn: a.product.name,
    nameUr: a.product.name,
    price: a.unit_price,
    quantity: a.quantity,
    size: a.variant.name,
  };
}

/** Extract a human-readable error message from an API error */
function apiErrMsg(err: unknown): string {
  if (!err || typeof err !== 'object') return 'Something went wrong.';
  const e = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
  const data = e.response?.data;
  if (data?.errors) {
    const first = Object.values(data.errors)[0];
    if (first?.[0]) return first[0];
  }
  return data?.message || 'Something went wrong.';
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const initializedRef = useRef(false);

  // ── Determine auth state without creating a circular dependency ─────────────
  // We read the token directly so CartContext doesn't depend on AuthContext.
  const isLoggedIn = (): boolean => Boolean(getAuthToken());

  // ── Initialize ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (isLoggedIn()) {
      const guestItems = readLocalCart();
      if (guestItems.length > 0) {
        // Token restored from storage (e.g. page reload after API register) — merge pending guest cart
        setIsCartLoading(true);
        (async () => {
          for (const item of guestItems) {
            if (!item.variantId) continue;
            try {
              await addToCartApi(item.variantId, item.quantity);
            } catch (err) {
              log('⚠️  Mount merge failed for', item.nameEn, apiErrMsg(err));
            }
          }
          clearLocalCart();
          try {
            const items = await getCart();
            setCartItems(items.map(apiItemToCartItem));
            log('✅ Guest cart merged on mount:', items.length, 'items');
          } catch {
            setCartItems([]);
          } finally {
            setIsCartLoading(false);
          }
        })();
        return;
      }

      // Authenticated → pull from API
      setIsCartLoading(true);
      getCart()
        .then(items => {
          setCartItems(items.map(apiItemToCartItem));
          log('✅ Cart loaded from API:', items.length, 'items');
        })
        .catch(() => {
          log('⚠️  API cart fetch failed on mount, using empty cart');
          setCartItems([]);
        })
        .finally(() => setIsCartLoading(false));
    } else {
      // Guest → pull from localStorage
      const local = readLocalCart();
      setCartItems(local);
      log('✅ Guest cart loaded from localStorage:', local.length, 'items');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Guest: persist to localStorage whenever items change ───────────────────
  useEffect(() => {
    if (!initializedRef.current) return;
    if (!isLoggedIn()) {
      writeLocalCart(cartItems);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  // ── syncFromApi — re-fetch API cart (called after login) ───────────────────
  const syncFromApi = useCallback(async () => {
    setIsCartLoading(true);
    try {
      const items = await getCart();
      setCartItems(items.map(apiItemToCartItem));
      log('✅ Cart synced from API:', items.length, 'items');
    } catch (err) {
      log('❌ syncFromApi failed:', err);
    } finally {
      setIsCartLoading(false);
    }
  }, []);

  // ── mergeGuestCart — called by AuthContext right after login ────────────────
  const mergeGuestCart = useCallback(async () => {
    const guestItems = readLocalCart();
    if (guestItems.length === 0) {
      await syncFromApi();
      return;
    }

    log('🔀 Merging', guestItems.length, 'guest items into API cart…');

    for (const item of guestItems) {
      if (!item.variantId) {
        log('⚠️  Skipping item without variantId:', item.nameEn);
        continue;
      }
      try {
        await addToCartApi(item.variantId, item.quantity);
      } catch (err) {
        const msg = apiErrMsg(err);
        toast.warning(`Could not add "${item.nameEn}" to cart: ${msg}`);
      }
    }

    clearLocalCart();
    await syncFromApi();
    log('✅ Guest cart merge complete');
  }, [syncFromApi]);

  // ── addToCart ───────────────────────────────────────────────────────────────
  const addToCart = useCallback(async (item: Omit<CartItem, 'quantity'>) => {
    if (isLoggedIn()) {
      // ── Logged-in: API path ──
      if (!item.variantId) {
        const msg = 'Please select a size/variant before adding to cart.';
        toast.error(msg);
        throw new Error(msg);
      }
      setIsCartLoading(true);
      try {
        const apiItem = await addToCartApi(item.variantId, 1);
        const mapped = apiItemToCartItem(apiItem);
        // Update local state: if the API item already exists, replace; else push
        setCartItems(prev => {
          const idx = prev.findIndex(c => c.cartItemId === apiItem.id);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = mapped;
            return next;
          }
          return [...prev, mapped];
        });
        log('✅ Added via API:', apiItem);
      } catch (err) {
        const msg = apiErrMsg(err);
        toast.error(msg);
        throw err;
      } finally {
        setIsCartLoading(false);
      }
    } else {
      // ── Guest: localStorage path ──
      setCartItems(prev => {
        const existing = prev.find(
          c => String(c.id) === String(item.id) && c.size === item.size,
        );
        if (existing) {
          return prev.map(c =>
            String(c.id) === String(item.id) && c.size === item.size
              ? { ...c, quantity: c.quantity + 1 }
              : c,
          );
        }
        return [...prev, { ...item, quantity: 1 }];
      });
      log('✅ Added to guest cart:', item.nameEn);
    }
  }, []);

  // ── updateQuantity ──────────────────────────────────────────────────────────
  const updateQuantity = useCallback(
    async (id: string | number, size: string, newQuantity: number) => {
      const qty = Math.max(1, newQuantity);

      if (isLoggedIn()) {
        const item = cartItems.find(
          c => String(c.id) === String(id) && c.size === size,
        );
        if (!item?.cartItemId) return;
        try {
          const updated = await updateCartItemApi(item.cartItemId, qty);
          setCartItems(prev =>
            prev.map(c =>
              c.cartItemId === updated.id ? apiItemToCartItem(updated) : c,
            ),
          );
        } catch (err) {
          toast.error(apiErrMsg(err));
        }
      } else {
        setCartItems(prev =>
          prev.map(c =>
            String(c.id) === String(id) && c.size === size
              ? { ...c, quantity: qty }
              : c,
          ),
        );
      }
    },
    [cartItems],
  );

  // ── removeFromCart ──────────────────────────────────────────────────────────
  const removeFromCart = useCallback(
    async (id: string | number, size: string) => {
      if (isLoggedIn()) {
        const item = cartItems.find(
          c => String(c.id) === String(id) && c.size === size,
        );
        if (!item?.cartItemId) return;
        try {
          await removeCartItemApi(item.cartItemId);
          setCartItems(prev =>
            prev.filter(c => c.cartItemId !== item.cartItemId),
          );
        } catch (err) {
          toast.error(apiErrMsg(err));
        }
      } else {
        setCartItems(prev =>
          prev.filter(
            c => !(String(c.id) === String(id) && c.size === size),
          ),
        );
      }
    },
    [cartItems],
  );

  // ── clearCart ───────────────────────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    if (isLoggedIn()) {
      try {
        await clearCartApi();
        setCartItems([]);
      } catch (err) {
        toast.error(apiErrMsg(err));
      }
    } else {
      setCartItems([]);
      clearLocalCart();
    }
  }, []);

  // ── Derived helpers ─────────────────────────────────────────────────────────
  const getCartTotal = useCallback(
    () => cartItems.reduce((s, i) => s + i.price * i.quantity, 0),
    [cartItems],
  );

  const getCartCount = useCallback(
    () => cartItems.reduce((s, i) => s + i.quantity, 0),
    [cartItems],
  );

  const getItemCount = useCallback(
    (id: string | number, size: string) =>
      cartItems.find(
        c => String(c.id) === String(id) && c.size === size,
      )?.quantity ?? 0,
    [cartItems],
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        getItemCount,
        mergeGuestCart,
        syncFromApi,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
