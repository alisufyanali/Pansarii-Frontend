import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Special Offers & Deals | Pansari Inn',
  description: 'Exclusive savings on Pansari Inn\'s finest herbal products. Flash sales, seasonal offers, BOGO deals and more. Limited time discounts!',
  keywords: ['offers', 'deals', 'discounts', 'promo codes', 'herbal products sale', 'Pakistan'],
  openGraph: {
    title: 'Special Offers & Deals | Pansari Inn',
    description: 'Exclusive savings on Pansari Inn\'s finest herbal products',
    type: 'website',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
