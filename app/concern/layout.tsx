import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export const metadata: Metadata = {
  title: 'Health Concerns | Pansari Inn',
  description: 'Find natural remedies and herbal solutions for your specific health concerns and wellness needs.',
  alternates: { canonical: `${SITE_URL}/concern` },
  openGraph: {
    title: 'Health Concerns | Pansari Inn',
    description: 'Find natural remedies and herbal solutions for your specific health concerns and wellness needs.',
    url: `${SITE_URL}/concern`,
    type: 'website',
    siteName: 'Pansari Inn',
    images: [{ url: '/images/Banner.png', width: 1200, height: 630, alt: 'Health Concerns - Pansari Inn' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Health Concerns | Pansari Inn',
    description: 'Find natural remedies and herbal solutions for your specific health concerns and wellness needs.',
    images: ['/images/Banner.png'],
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
