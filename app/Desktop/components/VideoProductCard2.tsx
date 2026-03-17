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
    router.push(`/product/${slug}`);
  };

  const handleIconClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-full rounded-[18px] border border-gray-300 overflow-hidden flex flex-col bg-white hover:shadow-lg hover:border-[#197B33] transition-all duration-300 cursor-pointer"
      style={{ height: '50vh', minHeight: '280px', maxHeight: '420px' }}
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

        {/* Share + Heart icons */}
        <div className="absolute bottom-2 right-2 flex gap-1.5">
          <button onClick={handleIconClick}
            className="p-1.5 rounded bg-white/20 text-white hover:bg-white/30 transition-colors active:scale-95"
            aria-label="Share">
            <FaShareAlt className="w-3 h-3" />
          </button>
          <button onClick={handleIconClick}
            className="p-1.5 rounded bg-white/20 text-white hover:bg-white/30 transition-colors active:scale-95"
            aria-label="Add to favourites">
            <FaHeart className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Info strip — fixed height, same as VideoProductCard */}
      {(product.nameEn || product.price) && (
        <div className="flex p-2 gap-2 flex-shrink-0">
          {product.productImage && (
            <div className="flex flex-col items-start gap-1 flex-shrink-0">
              <img src={product.productImage} alt={product.nameEn || 'Product'}
                className="w-[44px] h-[40px] rounded-[4px] object-cover" />
              {product.sale && (
                <div className="text-[9px] font-medium text-center text-black px-1 py-0.5 rounded bg-white border border-gray-300 leading-tight">
                  {product.sale}
                </div>
              )}
            </div>
          )}
          <div className="flex-1 flex flex-col justify-center gap-0.5 min-w-0">
            {product.nameEn && <p className="text-[11px] font-medium truncate text-gray-900">{product.nameEn}</p>}
            {product.nameUr && <p className="text-[11px] font-medium truncate text-gray-500">{product.nameUr}</p>}
            {product.price && (
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span className="text-xs font-semibold leading-tight">PKR {product.price}</span>
                {product.oldPrice && (
                  <span className="text-[10px] text-gray-400 line-through">PKR {product.oldPrice}</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}