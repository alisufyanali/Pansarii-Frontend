import BottomNav from '@/components/Mobile/components/BottomNav';

export default function CancelOrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}
