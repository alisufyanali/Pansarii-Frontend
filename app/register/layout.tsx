import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create a Pansari Inn account to save your wishlist, track orders, and enjoy a faster checkout experience.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Register | Pansari Inn',
    description: 'Create your Pansari Inn account.',
  },
};

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
