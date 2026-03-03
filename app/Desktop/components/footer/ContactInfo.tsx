// ContactInfo.tsx
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';

interface SocialMediaItem {
  name: string;
  icon: React.ReactNode;
  url: string;
}

interface ContactInfoProps {
  textStyle: React.CSSProperties;
  buttonColor: string;
  email?: string;
  phone?: string;
  socialMedia?: SocialMediaItem[];
  logoUrl?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  showContactInfo?: boolean;
  showSocialMedia?: boolean;
}

const defaultSocialMedia: SocialMediaItem[] = [
  { 
    name: 'Facebook', 
    icon: <FaFacebook className="w-4 h-4 sm:w-5 sm:h-5" />,
    url: 'https://facebook.com'
  },
  { 
    name: 'Twitter', 
    icon: <FaTwitter className="w-4 h-4 sm:w-5 sm:h-5" />,
    url: 'https://twitter.com'
  },
  { 
    name: 'YouTube', 
    icon: <FaYoutube className="w-4 h-4 sm:w-5 sm:h-5" />,
    url: 'https://youtube.com'
  },
  { 
    name: 'Instagram', 
    icon: <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5" />,
    url: 'https://instagram.com'
  }
];

export default function ContactInfo({ 
  textStyle, 
  buttonColor, 
  email = 'pansariinn@gmail.com',
  phone = '+923045779900',
  socialMedia = defaultSocialMedia,
  logoUrl = '/images/logo.png',
  logoAlt = 'Pansari Inn Logo',
  logoWidth = 140,
  logoHeight = 45,
  showContactInfo = true,
  showSocialMedia = true
}: ContactInfoProps) {
  
  return (
    <div className="flex flex-col items-start w-full">
      {/* Responsive Logo */}
      <div className="relative w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] h-auto mb-3 sm:mb-4">
        <Image 
          src={logoUrl} 
          alt={logoAlt} 
          width={logoWidth}
          height={logoHeight}
          className="w-full h-auto object-contain"
          priority
        />
      </div>
      
      {/* Contact Info */}
      {showContactInfo && (
        <div className="space-y-2 sm:space-y-3">
          <p style={{ ...textStyle, fontSize: 'clamp(11px, 2vw, 14px)' }} className="hover:opacity-80 transition-opacity">
            <a 
              href={`mailto:${email}`} 
              style={{ color: buttonColor }}
              className="break-all hover:underline"
            >
              {email}
            </a>
          </p>
          <p style={{ ...textStyle, fontSize: 'clamp(11px, 2vw, 14px)' }} className="hover:opacity-80 transition-opacity">
            <a 
              href={`tel:${phone}`} 
              style={{ color: buttonColor }}
              className="hover:underline"
            >
              {phone}
            </a>
          </p>
        </div>
      )}
      
      {/* Social Media Icons */}
      {showSocialMedia && (
        <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-5">
          {socialMedia.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: buttonColor }}
              className="hover:opacity-80 transition-all duration-300 hover:scale-110"
              aria-label={platform.name}
            >
              {platform.icon}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}