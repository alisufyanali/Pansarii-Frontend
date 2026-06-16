// context/WishList.tsx
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
  getWishlist,
  addToWishlistApi,
  removeFromWishlistApi,
  type ApiWishlistItem,
} from '@/lib/wishlist';

// ─── Dev logger ───────────────────────────────────────────────────────────────
const log = (...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development') console.log('[Wishlist]', ...args);
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WishlistItem {
  id: string | number;
  /** API wishlist row id (for DELETE calls) */
  wishlistId?: number;
  /** product id as number (for POST calls) */
  productId?: number;
  /** optional variant id */
  variantId?: number;
  img: string;
  nameEn: string;
  nameUr: string;
  price: number;
  oldPrice?: number;
  sale?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  category?: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  isWishlistLoading: boolean;
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (id: string | number) => Promise<void>;
  toggleWishlist: (item: WishlistItem) => Promise<void>;
  clearWishlist: () => void;
  isInWishlist: (id: string | number) => boolean;
  getWishlistCount: () => number;
  /** Called by AuthContext after login to merge guest wishlist → API */
  mergeGuestWishlist: () => Promise<void>;
  /** Re-fetch wishlist from API */
  syncFromApi: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'pansari-wishlist';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readLocalWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeLocalWishlist(items: WishlistItem[]): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
  catch { /* ignore */ }
}

function clearLocalWishlist(): void {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(STORAGE_KEY); }
  catch { /* ignore */ }
}

function apiItemToWishlistItem(a: ApiWishlistItem): WishlistItem {
  const displayPrice = a.product.sale_price ?? a.product.price;
  return {
    id: a.product.id,
    wishlistId: a.id,
    productId: a.product.id,
    variantId: a.variant?.id,
    img: a.product.thumbnail || '/images/product.png',
    nameEn: a.product.name,
    nameUr: a.product.name,
    price: displayPrice,
    oldPrice: a.product.sale_price && a.product.price > a.product.sale_price
      ? a.product.price
      : undefined,
    inStock: true,
  };
}

function apiErrMsg(err: unknown): string {
  if (!err || typeof err !== 'object') return 'Something went wrong.';
  const e = err as { response?: { data?: { message?: string } } };
  return e.response?.data?.message || 'Something went wrong.';
}

function isAlreadyInWishlist(err: unknown): boolean {
  const msg = apiErrMsg(err).toLowerCase();
  return msg.includes('already') || msg.includes('wishlist');
}

function getHttpStatus(err: unknown): number | null {
  if (!err || typeof err !== 'object') return null;
  const e = err as { response?: { status?: number } };
  return e.response?.status ?? null;
}

const isLoggedIn = (): boolean => Boolean(getAuthToken());

// ─── Provider ─────────────────────────────────────────────────────────────────

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const initializedRef = useRef(false);

  // ── Initialize ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (isLoggedIn()) {
      setIsWishlistLoading(true);
      getWishlist()
        .then(items => {
          setWishlistItems(items.map(apiItemToWishlistItem));
          log('✅ Wishlist loaded from API:', items.length, 'items');
        })
        .catch(() => {
          log('⚠️ API wishlist fetch failed on mount');
          setWishlistItems([]);
        })
        .finally(() => setIsWishlistLoading(false));
    } else {
      const local = readLocalWishlist();
      setWishlistItems(local);
      log('✅ Guest wishlist loaded from localStorage:', local.length, 'items');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Guest: persist to localStorage ─────────────────────────────────────────
  useEffect(() => {
    if (!initializedRef.current) return;
    if (!isLoggedIn()) {
      writeLocalWishlist(wishlistItems);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishlistItems]);

  // ── syncFromApi ─────────────────────────────────────────────────────────────
  const syncFromApi = useCallback(async () => {
    setIsWishlistLoading(true);
    try {
      const items = await getWishlist();
      setWishlistItems(items.map(apiItemToWishlistItem));
      log('✅ Wishlist synced from API:', items.length, 'items');
    } catch (err) {
      log('❌ syncFromApi failed:', err);
    } finally {
      setIsWishlistLoading(false);
    }
  }, []);

  // ── mergeGuestWishlist ──────────────────────────────────────────────────────
  const mergeGuestWishlist = useCallback(async () => {
    const guestItems = readLocalWishlist();
    if (guestItems.length === 0) {
      await syncFromApi();
      return;
    }

    log('🔀 Merging', guestItems.length, 'guest wishlist items into API…');

    for (const item of guestItems) {
      const productId = item.productId ?? Number(item.id);
      if (!productId) continue;
      try {
        await addToWishlistApi(productId, item.variantId);
      } catch (err) {
        // 422 "already in wishlist" is fine — skip silently
        if (getHttpStatus(err) === 422 && isAlreadyInWishlist(err)) continue;
        log('⚠️ Could not merge wishlist item:', item.nameEn, apiErrMsg(err));
      }
    }

    clearLocalWishlist();
    await syncFromApi();
    log('✅ Guest wishlist merge complete');
  }, [syncFromApi]);

  // ── addToWishlist ───────────────────────────────────────────────────────────
  const addToWishlist = useCallback(async (item: WishlistItem) => {
    if (isLoggedIn()) {
      const productId = item.productId ?? Number(item.id);
      if (!productId) return;
      // Optimistic add
      const optimistic: WishlistItem = { ...item, productId };
      setWishlistItems(prev =>
        prev.some(w => String(w.id) === String(item.id)) ? prev : [...prev, optimistic],
      );
      try {
        const result = await addToWishlistApi(productId, item.variantId);
        // Update wishlistId from API response
        setWishlistItems(prev =>
          prev.map(w =>
            String(w.id) === String(item.id) ? { ...w, wishlistId: result.id } : w,
          ),
        );
        log('✅ Added to API wishlist:', item.nameEn);
      } catch (err) {
        if (getHttpStatus(err) === 422 && isAlreadyInWishlist(err)) {
          toast.info('Already in your wishlist');
          return;
        }
        // Rollback optimistic add
        setWishlistItems(prev => prev.filter(w => String(w.id) !== String(item.id)));
        toast.error(apiErrMsg(err));
      }
    } else {
      setWishlistItems(prev =>
        prev.some(w => String(w.id) === String(item.id))
          ? prev
          : [...prev, item],
      );
      log('✅ Added to guest wishlist:', item.nameEn);
    }
  }, []);

  // ── removeFromWishlist ──────────────────────────────────────────────────────
  const removeFromWishlist = useCallback(async (id: string | number) => {
    if (isLoggedIn()) {
      const item = wishlistItems.find(w => String(w.id) === String(id));
      if (!item?.wishlistId) {
        // Fallback: remove optimistically without API call
        setWishlistItems(prev => prev.filter(w => String(w.id) !== String(id)));
        return;
      }
      // Optimistic remove
      setWishlistItems(prev => prev.filter(w => String(w.id) !== String(id)));
      try {
        await removeFromWishlistApi(item.wishlistId);
        log('✅ Removed from API wishlist:', id);
      } catch (err) {
        // Rollback
        setWishlistItems(prev => [...prev, item]);
        toast.error(apiErrMsg(err));
      }
    } else {
      setWishlistItems(prev => prev.filter(w => String(w.id) !== String(id)));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishlistItems]);

  // ── toggleWishlist ──────────────────────────────────────────────────────────
  const toggleWishlist = useCallback(async (item: WishlistItem) => {
    const exists = wishlistItems.some(w => String(w.id) === String(item.id));
    if (exists) {
      await removeFromWishlist(item.id);
    } else {
      await addToWishlist(item);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishlistItems, addToWishlist, removeFromWishlist]);

  // ── clearWishlist ───────────────────────────────────────────────────────────
  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
    if (!isLoggedIn()) clearLocalWishlist();
  }, []);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const isInWishlist = useCallback(
    (id: string | number) => wishlistItems.some(w => String(w.id) === String(id)),
    [wishlistItems],
  );

  const getWishlistCount = useCallback(() => wishlistItems.length, [wishlistItems]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isWishlistLoading,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        isInWishlist,
        getWishlistCount,
        mergeGuestWishlist,
        syncFromApi,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = (): WishlistContextType => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
};
