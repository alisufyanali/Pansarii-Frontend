import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Pansari Inn',
  description: 'Read the Terms & Conditions of Pansari Inn. Learn about our policies on ordering, payments, returns, delivery, and use of our herbal products website.',
  keywords: ['terms and conditions', 'terms of service', 'pansari inn policy', 'ordering terms', 'Pakistan'],
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: {
    title: 'Terms & Conditions | Pansari Inn',
    description: 'Review the Terms & Conditions that apply to your use of Pansari Inn and all orders placed through our website.',
    url: `${SITE_URL}/terms`,
    type: 'website',
    siteName: 'Pansari Inn',
  },
  twitter: {
    card: 'summary',
    title: 'Terms & Conditions | Pansari Inn',
    description: 'Review the Terms & Conditions that apply to your use of Pansari Inn and all orders placed through our website.',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
