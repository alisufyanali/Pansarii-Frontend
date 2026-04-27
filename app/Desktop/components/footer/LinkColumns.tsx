import Link from 'next/link';

const linkGroups = [
  {
    title: 'Quick Links',
    links: [
      { name: 'About Us',    url: '/aboutus'     },
      { name: 'Our Story',   url: '/our-story'   },
      { name: 'Ingredients', url: '/ingredients' },
      { name: 'Blog',        url: '/blog'        },
      { name: 'Careers',     url: '/careers'     },
    ],
  },
  {
    title: 'Shop',
    links: [
      { name: 'Skincare',     url: '/beauty-corner'    },
      { name: 'Haircare',     url: '/shop?category=Herb' },
      { name: 'Oils',         url: '/Oils'             },
      { name: 'Supplements',  url: '/shop?category=Supplements' },
      { name: 'Best Sellers', url: '/shop'             },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { name: 'Track Order',   url: '/track-order'   },
      { name: 'Returns',       url: '/returns'       },
      { name: 'Shipping Info', url: '/shipping-info' },
      { name: 'FAQs',          url: '/faqs'          },
      { name: 'Contact Us',    url: '/contact'       },
    ],
  },
];

export default function LinkColumns() {
  return (
    <div className="grid grid-cols-3 gap-6 font-poppins">
      {linkGroups.map(group => (
        <div key={group.title}>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-green-700 mb-3">
            {group.title}
          </h4>
          <ul className="space-y-2">
            {group.links.map(link => (
              <li key={link.name}>
                <Link
                  href={link.url}
                  className="text-[13px] text-gray-500 hover:text-green-700 transition-colors duration-200 leading-snug"
                >
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
