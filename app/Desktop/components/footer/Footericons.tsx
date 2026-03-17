import { FaTruck, FaMapMarkerAlt, FaShieldAlt, FaClock, FaLeaf } from 'react-icons/fa';

interface FooterIconsProps { buttonColor: string; textStyle: React.CSSProperties; }

const iconData = [
  { icon: FaTruck,          title: "Free Shipping",   description: "On orders above ₹499"  },
  { icon: FaMapMarkerAlt,   title: "11000+ Pincodes", description: "Nationwide Delivery"    },
  { icon: FaShieldAlt,      title: "100% Authentic",  description: "Certified Products"     },
  { icon: FaClock,          title: "Quick Delivery",  description: "2-4 Business Days"      },
  { icon: FaLeaf,           title: "Eco-Friendly",    description: "Sustainable Packaging"  },
];

export default function FooterIcons({ buttonColor, textStyle }: FooterIconsProps) {
  return (
    <div className="w-full me-bgcolor-g py-4 sm:py-5 lg:py-6 px-4 sm:px-8 lg:px-[20%]">
      <div className="grid grid-cols-5 gap-2 lg:gap-4">
        {iconData.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex flex-col items-center text-center group cursor-pointer">
              <div className="mb-1.5 p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-all">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h4 className="text-white font-semibold leading-tight"
                style={{ fontFamily: 'Poppins', fontSize: 'clamp(9px, 1.2vw, 13px)', letterSpacing: '0.2px' }}>
                {item.title}
              </h4>
              <p className="text-white/75 leading-tight mt-0.5"
                style={{ fontFamily: 'Poppins', fontSize: 'clamp(8px, 1vw, 11px)', lineHeight: '1.3' }}>
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}