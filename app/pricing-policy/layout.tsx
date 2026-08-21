import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Pricing Policy | Pansari Inn',
  description: 'Understand our pricing policy — all prices are in Pakistani Rupees and are subject to change. Orders are billed at the price in effect at the time of shipping.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
