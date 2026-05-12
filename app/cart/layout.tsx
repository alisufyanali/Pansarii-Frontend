import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review your selected items, apply promo codes, and proceed to checkout.',
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
