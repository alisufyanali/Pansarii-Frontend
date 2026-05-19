import Link from 'next/link';

const linkGroups = [
  {
    title: 'Quick Links',
    links: [
      { name: 'About Us',    url: '/aboutus'     },
      { name: 'Our Story',   url: '/our-story'   },
      { name: 'Blog',        url: '/blog'        },
    ],
  },
  {
    title: 'Shop',
    links: [
      { name: 'Skincare',     url: '/beauty-corner'             },
      { name: 'Haircare',     url: '/shop?category=Herb'        },
      { name: 'Oils',         url: '/oils'                      },
      { name: 'Supplements',  url: '/shop?category=Supplements' },
      { name: 'Best Sellers', url: '/shop'                      },
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
    <div className="grid grid-cols-3 gap-8">
      {linkGroups.map(group => (
        <div key={group.title}>
          {/* Column heading — matches design: bold, black */}
          <h4 className="text-sm font-bold text-gray-900 mb-3">
            {group.title}
          </h4>
          <ul className="space-y-2">
            {group.links.map(link => (
              <li key={link.name}>
                <Link
                  href={link.url}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors leading-snug"
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
