import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export const metadata: Metadata = {
  title: 'Shipping Info | Pansari Inn',
  description: 'Shipping information, delivery timelines, and shipping charges for orders across Pakistan.',
  alternates: { canonical: `${SITE_URL}/shipping-info` },
  openGraph: {
    title: 'Shipping Info | Pansari Inn',
    description: 'Shipping information, delivery timelines, and shipping charges for orders across Pakistan.',
    url: `${SITE_URL}/shipping-info`,
    type: 'website',
    siteName: 'Pansari Inn',
  },
  twitter: {
    card: 'summary',
    title: 'Shipping Info | Pansari Inn',
    description: 'Shipping information, delivery timelines, and shipping charges for orders across Pakistan.',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
