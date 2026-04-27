import Image from 'next/image';
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';

const socialLinks = [
  { name: 'Facebook',  Icon: FaFacebook,  url: 'https://facebook.com/pansariin.pk'  },
  { name: 'Twitter',   Icon: FaTwitter,   url: 'https://twitter.com/pansariin'      },
  { name: 'YouTube',   Icon: FaYoutube,   url: 'https://youtube.com/pansariin'      },
  { name: 'Instagram', Icon: FaInstagram, url: 'https://instagram.com/pansariin.pk' },
];

export default function ContactInfo() {
  return (
    <div className="flex flex-col items-start gap-3 font-poppins">

      {/* Logo */}
      <Image
        src="/images/logo.png"
        alt="Pansari Inn Logo"
        width={120}
        height={40}
        className="object-contain"
        priority
      />

      {/* Contact */}
      <div className="space-y-1">
        <p className="text-xs text-gray-500">Email:</p>
        <a
          href="mailto:pansariinn@gmail.com"
          className="text-[13px] text-green-700 hover:underline break-all"
        >
          pansariinn@gmail.com
        </a>

        <p className="text-xs text-gray-500 mt-1.5">Phone:</p>
        <a
          href="tel:+923045779900"
          className="text-[13px] text-green-700 hover:underline"
        >
          +92 304 577 9900
        </a>
      </div>

      {/* Social icons */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Follow Our Social Media!</p>
        <div className="flex items-center gap-3">
          {socialLinks.map(({ name, Icon, url }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-green-700 hover:text-green-700 transition-all"
            >
              <Icon className="w-3.5 h-3.5" />
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
