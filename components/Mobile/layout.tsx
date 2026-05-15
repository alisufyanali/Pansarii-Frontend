"use client";

import { ReactNode, useState } from "react";
import Header from "./components/header";
import MenuModal from "./components/MenuModal";
import Footer from "./components/footer";
import BottomNav from "./components/BottomNav";

export default function MobileLayout({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Header
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <main className="min-h-screen bg-white pt-32">
        {children}
      </main>

      <Footer />

      <BottomNav />

      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
