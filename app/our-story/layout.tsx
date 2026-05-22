import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Our Story | Pansari Inn',
  description: 'Learn about Pansari Inn - our journey, mission, and commitment to providing authentic herbal products.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
