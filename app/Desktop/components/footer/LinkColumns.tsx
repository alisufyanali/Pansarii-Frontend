interface LinkColumnsProps {
  textStyle: React.CSSProperties;
  buttonColor: string;
}

const linkGroups = [
  {
    title: 'Quick Links',
    links: [
      { name: 'About Us', url: '/about' },
      { name: 'Our Story', url: '/story' },
      { name: 'Ingredients', url: '/ingredients' },
      { name: 'Blog', url: '/blog' },
      { name: 'Careers', url: '/careers' }
    ]
  },
  {
    title: 'Shop',
    links: [
      { name: 'Skincare', url: '/shop/skincare' },
      { name: 'Haircare', url: '/shop/haircare' },
      { name: 'Oils', url: '/shop/oils' },
      { name: 'Supplements', url: '/shop/supplements' },
      { name: 'Best Sellers', url: '/shop/best-sellers' }
    ]
  },
  {
    title: 'Customer Service',
    links: [
      { name: 'Track Order', url: '/track-order' },
      { name: 'Returns', url: '/returns' },
      { name: 'Shipping Info', url: '/shipping' },
      { name: 'FAQs', url: '/faqs' }
    ]
  }
];

export default function LinkColumns({ textStyle, buttonColor }: LinkColumnsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-4 lg:gap-8 w-full">
      {linkGroups.map((group) => (
        <div key={group.title} className="min-w-0">
          <h4 
            className="font-bold mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg"
            style={{ 
              fontFamily: 'Poppins',
              letterSpacing: '0.4px',
              textTransform: 'uppercase',
              color: buttonColor
            }}
          >
            {group.title}
          </h4>
          <ul className="space-y-2 sm:space-y-3">
            {group.links.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.url}
                  style={{ 
                    ...textStyle, 
                    fontSize: 'clamp(12px, 2vw, 14px)',
                    lineHeight: '1.5'
                  }} 
                  className="hover:text-[#197B33] transition-colors duration-200 inline-block"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}