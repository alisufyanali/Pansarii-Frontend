// app/layout.tsx
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import "./globals.css";
import DeviceDetector from "./utils/screen-detection";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishList";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SpeedInsights } from "@vercel/speed-insights/next"

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  preload: false, // prevents build-time Google Fonts fetch failure in offline/restricted environments
});

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
