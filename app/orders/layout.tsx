import BottomNav from '@/components/Mobile/components/BottomNav';

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}
