'use client';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface SafeImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string | null | undefined;
  fallbackSrc?: string;
}

export default function SafeImage({ 
  src, 
  fallbackSrc = '/images/product.png', 
  alt, 
  ...props 
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  
  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}
