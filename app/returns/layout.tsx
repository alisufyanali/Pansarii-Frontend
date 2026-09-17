import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export const metadata: Metadata = {
  title: 'Returns Policy | Pansari Inn',
  description: 'Our hassle-free returns policy - learn about return procedures, timelines, and refund process.',
  alternates: { canonical: `${SITE_URL}/returns` },
  openGraph: {
    title: 'Returns Policy | Pansari Inn',
    description: 'Our hassle-free returns policy - learn about return procedures, timelines, and refund process.',
    url: `${SITE_URL}/returns`,
    type: 'website',
    siteName: 'Pansari Inn',
  },
  twitter: {
    card: 'summary',
    title: 'Returns Policy | Pansari Inn',
    description: 'Our hassle-free returns policy - learn about return procedures, timelines, and refund process.',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
