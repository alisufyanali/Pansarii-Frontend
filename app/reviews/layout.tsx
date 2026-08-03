import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Customer Reviews | Pansari Inn',
  description: 'Read genuine customer reviews for Pansari Inn herbal and Ayurvedic products.',
};

export default function ReviewsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
