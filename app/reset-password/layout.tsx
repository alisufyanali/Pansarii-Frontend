import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your Pansari Inn account.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Reset Password | Pansari Inn',
    description: 'Set your new account password.',
  },
};

export default function ResetPasswordLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
