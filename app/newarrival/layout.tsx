import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'New Arrivals',
  description:
    'Discover the latest Ayurvedic and herbal products at Pansari Inn — newly launched natural wellness essentials.',
  openGraph: {
    title: 'New Arrivals | Pansari Inn',
    description: 'Shop the latest Ayurvedic and herbal products at Pansari Inn.',
  },
};

export default function NewArrivalLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
