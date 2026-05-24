import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Contact Us | Pansari Inn',
  description: 'Get in touch with Pansari Inn. Contact us for inquiries, support, or questions about our natural herbal products. Phone, email, and WhatsApp support available.',
  keywords: ['contact pansari inn', 'customer support', 'herbal products inquiry', 'Pakistan'],
  openGraph: {
    title: 'Contact Us | Pansari Inn',
    description: 'Get in touch with Pansari Inn for inquiries and support',
    type: 'website',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
