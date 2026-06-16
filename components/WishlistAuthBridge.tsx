"use client";

/**
 * WishlistAuthBridge
 * Mounts inside <WishlistProvider> and registers the mergeGuestWishlist
 * callback with AuthContext so login() can trigger it without a circular
 * dependency.
 */

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishList';

export default function WishlistAuthBridge() {
  const { setWishlistMerge } = useAuth();
  const { mergeGuestWishlist } = useWishlist();

  useEffect(() => {
    setWishlistMerge(mergeGuestWishlist);
  }, [setWishlistMerge, mergeGuestWishlist]);

  return null;
}
