import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export const metadata: Metadata = {
  title: 'Our Commitment To Quality | Pansari Inn',
  description: 'Learn how Pansari Inn ensures peak freshness, purity, and quality across every herbal, spice, oil, and supplement product we source and pack.',
  alternates: { canonical: `${SITE_URL}/our-commitment-to-quality` },
  openGraph: {
    title: 'Our Commitment To Quality | Pansari Inn',
    description: 'How Pansari Inn ensures peak freshness, purity, and quality across every herbal, spice, oil, and supplement product we source and pack.',
    url: `${SITE_URL}/our-commitment-to-quality`,
    type: 'website',
    siteName: 'Pansari Inn',
    images: [{ url: '/images/Banner.png', width: 1200, height: 630, alt: 'Quality Commitment - Pansari Inn' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Commitment To Quality | Pansari Inn',
    description: 'How Pansari Inn ensures peak freshness, purity, and quality across every product we source and pack.',
    images: ['/images/Banner.png'],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
