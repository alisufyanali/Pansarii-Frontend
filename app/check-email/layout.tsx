import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Check Email',
  description: 'Confirm your password reset email.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Check Email | Pansari Inn',
    description: 'Check your email for a password reset link.',
  },
};

export default function CheckEmailLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
