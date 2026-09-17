// app/layout.tsx
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import "./globals.css";
import DeviceDetector from "@/hooks/useDeviceDetection";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishList";
import { AuthProvider } from "@/context/AuthContext";
import CartAuthBridge from "@/components/CartAuthBridge";
import WishlistAuthBridge from "@/components/WishlistAuthBridge";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    url: "https://pansariinn.com",
    siteName: "Pansari Inn",
    images: [
      {
        url: "/images/Banner.png",
        width: 1200,
        height: 630,
        alt: "Pansari Inn - Premium Ayurvedic & Herbal Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@pansariinn",
    title: "Pansari Inn - Premium Ayurvedic & Herbal Products",
    description: "100% Pure Ayurvedic & Herbal Products for health and wellness.",
    images: ["/images/Banner.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="preload" as="image" href="/images/Banner.png" fetchPriority="high" imageSizes="(max-width: 768px) 92vw, 100vw" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className={`${poppins.className} bg-white text-gray-900 antialiased`}>
        {/* Organization + WebSite JSON-LD — site-wide structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Pansari Inn",
                url: "https://pansariinn.com",
                logo: "https://pansariinn.com/images/logo.png",
                description: "100% Pure Ayurvedic & Herbal Products — premium quality natural products for health, beauty, and wellness.",
                email: "chat@pansariinn.pk",
                telephone: "+923045779900",
                sameAs: [
                  "https://facebook.com/pansariinn",
                  "https://instagram.com/pansariinn",
                  "https://twitter.com/pansariin",
                  "https://youtube.com/pansariin",
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+923045779900",
                  contactType: "customer service",
                  availableLanguage: ["English", "Urdu"],
                  contactOption: "TollFree",
                  areaServed: "PK",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Pansari Inn",
                url: "https://pansariinn.com",
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://pansariinn.com/shop?search={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              },
            ]),
          }}
        />
        <AuthProvider>
          <CartProvider>
            <CartAuthBridge />
            <WishlistProvider>
              <WishlistAuthBridge />
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
                style={{ zIndex: 99999 }}
              />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
