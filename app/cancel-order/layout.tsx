import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Cancel Order | Pansari Inn',
  description: 'Cancel your order easily - learn about cancellation policies and process your cancellation request.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
