import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Shop by Category | Pansari Inn',
  description: 'Browse our full collection of natural & herbal products organized by category. Find herbs, oils, supplements, beauty products and more.',
  keywords: ['herbal products', 'natural herbs', 'ayurvedic', 'categories', 'shop', 'Pakistan'],
  openGraph: {
    title: 'Shop by Category | Pansari Inn',
    description: 'Browse our full collection of natural & herbal products organized by category',
    type: 'website',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
