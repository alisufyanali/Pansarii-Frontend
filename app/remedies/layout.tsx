import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Remedies | Pansari Inn',
  description: 'Natural herbal remedies and traditional solutions for common health issues and wellness concerns.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
