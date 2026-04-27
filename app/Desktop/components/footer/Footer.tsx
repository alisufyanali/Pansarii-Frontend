import ContactInfo from './ContactInfo';
import LinkColumns from './LinkColumns';
import Newsletter from './Newsletter';
import FooterIcons from './Footericons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <FooterIcons />

      <footer className="bg-white text-gray-900 font-poppins">
        <div className="px-[4%] py-10 max-w-[1920px] mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr_240px] gap-8 lg:gap-12 items-start">
            {/* LEFT — Logo + contact + socials */}
            <ContactInfo />

            {/* CENTER — Link columns */}
            <LinkColumns />

            {/* RIGHT — Newsletter */}
            <Newsletter />
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-5 border-t border-gray-100">
            <p className="text-center text-xs text-gray-400">
              © 2019–{currentYear} PansariInn. All rights reserved.
            </p>
          </div>

        </div>
      </footer>
    </>
  );
}
