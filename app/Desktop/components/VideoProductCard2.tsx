"use client";

import React, { useRef, useEffect, useState } from 'react';
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

    if (videoLoaded) {
      playVideo();
    }
  }, [videoError, videoLoaded, product.video]);

  const handleVideoError = () => {
    setVideoError(true);
  };

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  return (
    <div className="relative w-full aspect-[274/323] rounded-[18px] border border-gray-300 overflow-hidden bg-black">
      
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

      {/* Views badge bottom-left */}
      {product.views && (
        <div className="absolute bottom-2 left-2 rounded-[5px] px-2 py-1 text-xs font-medium backdrop-blur-sm bg-white/20 text-white">
          {product.views} Views
        </div>
      )}

      {/* Bottom-right icons: Share & Heart */}
      <div className="absolute bottom-2 right-2 flex gap-2">
        <button 
          className="p-1.5 rounded bg-white/20 text-white hover:bg-white/30 transition-colors active:scale-95"
          aria-label="Share"
        >
          <FaShareAlt className="w-3.5 h-3.5" />
        </button>
        <button 
          className="p-1.5 rounded bg-white/20 text-white hover:bg-white/30 transition-colors active:scale-95"
          aria-label="Add to favorites"
        >
          <FaHeart className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}