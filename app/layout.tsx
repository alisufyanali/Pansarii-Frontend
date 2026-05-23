// app/layout.tsx
import type { Metadata } from 'next';
import "./globals.css";
import DeviceDetector from "@/hooks/useDeviceDetection";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishList";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SpeedInsights } from "@vercel/speed-insights/next"

const poppins = { variable: '--font-poppins', className: 'font-poppins' };

export const metadata: Metadata = {
  title: {
    default: 'Pansari Inn - Premium Ayurvedic & Herbal Products',
    template: '%s | Pansari Inn',
  },
  description: "100% Pure Ayurvedic & Herbal Products. Premium quality natural products for health, beauty, and wellness.",
  keywords: ["ayurvedic", "herbal", "natural products", "wellness", "health", "beauty", "Pakistan"],
  authors: [{ name: "Pansari Inn" }],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "Pansari Inn - Premium Ayurvedic & Herbal Products",
    description: "100% Pure Ayurvedic & Herbal Products for health and wellness",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} light`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="bg-white text-gray-900 font-poppins antialiased" suppressHydrationWarning>
        <CartProvider>
          <WishlistProvider>
            <DeviceDetector>{children}</DeviceDetector>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </WishlistProvider>
        </CartProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
