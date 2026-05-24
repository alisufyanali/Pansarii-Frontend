"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Dev-only logger — stripped in production builds
const log = (...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development') console.log(...args);
};

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

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: string | number, size: string, newQuantity: number) => void;
  removeFromCart: (id: string | number, size: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getItemCount: (id: string | number, size: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage - runs only once on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('pansari-cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          log('✅ Cart loaded from localStorage:', parsedCart);
          setCartItems(parsedCart);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Error loading cart:', error);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      try {
        localStorage.setItem('pansari-cart', JSON.stringify(cartItems));
        log('💾 Cart saved to localStorage:', cartItems);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Error saving cart:', error);
        }
      }
    }
  }, [cartItems, isInitialized]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    log('🛒 Adding to cart:', item);

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
        log('✅ Updated existing item, new cart:', newCart);
        return newCart;
      } else {
        const newCart = [...prev, { ...item, quantity: 1 }];
        log('✅ Added new item, new cart:', newCart);
        return newCart;
      }
    });
  };

  const updateQuantity = (id: string | number, size: string, newQuantity: number) => {
    log('🔄 Updating quantity for:', { id, size, newQuantity });

    setCartItems(prev => {
      const newCart = prev.map(item =>
        String(item.id) === String(id) && item.size === size
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      );
      log('✅ Quantity updated, new cart:', newCart);
      return newCart;
    });
  };

  const removeFromCart = (id: string | number, size: string) => {
    log('🗑️ Removing from cart:', { id, size });

    setCartItems(prev => {
      const newCart = prev.filter(item =>
        !(String(item.id) === String(id) && item.size === size)
      );
      log('✅ Item removed, new cart:', newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    log('🧹 Clearing cart');
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
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    getItemCount,
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
