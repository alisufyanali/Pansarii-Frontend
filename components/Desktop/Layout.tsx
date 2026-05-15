import { ReactNode } from "react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

export default function DesktopLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white mt-32">
        {children}
      </main>
      <Footer />
    </>
  );
}
