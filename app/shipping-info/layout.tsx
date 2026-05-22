import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Shipping Info | Pansari Inn',
  description: 'Shipping information, delivery timelines, and shipping charges for orders across Pakistan.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
