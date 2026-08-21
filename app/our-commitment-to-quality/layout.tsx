import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Our Commitment To Quality | Pansari Inn',
  description: 'Learn how Pansari Inn ensures peak freshness, purity, and quality across every herbal, spice, oil, and supplement product we source and pack.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
