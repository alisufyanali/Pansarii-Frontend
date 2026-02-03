// app/Desktop/layout.tsx
import { ReactNode } from "react";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishList";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

export default function DesktopLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <Navbar />
        <main className="min-h-screen bg-white pt-44">
          {children}
        </main>
        <Footer />
      </WishlistProvider>
    </CartProvider>
  );
}