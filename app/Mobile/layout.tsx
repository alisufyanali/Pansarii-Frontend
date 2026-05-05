// app/Mobile/layout.tsx
"use client";

import { ReactNode, useState } from "react";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishList";
import Header from "./components/header";
import Navbar from "./components/navbar";
import MenuModal from "./components/MenuModal";
import Footer from "./components/footer";

export default function MobileLayout({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <CartProvider>
      <WishlistProvider>
        {/* Header - Fixed at top */}
        <Header
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />

        {/* Main Content */}
        <main className="min-h-screen bg-white pt-32">
          {children}
        </main>

        {/* Footer Section */}
        <Footer />

        {/* Floating Bottom Navbar - Uncomment if needed */}
        {/* <Navbar 
          setIsMenuOpen={setIsMenuOpen}
        /> */}

        {/* Menu Modal */}
        <MenuModal 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)} 
        />
      </WishlistProvider>
    </CartProvider>
  );
}