"use client";

import { useDeviceDetection } from './utils/screen-detection';
import DesktopHome from "./home/desktop/page";
import MobileHome from "./home/mobile/page";

export default function Page() {
  const { isMobile, isLoading } = useDeviceDetection();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }
  
  return isMobile ? <MobileHome /> : <DesktopHome />;
}