import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pansariinn.com';

export const metadata: Metadata = {
  title: 'Contact Us | Pansari Inn',
  description: 'Get in touch with Pansari Inn. Contact us for inquiries, support, or questions about our natural herbal products. Phone, email, and WhatsApp support available.',
  keywords: ['contact pansari inn', 'customer support', 'herbal products inquiry', 'Pakistan'],
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: 'Contact Us | Pansari Inn',
    description: 'Get in touch with Pansari Inn for inquiries, support, or questions about our natural herbal products.',
    url: `${SITE_URL}/contact`,
    type: 'website',
    siteName: 'Pansari Inn',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Us | Pansari Inn',
    description: 'Get in touch with Pansari Inn for inquiries, support, or questions about our natural herbal products.',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
