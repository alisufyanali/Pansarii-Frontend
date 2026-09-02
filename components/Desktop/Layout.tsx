"use client";

import { ReactNode, useState } from "react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import CartSidebar from "./components/sidebar";

export default function DesktopLayout({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <Navbar onCartOpen={() => setIsCartOpen(true)} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <main className="min-h-screen bg-white mt-32">
        {children}
      </main>
      <Footer />
    </>
  );
}
