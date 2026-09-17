import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export const metadata: Metadata = {
  title: 'New Arrivals | Pansari Inn',
  description: 'Discover our latest collection of 100% Ayurvedic & Herbal products. Just launched - premium quality natural products with free shipping.',
  keywords: ['new arrivals', 'latest products', 'herbal products', 'ayurvedic', 'natural', 'Pakistan'],
  alternates: { canonical: `${SITE_URL}/newarrival` },
  openGraph: {
    title: 'New Arrivals | Pansari Inn',
    description: 'Discover our latest collection of 100% Ayurvedic & Herbal products. Just launched - premium quality natural products with free shipping.',
    url: `${SITE_URL}/newarrival`,
    type: 'website',
    siteName: 'Pansari Inn',
    images: [{ url: '/images/Banner.png', width: 1200, height: 630, alt: 'New Arrivals - Pansari Inn' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Arrivals | Pansari Inn',
    description: 'Discover our latest collection of 100% Ayurvedic & Herbal products.',
    images: ['/images/Banner.png'],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
