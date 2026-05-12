import { FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

interface FooterBannerProps {
  className?: string;
}

const FooterBanner = ({ className = '' }: FooterBannerProps) => {
  return (
    <div className={`relative w-full min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px] xl:min-h-[500px] 2xl:min-h-[550px] flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/whisk.png)',
        }}
      />
      <div className="absolute inset-0 bg-black/50" /> {/* Overlay for better text readability */}
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center">
        <div className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl font-light mb-2 sm:mb-3">
          Expert Herbal Guidance, Naturally
        </div>
        
        <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight mb-3 sm:mb-4">
          Discover trusted Ayurvedic and herbal solutions
        </h2>
        
        <p className="text-white/80 text-xs sm:text-sm md:text-base lg:text-lg max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-10 px-2">
          Discover trusted Ayurvedic and herbal solutions carefully crafted to support your health and wellness. 
          Each product is made using time-tested ingredients and expert knowledge.
        </p>
        
        {/* Shop Now Button */}
        <Link href="/shop" passHref>
          <button
            className="group me-bgcolor-y flex items-center justify-center gap-2 sm:gap-3 md:gap-4 
                     font-bold text-white uppercase tracking-wide mx-auto
                     hover:opacity-90 transition-all duration-300 transform hover:scale-105
                     text-xs sm:text-sm md:text-base"
            style={{
              width: 'clamp(140px, 20vw, 175px)',
              height: 'clamp(45px, 6vw, 59px)',
              padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 24px)',
              borderRadius: '50px',
              border: 'none',
              outline: 'none'
            }}
            aria-label="Shop Now"
          >
            <span>Shop Now</span>
            <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FooterBanner;