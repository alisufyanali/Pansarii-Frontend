import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export const metadata: Metadata = {
  title: 'Shop by Category | Pansari Inn',
  description: 'Browse our full collection of natural & herbal products organized by category. Find herbs, oils, supplements, beauty products and more.',
  keywords: ['herbal products', 'natural herbs', 'ayurvedic', 'categories', 'shop', 'Pakistan'],
  alternates: { canonical: `${SITE_URL}/category` },
  openGraph: {
    title: 'Shop by Category | Pansari Inn',
    description: 'Browse our full collection of natural & herbal products organized by category. Find herbs, oils, supplements, beauty products and more.',
    url: `${SITE_URL}/category`,
    type: 'website',
    siteName: 'Pansari Inn',
    images: [{ url: '/images/Banner.png', width: 1200, height: 630, alt: 'Shop by Category - Pansari Inn' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop by Category | Pansari Inn',
    description: 'Browse our full collection of natural & herbal products organized by category.',
    images: ['/images/Banner.png'],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
