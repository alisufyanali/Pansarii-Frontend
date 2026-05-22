import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Track Order | Pansari Inn',
  description: 'Track your order status and delivery progress in real-time with our order tracking system.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
