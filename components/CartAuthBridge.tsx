"use client";

/**
 * CartAuthBridge
 * Mounts inside <CartProvider> and registers the mergeGuestCart callback
 * with AuthContext so login() can trigger it without a circular dependency.
 */

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function CartAuthBridge() {
  const { setCartMerge } = useAuth();
  const { mergeGuestCart } = useCart();

  useEffect(() => {
    setCartMerge(mergeGuestCart);
  }, [setCartMerge, mergeGuestCart]);

  return null;
}
