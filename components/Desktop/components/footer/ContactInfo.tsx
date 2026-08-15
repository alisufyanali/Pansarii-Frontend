import Image from 'next/image';
import { FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SOCIAL_LINKS } from '@/lib/social-links';

const socialLinks = [
  { name: 'Facebook',  Icon: FaFacebook,  url: SOCIAL_LINKS.facebook  },
  { name: 'X',         Icon: FaXTwitter,  url: SOCIAL_LINKS.twitter   },
  { name: 'YouTube',   Icon: FaYoutube,   url: SOCIAL_LINKS.youtube   },
  { name: 'Instagram', Icon: FaInstagram, url: SOCIAL_LINKS.instagram },
];

export default function ContactInfo() {
  return (
    <div className="flex flex-col items-start gap-4">

      {/* Logo */}
      <Image
        src="/images/logo.png"
        alt="Pansari Inn Logo"
        width={130}
        height={44}
        className="object-contain"
        priority
      />

      {/* Contact — inline label + value, matching design */}
      <div className="space-y-1.5 text-sm text-gray-700">
        <p>
          <span className="font-medium text-gray-900">Email: </span>
          <a href="mailto:pansariinn@gmail.com" className="text-gray-700 hover:text-green-700 transition-colors">
            pansariinn@gmail.com
          </a>
        </p>
        <p>
          <span className="font-medium text-gray-900">Phone: </span>
          <a href="tel:+923045779900" className="text-gray-700 hover:text-green-700 transition-colors">
            0304 577 9900
          </a>
        </p>
      </div>

      {/* Social icons */}
      <div>
        <p className="text-sm text-gray-700 font-medium mb-2">Follow Our Social Media!</p>
        <div className="flex items-center gap-2.5">
          {socialLinks.map(({ name, Icon, url }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-all"
            >
              <Icon className="w-3.5 h-3.5" />
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
