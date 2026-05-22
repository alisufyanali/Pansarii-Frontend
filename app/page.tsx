"use client";

import { useDeviceDetection } from './utils/screen-detection';
import DesktopHome from "@/components/Desktop/DesktopHome";
import MobileHome from "@/components/Mobile/MobileHome";
import './globals.css';

export default function Page() {
  const { isMobile } = useDeviceDetection();
  
  return isMobile ? <MobileHome /> : <DesktopHome />;
}
