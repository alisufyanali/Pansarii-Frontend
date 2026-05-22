import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Support | Pansari Inn',
  description: 'Customer support and help center - get assistance with orders, products, and account issues.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
