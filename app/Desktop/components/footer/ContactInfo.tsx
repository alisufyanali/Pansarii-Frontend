import Image from 'next/image';
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';

interface SocialMediaItem { name: string; icon: React.ReactNode; url: string; }
interface ContactInfoProps {
  textStyle: React.CSSProperties; buttonColor: string;
  email?: string; phone?: string;
  socialMedia?: SocialMediaItem[];
  logoUrl?: string; logoAlt?: string;
}

const defaultSocialMedia: SocialMediaItem[] = [
  { name: 'Facebook',  icon: <FaFacebook className="w-3.5 h-3.5" />,  url: 'https://facebook.com'  },
  { name: 'Twitter',   icon: <FaTwitter className="w-3.5 h-3.5" />,   url: 'https://twitter.com'   },
  { name: 'YouTube',   icon: <FaYoutube className="w-3.5 h-3.5" />,   url: 'https://youtube.com'   },
  { name: 'Instagram', icon: <FaInstagram className="w-3.5 h-3.5" />, url: 'https://instagram.com' },
];

export default function ContactInfo({
  textStyle, buttonColor,
  email = 'pansariinn@gmail.com',
  phone = '+923045779900',
  socialMedia = defaultSocialMedia,
  logoUrl = '/images/logo.png', logoAlt = 'Pansari Inn Logo',
}: ContactInfoProps) {
  return (
    <div className="flex flex-col items-start w-full">
      <div className="relative w-[110px] h-auto mb-3">
        <Image src={logoUrl} alt={logoAlt} width={110} height={36}
          className="w-full h-auto object-contain" priority />
      </div>
      <div className="space-y-1.5">
        <p><a href={`mailto:${email}`} style={{ ...textStyle, color: buttonColor, fontSize: '11px' }}
          className="hover:opacity-70 transition-opacity break-all">{email}</a></p>
        <p><a href={`tel:${phone}`} style={{ ...textStyle, color: buttonColor, fontSize: '11px' }}
          className="hover:opacity-70 transition-opacity">{phone}</a></p>
      </div>
      <div className="flex gap-3 mt-3">
        {socialMedia.map(p => (
          <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
            style={{ color: buttonColor }} className="hover:opacity-70 transition-all hover:scale-110"
            aria-label={p.name}>{p.icon}</a>
        ))}
      </div>
    </div>
  );
}