// app/Mobile/layout.tsx
"use client";

import { ReactNode, useState } from "react";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishList";
import Header from "./components/header";
import Navbar from "./components/navbar";
import MenuModal from "./components/MenuModal";

export default function MobileLayout({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <CartProvider>
      <WishlistProvider>
        {/* Header - Fixed at top */}
        <Header
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
        />

        {/* Main Content */}
        <main className="min-h-screen bg-white pt-16 pb-24 px-4">
          {children}
        </main>

        {/* Floating Bottom Navbar */}
        <Navbar 
          setIsMenuOpen={setIsMenuOpen}
          // setIsSearchOpen={setIsSearchOpen}
        />

        {/* Menu Modal */}
        <MenuModal 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)} 
        />
      </WishlistProvider>
    </CartProvider>
  );
}