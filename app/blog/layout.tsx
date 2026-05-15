import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Read wellness tips, Ayurvedic guides, and herbal health articles from the Pansari Inn blog.',
  openGraph: {
    title: 'Blog | Pansari Inn',
    description: 'Wellness tips and Ayurvedic guides from Pansari Inn.',
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
