import BottomNav from '@/components/Mobile/components/BottomNav';

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}
