"use client";

import React, { useRef, useEffect, useState } from 'react';

interface VideoProduct {
  video: string;
  topImage: string;
  productImage: string;
  nameEn: string;
  nameUr: string;
  price: number | string;
  oldPrice?: number | string;
  sale?: string;
  views?: string;
  [key: string]: any;
}

interface VideoProductCardProps {
  product: VideoProduct;
}

export default function VideoProductCard({ product }: VideoProductCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current && !videoError && videoLoaded) {
        try {
          console.log('Attempting to play video:', product.video);
          videoRef.current.muted = true;
          await videoRef.current.play();
          console.log('Video playback started');
        } catch (error) {
          console.log('Autoplay prevented:', error);
        }
      }
    };

    if (videoLoaded) {
      playVideo();
    }
  }, [videoError, videoLoaded, product.video]);

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video failed to load:', product.video, e);
    setVideoError(true);
  };

  const handleVideoLoaded = () => {
    console.log('Video loaded successfully:', product.video);
    setVideoLoaded(true);
  };

  return (
    <div className="w-full h-auto rounded-[18px] border border-gray-300 overflow-hidden flex flex-col bg-white hover:shadow-lg transition-shadow">
      
      {/* Top Section - VIDEO */}
      <div className="relative w-full aspect-[274/323] rounded-t-[18px] overflow-hidden bg-black">
        {/* Video Player */}
        {!videoError ? (
          <video
            ref={videoRef}
            src={product.video}
            className="w-full h-full object-cover"
            loop
            muted
            autoPlay
            playsInline
            onError={handleVideoError}
            onLoadedData={handleVideoLoaded}
            onCanPlay={handleVideoLoaded}
            disablePictureInPicture
            disableRemotePlayback
            preload="auto"
          />
        ) : (
          <img
            src={product.topImage}
            alt="Product"
            className="w-full h-full object-cover"
          />
        )}

        {/* Loading indicator */}
        {!videoLoaded && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="text-white text-xs md:text-sm">Loading...</div>
          </div>
        )}

        {/* Views badge bottom-left */}
        {product.views && (
          <div className="absolute bottom-2 left-2 rounded-[5px] px-2 py-1 text-[10px] md:text-xs font-medium backdrop-blur-sm bg-black/30 text-white">
            {product.views} Views
          </div>
        )}
      </div>

      {/* Lower Details Section */}
      <div className="flex p-2 md:p-3 gap-2 md:gap-3">
        {/* Left Side: Product thumbnail */}
        <div className="flex flex-col items-start gap-2 flex-shrink-0">
          <img
            src={product.productImage}
            alt={product.nameEn}
            className="w-[50px] h-[44px] md:w-[61px] md:h-[54px] rounded-[4px] object-cover"
          />
          {product.sale && (
            <div className="text-[10px] md:text-[11px] font-medium font-poppins leading-tight text-center text-black px-1 py-0.5 rounded bg-white border border-gray-300">
              {product.sale}
            </div>
          )}
        </div>

        {/* Right Side: Product info */}
        <div className="flex-1 flex flex-col justify-center gap-1 min-w-0">
          <p className="text-xs md:text-sm lg:text-base font-medium truncate">{product.nameEn}</p>
          <p className="text-xs md:text-sm lg:text-base font-medium truncate">{product.nameUr}</p>
          <div className="flex items-center gap-1 md:gap-2 mt-1 flex-wrap">
            <span className="text-sm md:text-base lg:text-lg 2xl:text-xl font-poppins font-semibold leading-tight">
              PKR {product.price}
            </span>
            {product.oldPrice && (
              <span className="text-xs md:text-sm text-gray-500 line-through">
                PKR {product.oldPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}