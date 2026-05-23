import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Order Confirmation | Pansari Inn',
  description: 'Your order has been placed successfully. View your order details, invoice, and estimated delivery information.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
