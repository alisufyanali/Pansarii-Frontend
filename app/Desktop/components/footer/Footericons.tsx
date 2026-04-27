import { FaTruck, FaMapMarkerAlt, FaShieldAlt, FaClock, FaLeaf } from 'react-icons/fa';

const iconData = [
  { icon: FaTruck,        title: 'Free Shipping',   description: 'On orders above PKR 999' },
  { icon: FaMapMarkerAlt, title: 'Nationwide',       description: 'Delivery Across Pakistan' },
  { icon: FaShieldAlt,    title: '100% Authentic',  description: 'Certified Products'       },
  { icon: FaClock,        title: 'Quick Delivery',  description: '2–4 Business Days'        },
  { icon: FaLeaf,         title: 'Eco-Friendly',    description: 'Sustainable Packaging'    },
];

export default function FooterIcons() {
  return (
    <div className="w-full me-bgcolor-g py-5 lg:py-6 px-[4%] font-poppins">
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {iconData.map(({ icon: Icon, title, description }, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              {/* Icon circle */}
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/15 group-hover:bg-white/25 transition-all flex items-center justify-center mb-2">
                <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>

              {/* Text */}
              <p className="text-white font-semibold text-xs lg:text-sm leading-tight">
                {title}
              </p>
              <p className="text-white/70 text-[11px] lg:text-xs leading-tight mt-0.5">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
