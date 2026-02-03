// app/components/DeviceDetector.tsx
"use client";

import { useEffect, useState } from 'react';
import DesktopLayout from '../Desktop/Layout';
import MobileLayout from '../Mobile/layout';

export default function DeviceDetector({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i;
      const isMobileDevice = mobileRegex.test(userAgent);
      
      // Additional check for screen width
      const isSmallScreen = window.innerWidth <= 768;
      
      setIsMobile(isMobileDevice || isSmallScreen);
      setIsLoading(false);
    };

    checkDevice();
    
    // Add resize listener for responsive changes
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (isLoading) {
    // Optional: Show a loading skeleton or default to desktop
    return <DesktopLayout>{children}</DesktopLayout>;
  }

  return isMobile ? (
    <MobileLayout>{children}</MobileLayout>
  ) : (
    <DesktopLayout>{children}</DesktopLayout>
  );
}