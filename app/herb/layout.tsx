import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export const metadata: Metadata = {
  title: 'Herbs | Pansari Inn',
  description: 'Premium quality herbs and botanical ingredients - sourced naturally for your health and wellness.',
  alternates: { canonical: `${SITE_URL}/herb` },
  openGraph: {
    title: 'Herbs | Pansari Inn',
    description: 'Premium quality herbs and botanical ingredients - sourced naturally for your health and wellness.',
    url: `${SITE_URL}/herb`,
    type: 'website',
    siteName: 'Pansari Inn',
    images: [{ url: '/images/Banner.png', width: 1200, height: 630, alt: 'Herbs - Pansari Inn' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Herbs | Pansari Inn',
    description: 'Premium quality herbs and botanical ingredients - sourced naturally for your health and wellness.',
    images: ['/images/Banner.png'],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
