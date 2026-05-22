import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Beauty Corner | Pansari Inn',
  description: 'Discover natural beauty products and herbal cosmetics for radiant skin and healthy hair care.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
