import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Category | Pansari Inn',
  description: 'Browse our extensive range of herbal products organized by category - find exactly what you need.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
