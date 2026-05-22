import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Dawakhana | Pansari Inn',
  description: 'Traditional Dawakhana products - authentic herbal medicines and remedies from time-tested formulations.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
