"use client";

import React, { useRef, useEffect, useState, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FaHeart, FaShareAlt } from 'react-icons/fa';

interface VideoProduct {
  video: string;
  topImage: string;
  productImage?: string;
  nameEn?: string;
  nameUr?: string;
  price?: number | string;
  oldPrice?: number | string;
  sale?: string;
  views?: string;
  [key: string]: any;
}

interface VideoProductCard2Props {
  product: VideoProduct;
}

export default function VideoProductCard2({ product }: VideoProductCard2Props) {
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
        } catch (error) {
          console.log('Autoplay prevented:', error);
        }
      }
    };
    if (videoLoaded) playVideo();
  }, [videoError, videoLoaded, product.video]);

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!product.nameEn) return;
    e.preventDefault();
    e.stopPropagation();
    const slug = product.nameEn.toLowerCase().replace(/\s+/g, '-');
    router.push(`/${slug}`);
  };

  const handleIconClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-full rounded-[18px] border border-gray-300 overflow-hidden flex flex-col bg-white hover:shadow-lg hover:border-[#197B33] transition-all duration-300 cursor-pointer"
      style={{ height: '42vh', minHeight: '280px', maxHeight: '420px' }}
    >
      {/* Video section — fills all space above info strip */}
      <div className="relative w-full flex-1 overflow-hidden bg-black rounded-t-[18px]">
        {!videoError ? (
          <video
            ref={videoRef}
            src={product.video}
            className="w-full h-full object-cover"
            loop muted autoPlay playsInline
            onError={() => setVideoError(true)}
            onLoadedData={() => setVideoLoaded(true)}
            onCanPlay={() => setVideoLoaded(true)}
            disablePictureInPicture
            disableRemotePlayback
            preload="auto"
          />
        ) : (
          <img src={product.topImage} alt="Product" className="w-full h-full object-cover" />
        )}

        {!videoLoaded && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
            <div className="text-white text-xs">Loading...</div>
          </div>
        )}

        {/* Views badge */}
        {product.views && (
          <div className="absolute bottom-2 left-2 rounded-[5px] px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm bg-black/30 text-white">
            {product.views} Views
          </div>
        )}

      
      </div>

     
    </div>
  );
}