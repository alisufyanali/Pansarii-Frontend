// app/context/WishlistContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Dev-only logger — stripped in production builds
const log = (...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development') console.log(...args);
};

export interface WishlistItem {
  id: string | number;
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
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string | number) => void;
  toggleWishlist: (item: WishlistItem) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string | number) => boolean;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('pansari-wishlist');
        if (saved) {
          const parsed = JSON.parse(saved);
          log('✅ Wishlist loaded from localStorage:', parsed);
          setWishlistItems(parsed);
        }
      } catch (error) {
        console.error('❌ Error loading wishlist:', error);
      }
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage when wishlist changes
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      try {
        localStorage.setItem('pansari-wishlist', JSON.stringify(wishlistItems));
        log('💾 Wishlist saved to localStorage:', wishlistItems);
      } catch (error) {
        console.error('❌ Error saving wishlist:', error);
      }
    }
  }, [wishlistItems, isInitialized]);

  const addToWishlist = (item: WishlistItem) => {
    log('❤️ Adding to wishlist:', item);
    
    setWishlistItems(prev => {
      // Check if item already exists
      const exists = prev.find(wishlistItem => 
        String(wishlistItem.id) === String(item.id)
      );
      
      if (exists) {
        log('⚠️ Item already in wishlist');
        return prev;
      }
      
      const newWishlist = [...prev, item];
      log('✅ Added to wishlist, new wishlist:', newWishlist);
      return newWishlist;
    });
  };

  const removeFromWishlist = (id: string | number) => {
    log('🗑️ Removing from wishlist:', id);
    
    setWishlistItems(prev => {
      const newWishlist = prev.filter(item => 
        String(item.id) !== String(id)
      );
      log('✅ Removed from wishlist, new wishlist:', newWishlist);
      return newWishlist;
    });
  };

  const toggleWishlist = (item: WishlistItem) => {
    log('🔄 Toggling wishlist for:', item.id);
    
    const exists = wishlistItems.some(wishlistItem => 
      String(wishlistItem.id) === String(item.id)
    );
    
    if (exists) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  const clearWishlist = () => {
    log('🧹 Clearing wishlist');
    setWishlistItems([]);
  };

  const isInWishlist = (id: string | number) => {
    return wishlistItems.some(item => String(item.id) === String(id));
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistCount
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  
  return context;
};
