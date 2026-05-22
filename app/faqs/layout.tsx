import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'FAQs | Pansari Inn',
  description: 'Frequently asked questions about our products, shipping, returns, and more. Get answers to common queries.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
