import type { Metadata } from 'next';
import Shop from "@/components/Desktop/Sections/shop";

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse our full range of 100% pure Ayurvedic and herbal products — oils, supplements, skincare, honey, teas and more.',
  openGraph: {
    title: 'Shop | Pansari Inn',
    description: 'Browse our full range of 100% pure Ayurvedic and herbal products.',
  },
};

export default function ShopPage() {
  return <Shop />;
}