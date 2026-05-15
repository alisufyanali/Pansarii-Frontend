import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Offers',
  description:
    'Browse exclusive deals, flash sales, and promo codes on Pansari Inn\'s premium Ayurvedic and herbal products.',
  openGraph: {
    title: 'Offers | Pansari Inn',
    description: 'Exclusive deals and promo codes on Pansari Inn herbal products.',
  },
};

export default function OffersLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
