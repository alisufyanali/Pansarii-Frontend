// FooterIcons.tsx
import { FaTruck, FaMapMarkerAlt, FaShieldAlt, FaClock, FaLeaf } from 'react-icons/fa';

interface FooterIconsProps {
  buttonColor: string;
  textStyle: React.CSSProperties;
}

const iconData = [
  {
    icon: <FaTruck className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: "Free Shipping",
    description: "On orders above ₹499"
  },
  {
    icon: <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: "11000+ Pincodes",
    description: "Nationwide Delivery"
  },
  {
    icon: <FaShieldAlt className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: "100% Authentic",
    description: "Certified Products"
  },
  {
    icon: <FaClock className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: "Quick Delivery",
    description: "2-4 Business Days"
  },
  {
    icon: <FaLeaf className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: "Eco-Friendly",
    description: "Sustainable Packaging"
  }
];

export default function FooterIcons({ buttonColor, textStyle }: FooterIconsProps) {
  return (
    <div className="w-full me-bgcolor-g py-3 sm:py-4 md:py-6 lg:py-8 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-[1920px] mx-auto">
        {/* Single row with flex - no scroll, smaller items */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {iconData.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center group min-w-[65px] sm:min-w-[80px] md:min-w-[100px] lg:min-w-[120px]"
            >
              {/* Icon Container */}
              <div 
                className="mb-1 p-1.5 sm:p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300"
                style={{ color: buttonColor }}
              >
                {item.icon}
              </div>
              
              {/* Title */}
              <h4 
                className="text-white font-semibold text-[9px] sm:text-[10px] md:text-xs lg:text-sm mb-0.5 whitespace-nowrap"
                style={{ 
                  fontFamily: 'Poppins',
                  letterSpacing: '0.2px'
                }}
              >
                {item.title}
              </h4>
              
              {/* Description */}
              <p 
                className="text-white/80 text-[7px] sm:text-[8px] md:text-[10px] lg:text-xs whitespace-nowrap"
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