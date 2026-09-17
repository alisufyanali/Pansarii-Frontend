import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export const metadata: Metadata = {
  title: 'Pricing Policy | Pansari Inn',
  description: 'Understand our pricing policy — all prices are in Pakistani Rupees and are subject to change. Orders are billed at the price in effect at the time of shipping.',
  alternates: { canonical: `${SITE_URL}/pricing-policy` },
  openGraph: {
    title: 'Pricing Policy | Pansari Inn',
    description: 'All prices are in Pakistani Rupees and are subject to change. Orders are billed at the price in effect at the time of shipping.',
    url: `${SITE_URL}/pricing-policy`,
    type: 'website',
    siteName: 'Pansari Inn',
  },
  twitter: {
    card: 'summary',
    title: 'Pricing Policy | Pansari Inn',
    description: 'All prices are in Pakistani Rupees. Orders are billed at the price in effect at the time of shipping.',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
