import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Returns Policy | Pansari Inn',
  description: 'Our hassle-free returns policy - learn about return procedures, timelines, and refund process.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
