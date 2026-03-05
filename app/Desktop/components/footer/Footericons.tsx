import { FaTruck, FaMapMarkerAlt, FaShieldAlt, FaClock, FaLeaf } from 'react-icons/fa';

interface FooterIconsProps {
  buttonColor: string;
  textStyle: React.CSSProperties;
}

const iconData = [
  {
    icon: FaTruck,
    title: "Free Shipping",
    description: "On orders above ₹499"
  },
  {
    icon: FaMapMarkerAlt,
    title: "11000+ Pincodes",
    description: "Nationwide Delivery"
  },
  {
    icon: FaShieldAlt,
    title: "100% Authentic",
    description: "Certified Products"
  },
  {
    icon: FaClock,
    title: "Quick Delivery",
    description: "2-4 Business Days"
  },
  {
    icon: FaLeaf,
    title: "Eco-Friendly",
    description: "Sustainable Packaging"
  }
];

export default function FooterIcons({ buttonColor, textStyle }: FooterIconsProps) {
  return (
    <div className="w-full me-bgcolor-g py-4 sm:py-6 md:py-8 lg:py-12 px-2 sm:px-4 md:px-6 lg:px-12">
      <div className="max-w-[1920px] mx-auto">
        {/* ALWAYS 5 columns - scales content instead of wrapping */}
        <div className="grid grid-cols-5 gap-1 sm:gap-2 md:gap-4 lg:gap-6 xl:gap-8">
          {iconData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={index} 
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                {/* Icon - Responsive sizing */}
                <div 
                  className="mb-1 sm:mb-2 md:mb-3 p-1.5 sm:p-2 md:p-3 lg:p-4 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300"
                  style={{ color: 'white' }}
                >
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />
                </div>
                
                {/* Title - Scales from 8px to 16px */}
                <h4 
                  className="text-white font-semibold mb-0.5 sm:mb-1 leading-tight"
                  style={{ 
                    fontFamily: 'Poppins',
                    letterSpacing: '0.3px',
                    fontSize: 'clamp(8px, 1.5vw, 16px)'
                  }}
                >
                  {item.title}
                </h4>
                
                {/* Description - Scales from 7px to 14px */}
                <p 
                  className="text-white/80 leading-tight"
                  style={{ 
                    fontFamily: 'Poppins',
                    lineHeight: '1.3',
                    fontSize: 'clamp(7px, 1.2vw, 14px)'
                  }}
                >
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}