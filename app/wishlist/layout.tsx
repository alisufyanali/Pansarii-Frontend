import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Wishlist | Pansari Inn',
  description: 'Your saved herbal products. Save your favorite natural and ayurvedic products for later purchase.',
  keywords: ['wishlist', 'saved products', 'favorites', 'herbal products', 'Pakistan'],
  openGraph: {
    title: 'Wishlist | Pansari Inn',
    description: 'Your saved herbal products',
    type: 'website',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
