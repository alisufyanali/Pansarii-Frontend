"use client";

import Image from 'next/image';
import React, { useRef, useEffect, useState, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

interface VideoProduct {
  id: string | number;
  video: string;
  topImage: string;
  productImage: string;
  nameEn: string;
  nameUr: string;
  price: number | string;
  oldPrice?: number | string;
  sale?: string;
  views?: string;
  slug?: string;
}

interface VideoProductCardProps {
  product: VideoProduct;
}

export default function VideoProductCard({ product }: VideoProductCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current && !videoError && videoLoaded) {
        try {
          videoRef.current.muted = true;
          await videoRef.current.play();
        } catch {
          // Autoplay blocked by browser — silent fail
        }
      }
    };
    if (videoLoaded) playVideo();
  }, [videoError, videoLoaded, product.video]);

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to product details page
    const slug = product.slug ?? product.nameEn.toLowerCase().replace(/\s+/g, '-');
    router.push(`/products/${slug}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-full rounded-[18px] border border-gray-300 overflow-hidden flex flex-col bg-white hover:shadow-lg hover:border-[#197B33] transition-all duration-300 cursor-pointer h-[clamp(267px,27vw,427px)]"
    >
      {/* Video section */}
      <div className="relative w-full flex-1 overflow-hidden bg-black rounded-t-[18px]">
        {!videoError ? (
          <video
            ref={videoRef}
            src={product.video}
            className="w-full h-full object-cover"
            loop muted autoPlay playsInline
            poster={product.topImage}
            onError={() => setVideoError(true)}
            onLoadedData={() => setVideoLoaded(true)}
            onCanPlay={() => setVideoLoaded(true)}
            disablePictureInPicture
            disableRemotePlayback
            preload="auto"
          />
        ) : (
          <div className="relative w-full h-full">
            <Image src={product.topImage} alt={product.nameEn} fill className="object-cover" sizes="(max-width: 1280px) 25vw, 20vw" />
          </div>
        )}

        {!videoLoaded && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
            <div className="text-white text-xs">Loading...</div>
          </div>
        )}

        {product.views && (
          <div className="absolute bottom-2 left-2 rounded-[5px] px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm bg-black/30 text-white">
            {product.views} Views
          </div>
        )}
      </div>

      {/* Info strip */}
      <div className="flex p-2 gap-2 flex-shrink-0">
        <div className="flex flex-col items-start gap-1 flex-shrink-0">
          <div className="relative w-[44px] h-[40px] rounded-[4px] overflow-hidden">
            <Image src={product.productImage} alt={product.nameEn} fill className="object-cover" sizes="44px" />
          </div>
          {product.sale && (
            <div className="text-[9px] font-medium text-center text-black px-1 py-0.5 rounded bg-white border border-gray-300 leading-tight">
              {product.sale}
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center gap-0.5 min-w-0">
          <p className="text-[11px] font-medium truncate text-gray-900">{product.nameEn}</p>
          <p className="text-[11px] font-medium truncate text-gray-500">{product.nameUr}</p>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span className="text-xs font-semibold leading-tight">PKR {product.price}</span>
            {product.oldPrice && (
              <span className="text-[10px] text-gray-400 line-through">PKR {product.oldPrice}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
