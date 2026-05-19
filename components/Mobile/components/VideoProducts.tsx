"use client";

import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaHeart, FaShareAlt } from 'react-icons/fa';
import { allProducts } from '@/components/Desktop/data/products';

export default function MobileVideoProducts() {
  const router    = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);
  const isTouch   = useRef(false);

  const products = allProducts.slice(0, 6).map(p => ({
    id:    p.id,
    video: '/images/review.mp4',
    img:   p.img,
    nameEn: p.nameEn,
    views: '860',
    price: p.price,
  }));

  // Auto-slide every 3s
  useEffect(() => {
    const t = setInterval(() => {
      if (isTouch.current) return;
      const el = sliderRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      if (atEnd) { el.scrollLeft = 0; }
      else {
        const card = el.querySelector('.vid-card') as HTMLElement;
        el.scrollLeft += (card ? card.offsetWidth + 12 : 160);
      }
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-4">
      <div className="px-4 mb-3">
        <h2 className="text-base font-bold text-gray-900">
          Video Of <span className="me-color-y">Products</span>
        </h2>
      </div>

      <div
        ref={sliderRef}
        className="flex gap-3 overflow-x-auto no-scrollbar pl-4 pr-4"
        onTouchStart={() => { isTouch.current = true; }}
        onTouchEnd={() => { setTimeout(() => { isTouch.current = false; }, 2000); }}
      >
        {products.map(p => (
          <VideoCard key={p.id} product={p} onPress={() => router.push(`/products/${p.nameEn.toLowerCase().replace(/\s+/g, '-')}`)} />
        ))}
      </div>
    </section>
  );
}

function VideoCard({ product, onPress }: { product: any; onPress: () => void }) {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (videoRef.current && !err) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [err]);

  return (
    <div
      className="vid-card flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-transform relative aspect-[9/14]"
      style={{ width: 'calc((100vw - 56px) / 2.6)' }}
      onClick={onPress}
    >
      {/* Video / fallback */}
      {!err ? (
        <video
          ref={videoRef}
          src={product.video}
          className="w-full h-full object-cover"
          loop muted autoPlay playsInline
          onError={() => setErr(true)}
        />
      ) : (
        <div className="relative w-full h-full">
          <Image src={product.img} alt={product.nameEn} fill className="object-cover" sizes="(max-width: 768px) 50vw, 20vw" />
        </div>
      )}

      {/* Bottom overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <div className="flex items-center justify-between">
          <span className="text-white text-[10px] font-medium">{product.views} Views</span>
          <div className="flex items-center gap-2">
            <FaHeart className="w-3 h-3 text-white/80" />
            <FaShareAlt className="w-3 h-3 text-white/80" />
          </div>
        </div>
        {/* Small product image */}
        <div className="flex items-center gap-1.5 mt-1">
          <div className="relative w-7 h-7 rounded-md overflow-hidden flex-shrink-0 bg-white/20">
            <Image src={product.img} alt="" fill className="object-cover" sizes="28px" />
          </div>
          <span className="text-white text-[10px] font-medium line-clamp-1">{product.nameEn}</span>
        </div>
      </div>
    </div>
  );
}
