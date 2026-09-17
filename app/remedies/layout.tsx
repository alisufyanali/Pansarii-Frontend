import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export const metadata: Metadata = {
  title: 'Remedies | Pansari Inn',
  description: 'Natural herbal remedies and traditional solutions for common health issues and wellness concerns.',
  alternates: { canonical: `${SITE_URL}/remedies` },
  openGraph: {
    title: 'Remedies | Pansari Inn',
    description: 'Natural herbal remedies and traditional solutions for common health issues and wellness concerns.',
    url: `${SITE_URL}/remedies`,
    type: 'website',
    siteName: 'Pansari Inn',
    images: [{ url: '/images/Banner.png', width: 1200, height: 630, alt: 'Remedies - Pansari Inn' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Remedies | Pansari Inn',
    description: 'Natural herbal remedies and traditional solutions for common health issues and wellness concerns.',
    images: ['/images/Banner.png'],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
