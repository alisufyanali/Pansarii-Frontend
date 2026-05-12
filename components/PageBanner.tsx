import { ReactNode } from 'react';

interface PageBannerProps {
  icon:        ReactNode;
  title:       string;
  subtitle?:   string;
  description?: string;
  children?:   ReactNode; // for extra content like search bar
}

/**
 * Shared page banner used across all informational pages.
 * Consistent height, typography, and spacing.
 */
export default function PageBanner({ icon, title, subtitle, description, children }: PageBannerProps) {
  return (
    <section className="bg-green-700 text-white py-10 sm:py-12">
      <div className="max-w-3xl mx-auto px-[4%] text-center">
        <div className="flex justify-center mb-4 text-white/80">
          {icon}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h1>
        {subtitle && (
          <p className="text-base text-green-100 mb-1">{subtitle}</p>
        )}
        {description && (
          <p className="text-sm text-green-200 max-w-xl mx-auto">{description}</p>
        )}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </section>
  );
}
