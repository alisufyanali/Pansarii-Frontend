import { FaTruck, FaMapMarkerAlt, FaShieldAlt, FaClock, FaLeaf } from 'react-icons/fa';

interface FooterIconsProps {
  buttonColor: string;
  textStyle: React.CSSProperties;
}

const iconData = [
  {
    icon: <FaTruck className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10" />,
    title: "Free Shipping",
    description: "On orders above ₹499"
  },
  {
    icon: <FaMapMarkerAlt className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10" />,
    title: "11000+ Pincodes",
    description: "Nationwide Delivery"
  },
  {
    icon: <FaShieldAlt className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10" />,
    title: "100% Authentic",
    description: "Certified Products"
  },
  {
    icon: <FaClock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10" />,
    title: "Quick Delivery",
    description: "2-4 Business Days"
  },
  {
    icon: <FaLeaf className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10" />,
    title: "Eco-Friendly",
    description: "Sustainable Packaging"
  }
];

export default function FooterIcons({ buttonColor, textStyle }: FooterIconsProps) {
  return (
    <div className="w-full me-bgcolor-g py-6 sm:py-8 md:py-10 lg:py-12 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-[1920px] mx-auto">
        {/* Responsive Grid - Different columns for different screen sizes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
          {iconData.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              {/* Icon Container */}
              <div 
                className="mb-2 sm:mb-3 md:mb-4 p-3 sm:p-4 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300"
                style={{ color: buttonColor }}
              >
                {item.icon}
              </div>
              
              {/* Title */}
              <h4 
                className="text-white font-semibold text-xs sm:text-sm md:text-base lg:text-lg mb-1"
                style={{ 
                  fontFamily: 'Poppins',
                  letterSpacing: '0.3px'
                }}
              >
                {item.title}
              </h4>
              
              {/* Description */}
              <p 
                className="text-white/80 text-[10px] sm:text-xs md:text-sm"
                style={{ 
                  fontFamily: 'Poppins',
                  lineHeight: '1.4'
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