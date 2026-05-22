import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Wishlist | Pansari Inn',
  description: 'Your saved items and wishlist - keep track of products you love and want to purchase later.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
