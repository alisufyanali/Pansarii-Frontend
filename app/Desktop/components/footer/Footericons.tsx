// FooterIcons.tsx
import { FaTruck, FaMapMarkerAlt, FaShieldAlt, FaClock, FaLeaf } from 'react-icons/fa';

interface FooterIconsProps {
  buttonColor: string;
  textStyle: React.CSSProperties;
}

const iconData = [
  {
    icon: <FaTruck className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />,
    title: "Free Shipping",
    description: "On orders above ₹499"
  },
  {
    icon: <FaMapMarkerAlt className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />,
    title: "11000+ Pincodes",
    description: "Nationwide Delivery"
  },
  {
    icon: <FaShieldAlt className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />,
    title: "100% Authentic",
    description: "Certified Products"
  },
  {
    icon: <FaClock className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />,
    title: "Quick Delivery",
    description: "2-4 Business Days"
  },
  {
    icon: <FaLeaf className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />,
    title: "Eco-Friendly",
    description: "Sustainable Packaging"
  }
];

export default function FooterIcons({ buttonColor, textStyle }: FooterIconsProps) {
  return (
    <div className="w-full me-bgcolor-g py-4 sm:py-6 md:py-8 lg:py-10 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-[1920px] mx-auto">
        {/* Single row with flexbox - horizontal scroll on very small screens if needed */}
        <div className="flex flex-nowrap items-center justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-8 overflow-x-auto pb-2 scrollbar-hide">
          {iconData.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center group cursor-pointer min-w-[100px] sm:min-w-[120px] md:min-w-[140px] flex-shrink-0"
            >
              {/* Icon Container */}
              <div 
                className="mb-1 sm:mb-2 p-2 sm:p-3 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300"
                style={{ color: buttonColor }}
              >
                {item.icon}
              </div>
              
              {/* Title */}
              <h4 
                className="text-white font-semibold text-[10px] sm:text-xs md:text-sm lg:text-base mb-0.5 sm:mb-1"
                style={{ 
                  fontFamily: 'Poppins',
                  letterSpacing: '0.3px'
                }}
              >
                {item.title}
              </h4>
              
              {/* Description */}
              <p 
                className="text-white/80 text-[8px] sm:text-[10px] md:text-xs"
                style={{ 
                  fontFamily: 'Poppins',
                  lineHeight: '1.2'
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}