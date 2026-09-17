import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export const metadata: Metadata = {
  title: 'Our Story | Pansari Inn',
  description: 'Learn about Pansari Inn - our journey, mission, and commitment to providing authentic herbal products.',
  alternates: { canonical: `${SITE_URL}/our-story` },
  openGraph: {
    title: 'Our Story | Pansari Inn',
    description: 'Learn about Pansari Inn - our journey, mission, and commitment to providing authentic herbal products.',
    url: `${SITE_URL}/our-story`,
    type: 'website',
    siteName: 'Pansari Inn',
    images: [{ url: '/images/Banner.png', width: 1200, height: 630, alt: 'Our Story - Pansari Inn' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Story | Pansari Inn',
    description: 'Learn about Pansari Inn - our journey, mission, and commitment to providing authentic herbal products.',
    images: ['/images/Banner.png'],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
