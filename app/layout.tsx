// app/layout.tsx
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import "./globals.css";
import DeviceDetector from "@/hooks/useDeviceDetection";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishList";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SpeedInsights } from "@vercel/speed-insights/next"

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pansariinn.com'),
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
        <link rel="preload" as="image" href="/images/Banner.png" fetchPriority="high" imageSizes="(max-width: 768px) 92vw, 100vw" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
      </head>
      <body className={`${poppins.className} bg-white text-gray-900 antialiased`} suppressHydrationWarning>
        <AuthProvider>
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
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
