"use client";

import { useDeviceDetection } from './utils/screen-detection';
import DesktopHome from "./home/desktop/page";
import MobileHome from "./home/mobile/page";

export default function Page() {
  const { isMobile } = useDeviceDetection();
  

  
  return isMobile ? <MobileHome /> : <DesktopHome />;
}