"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface CartItem {
  id: string | number;
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

interface WishlistItem {
  id: string | number;
  img: string;
  nameEn: string;
  nameUr: string;
  price: number;
  oldPrice?: number;
  size: string;
  category?: string;
  rating?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  wishlistItems: WishlistItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: string | number, size: string, newQuantity: number) => void;
  removeFromCart: (id: string | number, size: string) => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string | number) => void;
  addToCartFromWishlist: (item: WishlistItem) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getItemCount: (id: string | number, size: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage - runs only once on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('pansari-cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          console.log('✅ Cart loaded from localStorage:', parsedCart);
          setCartItems(parsedCart);
        }

        const savedWishlist = localStorage.getItem('pansari-wishlist');
        if (savedWishlist) {
          const parsedWishlist = JSON.parse(savedWishlist);
          console.log('✅ Wishlist loaded from localStorage:', parsedWishlist);
          setWishlistItems(parsedWishlist);
        }
      } catch (error) {
        console.error('❌ Error loading cart/wishlist:', error);
      }
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      try {
        localStorage.setItem('pansari-cart', JSON.stringify(cartItems));
        console.log('💾 Cart saved to localStorage:', cartItems);
      } catch (error) {
        console.error('❌ Error saving cart:', error);
      }
    }
  }, [cartItems, isInitialized]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      try {
        localStorage.setItem('pansari-wishlist', JSON.stringify(wishlistItems));
        console.log('💾 Wishlist saved to localStorage:', wishlistItems);
      } catch (error) {
        console.error('❌ Error saving wishlist:', error);
      }
    }
  }, [wishlistItems, isInitialized]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    console.log('🛒 Adding to cart:', item);
    
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => 
        String(cartItem.id) === String(item.id) && 
        cartItem.size === item.size
      );
      
      if (existingItem) {
        const newCart = prev.map(cartItem =>
          String(cartItem.id) === String(item.id) && cartItem.size === item.size
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        console.log('✅ Updated existing item, new cart:', newCart);
        return newCart;
      } else {
        const newCart = [...prev, { ...item, quantity: 1 }];
        console.log('✅ Added new item, new cart:', newCart);
        return newCart;
      }
    });
  };

  const updateQuantity = (id: string | number, size: string, newQuantity: number) => {
    console.log('🔄 Updating quantity for:', { id, size, newQuantity });
    
    setCartItems(prev => {
      const newCart = prev.map(item =>
        String(item.id) === String(id) && item.size === size
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      );
      console.log('✅ Quantity updated, new cart:', newCart);
      return newCart;
    });
  };

  const removeFromCart = (id: string | number, size: string) => {
    console.log('🗑️ Removing from cart:', { id, size });
    
    setCartItems(prev => {
      const newCart = prev.filter(item => 
        !(String(item.id) === String(id) && item.size === size)
      );
      console.log('✅ Item removed, new cart:', newCart);
      return newCart;
    });
  };

  const addToWishlist = (item: WishlistItem) => {
    console.log('❤️ Adding to wishlist:', item);
    
    setWishlistItems(prev => {
      const exists = prev.some(wishlistItem => 
        String(wishlistItem.id) === String(item.id)
      );
      
      if (!exists) {
        const newWishlist = [...prev, item];
        console.log('✅ Added to wishlist, new wishlist:', newWishlist);
        return newWishlist;
      }
      console.log('⚠️ Item already in wishlist');
      return prev;
    });
  };

  const removeFromWishlist = (id: string | number) => {
    console.log('🗑️ Removing from wishlist:', { id });
    
    setWishlistItems(prev => {
      const newWishlist = prev.filter(item => 
        String(item.id) !== String(id)
      );
      console.log('✅ Item removed from wishlist, new wishlist:', newWishlist);
      return newWishlist;
    });
  };

  const addToCartFromWishlist = (item: WishlistItem) => {
    console.log('🛒 Adding wishlist item to cart:', item);
    
    // Add to cart with quantity 1
    addToCart({
      id: item.id,
      img: item.img,
      nameEn: item.nameEn,
      nameUr: item.nameUr,
      price: item.price,
      oldPrice: item.oldPrice,
      size: item.size,
      category: item.category,
      rating: item.rating
    });
    
    // Remove from wishlist
    removeFromWishlist(item.id);
  };

  const clearCart = () => {
    console.log('🧹 Clearing cart');
    setCartItems([]);
  };

  const getCartTotal = () => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return total;
  };

  const getCartCount = () => {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return count;
  };

  const getItemCount = (id: string | number, size: string) => {
    const item = cartItems.find(item => 
      String(item.id) === String(id) && item.size === size
    );
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    wishlistItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    addToCartFromWishlist,
    clearCart,
    getCartTotal,
    getCartCount,
    getItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};