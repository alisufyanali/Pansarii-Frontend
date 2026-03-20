import Link from 'next/link';

interface LinkColumnsProps { textStyle: React.CSSProperties; buttonColor: string; }

const linkGroups = [
  {
    title: 'Quick Links',
    links: [
      { name: 'About Us',    url: '/about'       },
      { name: 'Our Story',   url: '/story'       },
      { name: 'Ingredients', url: '/ingredients' },
      { name: 'Blog',        url: '/blog'        },
      { name: 'Careers',     url: '/careers'     },
    ],
  },
  {
    title: 'Shop',
    links: [
      { name: 'Skincare',     url: '/shop/skincare'     },
      { name: 'Haircare',     url: '/shop/haircare'     },
      { name: 'Oils',         url: '/shop/oils'         },
      { name: 'Supplements',  url: '/shop/supplements'  },
      { name: 'Best Sellers', url: '/shop/best-sellers' },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { name: 'Track Order',   url: '/track-order' },
      { name: 'Returns',       url: '/returns'     },
      { name: 'Shipping Info', url: '/shipping'    },
      { name: 'FAQs',          url: '/faqs'        },
    ],
  },
];

export default function LinkColumns({ textStyle, buttonColor }: LinkColumnsProps) {
  return (
    <div className="grid grid-cols-3 gap-6 w-full">
      {linkGroups.map(group => (
        <div key={group.title}>
          <h4 className="font-semibold mb-2.5 uppercase tracking-wider"
            style={{ fontFamily: 'Poppins', fontSize: '11px', color: buttonColor }}>
            {group.title}
          </h4>
          <ul className="space-y-1.5">
            {group.links.map(link => (
              <li key={link.name}>
                <Link href={link.url}
                  className="hover:text-[#197B33] transition-colors duration-200"
                  style={{ fontFamily: 'Poppins', fontSize: '11px', lineHeight: '1.5', color: '#6B7280' }}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}