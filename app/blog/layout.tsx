import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Read wellness tips, Ayurvedic guides, and herbal health articles from the Pansari Inn blog.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'Blog | Pansari Inn',
    description: 'Wellness tips, Ayurvedic guides, and herbal health articles from Pansari Inn.',
    url: `${SITE_URL}/blog`,
    type: 'website',
    siteName: 'Pansari Inn',
    images: [{ url: '/images/Banner.png', width: 1200, height: 630, alt: 'Pansari Inn Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Pansari Inn',
    description: 'Wellness tips, Ayurvedic guides, and herbal health articles from Pansari Inn.',
    images: ['/images/Banner.png'],
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
