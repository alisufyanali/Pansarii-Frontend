import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export const metadata: Metadata = {
  title: 'Special Offers & Deals | Pansari Inn',
  description: "Exclusive savings on Pansari Inn's finest herbal products. Flash sales, seasonal offers, BOGO deals and more. Limited time discounts!",
  keywords: ['offers', 'deals', 'discounts', 'promo codes', 'herbal products sale', 'Pakistan'],
  alternates: { canonical: `${SITE_URL}/offers` },
  openGraph: {
    title: 'Special Offers & Deals | Pansari Inn',
    description: "Exclusive savings on Pansari Inn's finest herbal products. Flash sales, seasonal offers, BOGO deals and more.",
    url: `${SITE_URL}/offers`,
    type: 'website',
    siteName: 'Pansari Inn',
    images: [{ url: '/images/Banner.png', width: 1200, height: 630, alt: 'Special Offers - Pansari Inn' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Special Offers & Deals | Pansari Inn',
    description: "Exclusive savings on Pansari Inn's finest herbal products.",
    images: ['/images/Banner.png'],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
