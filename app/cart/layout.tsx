import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Review your selected items, apply promo codes, and proceed to checkout.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Cart | Pansari Inn',
    description: 'Review your cart and proceed to checkout at Pansari Inn.',
  },
};

export default function CartLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
