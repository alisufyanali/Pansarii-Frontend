import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Pansari Inn. Call, email, or message us for orders, product questions, and customer support.',
  openGraph: {
    title: 'Contact Us | Pansari Inn',
    description: 'Contact Pansari Inn for orders, product questions, and customer support.',
  },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
