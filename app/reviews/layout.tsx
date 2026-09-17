import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export const metadata: Metadata = {
  title: 'Customer Reviews | Pansari Inn',
  description: 'Read genuine customer reviews for Pansari Inn herbal and Ayurvedic products.',
  alternates: { canonical: `${SITE_URL}/reviews` },
  openGraph: {
    title: 'Customer Reviews | Pansari Inn',
    description: 'Read genuine customer reviews for Pansari Inn herbal and Ayurvedic products.',
    url: `${SITE_URL}/reviews`,
    type: 'website',
    siteName: 'Pansari Inn',
  },
  twitter: {
    card: 'summary',
    title: 'Customer Reviews | Pansari Inn',
    description: 'Read genuine customer reviews for Pansari Inn herbal and Ayurvedic products.',
  },
};

export default function ReviewsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
