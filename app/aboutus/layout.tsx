import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Pansari Inn — your trusted source for 100% pure Ayurvedic and herbal products delivered across Pakistan.',
  openGraph: {
    title: 'About Us | Pansari Inn',
    description:
      'Learn about Pansari Inn — your trusted source for 100% pure Ayurvedic and herbal products.',
  },
};

export default function AboutUsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
