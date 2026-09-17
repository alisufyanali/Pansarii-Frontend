import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export const metadata: Metadata = {
  title: 'Oils | Pansari Inn',
  description: 'Premium quality pure oils — cold-pressed and natural for health, cooking, and wellness.',
  alternates: { canonical: `${SITE_URL}/oils` },
  openGraph: {
    title: 'Oils | Pansari Inn',
    description: 'Premium quality pure oils — cold-pressed and natural for health, cooking, and wellness.',
    url: `${SITE_URL}/oils`,
    type: 'website',
    siteName: 'Pansari Inn',
    images: [{ url: '/images/Banner.png', width: 1200, height: 630, alt: 'Oils - Pansari Inn' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oils | Pansari Inn',
    description: 'Premium quality pure oils — cold-pressed and natural for health, cooking, and wellness.',
    images: ['/images/Banner.png'],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
