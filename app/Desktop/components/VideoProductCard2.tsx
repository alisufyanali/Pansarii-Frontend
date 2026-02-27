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
    <div className="relative w-full max-w-[274px] sm:w-[250px] md:w-[274px] 
                    h-[250px] sm:h-[280px] md:h-[323px] 
                    rounded-[14px] sm:rounded-[16px] md:rounded-[18px] 
                    border border-gray-300 overflow-hidden bg-black
                    mx-auto">
      
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
        <div className="absolute bottom-2 left-2 rounded-[4px] sm:rounded-[5px] 
                       px-1.5 sm:px-2 py-0.5 sm:py-1 
                       text-[10px] sm:text-xs font-medium 
                       flex items-center justify-center 
                       backdrop-blur-sm bg-white/20 text-white">
          {product.views} Views
        </div>
      )}

      {/* Bottom-right icons: Share & Heart */}
      <div className="absolute bottom-2 right-2 flex gap-1.5 sm:gap-2">
        <button 
          className="p-1 sm:p-1.5 rounded bg-white/20 text-white 
                    hover:bg-white/30 transition-colors 
                    active:scale-95"
          aria-label="Share"
        >
          <FaShareAlt className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
        <button 
          className="p-1 sm:p-1.5 rounded bg-white/20 text-white 
                    hover:bg-white/30 transition-colors 
                    active:scale-95"
          aria-label="Add to favorites"
        >
          <FaHeart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
    </div>
  );
}