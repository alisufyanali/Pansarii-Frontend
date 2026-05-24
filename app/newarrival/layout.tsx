import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'New Arrivals | Pansari Inn',
  description: 'Discover our latest collection of 100% Ayurvedic & Herbal products. Just launched - premium quality natural products with free shipping.',
  keywords: ['new arrivals', 'latest products', 'herbal products', 'ayurvedic', 'natural', 'Pakistan'],
  openGraph: {
    title: 'New Arrivals | Pansari Inn',
    description: 'Discover our latest collection of 100% Ayurvedic & Herbal products',
    type: 'website',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
