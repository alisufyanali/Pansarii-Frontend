import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'My Wishlist',
  description: 'View and manage your saved products. Move items to cart or share your wishlist.',
  robots: { index: false, follow: false },
};

export default function WishlistLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
