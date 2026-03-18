import ContactInfo from './ContactInfo';
import LinkColumns from './LinkColumns';
import Newsletter from './Newsletter';
import FooterIcons from './Footericons';

export default function Footer() {
  const textStyle: React.CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '1.6',
    letterSpacing: '0',
    color: '#4B5563',
  };

  const buttonColor = '#197B33';
  const currentYear = new Date().getFullYear();

  return (
    <>
      <FooterIcons buttonColor={buttonColor} textStyle={textStyle} />

      <footer className="bg-white text-gray-900 ">
        {/* Mobile: normal padding | Desktop: 20% each side */}
        <div className="px-4 sm:px-8 py-12 px-3">
          <div className="grid grid-cols-1 md:grid-cols-[160px_1fr_220px] gap-6 lg:gap-8 items-start">

            {/* LEFT — Logo + contact + socials */}
            <ContactInfo textStyle={textStyle} buttonColor={buttonColor} />

            {/* CENTER — Link columns, breathing room via padding */}
            <div className="md:px-8 lg:px-12">
              <LinkColumns textStyle={textStyle} buttonColor={buttonColor} />
            </div>

            {/* RIGHT — Newsletter */}
            <Newsletter textStyle={textStyle} buttonColor={buttonColor} />
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-center text-[11px] text-gray-400" style={{ fontFamily: 'Poppins' }}>
              ©2019-{currentYear} PansariInn. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}