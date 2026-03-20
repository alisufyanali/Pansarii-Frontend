// app/utils/deviceManager.tsx
"use client";

import { useEffect, useState, ReactNode } from 'react';
import DesktopLayout from '../Desktop/Layout';
import MobileLayout from '../Mobile/layout';

// ============================================
// TYPES
// ============================================

export type DeviceType = 'mobile' | 'desktop';

interface DeviceDetectionResult {
  isMobile: boolean;
  isDesktop: boolean;
  deviceType: DeviceType;
  isLoading: boolean;
}

interface DeviceManagerProps {
  children: ReactNode;
}

interface ConditionalRenderProps {
  mobile?: ReactNode;
  desktop?: ReactNode;
  children?: ReactNode;
}

// ============================================
// DEVICE DETECTION LOGIC
// ============================================

/**
 * Check if device is mobile based on User-Agent and screen width
 */
function detectDevice(): boolean {
  if (typeof window === 'undefined') return false;

  // Check User-Agent
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i;
  const isMobileAgent = mobileRegex.test(userAgent);

  // Check screen width
  const isSmallScreen = window.innerWidth <= 768;

  // Device is mobile if either condition is true
  return isMobileAgent || isSmallScreen;
}

// ============================================
// REACT HOOK
// ============================================

/**
 * Hook to detect device type with loading state
 * 
 * @returns {DeviceDetectionResult} Device information and loading state
 * 
 * @example
 * const { isMobile, isLoading } = useDeviceDetection();
 * if (isLoading) return <Spinner />;
 * return isMobile ? <MobileView /> : <DesktopView />;
 */
export function useDeviceDetection(): DeviceDetectionResult {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = detectDevice();
      setIsMobile(mobile);
      setIsLoading(false);
    };

    // Initial check
    checkDevice();

    // Listen for resize events
    window.addEventListener('resize', checkDevice);

    // Cleanup
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return {
    isMobile,
    isDesktop: !isMobile,
    deviceType: isMobile ? 'mobile' : 'desktop',
    isLoading,
  };
}

// ============================================
// LAYOUT WRAPPER COMPONENT
// ============================================

/**
 * Main component that wraps children with appropriate layout
 * Automatically detects device and applies Desktop or Mobile layout
 * 
 * @param {ReactNode} children - Content to wrap
 * 
 * @example
 * // In layout.tsx
 * <DeviceManager>{children}</DeviceManager>
 */
export function DeviceManager({ children }: DeviceManagerProps) {
  const { isMobile, isLoading } = useDeviceDetection();

  // Don't render anything while loading to prevent layout flash
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return isMobile ? (
    <MobileLayout>{children}</MobileLayout>
  ) : (
    <DesktopLayout>{children}</DesktopLayout>
  );
}

// ============================================
// CONDITIONAL RENDER HELPER
// ============================================

/**
 * Component to conditionally render mobile or desktop content
 * 
 * @param {ReactNode} mobile - Content to show on mobile
 * @param {ReactNode} desktop - Content to show on desktop
 * @param {ReactNode} children - Fallback content (shown on both if no specific content)
 * 
 * @example
 * <DeviceContent 
 *   mobile={<MobileHomepage />} 
 *   desktop={<DesktopHomepage />} 
 * />
 */
export function DeviceContent({ mobile, desktop, children }: ConditionalRenderProps) {
  const { isMobile, isLoading } = useDeviceDetection();

  if (isLoading) return null; // Don't render during loading

  if (isMobile && mobile) return <>{mobile}</>;
  if (!isMobile && desktop) return <>{desktop}</>;
  return <>{children}</>;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get current device type (use in client components only)
 * @returns {DeviceType} 'mobile' or 'desktop'
 */
export function getDeviceType(): DeviceType {
  return detectDevice() ? 'mobile' : 'desktop';
}

/**
 * Check if current device is mobile (use in client components only)
 * @returns {boolean} true if mobile
 */
export function isMobileDevice(): boolean {
  return detectDevice();
}

/**
 * Check if current device is desktop (use in client components only)
 * @returns {boolean} true if desktop
 */
export function isDesktopDevice(): boolean {
  return !detectDevice();
}

// ============================================
// LOADING COMPONENT
// ============================================

/**
 * Reusable loading spinner component
 */
export function DeviceLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    </div>
  );
}

// ============================================
// DEFAULT EXPORT
// ============================================

export default DeviceManager;