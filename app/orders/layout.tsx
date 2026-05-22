import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'My Orders | Pansari Inn',
  description: 'View and manage your order history, track shipments, and review past purchases.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
