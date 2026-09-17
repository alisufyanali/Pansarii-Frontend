import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export const metadata: Metadata = {
  title: 'Dawakhana | Pansari Inn',
  description: 'Traditional Dawakhana products - authentic herbal medicines and remedies from time-tested formulations.',
  alternates: { canonical: `${SITE_URL}/dawakhana` },
  openGraph: {
    title: 'Dawakhana | Pansari Inn',
    description: 'Traditional Dawakhana products - authentic herbal medicines and remedies from time-tested formulations.',
    url: `${SITE_URL}/dawakhana`,
    type: 'website',
    siteName: 'Pansari Inn',
    images: [{ url: '/images/Banner.png', width: 1200, height: 630, alt: 'Dawakhana - Pansari Inn' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dawakhana | Pansari Inn',
    description: 'Traditional Dawakhana products - authentic herbal medicines and remedies from time-tested formulations.',
    images: ['/images/Banner.png'],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
