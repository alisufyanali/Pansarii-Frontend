import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'View and manage your saved products. Move items to cart or share your wishlist.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Wishlist | Pansari Inn',
    description: 'View and manage your saved products at Pansari Inn.',
  },
};

export default function WishlistLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
