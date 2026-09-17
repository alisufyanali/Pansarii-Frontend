import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export const metadata: Metadata = {
  title: 'Supplements | Pansari Inn',
  description: 'Natural herbal supplements and nutritional products for optimal health and wellness support.',
  alternates: { canonical: `${SITE_URL}/supplements` },
  openGraph: {
    title: 'Supplements | Pansari Inn',
    description: 'Natural herbal supplements and nutritional products for optimal health and wellness support.',
    url: `${SITE_URL}/supplements`,
    type: 'website',
    siteName: 'Pansari Inn',
    images: [{ url: '/images/Banner.png', width: 1200, height: 630, alt: 'Supplements - Pansari Inn' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Supplements | Pansari Inn',
    description: 'Natural herbal supplements and nutritional products for optimal health and wellness support.',
    images: ['/images/Banner.png'],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
