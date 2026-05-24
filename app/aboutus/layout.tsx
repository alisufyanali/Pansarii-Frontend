import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'About Us | Pansari Inn',
  description: 'Learn about Pansari Inn - your trusted partner for 100% pure natural herbs and herbal products. Discover our mission, values, and commitment to quality.',
  keywords: ['about pansari inn', 'herbal products Pakistan', 'natural herbs', 'ayurvedic', 'company story'],
  openGraph: {
    title: 'About Us | Pansari Inn',
    description: 'Your trusted partner for 100% pure natural herbs and herbal products',
    type: 'website',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
