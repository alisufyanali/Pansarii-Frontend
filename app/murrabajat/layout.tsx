import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export const metadata: Metadata = {
  title: 'Murrabajat | Pansari Inn',
  description: 'Traditional Murrabajat (herbal preserves) - delicious and nutritious herbal jams for health and vitality.',
  alternates: { canonical: `${SITE_URL}/murrabajat` },
  openGraph: {
    title: 'Murrabajat | Pansari Inn',
    description: 'Traditional Murrabajat (herbal preserves) - delicious and nutritious herbal jams for health and vitality.',
    url: `${SITE_URL}/murrabajat`,
    type: 'website',
    siteName: 'Pansari Inn',
    images: [{ url: '/images/Banner.png', width: 1200, height: 630, alt: 'Murrabajat - Pansari Inn' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Murrabajat | Pansari Inn',
    description: 'Traditional Murrabajat (herbal preserves) - delicious and nutritious herbal jams for health and vitality.',
    images: ['/images/Banner.png'],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
