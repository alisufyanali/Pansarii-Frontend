import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export const metadata: Metadata = {
  title: 'Privacy Policy | Pansari Inn',
  description: 'Learn how Pansari Inn collects, uses, and protects your personal data. Our Privacy Policy covers ordering, accounts, payments, cookies, and your rights.',
  keywords: ['privacy policy', 'data protection', 'personal information', 'cookies policy', 'Pakistan'],
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: {
    title: 'Privacy Policy | Pansari Inn',
    description: 'Learn how Pansari Inn collects, uses, and protects your personal data in accordance with Pakistani data protection standards.',
    url: `${SITE_URL}/privacy`,
    type: 'website',
    siteName: 'Pansari Inn',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | Pansari Inn',
    description: 'Learn how Pansari Inn collects, uses, and protects your personal data in accordance with Pakistani data protection standards.',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
